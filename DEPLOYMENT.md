# 🚀 部署指南｜隔代共學 AI 媒合系統

完整的部署指南，支援本地開發、Docker 容器化、和雲端部署（Render/Railway）。

---

## 📋 目錄

1. [快速開始](#快速開始)
2. [方案 A：本地開發部署](#方案-a本地開發部署)
3. [方案 B：Docker 部署](#方案-bdocker-部署)
4. [方案 C：Cloudflare Tunnel 快速公開](#方案-ccloudflare-tunnel-快速公開)
5. [方案 D：Render.com 雲端部署](#方案-drendercom-雲端部署)
6. [方案 E：Railway 雲端部署](#方案-erailway-雲端部署)
7. [環境變數設定](#環境變數設定)
8. [驗證部署](#驗證部署)
9. [故障排除](#故障排除)

---

## 🎯 快速開始

### 前置需求

- **Node.js** 20+ (建議使用 LTS 版本)
- **npm** 或 **yarn**
- **Pexels API Key** (已在 `server/.env` 配置)

### 最快速方式（推薦黑客松展示）

```bash
# 1. 啟動伺服器（單一命令）
cd server && npm install && npm run dev
```

伺服器啟動後，開啟瀏覽器訪問：
- **主展示頁**: http://localhost:3001
- **管理儀表板**: http://localhost:3001/admin.html

✅ **此方式同時提供前端靜態檔案和後端 API**

---

## 方案 A：本地開發部署

### 步驟 1：安裝依賴

```bash
# 後端依賴
cd server
npm install

# 測試依賴（可選）
cd ..
npm install  # E2E Playwright tests
```

### 步驟 2：配置環境變數

檢查 `server/.env` 檔案是否存在並包含：

```env
PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU
PORT=3001
NODE_ENV=development
```

### 步驟 3：啟動伺服器

```bash
cd server
npm run dev
```

你應該會看到：
```
[server] TypeScript Server running...
[server] listening on http://localhost:3001
[server] - Serving static files from: /path/to/frontend
[server] - API endpoint: /api/images
[server] - MCP endpoint: /mcp
```

### 步驟 4：訪問應用

開啟瀏覽器：
- http://localhost:3001 → 主展示頁
- http://localhost:3001/admin.html → 管理儀表板

### 步驟 5：測試功能

1. **圖片自動配圖**: 點擊「🎨 自動配圖」按鈕
2. **Pitch Coach**:
   - 在筆記欄輸入內容
   - 選擇「中文 (30秒)」或「English (60秒)」
   - 點擊「🤖 生成簡報稿」
3. **樓層巡檢**: 下拉選單選擇樓層，查看 AI 建議

---

## 方案 B：Docker 部署

適合需要容器化或一致性環境的情況。

### 步驟 1：構建 Docker 映像

```bash
# 從專案根目錄執行
docker build -t hsinchu-intergen:latest .
```

### 步驟 2：運行容器

```bash
docker run -d \
  --name hsinchu-intergen-app \
  -p 3001:3001 \
  -e PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU \
  -e NODE_ENV=production \
  hsinchu-intergen:latest
```

或使用 **Docker Compose**（推薦）：

```bash
# 使用 docker-compose
docker-compose up -d

# 查看日誌
docker-compose logs -f web

# 停止服務
docker-compose down
```

### 步驟 3：訪問應用

- http://localhost:3001

### Docker 管理指令

```bash
# 查看運行中的容器
docker ps

# 查看容器日誌
docker logs hsinchu-intergen-app -f

# 進入容器 shell
docker exec -it hsinchu-intergen-app sh

# 停止並移除容器
docker stop hsinchu-intergen-app
docker rm hsinchu-intergen-app

# 重新構建
docker-compose up -d --build
```

---

## 方案 C：Cloudflare Tunnel 快速公開

最快速的外網公開方案（5 分鐘內完成），適合黑客松 Demo 或臨時展示。

### 步驟 1：安裝 Cloudflare Tunnel

#### macOS/Linux
```bash
# 使用 Homebrew (macOS)
brew install cloudflare/cloudflare/cloudflared

# 或下載二進制檔案 (Linux)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
```

#### Windows
下載並安裝：https://github.com/cloudflare/cloudflared/releases

### 步驟 2：啟動本地伺服器

```bash
cd server
npm run dev
```

### 步驟 3：建立 Tunnel

**新開一個終端視窗**，執行：

```bash
cloudflared tunnel --url http://localhost:3001
```

你會看到類似輸出：
```
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://random-words-1234.trycloudflare.com
```

🎉 **複製這個 URL 並分享給任何人！他們都能訪問你的應用！**

### 優點
- ✅ **不需要註冊帳號**
- ✅ **5 分鐘內完成**
- ✅ **自動 HTTPS**
- ✅ **無需開放防火牆**

### 缺點
- ⚠️ URL 是隨機生成，每次重啟會改變
- ⚠️ 適合臨時展示，不適合長期部署

### 進階：固定 URL（需註冊 Cloudflare 帳號）

```bash
# 登入
cloudflared tunnel login

# 建立持久化 tunnel
cloudflared tunnel create hsinchu-intergen

# 配置 tunnel
cloudflared tunnel route dns hsinchu-intergen your-subdomain.example.com

# 運行 tunnel
cloudflared tunnel run hsinchu-intergen
```

---

## 方案 D：Render.com 雲端部署

免費、持久化、自動 HTTPS，最適合正式部署。

### 步驟 1：準備 Git Repository

確保所有改動都已提交：

```bash
git add .
git commit -m "feat: 新增部署配置檔案"
git push origin main
```

### 步驟 2：部署到 Render

#### 選項 A：使用 Blueprint（一鍵部署）

1. 訪問 https://render.com
2. 註冊/登入帳號
3. 點擊 **New** → **Blueprint**
4. 連接你的 GitHub repository
5. Render 會自動偵測 `render.yaml` 並部署

#### 選項 B：手動建立 Web Service

1. 訪問 https://render.com
2. 點擊 **New** → **Web Service**
3. 連接 GitHub repository
4. 配置設定：
   - **Name**: `hsinchu-intergen-app`
   - **Region**: `Singapore` (離台灣最近)
   - **Branch**: `main`
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && node dist/server.js`
   - **Environment**: `Node`
5. 新增環境變數：
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `PEXELS_API_KEY` = `3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU`
6. 點擊 **Create Web Service**

### 步驟 3：等待部署完成

部署通常需要 3-5 分鐘。你可以在 Render Dashboard 查看日誌。

### 步驟 4：獲取公開 URL

部署完成後，Render 會提供一個 URL，類似：
```
https://hsinchu-intergen-app.onrender.com
```

🎉 **你的應用現在已經公開在網路上！**

### Render 免費方案限制

- ✅ **自動 HTTPS**
- ✅ **自動從 GitHub 部署**
- ✅ **無限流量**
- ⚠️ **15 分鐘無活動會休眠**（首次訪問可能需要 30-60 秒啟動）
- ⚠️ **750 小時/月免費時數**

### 避免休眠（可選）

使用外部服務定期 ping 你的網站：
- UptimeRobot (https://uptimerobot.com) - 每 5 分鐘 ping 一次
- Cron-job.org (https://cron-job.org) - 自訂排程

---

## 方案 E：Railway 雲端部署

另一個優秀的免費部署選項，介面簡潔。

### 步驟 1：準備 Git Repository

```bash
git add .
git commit -m "feat: 新增 Railway 部署配置"
git push origin main
```

### 步驟 2：部署到 Railway

1. 訪問 https://railway.app
2. 註冊/登入（支援 GitHub 登入）
3. 點擊 **New Project**
4. 選擇 **Deploy from GitHub repo**
5. 選擇你的 repository
6. Railway 會自動偵測 `railway.json` 並配置

### 步驟 3：新增環境變數

在 Railway Dashboard：
1. 點擊你的專案
2. 進入 **Variables** 頁籤
3. 新增以下變數：
   ```
   NODE_ENV=production
   PORT=3001
   PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU
   ```

### 步驟 4：獲取公開 URL

部署完成後，Railway 會提供一個 URL，類似：
```
https://hsinchu-intergen-app.up.railway.app
```

### Railway 免費方案

- ✅ **$5 免費額度/月**
- ✅ **自動 HTTPS**
- ✅ **自動部署**
- ✅ **無休眠限制**（在免費額度內）

---

## 🔐 環境變數設定

### 必需的環境變數

| 變數名稱 | 用途 | 預設值 | 範例 |
|---------|------|--------|------|
| `PEXELS_API_KEY` | Pexels 圖片 API 金鑰 | 無 | `3MIg8LdMhGoI049Bw...` |
| `PORT` | 伺服器監聽端口 | `3001` | `3001` |
| `NODE_ENV` | 執行環境 | `development` | `production` |

### 本地開發

在 `server/.env` 檔案：
```env
PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU
PORT=3001
NODE_ENV=development
```

### Docker

在 `docker-compose.yml` 或透過 `-e` 參數傳遞。

### 雲端平台

在各平台的 Dashboard 設定環境變數（不要直接寫在程式碼中）。

---

## ✅ 驗證部署

### 1. 健康檢查

訪問：
```
https://your-domain.com/api/images
```

應該看到 JSON 回應：
```json
{
  "images": [
    {
      "id": 12345,
      "url": "https://...",
      "alt": "...",
      "photographer": "...",
      "source": "pexels"
    }
  ]
}
```

### 2. 前端頁面檢查

訪問主頁：
```
https://your-domain.com
```

應該看到：
- ✅ 頁面正常渲染
- ✅ Spline 3D 場景載入（或顯示佔位符）
- ✅ 圖片庫可以載入
- ✅ Pitch Coach 功能可用

### 3. Puter.js 檢查

開啟瀏覽器開發者工具（F12），在 Console 執行：
```javascript
console.log(typeof window.puter);  // 應該輸出 "object"
```

如果是 `undefined`，檢查網路是否允許載入 `https://js.puter.com/v2/`。

### 4. AI 功能測試

1. 在 Pitch Coach 輸入框輸入：
   ```
   我們要推廣隔代共學，讓長者和孩子一起學習。
   ```
2. 點擊「生成簡報稿」
3. 應該看到 Gemini 3 Pro 生成的簡報內容

---

## 🔧 故障排除

### 問題 1：圖片載入失敗

**症狀**: 點擊「自動配圖」後顯示錯誤訊息

**可能原因**:
1. Pexels API Key 未設定或無效
2. 後端伺服器未啟動
3. 網路連線問題

**解決方案**:
```bash
# 1. 檢查環境變數
cd server
cat .env | grep PEXELS_API_KEY

# 2. 測試 API 直接呼叫
curl "http://localhost:3001/api/images?q=taiwan"

# 3. 查看伺服器日誌
npm run dev  # 觀察 console 輸出
```

### 問題 2：Puter.js 未載入

**症狀**: Console 顯示 `window.puter is undefined`

**可能原因**:
1. 網路封鎖 `js.puter.com`
2. 內容安全政策 (CSP) 限制
3. 廣告封鎖器

**解決方案**:
```html
<!-- 檢查 index.html 是否有正確載入 -->
<script src="https://js.puter.com/v2/"></script>

<!-- 在瀏覽器 Network 面板確認腳本載入成功 -->
```

### 問題 3：Docker 容器無法啟動

**症狀**: `docker-compose up` 失敗

**解決方案**:
```bash
# 檢查日誌
docker-compose logs web

# 重新構建
docker-compose down
docker-compose build --no-cache
docker-compose up

# 檢查端口衝突
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

### 問題 4：Render/Railway 部署失敗

**症狀**: 部署時出現錯誤

**常見原因**:
1. 環境變數未設定
2. Build command 路徑錯誤
3. Node.js 版本不符

**解決方案**:
```bash
# 確認 Build Command
cd server && npm install && npm run build

# 確認 Start Command
cd server && node dist/server.js

# 確認 package.json 中的 engines 欄位
"engines": {
  "node": ">=20.0.0"
}
```

### 問題 5：CORS 錯誤

**症狀**: 前端無法呼叫 API，Console 顯示 CORS 錯誤

**原因**: CORS 設定問題（不太可能，因為後端已設定 `cors()`）

**解決方案**:
```typescript
// 檢查 server/src/server.ts
app.use(cors());  // 應該在所有路由之前
```

### 問題 6：15 分鐘後網站無法訪問 (Render)

**原因**: Render 免費方案會在 15 分鐘無活動後休眠

**解決方案**:
1. 使用 UptimeRobot 定期 ping
2. 升級到 Render 付費方案
3. 接受首次載入較慢的事實（黑客松展示時提前喚醒）

---

## 📊 部署方案比較

| 方案 | 速度 | 成本 | 持久性 | 難度 | 推薦場景 |
|------|------|------|--------|------|---------|
| **本地開發** | ⚡ 極快 | 免費 | ❌ 本地 | 🟢 簡單 | 開發測試 |
| **Cloudflare Tunnel** | ⚡ 快 | 免費 | ⚠️ 暫時 | 🟢 簡單 | 黑客松 Demo |
| **Docker** | ⚡ 快 | 免費 | ✅ 持久 | 🟡 中等 | 本地部署 |
| **Render** | 🐢 中 (冷啟動慢) | 免費 | ✅ 持久 | 🟢 簡單 | 正式展示 |
| **Railway** | ⚡ 快 | 免費 | ✅ 持久 | 🟢 簡單 | 正式部署 |

---

## 🎯 黑客松展示最佳實踐

### 展示前 30 分鐘

1. **確認網站已喚醒**（如果使用 Render）
   ```bash
   curl https://your-app.onrender.com/api/images
   ```

2. **測試所有功能**
   - ✅ 首頁載入
   - ✅ 圖片自動配圖
   - ✅ Pitch Coach 生成
   - ✅ 管理儀表板
   - ✅ 樓層巡檢 AI

3. **準備備案**
   - 本地開發環境隨時可啟動
   - Cloudflare Tunnel 備用

### 展示時

1. **開啟多個分頁**預先載入：
   - 主頁
   - 管理儀表板
   - Pitch Coach 已生成內容

2. **準備展示腳本**，避免臨時輸入

3. **網路問題備案**：
   - 錄製展示影片
   - 準備截圖

---

## 🚀 下一步

部署完成後，你可以：

1. **自訂網域** (Render/Railway 都支援)
2. **設定 Google Analytics** 追蹤使用情況
3. **新增更多 AI 功能** (使用 Puter.js 的其他模型)
4. **優化效能** (CDN, 圖片壓縮)
5. **新增使用者認證** (如果需要)

---

## 📞 支援

如果遇到問題：

1. 檢查本文件的**故障排除**章節
2. 查看伺服器日誌（`npm run dev` 的 console 輸出）
3. 查看瀏覽器 Console（F12 → Console 面板）
4. 檢查 Network 面板（F12 → Network）確認請求狀態

---

**祝黑客松順利！🎉**
