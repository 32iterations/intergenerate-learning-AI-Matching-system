// 管理端 Dashboard DEMO 腳本
// - 匯總今日隔代共學場次
// - 依據樓層利用率做簡單統計
// - 透過 Puter.js / Gemini 3 Pro 產生 Ops 巡檢建議

// ===== 錯誤處理工具函數 =====

/**
 * 判斷錯誤類型並回傳使用者友善的訊息
 * @param {Error} error - 錯誤物件
 * @param {string} context - 錯誤發生的情境
 * @returns {string} 使用者友善的錯誤訊息
 */
function getUserFriendlyErrorMessage(error, context = "操作") {
  if (!navigator.onLine) {
    return "網路連線中斷,請檢查網路設定後再試一次。";
  }

  if (error.message && error.message.includes("puter")) {
    return "Puter.js 服務無法連線,請確認網頁已正確載入 Puter.js 腳本。";
  }

  if (error.message && error.message.includes("ECONNREFUSED")) {
    return "無法連線到伺服器,請確認伺服器是否已啟動（http://localhost:3000）。";
  }

  return `${context}時發生錯誤,請稍後再試。詳細訊息: ${error.message}`;
}

// ===== 資料定義 =====

const TODAY_SESSIONS = [
  {
    time: "09:30–10:20",
    floor: "1F",
    space: "一般日照區",
    topic: "爺奶說故事：我小時候的竹塹城",
    audience: "長者 18 人＋幼兒園大班 10 人",
    quality: "良好",
    qualityScore: 4.2,
    status: "已結束",
  },
  {
    time: "10:30–11:15",
    floor: "2F",
    space: "多功能教室",
    topic: "共煮共食：一起包水餃",
    audience: "長者 12 人＋托嬰家長 6 人＋幼兒 14 人",
    quality: "非常好",
    qualityScore: 4.7,
    status: "進行中",
  },
  {
    time: "15:30–16:20",
    floor: "4F",
    space: "自習＆課輔教室",
    topic: "青少年志工陪讀＋長輩 iPad 練習",
    audience: "長者 8 人＋國中志工 9 人",
    quality: "普通",
    qualityScore: 3.4,
    status: "未開始",
  },
];

const ADMIN_FLOOR_UTIL = [
  { floor: "1F", name: "長者日照中心", utilization: 0.75 },
  { floor: "2F", name: "公共托嬰中心", utilization: 0.66 },
  { floor: "3F", name: "家庭支持服務中心", utilization: 0.58 },
  { floor: "4F", name: "青少年活動空間", utilization: 0.61 },
];

function formatPercent(v) {
  return `${Math.round(v * 100)}%`;
}

function bucketLabel(v) {
  const pct = v * 100;
  if (pct < 40) return "偏鬆";
  if (pct < 70) return "適中";
  if (pct < 85) return "微偏滿";
  return "偏滿";
}

function renderMetrics() {
  const totalSessionsEl = document.querySelector(
    "#metric-total-sessions .metric-value"
  );
  const qualityGoodEl = document.querySelector(
    "#metric-quality-good .metric-value"
  );
  const spaceHotEl = document.querySelector(
    "#metric-space-hot .metric-value"
  );

  if (!totalSessionsEl || !qualityGoodEl || !spaceHotEl) return;

  const total = TODAY_SESSIONS.length;
  const goodCount = TODAY_SESSIONS.filter((s) => s.qualityScore >= 4).length;
  const goodRatio = total > 0 ? goodCount / total : 0;

  totalSessionsEl.textContent = `${total} 場`;
  qualityGoodEl.textContent = `${Math.round(goodRatio * 100)}%`;

  const hottest = [...ADMIN_FLOOR_UTIL].sort(
    (a, b) => b.utilization - a.utilization
  )[0];

  if (hottest) {
    spaceHotEl.textContent = `${hottest.floor} ${hottest.name}`;
  }
}

function renderSessionsTable() {
  const tbody = document.getElementById("sessions-table-body");
  if (!tbody) return;

  tbody.innerHTML = TODAY_SESSIONS.map((s) => {
    const qualityClass =
      s.qualityScore >= 4.5
        ? "tag tag--success"
        : s.qualityScore >= 4
        ? "tag tag--info"
        : s.qualityScore >= 3
        ? "tag tag--warning"
        : "tag tag--danger";

    return `
      <tr>
        <td>${s.time}</td>
        <td>${s.floor} · ${s.space}</td>
        <td>${s.topic}</td>
        <td>${s.audience}</td>
        <td><span class="${qualityClass}">${s.quality}（${s.qualityScore.toFixed(
      1
    )}）</span></td>
        <td>${s.status}</td>
      </tr>
    `.trim();
  }).join("");
}

function renderAdminFloorSummary() {
  const container = document.getElementById("admin-floor-summary");
  if (!container) return;

  container.innerHTML = ADMIN_FLOOR_UTIL.map((f) => {
    return `
      <div class="admin-floor-card">
        <div class="admin-floor-row">
          <div class="admin-floor-name">
            <span class="admin-floor-label">${f.floor}</span>
            <span>${f.name}</span>
          </div>
          <div class="admin-floor-util">
            <span>${formatPercent(f.utilization)}</span>
            <span class="admin-floor-chip">${bucketLabel(f.utilization)}</span>
          </div>
        </div>
        <div class="admin-floor-bar">
          <div class="admin-floor-bar-fill" style="width: ${Math.round(
            f.utilization * 100
          )}%;"></div>
        </div>
      </div>
    `.trim();
  }).join("");
}

function initAiOpsInsights() {
  const btn = document.getElementById("ai-ops-insights-btn");
  const output = document.getElementById("ai-ops-output");

  if (!btn || !output) return;

  if (typeof window.puter === "undefined") {
    output.textContent =
      "Puter.js 尚未成功載入，因此無法示範 Gemini 3 Pro 巡檢建議。上線時請確認 index.html / admin.html 皆已引入 js.puter.com/v2。";
    return;
  }

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "AI 分析中⋯";
    output.textContent = "";

    const payload = {
      sessions: TODAY_SESSIONS,
      floorUtilization: ADMIN_FLOOR_UTIL,
    };

    const prompt = `
你是一位擅長長照、托育與社福場館營運的管理顧問，正在協助「赤土崎多功能館」做每日 Ops 巡檢。

以下是今天的隔代共學場次與各樓層空間利用率資料（utilization 為 0–1）：

${JSON.stringify(payload, null, 2)}

請用繁體中文輸出 3–4 點條列式建議，內容聚焦：
1) 今天需要特別關注的風險（例如：人力過載、空間過滿、安靜空間被打擾等）
2) 建議明天可以調整的排程或空間安排
3) 可以向市府或社區報告的亮點觀察（例如：哪個活動最有世代連結感）

請避免使用過於學術或制式的公文語氣，維持專業但溫暖、適合貼進簡報或交班記錄。`.trim();

    try {
      const response = await window.puter.ai.chat(prompt, {
        model: "gemini-3-pro-preview",
      });

      let text;
      if (typeof response === "string") {
        text = response;
      } else if (response && typeof response === "object") {
        text =
          response.output ||
          response.message ||
          (Array.isArray(response.choices) && response.choices[0]?.message) ||
          JSON.stringify(response);
      } else {
        text = "AI 回傳了非預期格式的結果，請稍後再試一次。";
      }

      output.textContent = text;
    } catch (err) {
      console.error("[initAiOpsInsights] 錯誤:", err);
      const errorMessage = getUserFriendlyErrorMessage(err, "產生 AI 巡檢建議");
      output.textContent = errorMessage;
    } finally {
      btn.disabled = false;
      btn.textContent = "產生今日「Ops 巡檢重點」建議";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderMetrics();
  renderSessionsTable();
  renderAdminFloorSummary();
  initAiOpsInsights();
});
