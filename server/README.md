# 圖片搜尋 & MCP 伺服器（server/）

這個資料夾是一個 Node + TypeScript 專案，同時提供：

1. HTTP API：`GET /api/images?q=...`
2. MCP HTTP endpoint：`POST /mcp`（供 Claude Code / MCP Inspector 連線）

## 安裝與啟動

```bash
cd server
npm install
cp .env.example .env
# 編輯 .env，填入你從 Pexels 申請的 API Key
npm run dev
```

預設會啟動在 `http://localhost:3000`。

- `http://localhost:3000/api/images?q=grandparents%20children%20taiwan`
- `http://localhost:3000/mcp` 供 MCP 客戶端呼叫

## Pexels API Key

1. 前往 Pexels 開發者頁申請免費 API key（需註冊帳號）。  
2. 將 key 填入 `.env` 的 `PEXELS_API_KEY`。

程式會自動附上 `Authorization` 標頭呼叫 Pexels 的 `/v1/search` 端點，
取得圖片清單再轉成簡化的 JSON 結構。

> 請留意 Pexels 的使用條款與授權標示規範。Demo 頁面已在圖片區塊顯示
> 「Photos from Pexels」及攝影師姓名，便於延伸使用。

## 作為 MCP 伺服器使用

啟動後，可以在 Claude Code 中加入此 MCP server：

```bash
claude mcp add --transport http hsinchu-images http://localhost:3000/mcp
```

接著你可以在對話中下指令，例如：

> 幫我用 `hsinchu-images` 伺服器的 `search_images` 工具，找幾張適合用在隔代共學著陸頁 Hero 區塊的照片，> 條件是：看起來像在台灣或東亞的祖孫與小朋友在社區空間活動。

Claude 就會自動呼叫 MCP 工具，回傳結構化的圖片資訊，並可進一步幫你把 `<img>` /
`<figure>` 片段寫進前端程式碼。
