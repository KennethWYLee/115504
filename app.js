const project = {
  "id": "115504",
  "slug": "ntub-115504-mood-compass",
  "repo": "115504",
  "title": "Mood Compass 情緒紀錄與自我照護儀表板",
  "shortName": "Mood Compass",
  "subtitle": "把每日感受整理成可回顧的生活訊號",
  "eyebrow": "115504 專業化展示版",
  "source": "五專第115504組 情緒紀錄網站系統手冊",
  "mark": "MC",
  "accent": "#2f855a",
  "accent2": "#db2777",
  "accent3": "#2563eb",
  "dark": "#102018",
  "tabs": [
    "今日狀態",
    "情緒紀錄",
    "趨勢分析",
    "照護建議",
    "隱私設定"
  ],
  "metrics": [
    {
      "label": "連續紀錄",
      "value": "14 天",
      "note": "每日情緒與事件"
    },
    {
      "label": "本週平穩度",
      "value": "78%",
      "note": "波動低於上週"
    },
    {
      "label": "主要觸發",
      "value": "課業",
      "note": "壓力事件占 34%"
    },
    {
      "label": "照護任務",
      "value": "3",
      "note": "呼吸、散步、睡眠"
    }
  ],
  "visual": {
    "mode": "wellbeing",
    "nodes": [
      [
        "紀錄",
        "心情 / 睡眠 / 壓力",
        14,
        34
      ],
      [
        "標籤",
        "觸發因素",
        42,
        20
      ],
      [
        "趨勢",
        "週期與波動",
        70,
        36
      ],
      [
        "照護",
        "自我練習",
        42,
        68
      ],
      [
        "回顧",
        "給自己的摘要",
        74,
        72
      ]
    ],
    "links": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        4
      ]
    ]
  },
  "panels": [
    {
      "title": "低負擔紀錄",
      "text": "以心情、能量、睡眠、事件標籤快速完成每日紀錄，避免日記工具過重。",
      "tag": "Daily check-in"
    },
    {
      "title": "趨勢而非診斷",
      "text": "平台只做生活訊號整理與自我照護提醒，不取代醫療或心理諮商。",
      "tag": "Safe scope"
    },
    {
      "title": "隱私優先",
      "text": "所有展示資料皆為模擬，正式設計應提供匯出、刪除與本機加密選項。",
      "tag": "Privacy"
    }
  ],
  "workflow": [
    "記錄今日心情、能量與睡眠",
    "標註壓力來源與支持事件",
    "檢視一週波動與高頻觸發",
    "選擇自我照護行動",
    "產生週回顧摘要"
  ],
  "form": {
    "title": "新增今日紀錄",
    "button": "儲存紀錄",
    "fields": [
      {
        "name": "mood",
        "label": "今日心情",
        "type": "select",
        "options": [
          "平穩",
          "焦慮",
          "疲憊",
          "開心",
          "低落"
        ],
        "value": "平穩"
      },
      {
        "name": "energy",
        "label": "能量",
        "type": "select",
        "options": [
          "高",
          "中",
          "低"
        ],
        "value": "中"
      },
      {
        "name": "trigger",
        "label": "主要事件",
        "type": "text",
        "value": "作業進度有壓力，但有和同學討論"
      }
    ]
  },
  "recordsTitle": "近期紀錄",
  "records": [
    {
      "title": "週五 · 平穩",
      "meta": "睡眠 7h · 課業壓力 · 散步 20 分鐘",
      "status": "已完成"
    },
    {
      "title": "週四 · 焦慮",
      "meta": "睡眠 5.5h · 報告截止 · 呼吸練習",
      "status": "需回顧"
    },
    {
      "title": "週三 · 開心",
      "meta": "社交支持 · 任務完成",
      "status": "穩定"
    }
  ],
  "insights": [
    "情緒紀錄應避免用單一分數判斷好壞，需結合睡眠、事件與支持來源。",
    "趨勢提醒應使用柔和語氣，避免造成使用者額外壓力。",
    "若使用者記錄高風險文字，正式版應提供求助資源與人工支持資訊。"
  ],
  "automation": [
    "週回顧摘要",
    "高壓力日提醒",
    "照護任務推薦",
    "資料匯出"
  ],
  "governance": [
    "本機優先",
    "可刪除全部資料",
    "不做醫療診斷",
    "敏感文字安全提示"
  ],
  "events": [
    "完成今日情緒紀錄",
    "壓力標籤「課業」連續 3 天出現",
    "週回顧摘要已更新"
  ]
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = {
  activeTab: 0,
  events: [...project.events],
  records: project.records.map((record) => ({ ...record })),
  metricBoost: 0,
  advisorText: ""
};

function pill(text, type = "ai") {
  return `<span class="pill ${type}">${text}</span>`;
}

function statusType(status) {
  if (/完成|穩定|正常|活躍|已確認|可輸出|已排程/.test(status)) return "good";
  if (/待|需|修訂|接近|處理中|進行中|分析中|審核中/.test(status)) return "warn";
  return "ai";
}

function toast(message) {
  const box = qs("#toast");
  box.textContent = message;
  box.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => box.classList.remove("show"), 2400);
}

function addEvent(message) {
  state.events.unshift(message);
  state.events = state.events.slice(0, 8);
}

function renderChrome() {
  qs("#nav").innerHTML = project.tabs.map((tab, index) => `
    <button class="${index === state.activeTab ? "active" : ""}" data-tab="${index}">${tab}</button>
  `).join("");
  qsa("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = Number(button.dataset.tab);
      render();
    });
  });
  qs("#viewTitle").textContent = project.tabs[state.activeTab];
  qs("#statusLine").innerHTML = [
    pill("系統正常", "good"),
    pill("免登入全權限", "ai"),
    pill(`事件 ${state.events.length}`, "warn")
  ].join("");
}

function metricGrid() {
  return `<div class="metric-grid">${project.metrics.map((metric, index) => {
    const value = index === 0 && state.metricBoost ? String(Number.parseInt(metric.value, 10) + state.metricBoost || metric.value) : metric.value;
    return `<article class="metric"><span>${metric.label}</span><strong>${value}</strong><p class="muted">${metric.note}</p></article>`;
  }).join("")}</div>`;
}

function visualPanel() {
  return `<section class="panel"><div class="panel-head"><h2>系統視覺模型</h2><span>${project.source}</span></div><canvas id="visualCanvas" class="visual" width="980" height="420"></canvas></section>`;
}

function cards(items) {
  return `<div class="cards">${items.map((item) => `
    <article class="card">
      <div class="record-head"><strong>${item.title}</strong>${pill(item.tag || "模組", "ai")}</div>
      <small>${item.text}</small>
    </article>
  `).join("")}</div>`;
}

function eventList() {
  return `<div class="events">${state.events.map((event, index) => `
    <article class="record"><div class="record-head"><strong>${index + 1}. ${event}</strong>${pill(index === 0 ? "最新" : "紀錄", index === 0 ? "warn" : "ai")}</div><small>模擬營運紀錄，供公開展示使用。</small></article>
  `).join("")}</div>`;
}

function overview() {
  return `
    <section class="view">
      ${metricGrid()}
      <div class="grid two">
        ${visualPanel()}
        <section class="panel"><div class="panel-head"><h2>專業化模組</h2><span>從學生構想到正式產品流程</span></div>${cards(project.panels)}</section>
      </div>
      <div class="grid two">
        <section class="panel"><div class="panel-head"><h2>核心洞察</h2><span>設計判斷</span></div>${insightList(project.insights)}</section>
        <section class="panel"><div class="panel-head"><h2>近期事件</h2><span>操作留痕</span></div>${eventList()}</section>
      </div>
    </section>
  `;
}

function workflow() {
  return `
    <section class="view">
      <div class="grid two">
        <section class="panel">
          <div class="panel-head"><h2>主要流程</h2><span>可執行工作流</span></div>
          <div class="timeline">${project.workflow.map((step, index) => `<div class="step"><span>${index + 1}</span><div><strong>${step}</strong><p class="muted">已整理成公開展示版的互動流程。</p></div></div>`).join("")}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>${project.form.title}</h2><span>模擬建立流程</span></div>
          <form id="mainForm">${project.form.fields.map(fieldTemplate).join("")}<button type="submit">${project.form.button}</button></form>
        </section>
      </div>
      <section class="panel"><div class="panel-head"><h2>流程狀態</h2><span>建立後會寫入事件紀錄</span></div>${eventList()}</section>
    </section>
  `;
}

function fieldTemplate(field) {
  if (field.type === "select") {
    return `<label>${field.label}<select name="${field.name}">${field.options.map((option) => `<option ${option === field.value ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
  }
  return `<label>${field.label}<input name="${field.name}" value="${field.value}"></label>`;
}

function records() {
  return `
    <section class="view">
      <div class="grid two">
        <section class="panel"><div class="panel-head"><h2>${project.recordsTitle}</h2><span>業務資料</span></div><div class="records">${state.records.map(recordTemplate).join("")}</div></section>
        <section class="panel"><div class="panel-head"><h2>分析摘要</h2><span>資料驅動決策</span></div>${insightList(project.insights)}<div class="actions"><button data-action="analyze">重新分析</button><button data-action="approve">核准第一筆待辦</button></div></section>
      </div>
      ${visualPanel()}
    </section>
  `;
}

function recordTemplate(record, index) {
  return `
    <article class="record">
      <div class="record-head"><div><strong>${record.title}</strong><small>${record.meta}</small></div>${pill(record.status, statusType(record.status))}</div>
      <div class="bar" style="--bar:var(--accent2);--value:${Math.max(28, 92 - index * 21)}%"><span></span></div>
    </article>
  `;
}

function automation() {
  return `
    <section class="view">
      <div class="grid two">
        <section class="panel"><div class="panel-head"><h2>AI / 自動化能力</h2><span>展示版模擬運算</span></div><div class="grid two">${project.automation.map((item, index) => `<article class="card"><strong>${item}</strong><small>狀態：${index % 2 ? "待人工確認" : "已產生建議"}</small></article>`).join("")}</div></section>
        <section class="panel">
          <div class="panel-head"><h2>智慧建議</h2><span>依目前資料產生</span></div>
          <textarea id="advisorInput" rows="5">請根據目前系統狀態提出下一步優化建議。</textarea>
          <div class="actions"><button data-advisor="risk">風險</button><button data-advisor="next">下一步</button><button data-advisor="report">報告摘要</button></div>
          <div id="advisorResult" class="card"><strong>建議摘要</strong><small>${state.advisorText || project.insights[0]}</small></div>
        </section>
      </div>
      <section class="panel"><div class="panel-head"><h2>治理原則</h2><span>公開展示版保護界線</span></div><div class="grid three">${project.governance.map((item) => `<article class="card"><strong>${item}</strong><small>正式系統需保留設定、稽核與人工確認流程。</small></article>`).join("")}</div></section>
    </section>
  `;
}

function governance() {
  return `
    <section class="view">
      <div class="grid two">
        <section class="panel"><div class="panel-head"><h2>治理與稽核</h2><span>可公開展示，不含真實個資</span></div><div class="grid two">${project.governance.map((item) => `<article class="card"><strong>${item}</strong><small>此項已納入公開展示版設計界線。</small></article>`).join("")}</div></section>
        <section class="panel"><div class="panel-head"><h2>事件紀錄</h2><button class="download" id="downloadBtn">下載摘要</button></div>${eventList()}</section>
      </div>
      <section class="panel"><div class="panel-head"><h2>部署準備</h2><span>GitHub Pages</span></div><div class="grid three"><article class="card"><strong>純靜態</strong><small>無後端、資料庫、API key 或真實服務連線。</small></article><article class="card"><strong>免登入</strong><small>管理端、使用端與展示端能力合併開放。</small></article><article class="card"><strong>可部署</strong><small>推送到 main branch 後可設定 Pages / root。</small></article></div></section>
    </section>
  `;
}

function insightList(items) {
  return `<div class="insights">${items.map((item) => `<article class="record"><strong>${item}</strong><small>依學生文件延伸出的產品化判斷。</small></article>`).join("")}</div>`;
}

function render() {
  renderChrome();
  const views = [overview, workflow, records, automation, governance];
  qs("#app").innerHTML = views[state.activeTab]();
  bindCurrentView();
  drawVisual();
}

function bindCurrentView() {
  const form = qs("#mainForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const first = project.form.fields[0];
      const value = new FormData(form).get(first.name);
      state.metricBoost += 1;
      addEvent(`${project.form.button}：${value}`);
      toast("工作已建立並寫入事件紀錄。");
      render();
    });
  }
  qsa("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "approve") {
        const target = state.records.find((record) => /待|需|修訂|處理|審核/.test(record.status));
        if (target) target.status = "已確認";
        addEvent("人工審核已更新第一筆待辦資料");
      } else {
        addEvent("資料已重新分析並更新洞察摘要");
      }
      toast("狀態已更新。");
      render();
    });
  });
  qsa("[data-advisor]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.advisor;
      const options = {
        risk: project.insights[1] || project.insights[0],
        next: `建議優先完成「${project.workflow[1]}」與「${project.workflow[2]}」，並保留人工確認節點。`,
        report: `${project.shortName} 目前已具備 ${project.panels.map((p) => p.title).join("、")} 等核心能力。`
      };
      state.advisorText = options[mode];
      addEvent(`AI 顧問產生「${button.textContent}」建議`);
      toast("AI 顧問已產生建議。");
      render();
    });
  });
  const download = qs("#downloadBtn");
  if (download) {
    download.addEventListener("click", () => {
      const content = [project.title, "", "近期事件:", ...state.events.map((event) => "- " + event)].join("\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = project.slug + "-summary.txt";
      a.click();
      URL.revokeObjectURL(url);
      toast("摘要檔已產生。");
    });
  }
}

function drawVisual() {
  const canvas = qs("#visualCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const css = getComputedStyle(document.body);
  const accent = css.getPropertyValue("--accent").trim();
  const accent2 = css.getPropertyValue("--accent2").trim();
  const accent3 = css.getPropertyValue("--accent3").trim();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  if (project.visual.mode === "game") {
    drawGame(ctx, width, height, accent, accent2, accent3);
    return;
  }
  ctx.strokeStyle = "rgba(20, 35, 55, 0.12)";
  for (let x = 0; x < width; x += 42) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 42) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  const points = project.visual.nodes.map(([title, sub, x, y]) => ({ title, sub, x: width * x / 100, y: height * y / 100 }));
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
  for (const [from, to] of project.visual.links) {
    ctx.beginPath();
    ctx.moveTo(points[from].x, points[from].y);
    ctx.lineTo(points[to].x, points[to].y);
    ctx.stroke();
  }
  points.forEach((point, index) => {
    ctx.fillStyle = index % 3 === 0 ? accent : index % 3 === 1 ? accent2 : accent3;
    roundRect(ctx, point.x - 88, point.y - 31, 176, 62, 10);
    ctx.fill();
    ctx.fillStyle = index % 3 === 2 ? "#101820" : "#fff";
    ctx.font = "700 20px Microsoft JhengHei, Arial";
    ctx.fillText(point.title, point.x - 68, point.y - 4);
    ctx.font = "14px Microsoft JhengHei, Arial";
    ctx.fillText(point.sub, point.x - 68, point.y + 20);
  });
}

function drawGame(ctx, width, height, accent, accent2, accent3) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#111827");
  gradient.addColorStop(1, "#2b1111");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 9; i += 1) ctx.fillRect(70 + i * 95, 95 + (i % 3) * 28, 48, 210);
  ctx.fillStyle = accent3;
  ctx.fillRect(120, 330, 740, 10);
  ctx.fillStyle = accent2;
  ctx.fillRect(210, 240, 58, 88);
  ctx.fillStyle = accent;
  ctx.fillRect(675, 218, 74, 110);
  ctx.fillStyle = "#fff";
  ctx.font = "700 24px Microsoft JhengHei, Arial";
  ctx.fillText("玩家：格擋準備", 170, 70);
  ctx.fillText("敵人 AI：追擊", 610, 70);
  meter(ctx, 170, 90, 260, "HP", 82, accent);
  meter(ctx, 610, 90, 260, "Stamina", 64, accent3);
}

function meter(ctx, x, y, w, label, value, color) {
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillRect(x, y, w, 12);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * value / 100, 12);
  ctx.fillStyle = "#fff";
  ctx.font = "14px Microsoft JhengHei, Arial";
  ctx.fillText(`${label} ${value}%`, x, y + 34);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

render();
