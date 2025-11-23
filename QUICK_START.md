# ⚡ 快速啟動指南｜隔代共學 AI 媒合系統

5 分鐘內讓你的系統上線！

---

## 🚀 最快方式（黑客松展示）

### 步驟 1: 啟動本地伺服器

```bash
cd server
npm install
npm run dev
```

看到這個訊息表示成功：
```
[server] listening on http://localhost:3001
```

### 步驟 2: 測試功能

開啟瀏覽器訪問：
- **主頁**: http://localhost:3001
- **管理儀表板**: http://localhost:3001/admin.html
- **API 測試**: http://localhost:3001/api/images?q=test

### 步驟 3: 公開到外網 (選擇其一)

#### 選項 A: Cloudflare Tunnel (5 分鐘)

```bash
# 安裝 cloudflared (只需一次)
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# 建立 tunnel
cloudflared tunnel --url http://localhost:3001
```

**複製產生的 URL** (例如: `https://random-words-1234.trycloudflare.com`) 並分享！

#### 選項 B: Render.com (10 分鐘)

1. 訪問 https://render.com 並登入
2. 點擊 **New** → **Web Service**
3. 連接你的 GitHub repository
4. 設定：
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && node dist/server.js`
5. 新增環境變數：
   ```
   PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU
   NODE_ENV=production
   PORT=3001
   ```
6. 點擊 **Create Web Service**

完成後會得到一個永久 URL！

#### 選項 C: Docker (3 分鐘)

```bash
# 建置並啟動
docker-compose up -d

# 查看日誌
docker-compose logs -f web

# 停止服務
docker-compose down
```

---

## ✅ 驗證部署

執行驗證腳本：

```bash
# 本地測試
./scripts/deploy-check.sh http://localhost:3001

# 線上測試
./scripts/deploy-check.sh https://your-app.onrender.com
```

你應該看到：
```
✅ API 端點正常 (HTTP 200)
✅ API 回應格式正確
   📸 回傳 6 張圖片
✅ 首頁載入正常 (HTTP 200)
✅ 管理儀表板載入正常 (HTTP 200)
```

---

## 🎯 黑客松展示檢查清單

展示前 30 分鐘：

- [ ] 伺服器已啟動並可訪問
- [ ] 測試「自動配圖」功能
- [ ] 測試「Pitch Coach」AI 生成
- [ ] 測試管理儀表板
- [ ] 準備一段測試文字在 Pitch Coach 輸入框
- [ ] 確認網路連線穩定

備案準備：

- [ ] 本地伺服器隨時待命
- [ ] 錄製 1-2 分鐘展示影片
- [ ] 截圖關鍵畫面
- [ ] 手機熱點備用

---

## 📚 更多資訊

- **完整部署指南**: 閱讀 `DEPLOYMENT.md`
- **部署測試報告**: 閱讀 `DEPLOYMENT_REPORT.md`
- **故障排除**: 查看 `DEPLOYMENT.md` 的「故障排除」章節
- **開發指南**: 閱讀 `DEVELOPMENT.md`

---

## 🆘 遇到問題？

### 問題：端口 3001 已被佔用

```bash
# 查看是什麼在使用
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# 停止佔用的進程或改用其他端口
PORT=3002 npm run dev
```

### 問題：圖片載入失敗

檢查環境變數：
```bash
cd server
cat .env | grep PEXELS_API_KEY
```

應該看到：
```
PEXELS_API_KEY=3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU
```

### 問題：Puter.js 未載入

開啟瀏覽器開發者工具 (F12)，在 Console 執行：
```javascript
console.log(typeof window.puter);
```

應該顯示 `"object"`。如果顯示 `"undefined"`，檢查網路是否允許訪問 `https://js.puter.com`。

---

## 🎊 準備好了！

你的系統現在已經可以：
- ✅ 本地運行
- ✅ 外網訪問
- ✅ 展示給評審

**祝黑客松順利！🚀**
