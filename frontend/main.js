// frontend/main.js
// - 自動根據頁面內容與 data-page-topic 產生圖片搜尋關鍵字
// - 呼叫後端 /api/images 取得 Pexels 搜尋結果並渲染
// - 透過 Puter.js 呼叫 Gemini 3 Pro 做 Pitch Coach

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

  if (error.message && error.message.includes("ECONNREFUSED")) {
    return "無法連線到伺服器,請確認伺服器是否已啟動（http://localhost:3000）。";
  }

  if (error.message && error.message.includes("404")) {
    return "找不到請求的資源,請聯絡技術支援。";
  }

  if (error.message && error.message.includes("500")) {
    return "伺服器發生錯誤,請稍後再試或聯絡技術支援。";
  }

  return `${context}時發生錯誤,請稍後再試。`;
}

// ===== 頁面主題與圖片搜尋 =====

function getPageTopic() {
  const body = document.body;
  const topicAttr = body.dataset.pageTopic || "";
  const headings = Array.from(
    document.querySelectorAll("h1, h2.section-title, .section h2")
  )
    .map((el) => el.textContent.trim())
    .join(" ");

  const raw = `${topicAttr} ${headings}`.trim();

  // 這裡可以視需要再更動權重，現在先加上關鍵詞讓圖片更偏向在地、亞洲情境
  const extra = "Taiwan Hsinchu intergenerational care grandparents children community center Asia";
  return `${raw} ${extra}`.trim();
}

async function fetchImages(queryOverride) {
  try {
    const query = (queryOverride || getPageTopic()).slice(0, 120);
    const resp = await fetch(`/api/images?q=${encodeURIComponent(query)}`);

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    return data.images || [];
  } catch (error) {
    console.error("[fetchImages] 錯誤:", error);
    throw error;
  }
}

function renderImages(images) {
  const grid = document.getElementById("image-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!images.length) {
    const div = document.createElement("div");
    div.className = "image-empty";
    div.textContent = "暫時找不到合適的圖像，可以稍後再試一次。";
    grid.appendChild(div);
    return;
  }

  images.forEach((img) => {
    const figure = document.createElement("figure");
    figure.className = "image-card";

    const image = document.createElement("img");
    image.src = img.url;
    image.alt =
      img.alt ||
      "祖孫與孩子在社區空間互動的示意照片（實際場景以赤土崎多功能館為主）";

    const caption = document.createElement("figcaption");
    const photographer = img.photographer || "Unknown";
    caption.textContent = `Photo: ${photographer} / Pexels`;

    figure.appendChild(image);
    figure.appendChild(caption);
    grid.appendChild(figure);
  });
}

async function handleImageRefresh(clickedButton) {
  const buttons = [
    document.getElementById("image-refresh-btn"),
    document.getElementById("image-refresh-btn-top"),
  ].filter(Boolean);

  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.textContent = "配圖中⋯";
  });

  try {
    const images = await fetchImages();
    renderImages(images);
  } catch (err) {
    console.error("[handleImageRefresh] 錯誤:", err);
    const grid = document.getElementById("image-grid");
    if (grid) {
      const errorMessage = getUserFriendlyErrorMessage(err, "載入圖片");
      grid.innerHTML = `<div class="image-empty">${errorMessage}</div>`;
    }
  } finally {
    buttons.forEach((btn) => {
      btn.disabled = false;
      btn.textContent =
        btn === clickedButton ? "重新配圖" : "依頁面內容自動配圖";
    });
  }
}

// --- Gemini 3 Pro Pitch Coach ---

function buildPitchPrompt({ notes, language }) {
  const baseContext =
    "你是一位熟悉台灣在地社福與新創簡報的教練，要幫我在黑客松決賽用很短的時間講清楚：「隔代共學 AI 媒合系統」如何在新竹市赤土崎多功能館落地。";

  if (language === "en") {
    return `
You are a bilingual Taiwanese pitch coach.

Summarize this project into a **60-second English pitch** for an international judge panel.
Context:
- City: Hsinchu City, Taiwan
- Location: Chihduqi Multi-functional Center (赤土崎多功能館)
- Service: AI-powered intergenerational matching between elders and families with young children, running activities in the physical center
- Constraints: limited social workers, safety and trust for families, meaningful roles for independent elders

User notes (in Chinese or English):
${notes || "(no additional notes provided)"}

Requirements:
- 3–4 short paragraphs
- Tone: confident, warm, civic-tech oriented
- Include at least one concrete example (a weekday evening or weekend scenario)
- Avoid heavy jargon; use words a city mayor or social welfare officer can immediately understand.
`;
  }

  // zh-TW 30 秒版本
  return `
${baseContext}

請你依據下列筆記，幫我寫一段「約 30 秒、偏口語、適合對市府長官與社福評審說」的中文介紹。

我的補充筆記：
${notes || "（沒有特別補充，請自行發揮，但要聚焦在：幫忙誰？節省什麼成本？為何一定要在赤土崎館做？）"}

輸出格式：
- 1 段主軸開場（1～2 句）
- 2～3 個 bullet points 說明具體好處（家庭、長者、館舍/市府 各至少一點）
- 最後 1 句收尾，點出「如果給我們機會試辦，半年內可以看到什麼具體改變」
`;
}

async function runPitchCoach({ language }) {
  const notesEl = document.getElementById("pitch-notes");
  const outputEl = document.getElementById("pitch-output");
  if (!notesEl || !outputEl) {
    if (outputEl) {
      outputEl.textContent = "無法找到必要的 DOM 元素。";
    }
    return;
  }

  const notes = notesEl.value.trim();
  const prompt = buildPitchPrompt({ notes, language });

  outputEl.textContent = "Gemini 3 Pro 正在思考中⋯";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: "google/gemini-2.0-flash-exp:free"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.error || "API 請求失敗");
    }

    const data = await response.json();
    const text = data.message || "AI 未返回有效回應";

    outputEl.textContent = text;
  } catch (err) {
    console.error("[runPitchCoach] 錯誤:", err);
    const errorMessage = getUserFriendlyErrorMessage(err, "產生 Pitch");
    outputEl.textContent = errorMessage;
  }
}

// --- Wire up events ---

// --- 館內平面圖 + 即時空間利用率（以赤土崎 1F–4F 極簡模型為例） ---

const FLOOR_DATA = {
  "1F": {
    label: "1F 長者日照中心",
    subtitle:
      "失智專區＋一般日照＋共用餐廳與庭園，是隔代共學故事時間與手作課的主要舞台。",
    spaces: [
      {
        id: "dementia",
        name: "失智照護區",
        type: "安靜 / 感官刺激",
        utilization: 0.68,
        capacity: 24,
      },
      {
        id: "daycare",
        name: "一般日照區",
        type: "團體活動 / 復健",
        utilization: 0.76,
        capacity: 36,
      },
      {
        id: "dining",
        name: "共用餐廳",
        type: "用餐 / 共食",
        utilization: 0.82,
        capacity: 60,
      },
      {
        id: "garden",
        name: "無障礙庭園",
        type: "戶外散步 / 共學",
        utilization: 0.42,
        capacity: 20,
      },
      {
        id: "rest",
        name: "休息 / 閱讀角落",
        type: "午休 / 安靜閱讀",
        utilization: 0.91,
        capacity: 10,
      },
      {
        id: "nurse",
        name: "護理站＋支援空間",
        type: "護理 / 社工 / 儲藏",
        utilization: 0.58,
        capacity: 8,
      },
    ],
  },
  "2F": {
    label: "2F 公共托嬰中心（0–2 歲）",
    subtitle:
      "嬰幼兒照護與親子活動空間，可安排「爺奶說故事」「世代共玩」等活動。",
    spaces: [
      {
        id: "infant",
        name: "嬰兒照護區",
        type: "0–1 歲照護",
        utilization: 0.71,
        capacity: 20,
      },
      {
        id: "toddler",
        name: "幼兒活動區",
        type: "1–2 歲遊戲",
        utilization: 0.64,
        capacity: 24,
      },
      {
        id: "multi",
        name: "多功能教室",
        type: "共讀 / 手作 / 音樂",
        utilization: 0.53,
        capacity: 30,
      },
      {
        id: "dining",
        name: "共用餐廳",
        type: "副食品 / 共食",
        utilization: 0.78,
        capacity: 40,
      },
      {
        id: "outdoor",
        name: "戶外遊戲平台",
        type: "大型玩具 / 遊戲",
        utilization: 0.37,
        capacity: 18,
      },
      {
        id: "support",
        name: "哺乳 / 員工休息 / 倉儲",
        type: "支援空間",
        utilization: 0.44,
        capacity: 10,
      },
    ],
  },
  "3F": {
    label: "3F 家庭支持服務中心",
    subtitle:
      "親職教育、家庭諮商與社區營造，是統籌整個赤土崎隔代共學計畫的「作戰室」。",
    spaces: [
      {
        id: "counsel",
        name: "家庭諮商室",
        type: "個別 / 家庭諮商",
        utilization: 0.62,
        capacity: 8,
      },
      {
        id: "parenting",
        name: "親職教育教室",
        type: "講座 / 工作坊",
        utilization: 0.74,
        capacity: 30,
      },
      {
        id: "community",
        name: "社區營造空間",
        type: "共餐 / 共煮 / 社群",
        utilization: 0.57,
        capacity: 24,
      },
      {
        id: "meeting",
        name: "志工＆館務會議室",
        type: "排班 / 計畫討論",
        utilization: 0.49,
        capacity: 12,
      },
      {
        id: "hotdesk",
        name: "社工與行政辦公",
        type: "行政 / 分析 / 文書",
        utilization: 0.83,
        capacity: 12,
      },
      {
        id: "support",
        name: "備品 / 休息空間",
        type: "支援空間",
        utilization: 0.36,
        capacity: 6,
      },
    ],
  },
  "4F": {
    label: "4F 青少年社區活動空間",
    subtitle:
      "閱讀、運動與社團活動空間，可規劃國中生以上志工參與隔代共學與課後陪伴。",
    spaces: [
      {
        id: "sports",
        name: "運動＆體能活動區",
        type: "球類 / 體能",
        utilization: 0.59,
        capacity: 32,
      },
      {
        id: "learning",
        name: "自習＆課輔教室",
        type: "讀書 / 課後輔導",
        utilization: 0.72,
        capacity: 28,
      },
      {
        id: "makerspace",
        name: "創客＆專題空間",
        type: "專題 / 專案共學",
        utilization: 0.44,
        capacity: 20,
      },
      {
        id: "lounge",
        name: "青少年交流角落",
        type: "社交 / 休憩",
        utilization: 0.63,
        capacity: 18,
      },
      {
        id: "studio",
        name: "錄音 / 媒體小間",
        type: "podcast / 影音製作",
        utilization: 0.31,
        capacity: 6,
      },
      {
        id: "support",
        name: "備品 / 支援空間",
        type: "儲藏 / 支援",
        utilization: 0.28,
        capacity: 6,
      },
    ],
  },
};

function percentLabel(value) {
  const pct = Math.round(value * 100);
  if (pct < 40) return `${pct}% · 偏鬆`;
  if (pct < 70) return `${pct}% · 適中`;
  if (pct < 85) return `${pct}% · 微偏滿`;
  return `${pct}% · 偏滿`;
}

function renderFloorUsage(floorKey) {
  const data = FLOOR_DATA[floorKey];
  if (!data) return;

  const titleEl = document.getElementById("floor-plan-title");
  const subtitleEl = document.getElementById("floor-plan-subtitle");
  const gridEl = document.getElementById("floor-plan-grid");
  const legendEl = document.getElementById("floor-legend-list");

  if (!gridEl || !legendEl || !titleEl || !subtitleEl) {
    return;
  }

  titleEl.textContent = data.label;
  subtitleEl.textContent = data.subtitle;

  gridEl.innerHTML = data.spaces
    .map(
      (space) => `
      <div class="floor-plan-room">
        <div class="floor-plan-room__name">${space.name}</div>
        <div class="floor-plan-room__meta">
          <span>${space.type}</span>
          <span class="floor-plan-room__pill">${percentLabel(
            space.utilization
          )}</span>
        </div>
      </div>
    `.trim()
    )
    .join("");

  legendEl.innerHTML = data.spaces
    .map(
      (space) => `
      <li class="floor-legend-item">
        <div class="floor-legend-row">
          <span>${space.name}</span>
          <span class="floor-plan-room__value">
            ${Math.round(space.utilization * 100)}%（最多 ${space.capacity} 人）
          </span>
        </div>
        <div class="floor-legend-bar">
          <div
            class="floor-legend-bar-fill"
            style="width: ${Math.round(space.utilization * 100)}%;"
          ></div>
        </div>
      </li>
    `.trim()
    )
    .join("");
}

function initFloorUsage() {
  const selectEl = document.getElementById("floor-select");
  if (!selectEl) return;

  renderFloorUsage(selectEl.value || "1F");

  selectEl.addEventListener("change", () => {
    renderFloorUsage(selectEl.value || "1F");
  });

  const aiBtn = document.getElementById("ai-floor-summary-btn");
  const aiOutputEl = document.getElementById("ai-floor-summary-output");

  if (aiBtn && aiOutputEl) {
    aiBtn.addEventListener("click", async () => {
      const floorKey = selectEl.value || "1F";
      const data = FLOOR_DATA[floorKey];
      if (!data) return;

      aiBtn.disabled = true;
      aiBtn.textContent = "AI 分析中⋯";

      const payload = {
        floor: floorKey,
        label: data.label,
        spaces: data.spaces.map((s) => ({
          name: s.name,
          type: s.type,
          utilization: s.utilization,
          capacity: s.capacity,
        })),
      };

      const prompt = `
你是一位熟悉台灣長照與托育現場的服務設計顧問，正在協助新竹市「赤土崎多功能館」做館內動線與空間排程最佳化。

以下是某一樓層目前的空間利用狀態（0–1 之間為使用率）：

${JSON.stringify(payload, null, 2)}

請用 2–3 句繁體中文，幫館方快速說明：
1) 現在最適合插入「隔代共學故事時間」或「共煮 / 共食」活動的 1–2 個空間與理由
2) 哪個空間已接近飽和，需要避免再排活動，並簡短說明風險

語氣請偏向專業但溫暖，適合出現在簡報或 Dashboard 側邊說明。`.trim();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            model: "google/gemini-2.0-flash-exp:free"
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.error || "API 請求失敗");
        }

        const data = await response.json();
        let text = data.message || "AI 未返回有效回應";
        if (typeof text !== "string") {
          text = "AI 回傳了非預期格式的結果，請稍後再試一次。";
        }

        aiOutputEl.textContent = text;
      } catch (err) {
        console.error("[AI floor summary] error:", err);
        aiOutputEl.textContent =
          "AI 服務目前無法連線（可能是 Puter.js 未載入或網路問題），請稍後再試。";
      } finally {
        aiBtn.disabled = false;
        aiBtn.textContent = "請 AI 幫我找出「現在最適合插入隔代共學」的場地";
      }
    });
  }
}

// --- Flow 區 Rive 動畫初始化 ---

function initRiveFlow() {
  const canvas = document.getElementById("rive-flow-canvas");
  if (!canvas) return;

  const hasRive = typeof window !== "undefined" && window.rive && window.rive.Rive;
  if (!hasRive) {
    console.warn(
      "[Rive] window.rive 尚未載入，請確認 index.html 已引入 https://unpkg.com/@rive-app/canvas@latest"
    );
    return;
  }

  try {
    const riveInstance = new window.rive.Rive({
      src: "./assets/rive/intergen-flow.riv",
      canvas,
      autoplay: true,
    });
    window.__intergenRiveFlow = riveInstance;
  } catch (err) {
    console.error("[Rive] 初始化失敗：", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 頁面載入時先嘗試配一次圖
  handleImageRefresh(null).catch((err) => console.error(err));

  const imageBtnMain = document.getElementById("image-refresh-btn");
  if (imageBtnMain) {
    imageBtnMain.addEventListener("click", () => handleImageRefresh(imageBtnMain));
  }

  const imageBtnTop = document.getElementById("image-refresh-btn-top");
  if (imageBtnTop) {
    imageBtnTop.addEventListener("click", () => handleImageRefresh(imageBtnTop));
  }

  const pitchBtnTop = document.getElementById("pitch-generate-btn");
  if (pitchBtnTop) {
    pitchBtnTop.addEventListener("click", () =>
      runPitchCoach({ language: "zh" })
    );
  }

  const pitchBtnBottom = document.getElementById("pitch-generate-btn-bottom");
  if (pitchBtnBottom) {
    pitchBtnBottom.addEventListener("click", () =>
      runPitchCoach({ language: "zh" })
    );
  }

  const pitchBtnEn = document.getElementById("pitch-generate-en-btn");
  if (pitchBtnEn) {
    pitchBtnEn.addEventListener("click", () =>
      runPitchCoach({ language: "en" })
    );
  }
  // 館內平面圖 & 空間利用率卡片初始化
  initFloorUsage();

  // Flow 區 Rive 動畫初始化
  initRiveFlow();

});