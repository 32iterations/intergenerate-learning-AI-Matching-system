#!/bin/bash
# 部署檢查腳本 - 驗證所有功能是否正常
# 使用方式: ./scripts/deploy-check.sh [URL]
# 範例: ./scripts/deploy-check.sh http://localhost:3001

set -e

URL="${1:-http://localhost:3001}"

echo "🔍 部署驗證檢查"
echo "================================"
echo "目標 URL: $URL"
echo "================================"

# 檢查 curl
if ! command -v curl &> /dev/null; then
    echo "❌ 錯誤: 未安裝 curl"
    exit 1
fi

# 1. 健康檢查 - API 端點
echo ""
echo "1️⃣  測試 API 端點..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/images?q=test")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API 端點正常 (HTTP $HTTP_CODE)"
else
    echo "❌ API 端點異常 (HTTP $HTTP_CODE)"
    exit 1
fi

# 2. 測試 API 回應格式
echo ""
echo "2️⃣  測試 API 回應格式..."
RESPONSE=$(curl -s "$URL/api/images?q=taiwan")
if echo "$RESPONSE" | grep -q "images"; then
    echo "✅ API 回應格式正確"
    # 提取圖片數量
    IMAGE_COUNT=$(echo "$RESPONSE" | grep -o '"id"' | wc -l)
    echo "   📸 回傳 $IMAGE_COUNT 張圖片"
else
    echo "❌ API 回應格式錯誤"
    echo "   回應: $RESPONSE"
    exit 1
fi

# 3. 測試首頁
echo ""
echo "3️⃣  測試首頁載入..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 首頁載入正常 (HTTP $HTTP_CODE)"
else
    echo "❌ 首頁載入異常 (HTTP $HTTP_CODE)"
    exit 1
fi

# 4. 測試管理儀表板
echo ""
echo "4️⃣  測試管理儀表板..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/admin.html")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 管理儀表板載入正常 (HTTP $HTTP_CODE)"
else
    echo "❌ 管理儀表板載入異常 (HTTP $HTTP_CODE)"
    exit 1
fi

# 5. 檢查前端資源
echo ""
echo "5️⃣  檢查前端資源..."

# main.js
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/main.js")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ main.js 載入正常"
else
    echo "⚠️  main.js 載入異常 (HTTP $HTTP_CODE)"
fi

# styles.css
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/styles.css")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ styles.css 載入正常"
else
    echo "⚠️  styles.css 載入異常 (HTTP $HTTP_CODE)"
fi

# 6. 測試外部依賴
echo ""
echo "6️⃣  測試外部依賴..."

# Puter.js
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://js.puter.com/v2/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Puter.js 可訪問"
else
    echo "⚠️  Puter.js 無法訪問 (HTTP $HTTP_CODE)"
    echo "   網路可能有限制，Gemini 3 Pro 功能可能無法使用"
fi

# 總結
echo ""
echo "================================"
echo "✅ 部署驗證完成！"
echo "================================"
echo ""
echo "下一步:"
echo "1. 在瀏覽器訪問 $URL"
echo "2. 測試「自動配圖」按鈕"
echo "3. 測試「Pitch Coach」AI 生成"
echo "4. 測試「樓層巡檢」AI 建議"
echo ""
