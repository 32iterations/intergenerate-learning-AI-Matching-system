# 🚀 OpenRouter AI 功能設置指南

Puter.js 遇到 401 認證問題後，我們已改用 **OpenRouter** 作為 AI 功能的後端。

---

## ⚡ 快速設置（5 分鐘）

### 步驟 1：獲取免費 OpenRouter API Key

1. 訪問 **[OpenRouter.ai](https://openrouter.ai)**
2. 點擊右上角 **"Sign In"** 使用 Google 或 GitHub 登入
3. 登入後訪問 **[https://openrouter.ai/keys](https://openrouter.ai/keys)**
4. 點擊 **"Create Key"** 創建新的 API key
5. 複製生成的 API key（格式：`sk-or-v1-...`）

### 步驟 2：配置環境變數

編輯 `server/.env` 文件：

```bash
# 將 your_openrouter_api_key_here 替換為您的實際 API key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxx
```

### 步驟 3：重啟伺服器

```bash
cd server
npm run dev
```

### 步驟 4：測試 AI 功能

訪問 http://localhost:3001 並測試：
- ✅ Pitch Coach（簡報生成）
- ✅ 樓層巡檢 AI（場地建議）

---

## 💰 費用說明

### 免費額度
OpenRouter 提供：
- **1,000,000 次** 免費 "Bring Your Own Key" (BYOK) 請求/月
- **免費模型**：`google/gemini-2.0-flash-exp:free`（我們使用的模型）
- **速率限制**：10 requests/minute（免費模型）

### 實際成本
對於黑客松 Demo：
- **成本**: 💰 **$0**（使用免費模型）
- **無需信用卡**
- **無月費**

---

## 🔧 技術實現

### 後端 API Endpoint

我們添加了 `/api/chat` endpoint：

**server/src/server.ts:181-237**

```typescript
app.post("/api/chat", async (req, res) => {
  const { prompt, model = "google/gemini-2.0-flash-exp:free" } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.json({ message: data.choices[0].message.content });
});
```

### 前端調用

**frontend/main.js:193-217**

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt,
    model: "google/gemini-2.0-flash-exp:free"
  }),
});

const data = await response.json();
outputEl.textContent = data.message;
```

---

## 📊 可用模型

我們當前使用的模型：
- **`google/gemini-2.0-flash-exp:free`** - 免費、快速、適合對話

其他免費模型選項：
- `google/gemini-2.5-flash:free` - Gemini 2.5 Flash（更新版本）
- `meta-llama/llama-3.1-8b-instruct:free` - Llama 3.1 8B

更改模型只需編輯 `server/src/server.ts` 第 190 行的預設值。

---

## 🐛 故障排除

### 問題 1：503 Service Unavailable

```
{
  "error": "OpenRouter API key not configured",
  "detail": "Please set OPENROUTER_API_KEY..."
}
```

**解決方案**：
1. 檢查 `.env` 文件中的 `OPENROUTER_API_KEY`
2. 確保 key 以 `sk-or-v1-` 開頭
3. 重啟伺服器

### 問題 2：401 Unauthorized

```
OpenRouter API error: 401 - ...
```

**解決方案**：
1. API key 可能無效或已過期
2. 訪問 https://openrouter.ai/keys 重新生成
3. 更新 `.env` 並重啟

### 問題 3：429 Rate Limit

```
OpenRouter API error: 429 - Rate limit exceeded
```

**解決方案**：
- 免費模型限制 10 requests/minute
- 等待 1 分鐘後重試
- 或升級到付費模型

---

## 🔐 安全性

### API Key 保護
- ✅ API key 儲存在 **後端** `.env` 文件
- ✅ **不會** 暴露在前端代碼
- ✅ 所有 AI 請求通過後端 `/api/chat` 中轉

### CORS 設置
後端已配置 CORS 允許前端訪問：

```typescript
app.use(cors());
```

---

## 🎯 與 Puter.js 的比較

| 功能 | Puter.js | OpenRouter |
|------|----------|------------|
| **認證** | ❌ 401 錯誤 | ✅ 正常 |
| **成本** | 免費（但不可用） | 免費 |
| **API Key** | 不需要 | 需要（但免費） |
| **模型** | Gemini 3 Pro | Gemini 2.0 Flash（免費版） |
| **穩定性** | ❌ 不穩定 | ✅ 穩定 |
| **設置** | 簡單（但失敗） | 中等（5分鐘） |

---

## 📚 相關資源

- **OpenRouter 官網**: https://openrouter.ai
- **API 文檔**: https://openrouter.ai/docs
- **獲取 API Key**: https://openrouter.ai/keys
- **模型列表**: https://openrouter.ai/models
- **定價**: https://openrouter.ai/pricing

---

## 🎊 完成檢查清單

設置完成後確認：

- [ ] 已獲取 OpenRouter API Key
- [ ] 已更新 `server/.env` 文件
- [ ] 已重啟伺服器（`npm run dev`）
- [ ] Pitch Coach 可以生成簡報
- [ ] 樓層巡檢 AI 可以分析場地
- [ ] 無 401/503 錯誤

---

**🎉 設置完成後，所有 AI 功能即可正常使用！**

有問題請參考故障排除章節或查看伺服器日誌。
