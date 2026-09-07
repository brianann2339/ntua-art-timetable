# 美術碩專修課盤

國立臺灣藝術大學 美術學系 碩士在職專班的畢業學分規劃工具。
整個網站就是 `index.html` 一個檔案，不需要伺服器、資料庫或任何安裝。

---

## 最快上線：Netlify Drop（不用註冊，30 秒）

1. 打開 <https://app.netlify.com/drop>
2. 把 `index.html` 拖進網頁中間的框
3. 馬上就會給你一個網址，例如 `https://xxxx-yyyy.netlify.app`

想固定網址、之後還要更新，就在那頁點 **Sign up** 綁一個免費帳號，網址名稱可以自己改。

---

## GitHub Pages（免費、網址好看、之後好維護）

**完全不用裝 git，全程在網頁上操作。**

1. 到 <https://github.com> 註冊或登入。
2. 右上角 **＋** → **New repository**
   - Repository name：`ntua-credit-board`（隨你取）
   - 選 **Public**（Pages 免費版需要公開）
   - 按 **Create repository**
3. 在新的 repo 頁面點 **Add file** → **Upload files**，把 `index.html` 拖進去，
   下面按 **Commit changes**。
4. 進 **Settings**（repo 上方那排）→ 左邊選 **Pages**
   - Source：**Deploy from a branch**
   - Branch：**main** ／ 資料夾選 **/ (root)** → **Save**
5. 等 1–2 分鐘重新整理，上面會出現你的網址：

   ```
   https://<你的帳號>.github.io/ntua-credit-board/
   ```

> 小技巧：如果 repo 名稱取成 `<你的帳號>.github.io`，網址就會是
> `https://<你的帳號>.github.io/`，沒有後面那一段。

### 之後要改內容

**Add file → Upload files** 再上傳一次同名的 `index.html` 覆蓋，
或直接在 GitHub 上點 `index.html` → 鉛筆圖示線上編輯，存檔後約 1 分鐘自動更新。

---

## 其他同樣免費的選擇

| 平台 | 特色 |
|---|---|
| [Cloudflare Pages](https://pages.cloudflare.com/) | 速度最快，可綁自己的網域 |
| [Vercel](https://vercel.com/) | 拖檔即部署，介面簡單 |
| [Netlify](https://www.netlify.com/) | 上面那個 Drop 的完整版 |

三家都可以直接接 GitHub repo，之後你在 GitHub 改檔案，網站就自動更新。

---

## 存檔與讀取

右上角有兩顆按鈕：

- **儲存課表** —— 跳出視窗問姓名，可以另外設 4 位數字密碼。存過之後同一份可以直接更新，也可以「另存新的一筆」。
- **已存課表** —— 列出所有存過的課表（姓名、入學學年、學分、更新時間），點「載入」就把它叫回畫面上繼續編輯。有設密碼的要輸入密碼才能載入或刪除。

預設存在**你這台裝置的瀏覽器**裡。想讓所有人共用、換裝置也叫得出來，
照 [`GOOGLE-SETUP.md`](GOOGLE-SETUP.md) 接一份免費的 Google 試算表當後端（約 5 分鐘）。

---

## 資料存在哪裡？

沒有接 Google 後端時，排好的課和存的課表都只在**你這台裝置的這個瀏覽器**裡（localStorage），
不會上傳到任何伺服器，別人打開網站看到的是空白的課表。

所以：

- 換電腦、換瀏覽器、清除瀏覽器資料 → 資料會不見
- 換裝置前先按右上角 **匯出備份**存成 JSON，到新裝置按 **匯入備份** 讀回來

---

## 想放廣告的話

要先有這個自己的網址才可能。Google AdSense 通常需要一定的內容量與流量才會過審，
把 AdSense 給的那段 `<script>` 貼在 `index.html` 的 `</head>` 前面就行。

---

## 資料來源

課程與畢業學分規定依
[國立臺灣藝術大學教務處 113 學年度碩士在職專班美術學系課程科目表](https://aca.ntua.edu.tw/uploads/files/113701.pdf)。
實際採計以系辦與教務處審核為準。
