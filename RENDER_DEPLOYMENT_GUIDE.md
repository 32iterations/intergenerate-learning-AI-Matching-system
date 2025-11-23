# 🚀 Render.com 完整部署指南 (2025 最新版)

**基於 2025 年最新資訊和最佳實踐**

根據線上檢索的最新教學，這是針對您的 Node.js + Express + TypeScript 專案的詳細部署步驟。

---

## 📚 參考資料來源

本指南基於以下最新資源：

- [Render 官方文檔 - Deploy Node Express App](https://render.com/docs/deploy-node-express-app)
- [Render Blueprint YAML 規範](https://render.com/docs/blueprint-spec)
- [DEV Community - TypeScript Express API 部署 (2025年10月)](https://dev.to/allcodez/deploying-a-typescript-express-api-to-render-a-complete-journey-1fnb)
- [Medium - TypeScript Node.js API 部署 (2024年11月)](https://medium.com/@gakiiviolet1/mastering-typescript-setting-up-and-deploying-your-node-js-api-with-render-a8573d510726)
- [Render 免費方案說明](https://render.com/docs/free)
- [Render 環境變數設定](https://render.com/docs/configure-environment-variables)

---

## ⚠️ TypeScript 專案重要注意事項

根據 [Stack Overflow](https://stackoverflow.com/questions/76556743/deploy-typescrpitnode-js-server-to-render-com) 和 [DEV Community](https://dev.to/allcodez/deploying-a-typescript-express-api-to-render-a-complete-journey-1fnb) 的最新討論：

### 關鍵要點

1. **不要在 Build 時設定 `NODE_ENV=production`**
   - ❌ 錯誤：會導致 TypeScript 不安裝，`tsc` 編譯失敗
   - ✅ 正確：只在 Start 後設定為 production

2. **必須使用 `0.0.0.0` 而非 `localhost`**
   - Render 需要綁定到 `0.0.0.0`
   - 使用 `process.env.PORT` 而非固定端口

3. **Build 和 Start 命令必須明確**
   - Build: 編譯 TypeScript (`npm run build`)
   - Start: 執行編譯後的 JS (`node dist/server.js`)

---

## 🔍 檢查您的專案配置

### 步驟 1：驗證 package.json

檢查 `server/package.json` 是否正確配置：

```json
{
  "name": "intergen-hsinchu-image-mcp-server",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",  // ✅ 編譯 TypeScript
    "start": "node dist/server.js"  // ✅ 執行編譯後的檔案
  },
  "engines": {
    "node": ">=20.0.0",  // ⚠️ 重要！指定 Node.js 版本
    "npm": ">=10.0.0"
  }
}
```

**目前狀態**：讓我檢查您的 package.json


**✅ 您的 package.json 狀態：良好**

- ✅ `build` script 存在: `tsc -p tsconfig.json`
- ✅ `start` script 存在: `node dist/server.js`
- ✅ 已新增 `engines` 欄位指定 Node.js 版本

---

### 步驟 2：檢查 server.ts 綁定設定

根據 [最新教學](https://dev.to/allcodez/deploying-a-typescript-express-api-to-render-a-complete-journey-1fnb)，必須綁定到 `0.0.0.0`：

**當前配置**：`server/src/server.ts:210`
```typescript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
```

**✅ 已使用 `process.env.PORT` - 符合 Render 要求**

---

### 步驟 3：修正 render.yaml 配置

根據 [Render Blueprint 規範](https://render.com/docs/blueprint-spec)，您的 `render.yaml` 需要修正：

**當前問題**：
```yaml
buildCommand: cd server && npm install && npm run build
startCommand: cd server && node dist/server.js
```

**⚠️ 問題**：Render 的工作目錄已經在專案根目錄，使用 `cd server` 會有路徑問題

**✅ 修正後的配置**：

```yaml
services:
  - type: web
    name: hsinchu-intergen-app
    env: node
    region: singapore
    plan: free
    # ⚠️ 重要：設定正確的根目錄
    rootDir: ./server
    # 建置命令：安裝依賴並編譯 TypeScript
    buildCommand: npm install && npm run build
    # 啟動命令：執行編譯後的 JS
    startCommand: node dist/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: PEXELS_API_KEY
        sync: false  # ✅ 不在 YAML 中硬編碼，稍後在 Dashboard 設定
    healthCheckPath: /api/images
    autoDeploy: true
    branch: main
```

---

## 🎯 詳細部署步驟（2025 最新流程）

### 方法 A：使用 Blueprint (推薦 - 自動化)

#### 1. 更新 render.yaml

執行以下命令更新配置：

\`\`\`bash
cat > render.yaml << 'YAML_EOF'
services:
  - type: web
    name: hsinchu-intergen-app
    env: node
    region: singapore
    plan: free
    rootDir: ./server
    buildCommand: npm install && npm run build
    startCommand: node dist/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: PEXELS_API_KEY
        sync: false
    healthCheckPath: /api/images
    autoDeploy: true
    branch: main
YAML_EOF
\`\`\`

#### 2. 提交更新

\`\`\`bash
git add server/package.json render.yaml
git commit -m "fix: 優化 Render 部署配置"
git push origin main
\`\`\`

#### 3. 在 Render Dashboard 部署

1. **訪問**：https://dashboard.render.com/select-repo?type=blueprint

2. **連接 GitHub**：
   - 授權 Render 訪問您的 GitHub
   - 選擇 repository: `32iterations/intergenerate-learning-AI-Matching-system`

3. **Render 自動讀取 `render.yaml`**
   - 系統會顯示即將建立的資源
   - 檢查配置是否正確

4. **設定環境變數**：
   - Render 會提示輸入 `PEXELS_API_KEY`
   - 貼上：`3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU`

5. **點擊 "Apply"**
   - Render 開始建置和部署
   - 預計 5-10 分鐘完成

---

### 方法 B：手動建立 Web Service

如果 Blueprint 不work，可以手動設定：

#### 1. 建立 New Web Service

訪問：https://dashboard.render.com/

點擊 **New** → **Web Service**

#### 2. 連接 GitHub Repository

- 選擇 `32iterations/intergenerate-learning-AI-Matching-system`
- 點擊 **Connect**

#### 3. 配置 Web Service

| 欄位 | 設定值 |
|------|--------|
| **Name** | `hsinchu-intergen-app` |
| **Region** | `Singapore` (離台灣最近) |
| **Branch** | `main` |
| **Root Directory** | `server` ⚠️ 重要！ |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/server.js` |
| **Plan** | `Free` |

#### 4. 設定環境變數

點擊 **Advanced** → **Add Environment Variable**

新增以下變數：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `PEXELS_API_KEY` | `3MIg8LdMhGoI049BwKKVmXHxp8alh7h6NSGHS8jALUqiNU4ImNLmdvTU` |

#### 5. 建立服務

點擊 **Create Web Service**

Render 開始建置...

---

## 📊 建置過程監控

### 預期的建置日誌

\`\`\`
==> Cloning from https://github.com/32iterations/intergenerate-learning-AI-Matching-system...
==> Checking out commit 89f1be7 in branch main
==> Using Node version 20.x.x (from package.json)
==> Running build command 'npm install && npm run build'...
    npm install
    added 234 packages in 15s
    
    npm run build
    > intergen-hsinchu-image-mcp-server@0.1.0 build
    > tsc -p tsconfig.json
    
    ✓ TypeScript compilation successful
==> Build successful! 🎉
==> Deploying...
==> Running start command 'node dist/server.js'...
    [server] listening on http://0.0.0.0:10000
==> Service is live! 🚀
\`\`\`

### 如果建置失敗

常見錯誤和解決方案：

#### 錯誤 1：`tsc: command not found`

**原因**：TypeScript 未安裝

**解決**：
確認 `typescript` 在 `devDependencies` 中（✅ 您已有）

#### 錯誤 2：`Cannot find module 'zod'`

**原因**：依賴未正確安裝

**解決**：
檢查 `package.json` 中的 dependencies（✅ 您已有）

#### 錯誤 3：`Error: listen EADDRINUSE`

**原因**：端口衝突

**解決**：
確認使用 `process.env.PORT`（✅ 您已設定）

---

## 🔍 部署後驗證

### 1. 查看部署 URL

Render 部署成功後會顯示：
\`\`\`
https://hsinchu-intergen-app.onrender.com
\`\`\`

### 2. 測試 API 端點

\`\`\`bash
curl https://hsinchu-intergen-app.onrender.com/api/images?q=taiwan | jq '.'
\`\`\`

應返回：
\`\`\`json
{
  "images": [
    {
      "id": 260566,
      "url": "https://images.pexels.com/photos/260566/...",
      "alt": "Taipei 101...",
      "photographer": "Pixabay",
      "source": "pexels"
    }
  ]
}
\`\`\`

### 3. 訪問主頁

\`\`\`
https://hsinchu-intergen-app.onrender.com
\`\`\`

應看到完整的網頁，包括：
- ✅ CSS 樣式正常
- ✅ 圖片可以顯示
- ✅ Puter.js 載入成功

### 4. 測試 AI 功能

訪問 Pitch Coach：
\`\`\`
https://hsinchu-intergen-app.onrender.com#pitch-coach
\`\`\`

測試生成簡報稿（需首次授權 Puter.js）

### 5. 執行驗證腳本

\`\`\`bash
./scripts/deploy-check.sh https://hsinchu-intergen-app.onrender.com
\`\`\`

---

## ⚠️ Render 免費方案限制 (2025)

根據 [Render 官方文檔](https://render.com/docs/free)：

### 1. 休眠機制

- 📊 **15 分鐘無活動會休眠**
- ⏱️ **首次訪問需要 30-60 秒喚醒**
- 💰 **750 小時/月免費時數**（休眠不計時）

**解決方案**：
- 展示前 30 分鐘先訪問網站
- 使用 [UptimeRobot](https://uptimerobot.com) 每 5 分鐘 ping 一次

### 2. 資料庫限制

- 📦 **每個 workspace 只能有 1 個免費 PostgreSQL**
- 💾 **1 GB 儲存空間**
- ⏰ **30 天後過期**（我們不使用資料庫，無影響）

### 3. 網路限制

- 🌐 **100 GB 月流量**（足夠黑客松使用）
- 📤 **無限入站流量**

---

## 🎯 黑客松展示最佳實踐

### 展示前 30 分鐘

1. **喚醒服務**
   \`\`\`bash
   # 訪問主頁
   curl https://hsinchu-intergen-app.onrender.com

   # 等待回應（可能需要 30-60 秒）
   \`\`\`

2. **測試所有功能**
   - ✅ 主頁載入
   - ✅ 圖片自動配圖
   - ✅ Pitch Coach
   - ✅ 管理儀表板

3. **準備本地備案**
   \`\`\`bash
   # 本地伺服器隨時待命
   cd server && npm run dev
   \`\`\`

### 展示時

- **URL 分享**：提前寫在簡報上
- **網路測試**：用手機測試是否可訪問
- **備案**：如果 Render 慢，切換到本地 + Cloudflare Tunnel

---

## 🔧 更新和維護

### 自動部署

只要推送到 GitHub，Render 就會自動重新部署：

\`\`\`bash
git add .
git commit -m "feat: 新功能"
git push origin main
\`\`\`

Render 會自動：
1. Clone 最新代碼
2. 執行 build 命令
3. 重新部署

### 手動重新部署

在 Render Dashboard：
1. 選擇您的 service
2. 點擊 **Manual Deploy** → **Deploy latest commit**

### 查看日誌

在 Render Dashboard：
1. 選擇您的 service
2. 點擊 **Logs**
3. 即時查看伺服器日誌

---

## 📈 效能優化建議

### 1. 減少冷啟動時間

\`\`\`javascript
// server.ts 優化啟動時間
import { config } from 'dotenv';
config(); // 儘早載入環境變數

// 延遲載入非關鍵模組
const loadMCP = async () => {
  const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
  // ...
};
\`\`\`

### 2. 使用 Render 的 Redis (選配)

如果需要快取：
\`\`\`yaml
# render.yaml
services:
  - type: web
    # ... web service 配置
  - type: redis
    name: redis
    plan: free
\`\`\`

### 3. 設定健康檢查

已在 `render.yaml` 設定：
\`\`\`yaml
healthCheckPath: /api/images
\`\`\`

Render 會定期檢查，確保服務正常。

---

## 🆘 故障排除清單

### 問題 1：部署失敗

**症狀**：Build failed

**檢查清單**：
- [ ] `rootDir` 設定為 `./server`
- [ ] `buildCommand` 正確：`npm install && npm run build`
- [ ] `package.json` 有 `build` script
- [ ] TypeScript 在 `devDependencies`

### 問題 2：502 Bad Gateway

**症狀**：網站無法訪問

**檢查清單**：
- [ ] 伺服器使用 `process.env.PORT`
- [ ] `startCommand` 正確：`node dist/server.js`
- [ ] 檢查 Render logs

### 問題 3：環境變數未生效

**症狀**：`PEXELS_API_KEY` undefined

**檢查清單**：
- [ ] 在 Render Dashboard 設定環境變數
- [ ] 變數名稱拼寫正確
- [ ] 重新部署服務

---

## 🎉 成功檢查清單

部署成功後，確認：

- [ ] ✅ 網站可以訪問
- [ ] ✅ API 返回正確的 JSON
- [ ] ✅ 圖片可以載入（Pexels API 運作）
- [ ] ✅ Puter.js 腳本載入
- [ ] ✅ Pitch Coach 可以使用
- [ ] ✅ 管理儀表板可訪問
- [ ] ✅ 所有樣式正常顯示
- [ ] ✅ 手機可以訪問
- [ ] ✅ 複製並保存了 URL

---

## 🔗 相關資源

### 官方文檔
- [Render - Deploy Node Express App](https://render.com/docs/deploy-node-express-app)
- [Render Blueprint 規範](https://render.com/docs/blueprint-spec)
- [Render 免費方案說明](https://render.com/docs/free)
- [Render 環境變數設定](https://render.com/docs/configure-environment-variables)

### 社群教學
- [DEV - TypeScript Express API 部署](https://dev.to/allcodez/deploying-a-typescript-express-api-to-render-a-complete-journey-1fnb)
- [Medium - TypeScript Node.js API 部署](https://medium.com/@gakiiviolet1/mastering-typescript-setting-up-and-deploying-your-node-js-api-with-render-a8573d510726)
- [Stack Overflow - TypeScript Render 部署討論](https://stackoverflow.com/questions/76556743/deploy-typescrpitnode-js-server-to-render-com)

### 專案文檔
- `QUICK_START.md` - 5 分鐘快速啟動
- `AUTO_DEPLOY.md` - 一鍵部署教學
- `DEPLOYMENT.md` - 完整部署指南
- `CLOUDFLARE_TUNNEL.md` - Cloudflare Tunnel 使用

---

**🎊 現在您可以信心滿滿地部署到 Render 了！**

**選擇方法 A (Blueprint) 或 方法 B (手動)，5-10 分鐘內完成部署！**

祝黑客松順利！🚀

