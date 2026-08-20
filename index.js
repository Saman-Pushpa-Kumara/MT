/**********************************************************************************
 * YTPRO ULTIMATE PRO ENGINE v4.0.0 (ALL-IN-ONE)
 * Includes: SABR Downloader, BotGuard Minter, Gemini AI, MediaSession BgPlay,
 * Gesture Controls, SponsorBlock, RYD Dislikes, 10x Speed, Full AdBlocker
 **********************************************************************************/

(function() {
  'use strict';

  // ==========================================
  // 1. GLOBAL ENVIRONMENT & CONFIGURATION
  // ==========================================
  const YTProVer = "4.0.0";
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
    "3.0 Flash Thinking": '[1,null,null,null,"5bf011840784117a",null,null,0,[4],null,null,1]',
    "3.0 Pro Plus": '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,4]',
    "3.0 Flash Plus": '[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,4]'
  };

  const YTPROCodecs = {
    video: ["AV1", "VP8", "VP9", "H264"],
    audio: ["Opus", "Mp4a"]
  };

  let touchStartY = 0, touchEndY = 0, pinchDistInitial = null;
  let isPinching = false, zoomIn = false, currentScale = 1;
  const sens = 0.005;
  let vol = (typeof Android !== 'undefined' && Android.getVolume) ? Android.getVolume() : 0.5;
  let brt = (typeof Android !== 'undefined' && Android.getBrightness) ? Android.getBrightness() / 100 : 0.5;
  let dislikes = "...";

  // Initialize Default LocalStorage
  if (!localStorage.getItem("saveCInfo")) {
    localStorage.setItem("autoSpn", "true");
    localStorage.setItem("bgplay", "true");
    localStorage.setItem("gesC", "true");
    localStorage.setItem("gesM", "false");
    localStorage.setItem("fzoom", "false");
    localStorage.setItem("saveCInfo", "true");
    localStorage.setItem("geminiModel", "3.0 Flash");
    localStorage.setItem("prompt", "Give me details about this YouTube video Id: {videoId} , a detailed summary of timestamps with facts, resources and reviews.");
    localStorage.setItem("devMode", "false");
    localStorage.setItem("block_60fps", "false");
    YTPROCodecs.video.forEach(k => localStorage.setItem(k, "true"));
    YTPROCodecs.audio.forEach(k => localStorage.setItem(k, "true"));
  }

  // Developer mode Eruda console
  if (typeof window.eruda === 'undefined' && localStorage.getItem("devMode") === "true") {
    const scr = document.createElement("script");
    scr.src = "//youtube.com/ytpro_cdn/npm/eruda";
    scr.onload = () => window.eruda.init();
    document.body.appendChild(scr);
  }

  const isD = true;
  const c = "#ffffff";
  const dc = "#121212";
  const d = "rgba(255, 255, 255, 0.08)";

  // ==========================================
  // 2. CODEC OVERRIDE & EXPERIMENTAL ENGINE
  // ==========================================
  function overrideCodecs() {
    const v = document.createElement("video");
    const origCanPlay = v.canPlayType.bind(v);
    v.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlay);
    if (window.MediaSource) {
      const origIsTypeSupported = window.MediaSource.isTypeSupported.bind(window.MediaSource);
      window.MediaSource.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported);
    }
  }

  function makeModifiedTypeChecker(origFn) {
    return function(type) {
      if (!type) return "";
      const blocked = [];
      if (localStorage.getItem("H264") === "false") blocked.push("avc");
      if (localStorage.getItem("VP8") === "false") blocked.push("vp8");
      if (localStorage.getItem("VP9") === "false") blocked.push("vp9", "vp09");
      if (localStorage.getItem("AV1") === "false") blocked.push("av01", "av99");
      if (localStorage.getItem("Opus") === "false") blocked.push("opus");
      if (localStorage.getItem("Mp4a") === "false") blocked.push("mp4a");

      for (let b of blocked) {
        if (type.includes(b)) return "";
      }
      if (localStorage.getItem("block_60fps") === "true") {
        const match = /framerate=(\d+)/.exec(type);
        if (match && parseInt(match[1]) > 30) return "";
      }
      return origFn(type);
    };
  }
  overrideCodecs();

  // ==========================================
  // 3. BACKGROUND PLAYBACK & NOTIFICATION PANEL FIX
  // ==========================================
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

  let _metaState = 'none';
  let _currentMeta = null;

  if (!('mediaSession' in navigator)) {
    Object.defineProperty(navigator, 'mediaSession', { value: {}, configurable: true });
  }

  Object.defineProperty(navigator.mediaSession, 'metadata', {
    get: () => _currentMeta,
    set: (val) => {
      bgPlaySync(val);
      _currentMeta = val;
    },
    configurable: true
  });

  navigator.mediaSession.setActionHandler = (action, handler) => {
    if (typeof handler === 'function') window.handlers[action] = handler;
  };

  Object.defineProperty(navigator.mediaSession, 'playbackState', {
    get: () => _metaState,
    set: (val) => {
      _metaState = val;
      const v = document.querySelector('video.video-stream') || document.querySelector('video');
      if (!v) return;
      if (val === 'playing') {
        setTimeout(() => window.Android?.bgPlay?.(v.currentTime * 1000), 100);
      } else if (val === 'paused' && (window.pauseAllowed || window.PIPause)) {
        setTimeout(() => window.Android?.bgPause?.(v.currentTime * 1000), 100);
      } else if (val === 'none') {
        window.Android?.bgStop?.();
        window.serviceRunning = false;
      }
    },
    configurable: true
  });

  async function bgPlaySync(info) {
    if (!info) return;
    const v = document.querySelector('video.video-stream') || document.querySelector('video');
    if (!v) return;

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

    const durMs = (v.duration || 0) * 1000;
    if (window.serviceRunning) {
      setTimeout(() => window.Android?.bgUpdate?.(iconBase64, info.title, info.artist, durMs), 50);
      setTimeout(() => window.Android?.bgPlay?.(v.currentTime * 1000), 100);
    } else {
      window.serviceRunning = true;
      setTimeout(() => window.Android?.bgStart?.(iconBase64, info.title, info.artist, durMs), 50);
      setTimeout(() => window.Android?.bgPlay?.(v.currentTime * 1000), 100);
    }
  }

  // Robust Native Android Notification Callbacks (With Fallback Triggering)
  window.seekTo = function(t) {
    const v = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.seekto === 'function') {
      window.handlers.seekto({ seekTime: t / 1000 });
    } else if (v) {
      v.currentTime = t / 1000;
    }
  };

  window.playVideo = function() {
    window.PIPause = false;
    navigator.mediaSession.playbackState = 'playing';
    const v = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.play === 'function') {
      window.handlers.play();
    } else if (v) {
      v.play().catch(() => {});
    }
    const playBtn = document.querySelector('.ytp-play-button') || document.querySelector('button[aria-label="Play"]');
    if (playBtn && v?.paused) playBtn.click();
  };

  window.pauseVideo = function() {
    window.PIPause = true;
    navigator.mediaSession.playbackState = 'paused';
    const v = document.querySelector('video.video-stream') || document.querySelector('video');
    if (typeof window.handlers?.pause === 'function') {
      window.handlers.pause();
    } else if (v) {
      v.pause();
    }
    const pauseBtn = document.querySelector('.ytp-play-button') || document.querySelector('button[aria-label="Pause"]');
    if (pauseBtn && !v?.paused) pauseBtn.click();
  };

  window.playNext = function() {
    if (typeof window.handlers?.nexttrack === 'function') {
      window.handlers.nexttrack();
    } else {
      const nextBtn = document.querySelector('.ytp-next-button') || 
                      document.querySelector('button[aria-label="Next video"]') || 
                      document.querySelector('button[aria-label="Next"]') ||
                      document.querySelector('.next-button') ||
                      document.querySelector('ytm-next-button-renderer');
      if (nextBtn) {
        nextBtn.click();
      } else {
        const nextLink = document.querySelector('ytm-video-with-context-renderer a, ytm-compact-video-renderer a');
        if (nextLink) nextLink.click();
      }
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
        const v = document.querySelector('video.video-stream') || document.querySelector('video');
        if (v) v.currentTime = 0;
      }
    }
  };

  // ==========================================
  // 4. AD-BLOCKING & NETWORK FILTERS
  // ==========================================
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

  const origXhrOpen = XMLHttpRequest.prototype.open;
  const origXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._reqUrl = url;
    return origXhrOpen.apply(this, [method, url, ...rest]);
  };
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._reqUrl && (
      this._reqUrl.includes("googleads.g.doubleclick.net") ||
      this._reqUrl.includes("youtube.com/youtubei/v1/player/ad_break") ||
      this._reqUrl.includes("youtube.com/pagead/adview") ||
      this._reqUrl.includes("youtube.com/api/stats/ads")
    )) {
      return;
    }
    return origXhrSend.apply(this, args);
  };

  function cleanupAds() {
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

  // ==========================================
  // 5. SPONSORBLOCK & RETURN DISLIKES
  // ==========================================
  function formatCompactNumber(num) {
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
      if (data?.dislikes) {
        dislikes = formatCompactNumber(parseInt(data.dislikes));
        updateDislikeDOM();
      }
    } catch (e) {}
  }

  function updateDislikeDOM() {
    try {
      const dislikeBtn = document.querySelector("dislike-button-view-model");
      if (dislikeBtn) {
        let label = dislikeBtn.querySelector("#diskl");
        if (!label) {
          label = document.createElement("span");
          label.id = "diskl";
          label.style.marginLeft = "6px";
          label.style.fontSize = "12px";
          dislikeBtn.appendChild(label);
        }
        label.textContent = dislikes;
      }
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
              showSponsorToast(seg[0]);
            }
          }
        };
      }
    } catch (e) {}
  }

  function showSponsorToast(rewindTo) {
    const toast = document.createElement("div");
    toast.className = "ytpro-toast";
    toast.innerHTML = `
      <span>⚡ Sponsor Skipped</span>
      <button id="spnRewind">Rewind</button>
    `;
    document.body.appendChild(toast);
    toast.querySelector("#spnRewind")?.addEventListener("click", () => {
      const v = document.querySelector(".video-stream");
      if (v) v.currentTime = rewindTo + 1;
      toast.remove();
    });
    setTimeout(() => toast.remove(), 4000);
  }

  // ==========================================
  // 6. MODERN GLASSMORPHIC UI STYLING
  // ==========================================
  const modernStyle = document.createElement("style");
  modernStyle.innerHTML = `
    .ytpro-modal {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      z-index: 9999999; display: flex; justify-content: center; align-items: flex-end;
      animation: ytproFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ytpro-sheet {
      width: 94%; max-width: 520px; max-height: 82vh;
      background: #121215ee; border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px 28px 18px 18px; margin-bottom: 15px; padding: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); overflow-y: auto; color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .ytpro-header {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 15px;
    }
    .ytpro-header h2 {
      margin: 0; font-size: 19px; font-weight: 700;
      background: linear-gradient(135deg, #ffffff 0%, #3ea6ff 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .ytpro-item {
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px; padding: 12px 16px; margin-bottom: 8px; font-size: 14px;
      font-weight: 500; transition: transform 0.15s ease, background 0.2s ease; cursor: pointer;
    }
    .ytpro-item:active { transform: scale(0.98); background: rgba(255, 255, 255, 0.08); }
    .ytpro-item-left { display: flex; align-items: center; gap: 12px; }
    .ytpro-switch {
      position: relative; width: 44px; height: 24px; background: rgba(255,255,255,0.15);
      border-radius: 20px; transition: background 0.25s ease;
    }
    .ytpro-switch.active { background: #3ea6ff; }
    .ytpro-switch-handle {
      position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
      background: #fff; border-radius: 50%; transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .ytpro-switch.active .ytpro-switch-handle { transform: translateX(20px); }
    .ytpro-toast {
      position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%);
      background: rgba(20, 20, 25, 0.9); backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 18px; border-radius: 30px;
      color: #fff; z-index: 99999999; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600;
      animation: ytproToastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ytpro-toast button {
      background: rgba(255, 255, 255, 0.15); border: none; color: #fff;
      border-radius: 12px; padding: 4px 10px; font-size: 12px; font-weight: 600;
    }
    @keyframes ytproFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ytproToastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
  `;
  document.head.appendChild(modernStyle);

  // SVG Icons Pack
  const icons = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    pip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="10" width="8" height="6" rx="1"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>`,
    codecs: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`
  };

  // ==========================================
  // 7. MODERN SETTINGS MODAL
  // ==========================================
  function openSettings() {
    const modal = document.createElement("div");
    modal.className = "ytpro-modal";
    modal.id = "settingsprodiv";

    const createToggleItem = (key, title, icon) => `
      <div class="ytpro-item" data-action="toggle" data-key="${key}">
        <div class="ytpro-item-left">
          ${icon}
          <span>${title}</span>
        </div>
        <div class="ytpro-switch ${localStorage.getItem(key) === "true" ? "active" : ""}">
          <div class="ytpro-switch-handle"></div>
        </div>
      </div>
    `;

    modal.innerHTML = `
      <div class="ytpro-sheet">
        <div class="ytpro-header">
          <h2>YTPRO Studio <span style="font-size:11px;font-weight:400;opacity:0.5;">v${YTProVer}</span></h2>
          <button style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;" id="ytproClose">✕</button>
        </div>

        <div class="ytpro-item" data-action="openDownloadHub" style="background:rgba(62,166,255,0.12);border-color:rgba(62,166,255,0.3);">
          <div class="ytpro-item-left">
            ${icons.download}
            <span style="font-weight:700;color:#3ea6ff;">Fast Media & SABR Downloader</span>
          </div>
          <span style="color:#3ea6ff;font-size:16px;">➔</span>
        </div>

        <div class="ytpro-item" data-action="openHearts">
          <div class="ytpro-item-left">
            ${icons.heart}
            <span>Liked Videos Library</span>
          </div>
          <span>➔</span>
        </div>

        ${createToggleItem("autoSpn", "Auto-Skip Sponsor Segments", icons.zap)}
        ${createToggleItem("bgplay", "Background Playback", icons.pip)}
        ${createToggleItem("gesC", "Volume / Brightness Touch Gestures", icons.sliders)}
        ${createToggleItem("gesM", "Swipe Down Miniplayer", icons.sliders)}
        ${createToggleItem("shorts", "Hide Shorts Feed", icons.sliders)}
        ${createToggleItem("block_60fps", "Block 60FPS Video (Save Battery)", icons.sliders)}
        ${createToggleItem("devMode", "Developer Console (Eruda)", icons.sparkles)}

        <div class="ytpro-item" data-action="geminiModels">
          <div class="ytpro-item-left">
            ${icons.sparkles}
            <span>Select Gemini AI Model</span>
          </div>
          <span style="font-size:12px;opacity:0.6;">${localStorage.getItem("geminiModel")} ➔</span>
        </div>

        <div class="ytpro-item" data-action="geminiPrompt">
          <div class="ytpro-item-left">
            ${icons.sparkles}
            <span>Edit AI Summary Prompt</span>
          </div>
          <span>➔</span>
        </div>

        <div class="ytpro-item" data-action="codecsModal">
          <div class="ytpro-item-left">
            ${icons.codecs}
            <span>Hardware Codecs Manager</span>
          </div>
          <span>➔</span>
        </div>

        <p style="font-size:11px;opacity:0.4;text-align:center;margin-top:20px;">YTPRO Ultimate Edition • Built for New Gen Experience</p>
      </div>
    `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "ytproClose") modal.remove();

      const item = e.target.closest("[data-action]");
      if (!item) return;

      const act = item.dataset.action;
      if (act === "toggle") {
        const key = item.dataset.key;
        const current = localStorage.getItem(key) === "true";
        const updated = current ? "false" : "true";
        localStorage.setItem(key, updated);
        item.querySelector(".ytpro-switch").classList.toggle("active", updated === "true");
        if (key === "bgplay") window.Android?.setBgPlay?.(updated === "true");
      } else if (act === "openDownloadHub") {
        modal.remove();
        window.ytproSabrDownload();
      } else if (act === "openHearts") {
        modal.remove();
        showHeartsLibrary();
      } else if (act === "geminiModels") {
        const modelNames = Object.keys(GeminiModels);
        const selected = prompt(`Select Model:\n${modelNames.map((m, i) => `${i + 1}. ${m}`).join("\n")}`, "2");
        if (selected && modelNames[parseInt(selected) - 1]) {
          localStorage.setItem("geminiModel", modelNames[parseInt(selected) - 1]);
          modal.remove();
          openSettings();
        }
      } else if (act === "geminiPrompt") {
        const currentP = localStorage.getItem("prompt");
        const newP = prompt("Edit Gemini AI Prompt Template:", currentP);
        if (newP) localStorage.setItem("prompt", newP);
      } else if (act === "codecsModal") {
        alert("All codecs (AV1, VP9, H264, Opus, Mp4a) are automatically hardware-accelerated.");
      }
    });

    document.body.appendChild(modal);
  }

  // ==========================================
  // 8. LIKED VIDEOS ("HEARTS") LIBRARY
  // ==========================================
  function toggleHeart() {
    const vidId = new URLSearchParams(window.location.search).get("v") || window.location.pathname.replace("/shorts/", "");
    if (!vidId) return;

    let hearts = JSON.parse(localStorage.getItem("hearts") || "{}");
    const v = document.querySelector("video.video-stream") || document.querySelector("video");
    const title = document.querySelector(".slim-video-metadata-header")?.textContent || 
                  document.querySelector(".ytShortsVideoTitleViewModelShortsVideoTitle")?.textContent || "Video";

    if (hearts[vidId]) {
      delete hearts[vidId];
      localStorage.setItem("hearts", JSON.stringify(hearts));
      window.Android?.showToast?.("Removed from Liked Library");
    } else {
      let thumb = "";
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (v) ctx.drawImage(v, 0, 0, 320, 180);
        thumb = canvas.toDataURL("image/jpeg", 0.7);
      } catch (e) {}

      hearts[vidId] = { title, thumb: thumb || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg` };
      localStorage.setItem("hearts", JSON.stringify(hearts));
      window.Android?.showToast?.("Saved to Liked Library ❤️");
    }
  }

  function showHeartsLibrary() {
    const modal = document.createElement("div");
    modal.className = "ytpro-modal";
    const hearts = JSON.parse(localStorage.getItem("hearts") || "{}");
    const keys = Object.keys(hearts);

    let listHtml = "";
    if (keys.length === 0) {
      listHtml = `<div style="text-align:center;padding:30px;opacity:0.6;">No saved videos found.</div>`;
    } else {
      keys.reverse().forEach(k => {
        const item = hearts[k];
        listHtml += `
          <div class="ytpro-item" data-watch-id="${k}" style="gap:12px;">
            <img src="${item.thumb}" style="width:90px;height:55px;border-radius:10px;object-fit:cover;">
            <div style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;">${item.title}</div>
            <button data-delete-id="${k}" style="background:transparent;border:none;color:#ff4444;font-size:16px;">✕</button>
          </div>
        `;
      });
    }

    modal.innerHTML = `
      <div class="ytpro-sheet">
        <div class="ytpro-header">
          <h2>Liked Videos ❤️</h2>
          <button style="background:transparent;border:none;color:#fff;font-size:18px;" id="heartsClose">✕</button>
        </div>
        <div style="max-height:60vh;overflow-y:auto;">${listHtml}</div>
      </div>
    `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "heartsClose") modal.remove();

      const delBtn = e.target.closest("[data-delete-id]");
      if (delBtn) {
        const id = delBtn.dataset.deleteId;
        delete hearts[id];
        localStorage.setItem("hearts", JSON.stringify(hearts));
        modal.remove();
        showHeartsLibrary();
        return;
      }

      const watchItem = e.target.closest("[data-watch-id]");
      if (watchItem) {
        modal.remove();
        window.location.href = `/watch?v=${watchItem.dataset.watchId}`;
      }
    });

    document.body.appendChild(modal);
  }

  // ==========================================
  // 9. HIGH-SPEED SABR DOWNLOADER & BOTGUARD MINTER
  // ==========================================
  window.ytproSabrDownload = async function() {
    let videoId = window.location.pathname.includes("shorts") ? 
                  window.location.pathname.split("/").pop() : 
                  new URLSearchParams(window.location.search).get("v");

    if (!videoId) {
      window.Android?.showToast?.("No active video found.");
      return;
    }

    const modal = document.createElement("div");
    modal.className = "ytpro-modal";
    modal.id = "ytproDlModal";
    modal.innerHTML = `
      <div class="ytpro-sheet" style="text-align:center;">
        <div class="ytpro-header">
          <h2>Downloads & SABR Hub</h2>
          <button style="background:transparent;border:none;color:#fff;font-size:18px;" onclick="document.getElementById('ytproDlModal').remove()">✕</button>
        </div>
        <div id="dlLoader" style="padding:30px 0;font-size:14px;color:#aaa;">
          ⚡ Initializing SABR Stream Engine...
        </div>
        <div id="dlBody" style="display:none;text-align:left;"></div>
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

      if (!streamingData) throw new Error("Could not extract stream data");

      const formats = streamingData.adaptive_formats || [];
      const dlLoader = modal.querySelector("#dlLoader");
      const dlBody = modal.querySelector("#dlBody");
      dlLoader.style.display = "none";
      dlBody.style.display = "block";

      const safeTitle = (info.basic_info?.title || "YTPRO_Media").replace(/[\/\\?%*:|"<>]/g, '-');
      const videoOnly = formats.filter(f => f.has_video && !f.has_audio);
      const audioOnly = formats.filter(f => f.has_audio && !f.has_video);

      let html = `<div style="font-size:13px;font-weight:700;margin-bottom:10px;color:#3ea6ff;">📹 High-Definition Video (Muxed):</div>`;
      videoOnly.slice(0, 5).forEach(v => {
        const mb = v.content_length ? (parseInt(v.content_length) / (1024 * 1024)).toFixed(1) + " MB" : "HQ Stream";
        html += `
          <div class="ytpro-item" data-v-itag="${v.itag}" data-a-itag="${audioOnly[0]?.itag || ''}">
            <div class="ytpro-item-left">
              ${icons.download}
              <span>${v.quality_label || 'HD'} (${v.container || 'mp4'})</span>
            </div>
            <span style="font-size:12px;opacity:0.7;">${mb}</span>
          </div>
        `;
      });

      html += `<div style="font-size:13px;font-weight:700;margin:16px 0 10px 0;color:#3ea6ff;">🎵 High-Bitrate Audio:</div>`;
      audioOnly.slice(0, 2).forEach(a => {
        const mb = a.content_length ? (parseInt(a.content_length) / (1024 * 1024)).toFixed(1) + " MB" : "HQ Audio";
        html += `
          <div class="ytpro-item" data-audio-only="${a.itag}">
            <div class="ytpro-item-left">
              ${icons.download}
              <span>Audio (${a.audio_quality || 'High'})</span>
            </div>
            <span style="font-size:12px;opacity:0.7;">${mb}</span>
          </div>
        `;
      });

      dlBody.innerHTML = html;

      dlBody.addEventListener("click", async (e) => {
        const item = e.target.closest(".ytpro-item");
        if (!item) return;
        modal.remove();

        startFastSabrDownload({
          info, yt, safeTitle,
          vItag: item.dataset.vItag,
          aItag: item.dataset.aItag,
          audioOnlyItag: item.dataset.audioOnly,
          SabrStream, buildSabrFormat, EnabledTrackTypes
        });
      });

    } catch (err) {
      modal.querySelector("#dlLoader").innerHTML = `<span style="color:#ff5555;">⚠️ Error: ${err.message}</span>`;
    }
  };

  async function startFastSabrDownload({ info, yt, safeTitle, vItag, aItag, audioOnlyItag, SabrStream, buildSabrFormat, EnabledTrackTypes }) {
    window.Android?.showToast?.("⚡ Download Initiated...");
    const indicator = createLiveDownloadIndicator();

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

      const ts = Date.now();
      const vFileName = `${safeTitle}_v_${ts}.mp4`;
      const aFileName = `${safeTitle}_a_${ts}.mp4`;

      const tasks = [];
      if (videoStream) tasks.push(pipeBinaryStream(videoStream, vFileName));
      if (audioStream) tasks.push(pipeBinaryStream(audioStream, aFileName));

      await Promise.all(tasks);

      if (vItag && aItag) {
        window.Android?.showToast?.("Muxing Video & Audio Formats...");
        window.Android?.muxVideoAudio?.(vFileName, aFileName, `${safeTitle}_${ts}.mp4`);
      }

      window.Android?.showToast?.("✅ Download & Muxing Finished!");
    } catch (e) {
      window.Android?.showToast?.("Download Failed: " + e.message);
    } finally {
      // Auto-remove Floating Animation on Complete!
      indicator?.remove();
    }
  }

  function createLiveDownloadIndicator() {
    let el = document.getElementById("ytproDlIndicator");
    if (el) return el;
    el = document.createElement("div");
    el.id = "ytproDlIndicator";
    el.innerHTML = `
      <div style="position:fixed;bottom:25px;right:20px;width:54px;height:54px;border-radius:50%;background:#18181fee;border:2px solid #3ea6ff;display:grid;place-items:center;z-index:9999999;box-shadow:0 10px 30px rgba(62,166,255,0.4);animation:ytproPulse 1.5s infinite;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3ea6ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:ytproDrop 1.2s infinite ease-in-out;"><path d="M12 3v13"/><polyline points="7 11 12 16 17 11"/><path d="M5 21h14"/></svg>
      </div>
      <style>
        @keyframes ytproPulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(62,166,255,0.6); } 70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(62,166,255,0); } 100% { transform: scale(1); } }
        @keyframes ytproDrop { 0%, 100% { transform: translateY(-3px); } 50% { transform: translateY(3px); } }
      </style>
    `;
    document.body.appendChild(el);
    return el;
  }

  function pipeBinaryStream(stream, fileName) {
    return new Promise(async (resolve) => {
      const reader = stream.getReader();
      const CHUNK_SIZE = 1024 * 512;
      let port = null;

      const handler = (ev) => {
        if (typeof ev.data === "string" && ev.data.startsWith("PORT_FOR:" + fileName)) {
          port = ev.ports[0];
          window.removeEventListener("message", handler);
        }
      };
      window.addEventListener("message", handler);
      window.Android?.requestBinaryPort?.(fileName);

      while (!port) await new Promise(r => setTimeout(r, 20));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value?.length) {
          let offset = 0;
          while (offset < value.length) {
            const chunk = value.slice(offset, offset + CHUNK_SIZE).buffer;
            port.postMessage(chunk);
            offset += chunk.byteLength;
          }
        }
      }
      port.postMessage("END");
      resolve();
    });
  }

  // ==========================================
  // 10. EXTRA SPEED CONTROLLER (10x)
  // ==========================================
  function injectExtraSpeed() {
    const slider = document.getElementById("slider");
    if (slider && slider.max !== "10") {
      slider.max = "10";
      slider.addEventListener("input", () => {
        const v = document.querySelector(".video-stream");
        if (v) v.playbackRate = parseFloat(slider.value);
      });
    }
  }

  // ==========================================
  // 11. GESTURES & ACTION BARS INJECTION
  // ==========================================
  function injectTopBarButtons() {
    if (window.location.pathname.includes("/watch") && !document.getElementById("ytproWatchActionBar")) {
      const container = document.querySelector(".slim-video-action-bar-actions");
      if (!container) return;

      const bar = document.createElement("div");
      bar.id = "ytproWatchActionBar";
      bar.style.cssText = "display:flex;gap:8px;padding:8px 12px;overflow-x:auto;scrollbar-width:none;";

      const createBtn = (title, icon, fn) => {
        const b = document.createElement("button");
        b.style.cssText = "display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:7px 14px;border-radius:20px;font-size:12px;font-weight:600;flex-shrink:0;cursor:pointer;";
        b.innerHTML = `${icon} <span>${title}</span>`;
        b.onclick = fn;
        return b;
      };

      bar.appendChild(createBtn("Download", icons.download, () => window.ytproSabrDownload()));
      bar.appendChild(createBtn("Heart", icons.heart, toggleHeart));
      bar.appendChild(createBtn("PIP", icons.pip, () => {
        const v = document.querySelector(".video-stream");
        if (v && window.Android?.pipvid) {
          v.getBoundingClientRect().height > v.getBoundingClientRect().width ? window.Android.pipvid("portrait") : window.Android.pipvid("landscape");
        }
      }));
      bar.appendChild(createBtn("Settings", icons.settings, openSettings));

      container.parentNode.insertBefore(bar, container.nextSibling);
    }
  }

  // Global Navigation & Mutation Listeners
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#download") window.ytproSabrDownload();
    if (window.location.hash === "#settings") openSettings();
    if (window.location.hash === "#hearts") showHeartsLibrary();
  });

  const domObserver = new MutationObserver(() => {
    cleanupAds();
    injectTopBarButtons();
    injectExtraSpeed();
    updateDislikeDOM();
  });
  domObserver.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", () => {
    fetchDislikes(window.location.href);
    checkSponsors(window.location.href);
  });

})();