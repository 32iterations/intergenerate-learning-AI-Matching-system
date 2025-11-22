# 靜態資源目錄

這個資料夾包含前端頁面使用的靜態資源檔案。

## 資料夾結構

- `rive/` - Rive 動畫檔案
  - 期望檔案: `intergen-flow.riv` (隔代共學流程動畫)
  - 用途: 首頁 Value Flow 區塊的動畫展示

- `images/` - 本地圖片資源
  - 可放置 logo、預設圖片等
  - 注意: 大部分圖片透過 Pexels API 動態載入

## 使用說明

### Rive 動畫

如需製作 Rive 動畫:
1. 前往 https://rive.app/
2. 建立動畫展示隔代共學的流程
3. 匯出為 `.riv` 檔案
4. 放置於 `rive/intergen-flow.riv`

### Spline 3D 場景

Spline 3D 是透過 CDN 載入,不需要本地檔案。
如需自訂 3D 場景:
1. 前往 https://spline.design/
2. 建立赤土崎多功能館的 3D 模型
3. 取得分享連結
4. 更新 `index.html` 中的 Spline viewer URL
