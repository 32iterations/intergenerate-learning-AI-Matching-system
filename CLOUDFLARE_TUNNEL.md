# ⚡ Cloudflare Tunnel 5 分鐘快速部署

**最快的外網公開方案！** 適合黑客松展示和臨時 Demo。

---

## 🎯 為什麼選擇 Cloudflare Tunnel？

### 優點

✅ **超快速** - 5 分鐘內完成
✅ **免費** - 無需付費
✅ **無需註冊** - 快速通道無需帳號
✅ **自動 HTTPS** - 安全連線
✅ **無需開放防火牆** - 反向隧道技術
✅ **全球 CDN** - Cloudflare 網路加速

### 缺點

⚠️ **URL 暫時** - 每次重啟會改變（可升級為固定 URL）
⚠️ **需持續運行** - 關閉終端即失效

### 適用場景

- 🎤 **黑客松展示** - 當天快速 demo
- 👥 **團隊預覽** - 分享給遠端團隊
- 🧪 **快速測試** - 測試外網連線
- 📱 **手機測試** - 在手機上測試網站

---

## 📦 步驟 1：安裝 cloudflared

### macOS

```bash
brew install cloudflare/cloudflare/cloudflared
```

### Linux

```bash
# 下載最新版本
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64

# 賦予執行權限
chmod +x cloudflared-linux-amd64

# 移動到系統路徑
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# 驗證安裝
cloudflared --version
```

### Windows

1. 訪問：https://github.com/cloudflare/cloudflared/releases
2. 下載 `cloudflared-windows-amd64.exe`
3. 重新命名為 `cloudflared.exe`
4. 加入 PATH 或直接執行

---

## 🚀 步驟 2：啟動本地伺服器

**終端 1** (啟動專案伺服器):

```bash
cd /home/thc1006/hsinchu/intergenerate-learning-AI-Matching-system
./scripts/start.sh
```

或手動啟動：

```bash
cd server
npm run dev
```

確認伺服器運行：
```
[server] listening on http://localhost:3001
```

---

## 🌐 步驟 3：建立 Tunnel

**終端 2** (新開一個終端):

```bash
cloudflared tunnel --url http://localhost:3001
```

### 預期輸出

```
2025-11-23T00:45:00Z INF Thank you for trying Cloudflare Tunnel. Doing so, without a Cloudflare account, is a quick way to experiment and try it out. However, be aware that these account-less Tunnels have no uptime guarantee. If you intend to use Tunnels in production you should use a pre-created named tunnel by following: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps
2025-11-23T00:45:00Z INF Requesting new quick Tunnel on trycloudflare.com...
2025-11-23T00:45:01Z INF +--------------------------------------------------------------------------------------------+
2025-11-23T00:45:01Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2025-11-23T00:45:01Z INF |  https://random-words-1234.trycloudflare.com                                               |
2025-11-23T00:45:01Z INF +--------------------------------------------------------------------------------------------+
2025-11-23T00:45:01Z INF Cannot determine default configuration path. No file [config.yml config.yaml] in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]
2025-11-23T00:45:01Z INF Version 2024.11.1
2025-11-23T00:45:01Z INF GOOS: linux, GOVersion: go1.22.2, GoArch: amd64
2025-11-23T00:45:01Z INF Settings: map[ha-connections:1 protocol:quic url:http://localhost:3001]
2025-11-23T00:45:01Z INF Generated Connector ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
2025-11-23T00:45:01Z INF cloudflared will not automatically update if installed by a package manager.
2025-11-23T00:45:01Z INF Initial protocol quic
2025-11-23T00:45:01Z INF ICMP proxy will use 192.168.1.1 as source for IPv4
2025-11-23T00:45:01Z INF ICMP proxy will use fe80::1 in zone eth0 as source for IPv6
2025-11-23T00:45:01Z INF Starting metrics server on 127.0.0.1:43517/metrics
2025-11-23T00:45:02Z INF Registered tunnel connection connIndex=0 connection=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx event=0 ip=198.41.200.13 location=SJC protocol=quic
```

### 🎉 成功！

複製這個 URL：
```
https://random-words-1234.trycloudflare.com
```

**這就是你的公開網址！**

---

## ✅ 步驟 4：驗證部署

### 方法 1：瀏覽器測試

開啟瀏覽器，訪問你的 Tunnel URL：
```
https://random-words-1234.trycloudflare.com
```

應該看到：
- ✅ 主頁正常顯示
- ✅ 樣式完整載入
- ✅ 圖片可以顯示

### 方法 2：API 測試

```bash
curl https://random-words-1234.trycloudflare.com/api/images?q=taiwan
```

應返回 JSON 格式的圖片資料。

### 方法 3：使用驗證腳本

```bash
./scripts/deploy-check.sh https://random-words-1234.trycloudflare.com
```

---

## 🎯 測試 AI 功能

現在所有 AI 功能都可以在外網使用了！

### 1. 圖片自動配圖
```
https://random-words-1234.trycloudflare.com
```
點擊「🎨 自動配圖」

### 2. Pitch Coach
```
https://random-words-1234.trycloudflare.com#pitch-coach
```
輸入筆記 → 生成簡報稿

### 3. 管理儀表板
```
https://random-words-1234.trycloudflare.com/admin.html
```
測試 AI Ops 巡檢

---

## 📱 分享給團隊

### 複製 URL

```bash
# 從終端複製 URL
echo "https://random-words-1234.trycloudflare.com"
```

### 分享方式

1. **Slack / Discord**
   ```
   🎉 Demo 上線了！
   https://random-words-1234.trycloudflare.com
   ```

2. **Email**
   ```
   主旨：隔代共學 AI 媒合系統 - 線上展示

   各位好，

   我們的專案已經上線，請訪問：
   https://random-words-1234.trycloudflare.com

   功能測試：
   - 主頁：圖片自動配圖
   - AI Coach：簡報生成
   - 管理端：/admin.html

   請隨時回饋！
   ```

3. **QR Code 生成**
   ```bash
   # 使用線上工具生成 QR Code
   # https://www.qr-code-generator.com/
   ```

---

## 🔧 進階功能

### 固定 URL（需註冊 Cloudflare 帳號）

如果你需要固定的 URL（不會每次改變）：

#### 步驟 1：登入 Cloudflare

```bash
cloudflared tunnel login
```

會開啟瀏覽器，登入你的 Cloudflare 帳號。

#### 步驟 2：建立命名的 Tunnel

```bash
cloudflared tunnel create hsinchu-intergen
```

會得到一個 Tunnel ID。

#### 步驟 3：設定 DNS

```bash
cloudflared tunnel route dns hsinchu-intergen your-subdomain.example.com
```

#### 步驟 4：建立配置檔

`~/.cloudflared/config.yml`:

```yaml
tunnel: hsinchu-intergen
credentials-file: /home/thc1006/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: your-subdomain.example.com
    service: http://localhost:3001
  - service: http_status:404
```

#### 步驟 5：運行 Tunnel

```bash
cloudflared tunnel run hsinchu-intergen
```

現在你有一個**固定的 URL**：
```
https://your-subdomain.example.com
```

---

## ⚙️ 故障排除

### 問題 1：Tunnel 連線失敗

```
INF Registered tunnel connection failed
```

**解決方案**:
- 檢查本地伺服器是否運行
- 確認端口 3001 沒有被佔用
- 檢查網路連線

### 問題 2：URL 無法訪問

```
Unable to connect
```

**解決方案**:
- 等待 30-60 秒（Tunnel 建立需要時間）
- 重新啟動 cloudflared
- 檢查防火牆設定

### 問題 3：502 Bad Gateway

```
502 Bad Gateway
cloudflare
```

**解決方案**:
- 確認本地伺服器正在運行
- 檢查 `http://localhost:3001` 是否可訪問
- 重啟本地伺服器

---

## 💡 最佳實踐

### 黑客松展示前

1. **提前 30 分鐘啟動**
   ```bash
   # 終端 1
   ./scripts/start.sh

   # 終端 2
   cloudflared tunnel --url http://localhost:3001
   ```

2. **記錄 URL**
   ```bash
   # 將 URL 存到檔案
   echo "https://random-words-1234.trycloudflare.com" > tunnel-url.txt
   ```

3. **測試所有功能**
   - [ ] 主頁載入
   - [ ] 圖片自動配圖
   - [ ] Pitch Coach
   - [ ] 管理儀表板
   - [ ] 手機訪問

4. **準備備案**
   - 本地伺服器隨時待命
   - 錄製展示影片
   - 截圖關鍵畫面

### 展示時

1. **保持終端運行**
   - 不要關閉 cloudflared 終端
   - 使用 tmux/screen 保持 session

2. **監控狀態**
   ```bash
   # 新終端監控伺服器日誌
   tail -f /tmp/server.log
   ```

3. **網路穩定性**
   - 使用穩定的 Wi-Fi
   - 準備手機熱點備用

---

## 📊 效能監控

### 查看 Tunnel 狀態

```bash
# cloudflared 會顯示即時日誌
# 包含每個請求的資訊
```

### 測試延遲

```bash
curl -w "@-" -o /dev/null -s https://random-words-1234.trycloudflare.com << 'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

---

## 🎊 完成檢查清單

部署完成後確認：

- [ ] 本地伺服器運行正常
- [ ] cloudflared tunnel 已建立
- [ ] 複製並保存了 Tunnel URL
- [ ] 主頁可以訪問
- [ ] API 端點測試通過
- [ ] 圖片自動配圖功能正常
- [ ] Pitch Coach 可以使用
- [ ] 管理儀表板可以訪問
- [ ] 手機可以訪問
- [ ] URL 已分享給團隊

---

## 🔗 相關連結

- **Cloudflare Tunnel 官方文檔**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps
- **快速 Tunnel 說明**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/run-tunnel/trycloudflare
- **GitHub Releases**: https://github.com/cloudflare/cloudflared/releases

---

## 📞 需要協助？

- **本文檔**: `CLOUDFLARE_TUNNEL.md`
- **完整部署指南**: `DEPLOYMENT.md`
- **快速啟動**: `QUICK_START.md`
- **自動部署**: `AUTO_DEPLOY.md`

---

**🎉 恭喜！5 分鐘內你的系統已經公開到全世界！**

**Tunnel URL**: https://random-words-1234.trycloudflare.com

**祝展示順利！🚀**
