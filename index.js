/***** YTPRO ULTIMATE ALL-IN-ONE SCRIPT *****
 * Modern Glassmorphic UI | SABR Fast Downloader | Resilient MediaSession & Background Controls
 * Fully Unified & Bug-Fixed Version
 ********************************************/

(function() {
  'use strict';

  // --- 0. ERUDA DEV TOOLS INJECTION ---
  if (typeof window.eruda === 'undefined' && localStorage.getItem('devMode') === 'true') {
    const s = document.createElement('script');
    s.src = '//youtube.com/ytpro_cdn/npm/eruda';
    s.onload = () => window.eruda.init();
    document.body.appendChild(s);
  }

  // --- 1. GLOBAL CONSTANTS & CONFIGURATION ---
  const YTProVer = "3.9.85";
  let ytoldV = "";
  window.PIPause = false;
  window.isPIP = false;
  window.pauseAllowed = true;
  window.handlers = window.handlers || {};
  window.serviceRunning = false;

  let sTime = [];
  let GeminiAT = "";
  const GeminiModels = {
    "3.0 Pro": '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4],null,null,1]',
    "3.0 Flash": '[1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1]',
    "3.0 Flash Thinking": '[1,null,null,null,"5bf011840784117a",null,null,0,[4],null,null,1]'
  };

  const YTPROCodecs = {
    video: ["AV1", "VP8", "VP9", "H264"],
    audio: ["Opus", "Mp4a"]
  };

  let touchStartY = 0, touchEndY = 0, initialPinchDist = null;
  const sens = 0.005;
  let vol = (typeof Android !== 'undefined' && Android.getVolume) ? Android.getVolume() : 0.5;
  let brt = (typeof Android !== 'undefined' && Android.getBrightness) ? Android.getBrightness() / 100 : 0.5;

  // Defaults Init
  if (!localStorage.getItem("saveCInfo")) {
    localStorage.setItem("autoSpn", "true");
    localStorage.setItem("bgplay", "true");
    localStorage.setItem("gesC", "true");
    localStorage.setItem("gesM", "false");
    localStorage.setItem("fzoom", "false");
    localStorage.setItem("saveCInfo", "true");
    localStorage.setItem("geminiModel", "3.0 Flash");
    localStorage.setItem("prompt", "Give me details about this YouTube video Id: {videoId} , a detailed summary with key facts and timestamps");
    localStorage.setItem("devMode", "false");
    localStorage.setItem("block_60fps", "false");
    YTPROCodecs.video.forEach(v => localStorage.setItem(v, "true"));
    YTPROCodecs.audio.forEach(a => localStorage.setItem(a, "true"));
  }

  const isD = true; // Modern Default Dark Glass Theme
  const c = "#ffffff";
  const dc = "#121212";
  const d = "rgba(255, 255, 255, 0.08)";
  let dislikes = "...";

  // --- 2. RESILIENT MEDIASESSION & BACKGROUND CONTROLS (FIX NOTIFICATIONS) ---
  if (typeof MediaMetadata === 'undefined') {
    window.MediaMetadata = class {
      constructor(data = {}) {
        this.title = data.title || '';
        this.artist = data.artist || '';
        this.album = data.album || '';
        this.artwork = data.artwork || [];
      }
    };
  }

  let _mediaState = 'none';
  let _mediaMetadata = null;

  if (!('mediaSession' in navigator)) {
    Object.defineProperty(navigator, 'mediaSession', {
      value: {},
      configurable: true
    });
  }

  Object.defineProperty(navigator.mediaSession, 'metadata', {
    get: () => _mediaMetadata,
    set: (val) => {
      bgPlay(val);
      _mediaMetadata = val;
    },
    configurable: true
  });

  navigator.mediaSession.setActionHandler = (action, handler) => {
    if (typeof handler === 'function') window.handlers[action] = handler;
  };

  Object.defineProperty(navigator.mediaSession, 'playbackState', {
    get: () => _mediaState,
    set: (value) => {
      _mediaState = value;
      const vid = document.querySelector('video.video-stream') || document.querySelector('video');
      if (!vid) return;
      if (value === 'playing') {
        setTimeout(() => { window.Android?.bgPlay?.(vid.currentTime * 1000); }, 100);
      } else if (value === 'paused' && (window.pauseAllowed || window.PIPause)) {
        setTimeout(() => { window.Android?.bgPause?.(vid.currentTime * 1000); }, 100);
      } else if (value === 'none') {
        window.Android?.bgStop?.();
        window.serviceRunning = false;
      }
    },
    configurable: true
  });

  async function bgPlay(info) {
    if (!info) return;
    const vid = document.querySelector('video.video-stream') || document.querySelector('video');
    if (!vid) return;

    let iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    const imgUrl = info?.artwork?.[0]?.src;

    if (imgUrl) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgUrl;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 160, 90);
        iconBase64 = canvas.toDataURL('image/png', 0.9).replace("data:image/png;base64,", "");
      } catch (e) {}
    }

    const durationMs = (vid.duration || 0) * 1000;
    if (window.serviceRunning) {
      setTimeout(() => window.Android?.bgUpdate?.(iconBase64, info.title, info.artist, durationMs), 50);
      setTimeout(() => window.Android?.bgPlay?.(vid.currentTime * 1000), 100);
    } else {
      window.serviceRunning = true;
      setTimeout(() => window.Android?.bgStart?.(iconBase64, info.title, info.artist, durationMs), 50);
      setTimeout(() => window.Android?.bgPlay?.(vid.currentTime * 1000), 100);
    }
  }

  // Robust Native Notification Action Handlers
  window.seekTo = function(t) {
    const vid = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.seekto === 'function') {
      window.handlers.seekto({ seekTime: t / 1000 });
    } else if (vid) {
      vid.currentTime = t / 1000;
    }
  };

  window.playVideo = function() {
    window.PIPause = false;
    navigator.mediaSession.playbackState = 'playing';
    const vid = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.play === 'function') {
      window.handlers.play();
    } else if (vid) {
      vid.play().catch(() => {});
    }
  };

  window.pauseVideo = function() {
    window.PIPause = true;
    navigator.mediaSession.playbackState = 'paused';
    const vid = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.pause === 'function') {
      window.handlers.pause();
    } else if (vid) {
      vid.pause();
    }
  };

  window.playNext = function() {
    if (typeof window.handlers?.nexttrack === 'function') {
      window.handlers.nexttrack();
    } else {
      const nextBtn = document.querySelector('.ytp-next-button') || 
                      document.querySelector('button[aria-label="Next video"]') || 
                      document.querySelector('button[aria-label="Next"]') ||
                      document.querySelector('.next-button');
      if (nextBtn) nextBtn.click();
    }
  };

  window.playPrev = function() {
    if (typeof window.handlers?.previoustrack === 'function') {
      window.handlers.previoustrack();
    } else {
      const prevBtn = document.querySelector('.ytp-prev-button') || 
                      document.querySelector('button[aria-label="Previous video"]') || 
                      document.querySelector('button[aria-label="Previous"]');
      if (prevBtn) {
        prevBtn.click();
      } else {
        const vid = document.querySelector('video.video-stream') || document.querySelector('video');
        if (vid) vid.currentTime = 0;
      }
    }
  };

  // --- 3. MODERN ICONS (SVG STRINGS) ---
  const downBtn = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const icons = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    pip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="10" width="8" height="6" rx="1"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`
  };

  // --- 4. AD-BLOCKING & NETWORK OVERRIDES ---
  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    try {
      const url = typeof input === "string" ? input : input.url;
      if (url.includes("googleads.g.doubleclick.net") || 
          url.includes("youtube.com/youtubei/v1/player/ad_break") || 
          url.includes("youtube.com/pagead/adview") || 
          url.includes("youtube.com/api/stats/ads")) {
        return new Response("", { status: 200 });
      }
      if (url.includes("youtube.com/youtubei/")) {
        const res = await origFetch.apply(this, arguments);
        try {
          const cloned = res.clone();
          let json = await cloned.json();
          delete json?.adSlots;
          delete json?.playerAds;
          delete json?.adPlacements;
          delete json?.adBreakHeartbeatParams;
          if (json?.[0]?.playerResponse) {
            delete json[0].playerResponse.adSlots;
            delete json[0].playerResponse.playerAds;
            delete json[0].playerResponse.adPlacements;
          }
          const bodyStr = JSON.stringify(json);
          const headers = new Headers(res.headers);
          headers.set("content-length", String(bodyStr.length));
          headers.set("content-type", "application/json");
          return new Response(bodyStr, { status: res.status, statusText: res.statusText, headers });
        } catch (e) {
          return res;
        }
      }
    } catch (err) {}
    return origFetch.apply(this, arguments);
  };

  function adsBlock() {
    try { document.querySelector(".video-stream")?.removeAttribute("disablepictureinpicture"); } catch (e) {}
    document.querySelectorAll("ad-slot-renderer, ytm-promoted-sparkles-web-renderer, ytm-companion-ad-renderer, ytm-paid-content-overlay-renderer").forEach(el => el.remove());
    try {
      const adVideo = document.querySelector(".ad-interrupting video");
      if (adVideo) {
        adVideo.currentTime = adVideo.duration || 999;
        document.querySelector(".ytp-ad-skip-button-modern")?.click();
      }
    } catch (e) {}
    if (localStorage.getItem("shorts") === "true") {
      document.querySelectorAll(".big-shorts-singleton, ytm-reel-shelf-renderer, ytm-shorts-lockup-view-model").forEach(e => e.remove());
    }
  }

  // --- 5. DISLIKES & SPONSORBLOCK ---
  function getDislikesInLocale(num) {
    if (num < 1000) return num.toString();
    const b = Math.floor(Math.log10(num) - 2);
    const a = b + (b % 3 ? 1 : 0);
    const val = Math.floor(num / 10 ** a) * 10 ** a;
    return Intl.NumberFormat(navigator.language || 'en', { notation: "compact", compactDisplay: "short" }).format(val);
  }

  async function fetchDislikes(urlStr) {
    try {
      const u = new URL(urlStr);
      let vidId = u.pathname.includes("shorts") ? u.pathname.split("/").pop() : u.searchParams.get("v");
      if (!vidId) return;
      const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${vidId}`);
      const data = await res.json();
      if (data?.dislikes) dislikes = getDislikesInLocale(parseInt(data.dislikes));
    } catch (e) {}
  }

  async function checkSponsors(urlStr) {
    if (!urlStr.includes("watch")) return;
    try {
      sTime = [];
      const vidId = new URL(urlStr).searchParams.get("v");
      const res = await fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${vidId}`);
      const data = await res.json();
      if (Array.isArray(data)) sTime = data.map(s => s.segment);
      
      const v = document.querySelector(".video-stream");
      if (v) {
        v.ontimeupdate = () => {
          const cur = v.currentTime;
          for (let seg of sTime) {
            if (Math.floor(cur) === Math.floor(seg[0]) && localStorage.getItem("autoSpn") === "true") {
              v.currentTime = seg[1];
              showSkipNotification(seg[0]);
            }
          }
        };
      }
    } catch (e) {}
  }

  function showSkipNotification(rewindTo) {
    const box = document.createElement("div");
    box.className = "ytpro-glass-toast";
    box.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:10px;">
        <span style="font-size:13px;font-weight:600;">⚡ Skipped Sponsor</span>
        <button style="background:rgba(255,255,255,0.15);border:none;color:#fff;border-radius:12px;padding:4px 10px;font-size:12px;" id="rewindBtn">Rewind</button>
      </div>
    `;
    document.body.appendChild(box);
    box.querySelector("#rewindBtn")?.addEventListener("click", () => {
      const v = document.querySelector(".video-stream");
      if (v) v.currentTime = rewindTo + 1;
      box.remove();
    });
    setTimeout(() => box.remove(), 4000);
  }

  // --- 6. MODERN GEN-Z UI INJECTION (SETTINGS & CONTROLS) ---
  const modernStyle = document.createElement("style");
  modernStyle.innerHTML = `
    .ytpro-glass-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      animation: ytproFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ytpro-sheet {
      width: 94%;
      max-width: 500px;
      max-height: 80vh;
      background: #141414e6;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px 28px 18px 18px;
      margin-bottom: 20px;
      padding: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
      overflow-y: auto;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .ytpro-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 15px;
    }
    .ytpro-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .ytpro-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 12px 16px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .ytpro-item:active {
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.08);
    }
    .ytpro-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ytpro-switch {
      position: relative;
      width: 44px;
      height: 24px;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      transition: background 0.3s;
      cursor: pointer;
    }
    .ytpro-switch.active {
      background: #3ea6ff;
    }
    .ytpro-switch-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .ytpro-switch.active .ytpro-switch-handle {
      transform: translateX(20px);
    }
    .ytpro-glass-toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(20, 20, 20, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 10px 18px;
      border-radius: 30px;
      color: #fff;
      z-index: 9999999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      animation: ytproToastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes ytproFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ytproToastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
  `;
  document.head.appendChild(modernStyle);

  // Settings Modal Function
  function openSettings() {
    const outer = document.createElement("div");
    outer.className = "ytpro-glass-modal";
    outer.id = "settingsprodiv";

    const createToggle = (key, label, iconSvg) => `
      <div class="ytpro-item" data-action="toggle" data-key="${key}">
        <div class="ytpro-item-left">
          ${iconSvg}
          <span>${label}</span>
        </div>
        <div class="ytpro-switch ${localStorage.getItem(key) === "true" ? "active" : ""}">
          <div class="ytpro-switch-handle"></div>
        </div>
      </div>
    `;

    outer.innerHTML = `
      <div class="ytpro-sheet">
        <div class="ytpro-header">
          <h2>YTPRO Settings <span style="font-size:11px;font-weight:400;opacity:0.6;">v${YTProVer}</span></h2>
          <button style="background:transparent;border:none;color:#fff;font-size:18px;" id="ytproClose">✕</button>
        </div>

        <div class="ytpro-item" data-action="openDownloadHub">
          <div class="ytpro-item-left">
            ${icons.download}
            <span style="font-weight:600;color:#3ea6ff;">Open Fast Download Hub</span>
          </div>
          <span>➔</span>
        </div>

        <div class="ytpro-item" data-action="openHearts">
          <div class="ytpro-item-left">
            ${icons.heart}
            <span>Liked Videos Library</span>
          </div>
          <span>➔</span>
        </div>

        ${createToggle("autoSpn", "Auto-Skip Sponsors", icons.zap)}
        ${createToggle("bgplay", "Background Playback", icons.pip)}
        ${createToggle("gesC", "Volume/Brightness Gestures", icons.sliders)}
        ${createToggle("gesM", "Swipe Down to Miniplayer", icons.sliders)}
        ${createToggle("shorts", "Hide YouTube Shorts", icons.shield)}
        ${createToggle("devMode", "Developer Console (Eruda)", icons.sparkles)}

        <div class="ytpro-item" data-action="geminiPrompt">
          <div class="ytpro-item-left">
            ${icons.sparkles}
            <span>Customize Gemini Prompt</span>
          </div>
          <span>➔</span>
        </div>
        
        <p style="font-size:11px;opacity:0.4;text-align:center;margin-top:15px;">YTPRO Mod • Ultra Smooth Experience</p>
      </div>
    `;

    outer.addEventListener("click", (e) => {
      if (e.target === outer || e.target.id === "ytproClose") outer.remove();
      
      const item = e.target.closest("[data-action]");
      if (!item) return;

      const act = item.dataset.action;
      if (act === "toggle") {
        const key = item.dataset.key;
        const newVal = localStorage.getItem(key) === "true" ? "false" : "true";
        localStorage.setItem(key, newVal);
        const sw = item.querySelector(".ytpro-switch");
        sw.classList.toggle("active", newVal === "true");
        if (key === "bgplay") window.Android?.setBgPlay?.(newVal === "true");
      } else if (act === "openDownloadHub") {
        outer.remove();
        window.location.hash = "#download";
      } else if (act === "openHearts") {
        outer.remove();
        window.location.hash = "#hearts";
      } else if (act === "geminiPrompt") {
        const p = prompt("Enter Gemini Video Summarizer Prompt:", localStorage.getItem("prompt"));
        if (p !== null) localStorage.setItem("prompt", p);
      }
    });

    document.body.appendChild(outer);
  }

  // --- 7. SABR ADVANCED DOWNLOAD ENGINE ---
  window.ytproSabrDownload = async function() {
    let videoId = window.location.pathname.includes("shorts") ? 
                  window.location.pathname.split("/").pop() : 
                  new URLSearchParams(window.location.search).get("v");

    if (!videoId) {
      window.Android?.showToast?.("No active video found.");
      return;
    }

    const modal = document.createElement("div");
    modal.className = "ytpro-glass-modal";
    modal.id = "ytproDownloadModal";
    modal.innerHTML = `
      <div class="ytpro-sheet" style="text-align:center;">
        <div class="ytpro-header">
          <h2>Downloads & Media Hub</h2>
          <button style="background:transparent;border:none;color:#fff;font-size:18px;" onclick="document.getElementById('ytproDownloadModal').remove()">✕</button>
        </div>
        <div id="dlLoading" style="padding:20px 0;font-size:14px;color:#aaa;">
          ⚡ Fetching formats via SABR Stream...
        </div>
        <div id="dlContent" style="display:none;text-align:left;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    try {
      const { Innertube, Platform } = await import('https://cdn.jsdelivr.net/npm/youtubei.js@17.0.1/bundle/browser.min.js');
      const { SabrStream } = await import('https://esm.sh/googlevideo@4.0.4/sabr-stream');
      const { buildSabrFormat, EnabledTrackTypes } = await import('https://esm.sh/googlevideo@4.0.4/utils');

      Platform.shim.eval = async (data, env) => {
        const props = [];
        if (env.n) props.push(`n: exportedVars.nFunction("${env.n}")`);
        if (env.sig) props.push(`sig: exportedVars.sigFunction("${env.sig}")`);
        return new Function(`${data.output}\nreturn { ${props.join(', ')} }`)();
      };

      const cookies = window.Android?.getAllCookies?.('https://www.youtube.com') ?? '';
      const yt = await Innertube.create({ cookie: cookies, retrieve_player: true, generate_session_locally: true });
      const info = await yt.getBasicInfo(videoId, { client: 'WEB' });
      const streamingData = info.streaming_data;

      if (!streamingData) throw new Error("Could not parse streaming data");

      const formats = streamingData.adaptive_formats || [];
      const dlLoading = modal.querySelector("#dlLoading");
      const dlContent = modal.querySelector("#dlContent");
      dlLoading.style.display = "none";
      dlContent.style.display = "block";

      const safeTitle = (info.basic_info?.title || "Video").replace(/[\/\\?%*:|"<>]/g, '-');
      const videoFormats = formats.filter(f => f.has_video && !f.has_audio);
      const audioFormats = formats.filter(f => f.has_audio && !f.has_video);

      let html = `<div style="font-size:13px;font-weight:600;margin-bottom:12px;opacity:0.8;">📹 Video (High Quality Muxed):</div>`;
      videoFormats.slice(0, 5).forEach(vf => {
        const sizeMb = vf.content_length ? (parseInt(vf.content_length) / (1024 * 1024)).toFixed(1) + " MB" : "Dynamic";
        html += `
          <div class="ytpro-item" data-v-itag="${vf.itag}" data-a-itag="${audioFormats[0]?.itag || ''}">
            <div class="ytpro-item-left">
              ${downBtn}
              <span>${vf.quality_label || 'HD'} (${vf.container || 'mp4'})</span>
            </div>
            <span style="font-size:12px;opacity:0.7;">${sizeMb}</span>
          </div>
        `;
      });

      html += `<div style="font-size:13px;font-weight:600;margin:16px 0 8px 0;opacity:0.8;">🎵 Audio Only:</div>`;
      audioFormats.slice(0, 2).forEach(af => {
        const sizeMb = af.content_length ? (parseInt(af.content_length) / (1024 * 1024)).toFixed(1) + " MB" : "Dynamic";
        html += `
          <div class="ytpro-item" data-audio-only="${af.itag}">
            <div class="ytpro-item-left">
              ${downBtn}
              <span>Audio (${af.audio_quality || 'High'})</span>
            </div>
            <span style="font-size:12px;opacity:0.7;">${sizeMb}</span>
          </div>
        `;
      });

      dlContent.innerHTML = html;

      dlContent.addEventListener("click", async (ev) => {
        const row = ev.target.closest(".ytpro-item");
        if (!row) return;
        modal.remove();

        const vItag = row.dataset.vItag;
        const aItag = row.dataset.aItag;
        const audioOnlyItag = row.dataset.audioOnly;

        startSabrDownload({
          info,
          yt,
          safeTitle,
          vItag,
          aItag,
          audioOnlyItag,
          SabrStream,
          buildSabrFormat,
          EnabledTrackTypes
        });
      });

    } catch (err) {
      console.error(err);
      modal.querySelector("#dlLoading").innerHTML = `<span style="color:#ff5555;">⚠️ Failed to load formats: ${err.message}</span>`;
    }
  };

  // Dedicated Binary Stream Handler with Self-Destructing Indicator
  async function startSabrDownload({ info, yt, safeTitle, vItag, aItag, audioOnlyItag, SabrStream, buildSabrFormat, EnabledTrackTypes }) {
    window.Android?.showToast?.("Download Started...");
    const indicator = createDownloadIndicator();

    try {
      const streamingData = info.streaming_data;
      const sabrFormats = (streamingData.adaptive_formats || []).map(f => buildSabrFormat(f));
      const serverAbrUrl = await yt.session.player.decipher(streamingData.server_abr_streaming_url);

      const sabr = new SabrStream({
        videoId: info.basic_info.id,
        cpn: info.cpn,
        serverAbrStreamingUrl: serverAbrUrl,
        formats: sabrFormats,
        clientInfo: { clientName: 1, clientVersion: yt.session.context.client.clientVersion, osName: 'Windows', osVersion: '10.0' }
      });

      const enabledTrack = audioOnlyItag ? EnabledTrackTypes.AUDIO_ONLY : (vItag && aItag ? EnabledTrackTypes.VIDEO_AND_AUDIO : EnabledTrackTypes.VIDEO_ONLY);
      const targetVideo = sabrFormats.find(s => s.itag == vItag);
      const targetAudio = sabrFormats.find(s => s.itag == (audioOnlyItag || aItag));

      const { videoStream, audioStream } = await sabr.start({
        preferMp4: true,
        videoFormat: () => targetVideo,
        audioFormat: () => targetAudio,
        enabledTrackTypes: enabledTrack
      });

      const timeStamp = Date.now();
      const vFileName = `${safeTitle}_video_${timeStamp}.mp4`;
      const aFileName = `${safeTitle}_audio_${timeStamp}.mp4`;

      const tasks = [];
      if (videoStream) tasks.push(pipeStreamToPort(videoStream, vFileName));
      if (audioStream) tasks.push(pipeStreamToPort(audioStream, aFileName));

      await Promise.all(tasks);

      if (vItag && aItag) {
        window.Android?.showToast?.("Muxing Video & Audio...");
        window.Android?.muxVideoAudio?.(vFileName, aFileName, `${safeTitle}_${timeStamp}.mp4`);
      }

      window.Android?.showToast?.("✅ Download Completed!");
    } catch (e) {
      console.error(e);
      window.Android?.showToast?.("Download Error: " + e.message);
    } finally {
      // Auto-remove animated indicator on complete!
      indicator?.remove();
    }
  }

  function createDownloadIndicator() {
    let ind = document.getElementById("ytproDownloadIndicator");
    if (ind) return ind;
    ind = document.createElement("div");
    ind.id = "ytproDownloadIndicator";
    ind.innerHTML = `
      <div style="position:fixed;bottom:25px;right:20px;width:52px;height:52px;border-radius:50%;background:#1a1a1a;border:2px solid #3ea6ff;display:grid;place-items:center;z-index:999999;box-shadow:0 8px 25px rgba(62,166,255,0.4);animation:pulseGlow 1.5s infinite;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3ea6ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:dropBounce 1.2s infinite ease-in-out;"><path d="M12 3v13"/><polyline points="7 11 12 16 17 11"/><path d="M5 21h14"/></svg>
      </div>
      <style>
        @keyframes pulseGlow { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(62,166,255,0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(62,166,255,0); } 100% { transform: scale(1); } }
        @keyframes dropBounce { 0%, 100% { transform: translateY(-3px); } 50% { transform: translateY(3px); } }
      </style>
    `;
    document.body.appendChild(ind);
    return ind;
  }

  function pipeStreamToPort(stream, fileName) {
    return new Promise(async (resolve) => {
      const reader = stream.getReader();
      const CHUNK_SIZE = 1024 * 512;
      let filePort = null;

      const portHandler = (event) => {
        if (typeof event.data === "string" && event.data.startsWith("PORT_FOR:" + fileName)) {
          filePort = event.ports[0];
          window.removeEventListener("message", portHandler);
        }
      };
      window.addEventListener("message", portHandler);
      window.Android?.requestBinaryPort?.(fileName);

      while (!filePort) await new Promise(r => setTimeout(r, 20));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value?.length) {
          let offset = 0;
          while (offset < value.length) {
            const chunk = value.slice(offset, offset + CHUNK_SIZE).buffer;
            filePort.postMessage(chunk);
            offset += chunk.byteLength;
          }
        }
      }
      filePort.postMessage("END");
      resolve();
    });
  }

  // --- 8. FLOATING CONTROLS & ACTION BUTTONS ---
  function injectActionButtons() {
    if (window.location.pathname.includes("/watch") && !document.getElementById("ytproActionsBar")) {
      const container = document.querySelector(".slim-video-action-bar-actions");
      if (!container) return;

      const bar = document.createElement("div");
      bar.id = "ytproActionsBar";
      bar.style.cssText = "display:flex;gap:8px;padding:8px 12px;overflow-x:auto;scrollbar-width:none;";

      const createBtn = (id, label, iconSvg, onClick) => {
        const b = document.createElement("button");
        b.style.cssText = "display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:600;flex-shrink:0;";
        b.innerHTML = `${iconSvg} <span>${label}</span>`;
        b.onclick = onClick;
        return b;
      };

      bar.appendChild(createBtn("ytproDl", "Download", icons.download, () => window.location.hash = "#download"));
      bar.appendChild(createBtn("ytproPip", "PIP", icons.pip, () => {
        const v = document.querySelector(".video-stream");
        if (v && window.Android?.pipvid) {
          v.getBoundingClientRect().height > v.getBoundingClientRect().width ? window.Android.pipvid("portrait") : window.Android.pipvid("landscape");
        }
      }));
      bar.appendChild(createBtn("ytproSett", "Settings", icons.settings, openSettings));

      container.parentNode.insertBefore(bar, container.nextSibling);
    }
  }

  // --- 9. MUTATION OBSERVER & ROUTING ---
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#download") window.ytproSabrDownload();
    if (window.location.hash === "#settings") openSettings();
  });

  const observer = new MutationObserver(() => {
    adsBlock();
    injectActionButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", () => {
    fetchDislikes(window.location.href);
    checkSponsors(window.location.href);
  });

})();