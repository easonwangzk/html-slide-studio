import "./modern-studio.css";

const copyBtn = document.querySelector("#copyBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const htmlUpload = document.querySelector("#htmlUpload");
const openFullscreenBtn = document.querySelector("#openFullscreenBtn");
const openWindowBtn = document.querySelector("#openWindowBtn");
const openPresenterBtn = document.querySelector("#openPresenterBtn");
const fillNotesBtn = document.querySelector("#fillNotesBtn");
const openTeleprompterBtn = document.querySelector("#openTeleprompterBtn");
const teleprompterInput = document.querySelector("#teleprompterInput");
const previewFrame = document.querySelector("#previewFrame");
const htmlOutput = document.querySelector("#htmlOutput");
const statusInfo = document.querySelector("#statusInfo");

let previewBlobUrl = "";
const draftStorageKey = "html-slide-studio-draft-v1";
let teleprompterWindow = null;

const getRevealApi = () => {
  const win = previewFrame?.contentWindow;
  const reveal = win?.Reveal;
  if (reveal && typeof reveal.next === "function") {
    return reveal;
  }
  return null;
};

const setPreviewHtml = (html) => {
  if (previewBlobUrl) {
    URL.revokeObjectURL(previewBlobUrl);
  }
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  previewBlobUrl = URL.createObjectURL(blob);
  previewFrame.src = previewBlobUrl;
};

const setStatus = (message, isError = false) => {
  if (!statusInfo) {
    return;
  }
  statusInfo.textContent = message;
  statusInfo.style.color = isError ? "#d32f2f" : "#2e7d32";
};

const openPreviewInWindow = () => {
  const html = htmlOutput.value || defaultDemo;
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) {
    setStatus("浏览器阻止了新窗口，请允许弹窗", true);
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
};

const openGenericPresenterView = () => {
  const presenter = window.open("", "generic-presenter-window", "width=1280,height=780");
  if (!presenter) {
    setStatus("演讲者视图被浏览器拦截，请允许弹窗", true);
    return;
  }

  const teleprompterText = (teleprompterInput?.value || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  presenter.document.open();
  presenter.document.write(`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Presenter View</title>
  <style>
    body { margin: 0; background: #0f172a; color: #f8fafc; font-family: "Segoe UI", sans-serif; }
    .shell { display: grid; grid-template-columns: 1.45fr 1fr; min-height: 100vh; }
    iframe { width: 100%; height: 100vh; border: 0; background: #fff; }
    .panel { padding: 18px; border-left: 1px solid #334155; overflow: auto; }
    h1 { margin-top: 0; font-size: 20px; }
    .note { line-height: 1.7; font-size: 30px; white-space: normal; }
  </style>
</head>
<body>
  <div class="shell">
    <iframe src="${previewBlobUrl || "about:blank"}"></iframe>
    <section class="panel">
      <h1>演讲者题词</h1>
      <div class="note">${teleprompterText || "请在主界面填写题词内容"}</div>
    </section>
  </div>
</body>
</html>`);
  presenter.document.close();
  setStatus("通用演讲者视图已打开");
};

const sendPreviewKey = (key) => {
  try {
    const frameWindow = previewFrame.contentWindow;
    if (!frameWindow) {
      return;
    }

    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true
    });

    frameWindow.dispatchEvent(event);
    frameWindow.focus();
  } catch {
    setStatus("当前预览不支持该演示按钮", true);
  }
};

const extractCurrentRevealNotes = () => {
  const reveal = getRevealApi();
  if (!reveal || typeof reveal.getCurrentSlide !== "function") {
    return "";
  }

  const slide = reveal.getCurrentSlide();
  if (!slide) {
    return "";
  }

  const notesNode = slide.querySelector("aside.notes");
  return notesNode?.textContent?.trim() || "";
};

const buildTeleprompterPage = (content) => {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Teleprompter</title>
  <style>
    body { margin: 0; background: #111; color: #f9fafb; font-family: "Segoe UI", sans-serif; }
    .toolbar { position: sticky; top: 0; display: flex; gap: 8px; align-items: center; padding: 10px; background: rgba(0,0,0,0.75); border-bottom: 1px solid #333; }
    .toolbar button { border: 1px solid #555; background: #1f2937; color: #fff; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
    .toolbar span { opacity: 0.85; font-size: 14px; }
    .content { padding: 24px; line-height: 1.7; font-size: 32px; white-space: normal; min-height: 120vh; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="toggleBtn">暂停</button>
    <button id="fasterBtn">加速</button>
    <button id="slowerBtn">减速</button>
    <span id="speedInfo">速度: 24</span>
  </div>
  <div id="content" class="content">${escaped || "请在主界面输入题词内容"}</div>
  <script>
    let speed = 24;
    let running = true;
    const speedInfo = document.getElementById("speedInfo");
    const toggleBtn = document.getElementById("toggleBtn");
    function tick() {
      if (running) window.scrollBy(0, speed / 18);
      requestAnimationFrame(tick);
    }
    tick();
    toggleBtn.addEventListener("click", () => {
      running = !running;
      toggleBtn.textContent = running ? "暂停" : "继续";
    });
    document.getElementById("fasterBtn").addEventListener("click", () => {
      speed = Math.min(speed + 4, 80);
      speedInfo.textContent = "速度: " + speed;
    });
    document.getElementById("slowerBtn").addEventListener("click", () => {
      speed = Math.max(speed - 4, 4);
      speedInfo.textContent = "速度: " + speed;
    });
    window.addEventListener("message", (event) => {
      if (!event.data || event.data.type !== "update-text") return;
      document.getElementById("content").innerHTML = event.data.text;
      window.scrollTo({ top: 0 });
    });
  </script>
</body>
</html>`;
};

const openTeleprompter = () => {
  const content = (teleprompterInput?.value || "").trim();

  if (!teleprompterWindow || teleprompterWindow.closed) {
    teleprompterWindow = window.open("", "teleprompter-window", "width=980,height=720");
    if (!teleprompterWindow) {
      setStatus("题词器窗口被浏览器拦截，请允许弹窗", true);
      return;
    }
    teleprompterWindow.document.open();
    teleprompterWindow.document.write(buildTeleprompterPage(content));
    teleprompterWindow.document.close();
    setStatus("题词器已打开");
    return;
  }

  const safeText = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  teleprompterWindow.postMessage({ type: "update-text", text: safeText }, "*");
  teleprompterWindow.focus();
  setStatus("题词器内容已更新");
};

const defaultDemo = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slide Studio</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 600px;
    }
    h1 { margin: 0 0 16px; color: #333; font-size: 2rem; }
    p { margin: 0; color: #666; font-size: 1.05rem; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Slide Studio</h1>
    <p>上传一个 HTML 文件开始预览和演示</p>
  </div>
</body>
</html>`;

setPreviewHtml(defaultDemo);
htmlOutput.value = defaultDemo;
if (teleprompterInput) {
  teleprompterInput.value = "欢迎使用题词器。\n\n编辑这里的内容，然后点击「题词器」按钮开始演讲。";
}
setStatus("就绪");

openPresenterBtn?.addEventListener("click", () => {
  const reveal = getRevealApi();
  if (!reveal) {
    openGenericPresenterView();
    return;
  }

  const notesPlugin = reveal.getPlugin?.("notes");
  if (notesPlugin?.open) {
    notesPlugin.open();
    setStatus("演讲者视图已打开");
    return;
  }

  sendPreviewKey("s");
  setStatus("已尝试打开演讲者视图");
});

fillNotesBtn?.addEventListener("click", () => {
  const notes = extractCurrentRevealNotes();
  if (!notes) {
    setStatus("当前页未检测到备注，可手动填写题词内容");
    return;
  }
  teleprompterInput.value = notes;
  setStatus("已提取当前页备注到题词区");
});

openTeleprompterBtn?.addEventListener("click", openTeleprompter);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(htmlOutput.value || "");
    setStatus("HTML 已复制到剪贴板");
  } catch {
    setStatus("复制失败，请手动复制", true);
  }
});

downloadBtn.addEventListener("click", () => {
  const html = htmlOutput.value;
  if (!html.trim()) {
    setStatus("没有可下载的 HTML 内容", true);
    return;
  }

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `generated-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus("HTML 文件已下载");
});

htmlUpload.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const html = await file.text();
  htmlOutput.value = html;
  setPreviewHtml(html);
  setStatus(`已加载 ${file.name} 并进入预览`);
});

openFullscreenBtn.addEventListener("click", () => {
  const element = previewFrame;
  if (!element) {
    return;
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => undefined);
    return;
  }

  element.requestFullscreen().catch(() => {
    setStatus("无法进入全屏，请检查浏览器权限", true);
  });
});

openWindowBtn?.addEventListener("click", openPreviewInWindow);
