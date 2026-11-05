# 揪排 App（外殼）

把揪排加到手機主畫面的獨立 App（PWA）。網址：https://ian19861007git.github.io/jiupai-app/

## 這個專案放什麼

只放 App 的「外殼」：載入畫面、圖示、離線快取、收通知用的 service worker。
**沒有任何金鑰、名單、帳號或付款資料**，所以可以公開。

畫面內容與所有資料都由揪排的 Apps Script 提供（和 LINE 裡的揪排 App 同一份畫面），
登入、報名、繳費等每一個操作都在 Apps Script 端驗證身分。

| 檔案 | 用途 |
|---|---|
| `index.html` | 開 App 時先顯示的載入畫面，向 Apps Script 抓揪排畫面並存在手機上 |
| `sw.js` | 離線快取外殼、顯示推播通知、點通知打開 App |
| `manifest.webmanifest` | App 名稱、圖示、主畫面顯示方式 |
| `icons/` | 夜燈配色圖示（藏青 × 金） |

## 費用

全部 0 元：GitHub Pages（公開專案免費）、網頁推播（Apple／Google 推播服務免費、不限則數，
不佔 LINE 官方帳號的訊息額度）。

## 怎麼裝

- iPhone：用 Safari 打開網址 → 分享 → 加入主畫面（iOS 16.4 以上才能收通知）
- Android：用 Chrome 打開 → 選單 → 安裝應用程式
- 第一次開啟按「用 LINE 登入」，把登入碼傳給揪排官方帳號即可

LINE 裡私訊揪排輸入 `!App` 也會回覆網址與安裝方式。
