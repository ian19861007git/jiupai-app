/* 揪排 App service worker：快取外殼（沒網路也開得起來）、收推播、點通知打開 App。
   推播內容由揪排的 Apps Script 加密送出（標準 Web Push），這裡只負責顯示。全部免費。 */
var CACHE = 'jiupai-shell-v2';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-512-maskable.png', './icons/apple-touch-icon.png', './icons/badge-72.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Apps Script、字型等外部請求不攔
  if (req.mode === 'navigate') {
    // 外殼頁：先上網抓最新的，沒網路才用快取
    // 外殼頁每次都向 GitHub 確認有沒有新版（cache: no-cache），修正才不會被手機快取卡住
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./', copy); }); }
      return res;
    }).catch(function () { return caches.match('./', { ignoreSearch: true }); }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { b: e.data ? e.data.text() : '' }; }
  var opt = {
    body: d.b || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/badge-72.png',
    data: { url: d.u || './' },
    lang: 'zh-TW',
    silent: !!d.s
  };
  if (d.g) { opt.tag = d.g; opt.renotify = true; }
  e.waitUntil(self.registration.showNotification(d.t || '揪排', opt));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
        c.postMessage({ type: 'jp-open', url: url });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
