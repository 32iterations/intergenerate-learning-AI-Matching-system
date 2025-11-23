#!/bin/bash
# 快速啟動腳本 - 隔代共學 AI 媒合系統
# 適用於黑客松展示和本地開發

set -e  # 遇到錯誤立即退出

echo "🚀 啟動「隔代共學 AI 媒合系統」"
echo "================================"

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: 未安裝 Node.js"
    echo "請訪問 https://nodejs.org 安裝 Node.js 20+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 檢查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤: 未安裝 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 進入 server 目錄
cd "$(dirname "$0")/../server"

# 檢查 .env 檔案
if [ ! -f .env ]; then
    echo "⚠️  警告: .env 檔案不存在"
    echo "複製 .env.example 到 .env..."
    cp .env.example .env
    echo "請編輯 .env 檔案設定 PEXELS_API_KEY"
fi

# 檢查 node_modules
if [ ! -d node_modules ]; then
    echo "📦 安裝依賴套件..."
    npm install
else
    echo "✅ 依賴套件已安裝"
fi

# 檢查環境變數
if ! grep -q "PEXELS_API_KEY=" .env || grep -q "PEXELS_API_KEY=$" .env; then
    echo "⚠️  警告: PEXELS_API_KEY 未設定"
    echo "請在 .env 檔案中設定 Pexels API Key"
fi

# 啟動伺服器
echo ""
echo "🎯 啟動伺服器..."
echo "================================"
echo "主展示頁: http://localhost:3001"
echo "管理儀表板: http://localhost:3001/admin.html"
echo "API 端點: http://localhost:3001/api/images"
echo "MCP 端點: http://localhost:3001/mcp"
echo "================================"
echo "按 Ctrl+C 停止伺服器"
echo ""

npm run dev
