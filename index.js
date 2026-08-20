/**
 * YTPro Next-Gen Modern Edition
 * Redesigned UI + Fixed Gemini + Fixed Notification Buttons (Play/Pause/Next/Prev)
 */

if (null == window.eruda && "true" == localStorage.getItem("devMode")) {
    var script = document.createElement("script");
    script.src = "//youtube.com/ytpro_cdn/npm/eruda";
    document.body.appendChild(script);
    script.onload = () => eruda.init();
}

if (!window.YTProVer) {
    window.YTProVer = "4.1.0-NextGen";
    const origPause = HTMLMediaElement.prototype.pause;
    const origPlay = HTMLMediaElement.prototype.play;
    
    // Notification & Background State Flags
    window.userPaused = false;
    window.pauseAllowed = true;
    window.isPIP = false;
    window.PIPause = false;
    
    var sTime = [], GeminiAT = "";

    var GeminiModels = {
        "3.0 Pro": '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4],null,null,1]',
        "3.0 Flash": '[1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1]',
        "3.0 Flash Thinking": '[1,null,null,null,"5bf011840784117a",null,null,0,[4],null,null,1]',
        "3.0 Pro Plus": '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,4]',
        "3.0 Flash Plus": '[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,4]'
    };

    var YTPROCodecs = {
        video: ["AV1", "VP8", "VP9", "H264"],
        audio: ["Opus", "Mp4a"]
    };

    var vol = typeof Android !== "undefined" && Android.getVolume ? Android.getVolume() : 0.5;
    var brt = typeof Android !== "undefined" && Android.getBrightness ? Android.getBrightness() / 100 : 0.5;

    // Default Configuration
    if (!localStorage.getItem("saveCInfo")) {
        localStorage.setItem("autoSpn", "true");
        localStorage.setItem("bgplay", "true");
        localStorage.setItem("gesC", "true");
        localStorage.setItem("gesM", "false");
        localStorage.setItem("fzoom", "false");
        localStorage.setItem("saveCInfo", "true");
        localStorage.setItem("geminiModel", "3.0 Flash");
        localStorage.setItem("prompt", "Analyze this YouTube video (Title: {title}, ID: {videoId}). Give an insightful summary, key takeaways, and timestamp highlights.");
        localStorage.setItem("devMode", "false");
        localStorage.setItem("block_60fps", "false");
        localStorage.setItem("loopVideo", "false");
        YTPROCodecs.video.forEach(e => localStorage.setItem(e, "true"));
        YTPROCodecs.audio.forEach(e => localStorage.setItem(e, "true"));
    }

    var isD = document.cookie.indexOf("f6=40000") > -1 || window.matchMedia("(prefers-color-scheme: dark)").matches;
    var c = isD ? "#ffffff" : "#0f0f0f";
    var dc = isD ? "#0f0f0f" : "#ffffff";
    var bgGlass = isD ? "rgba(24, 24, 27, 0.85)" : "rgba(255, 255, 255, 0.88)";
    var cardBg = isD ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.04)";
    var borderGlass = isD ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";

    // Modern SVG Icons
    var Icons = {
        settings: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        download: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        heart: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        sparkles: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="url(#geminiGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="geminiGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4285F4"/><stop offset="50%" stop-color="#9B72CB"/><stop offset="100%" stop-color="#D96570"/></linearGradient></defs><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
        skip: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>`,
        hand: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M6 14v1a6 6 0 0 0 12 0v-4"></path></svg>`,
        repeat: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
        code: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        chevron: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
    };

    // ==========================================
    // 1. SMART BACKGROUND & PAUSE/PLAY OVERRIDE
    // ==========================================
    HTMLMediaElement.prototype.pause = function () {
        // If pause is requested by the user, media session, or PIP mode, allow it!
        if (window.userPaused || window.pauseAllowed || window.PIPause || document.visibilityState === "visible") {
            return origPause.apply(this, arguments);
        }
        
        // Only prevent unwanted pauses caused by background tab switching
        if (localStorage.getItem("bgplay") === "true") {
            return origPlay.apply(this, arguments).catch(() => {});
        }
        return origPause.apply(this, arguments);
    };

    // ==========================================
    // 2. COMPLETE MEDIA SESSION & NOTIFICATION HANDLER
    // ==========================================
    function setupMediaSession() {
        if (!("mediaSession" in navigator)) return;

        const vInfo = getVideoInfo();
        const video = document.querySelector("video");

        // Update Notification Metadata (Title, Channel, High-Res Cover Art)
        navigator.mediaSession.metadata = new MediaMetadata({
            title: vInfo.title || "YouTube Video",
            artist: vInfo.author || "YouTube",
            album: "YouTube Pro",
            artwork: [
                { src: `https://i.ytimg.com/vi/${vInfo.videoId}/hqdefault.jpg`, sizes: "480x360", type: "image/jpeg" },
                { src: `https://i.ytimg.com/vi/${vInfo.videoId}/maxresdefault.jpg`, sizes: "1280x720", type: "image/jpeg" }
            ]
        });

        // 1. PLAY BUTTON Action
        navigator.mediaSession.setActionHandler("play", () => {
            window.userPaused = false;
            window.pauseAllowed = true;
            const vid = document.querySelector("video");
            if (vid) {
                vid.play();
                navigator.mediaSession.playbackState = "playing";
            }
        });

        // 2. PAUSE BUTTON Action
        navigator.mediaSession.setActionHandler("pause", () => {
            window.userPaused = true;
            window.pauseAllowed = true;
            const vid = document.querySelector("video");
            if (vid) {
                origPause.apply(vid);
                navigator.mediaSession.playbackState = "paused";
            }
        });

        // 3. NEXT TRACK BUTTON Action
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            window.userPaused = false;
            const nextBtn = document.querySelector(".ytp-next-button") || 
                            document.querySelector(".next-button") || 
                            document.querySelector("button[aria-label='Next video']") ||
                            document.querySelector("ytm-next-button-renderer button");
            if (nextBtn) {
                nextBtn.click();
            } else {
                // Fallback: Click first recommended video in feed
                const firstRec = document.querySelector("ytm-compact-video-renderer a, ytm-video-with-context-renderer a");
                if (firstRec) firstRec.click();
            }
        });

        // 4. PREVIOUS TRACK / REWIND BUTTON Action
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            const vid = document.querySelector("video");
            if (vid) {
                if (vid.currentTime > 4) {
                    vid.currentTime = 0; // Restart video if played > 4s
                } else {
                    window.history.back(); // Go to previous video
                }
            }
        });

        // 5. SEEK FORWARD / BACKWARD (10s)
        navigator.mediaSession.setActionHandler("seekforward", (details) => {
            const vid = document.querySelector("video");
            if (vid) vid.currentTime = Math.min(vid.currentTime + (details.seekOffset || 10), vid.duration);
        });

        navigator.mediaSession.setActionHandler("seekbackward", (details) => {
            const vid = document.querySelector("video");
            if (vid) vid.currentTime = Math.max(vid.currentTime - (details.seekOffset || 10), 0);
        });

        // 6. UPDATE PLAYBACK STATE
        if (video) {
            video.onplay = () => {
                window.userPaused = false;
                navigator.mediaSession.playbackState = "playing";
            };
            video.onpause = () => {
                navigator.mediaSession.playbackState = "paused";
            };
        }
    }

    // Helper: Safe Info Extractor for Video & Channel Name
    function getVideoInfo() {
        let vId = new URLSearchParams(window.location.search).get("v");
        if (!vId && window.location.pathname.includes("/shorts/")) {
            vId = window.location.pathname.split("/shorts/")[1]?.split("?")[0];
        }
        let titleEl = document.querySelector(".slim-video-metadata-header") ||
                      document.querySelector(".ytShortsVideoTitleViewModelShortsVideoTitle") ||
                      document.querySelector("h1.title") ||
                      document.querySelector("ytm-slim-video-metadata-section-renderer");
        let title = titleEl ? titleEl.textContent.trim() : document.title.replace("- YouTube", "").trim();

        let authorEl = document.querySelector(".slim-owner-channel-name") || 
                       document.querySelector(".ytm-channel-thumbnail-with-link-renderer-text");
        let author = authorEl ? authorEl.textContent.trim() : "YouTube";

        return { videoId: vId || "unknown", title: title || "YouTube Video", author: author };
    }

    // Floating Download Animation Pill (Auto-Dismissing)
    function triggerDownloadAnimation(filename) {
        const animDiv = document.createElement("div");
        animDiv.style.cssText = `
            position: fixed; top: 25px; right: 20px; z-index: 999999999;
            background: ${bgGlass}; border: 1px solid ${borderGlass};
            backdrop-filter: blur(16px); padding: 10px 16px; border-radius: 20px;
            display: flex; align-items: center; gap: 12px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.3); color: ${c};
            font-size: 13px; font-weight: 600; animation: slideDownIn 0.4s ease forwards;
        `;
        animDiv.innerHTML = `
            <style>
                @keyframes slideDownIn { from { opacity: 0; transform: translateY(-30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes spinCircle { 100% { transform: rotate(360deg); } }
                .down-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(66, 133, 244, 0.25); border-top-color: #4285f4; border-radius: 50%; animation: spinCircle 0.8s linear infinite; }
            </style>
            <div class="down-spinner"></div>
            <div style="display:flex; flex-direction:column;">
                <span>Downloading...</span>
                <span style="font-size:10px; opacity:0.7; max-width:140px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${filename || "Media"}</span>
            </div>
        `;
        document.body.appendChild(animDiv);

        setTimeout(() => {
            animDiv.style.transition = "all 0.4s ease";
            animDiv.style.opacity = "0";
            animDiv.style.transform = "translateY(-20px) scale(0.9)";
            setTimeout(() => animDiv.remove(), 400);
        }, 3500);
    }

    // Gemini Engine with Full Safe Extraction
    async function geminiInfo() {
        let responseBox = document.getElementById("GeminiResponse");
        if (!responseBox) {
            responseBox = document.createElement("div");
            responseBox.id = "GeminiResponse";
            responseBox.style.cssText = `
                min-height: 80px; max-height: 380px; overflow-y: auto; width: calc(100% - 30px);
                margin: 10px auto; padding: 16px; border-radius: 20px; background: ${cardBg};
                border: 1px solid ${borderGlass}; backdrop-filter: blur(12px); color: ${c};
                font-size: 13.5px; line-height: 1.6;
            `;
            const mainDiv = document.getElementById("ytproMainDivE");
            if (mainDiv) mainDiv.after(responseBox);
            else document.body.appendChild(responseBox);
        }

        responseBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; font-weight:600;">
                <div style="width:14px; height:14px; border-radius:50%; background:linear-gradient(135deg, #4285f4, #9b72cb); animation:spinCircle 1s infinite linear;"></div>
                Analyzing video details with Gemini AI...
            </div>
        `;

        const vInfo = getVideoInfo();
        const cookies = typeof Android !== "undefined" && Android.getAllCookies ? Android.getAllCookies(window.location.href) : "";

        if (cookies.indexOf("__Secure-1PSID=") < 0) {
            responseBox.innerHTML = `
                <div style="text-align:center; padding: 10px;">
                    <p style="margin-bottom:12px; opacity:0.8;">Sign in to your Google account to use Gemini AI.</p>
                    <a href="https://accounts.google.com/ServiceLogin?service=youtube" style="display:inline-block; padding:8px 20px; border-radius:20px; background:${c}; color:${dc}; font-weight:600; text-decoration:none;">Sign In</a>
                </div>
            `;
            return;
        }

        let cookieHeader = cookies.split(";").filter(e => e.includes("__Secure-1PSID=") || e.includes("__Secure-1PSIDTS=")).join("; ");
        let promptTemplate = localStorage.getItem("prompt") || "Summary of {title} (ID: {videoId})";
        let promptFinal = promptTemplate.replaceAll("{title}", vInfo.title).replaceAll("{videoId}", vInfo.videoId).replaceAll("{url}", window.location.href);

        try {
            if (typeof Android !== "undefined" && Android.getSNlM0e) {
                Android.getSNlM0e(cookieHeader);
                GeminiAT = await callbackSNlM0e();
            }
            const payload = JSON.stringify([null, JSON.stringify([[promptFinal], null, null])]);
            const params = new URLSearchParams();
            params.append("f.req", payload);
            params.append("at", GeminiAT);

            const headers = JSON.stringify({
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "x-goog-ext-525001261-jspb": GeminiModels[localStorage.getItem("geminiModel")] || GeminiModels["3.0 Flash"],
                "cookie": cookieHeader,
                "Referer": "https://gemini.google.com/"
            });

            if (typeof Android !== "undefined" && Android.GeminiClient) {
                Android.GeminiClient("https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate", headers, params.toString());
                const res = await callbackGeminiClient();
                handleGeminiResponse(res);
            }
        } catch (err) {
            responseBox.innerHTML = `<div style="color:#ef4444;">Error generating response: ${err.message}</div>`;
        }
    }

    // Modern Settings Sheet
    function openSettings() {
        let existing = document.getElementById("settingsprodiv");
        if (existing) existing.remove();

        const wrapper = document.createElement("div");
        wrapper.id = "settingsprodiv";
        wrapper.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px);
            z-index: 99999999; display: flex; align-items: flex-end; justify-content: center;
        `;

        const panel = document.createElement("div");
        panel.style.cssText = `
            width: 100%; max-width: 480px; max-height: 85vh;
            background: ${bgGlass}; border: 1px solid ${borderGlass};
            border-radius: 28px 28px 0 0; padding: 22px 20px 30px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.5); overflow-y: auto;
            color: ${c}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:12px; background:linear-gradient(135deg, #FF0033, #FF4500); display:flex; align-items:center; justify-content:center; color:#fff;">
                        ${Icons.play}
                    </div>
                    <div>
                        <h2 style="font-size:18px; font-weight:700; margin:0;">YouTube Pro</h2>
                        <span style="font-size:11px; opacity:0.6;">v${YTProVer} • Next-Gen Studio</span>
                    </div>
                </div>
                <button id="closeSetBtn" style="background:transparent; border:0; color:${c}; opacity:0.6; padding:5px;">✕</button>
            </div>

            <!-- Quick Navigation -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
                <div id="btnGoDownload" style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:18px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <div style="color:#3b82f6;">${Icons.download}</div>
                    <span style="font-size:13px; font-weight:600;">Downloads</span>
                </div>
                <div id="btnGoLiked" style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:18px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <div style="color:#ec4899;">${Icons.heart}</div>
                    <span style="font-size:13px; font-weight:600;">Liked Videos</span>
                </div>
            </div>

            <!-- Toggle Items with Icons -->
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${renderToggleItem("bgplay", Icons.play, "Background Playback", "Notification controls enabled")}
                ${renderToggleItem("autoSpn", Icons.skip, "Auto-skip Sponsors", "Skip sponsor segments automatically")}
                ${renderToggleItem("gesC", Icons.hand, "Gesture Controls", "Brightness & volume swipes")}
                ${renderToggleItem("loopVideo", Icons.repeat, "Video Loop", "Auto repeat current video")}
                ${renderToggleItem("shorts", Icons.play, "Hide Shorts Feed", "Remove Shorts tab and shelf")}
                ${renderToggleItem("saveCInfo", Icons.sparkles, "Gemini Context Retention", "Remember previous AI chat history")}
                ${renderToggleItem("devMode", Icons.code, "Developer Mode", "Enable Eruda inspect console")}
            </div>
        `;

        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);

        wrapper.onclick = (e) => { if (e.target === wrapper) wrapper.remove(); };
        panel.querySelector("#closeSetBtn").onclick = () => wrapper.remove();
        panel.querySelector("#btnGoDownload").onclick = () => { wrapper.remove(); openDownloadHub(); };
        panel.querySelector("#btnGoLiked").onclick = () => { wrapper.remove(); window.location.hash = "#hearts"; };

        panel.querySelectorAll("[data-toggle-key]").forEach(el => {
            el.onclick = () => {
                const key = el.dataset.toggleKey;
                const cur = localStorage.getItem(key) === "true";
                localStorage.setItem(key, String(!cur));
                if (key === "bgplay" && typeof Android !== "undefined" && Android.setBgPlay) {
                    Android.setBgPlay(!cur);
                }
                openSettings();
            };
        });
    }

    function renderToggleItem(key, iconSvg, title, subtitle) {
        const val = localStorage.getItem(key) === "true";
        return `
            <div data-toggle-key="${key}" style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:16px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="opacity:0.85;">${iconSvg}</div>
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-size:13.5px; font-weight:600;">${title}</span>
                        <span style="font-size:11px; opacity:0.6;">${subtitle}</span>
                    </div>
                </div>
                <div style="width:42px; height:24px; border-radius:24px; background:${val ? "#3b82f6" : (isD ? "#333" : "#ccc")}; position:relative; transition:all 0.25s;">
                    <div style="width:18px; height:18px; border-radius:50%; background:#fff; position:absolute; top:3px; left:${val ? "21px" : "3px"}; transition:all 0.25s;"></div>
                </div>
            </div>
        `;
    }

    // Modern Download Page with Clear Data
    function openDownloadHub() {
        let existing = document.getElementById("outerdownytprodiv");
        if (existing) existing.remove();

        const vInfo = getVideoInfo();
        const wrapper = document.createElement("div");
        wrapper.id = "outerdownytprodiv";
        wrapper.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px);
            z-index: 99999999; display: flex; align-items: flex-end; justify-content: center;
        `;

        const sheet = document.createElement("div");
        sheet.style.cssText = `
            width: 100%; max-width: 480px; max-height: 85vh;
            background: ${bgGlass}; border: 1px solid ${borderGlass};
            border-radius: 28px 28px 0 0; padding: 22px 20px 30px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.5); overflow-y: auto;
            color: ${c}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        sheet.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:#3b82f6;">${Icons.download}</span>
                    <h3 style="font-size:17px; font-weight:700; margin:0;">Download Center</h3>
                </div>
                <button id="closeDownBtn" style="background:transparent; border:0; color:${c}; opacity:0.6; padding:5px;">✕</button>
            </div>

            <div style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:16px; padding:12px; margin-bottom:16px;">
                <span style="font-size:12px; font-weight:600; opacity:0.6; display:block; margin-bottom:4px;">Target Media</span>
                <p style="font-size:13px; font-weight:600; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${vInfo.title}</p>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
                <div id="btnDLVideo" style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:16px; padding:14px; text-align:center; cursor:pointer;">
                    <div style="font-size:14px; font-weight:700;">Full Video (MP4)</div>
                    <span style="font-size:11px; opacity:0.6;">Direct Video Stream</span>
                </div>
                <div id="btnDLAudio" style="background:${cardBg}; border:1px solid ${borderGlass}; border-radius:16px; padding:14px; text-align:center; cursor:pointer;">
                    <div style="font-size:14px; font-weight:700;">Audio Only (MP3)</div>
                    <span style="font-size:11px; opacity:0.6;">High Quality Audio</span>
                </div>
            </div>

            <!-- Clear Data Button at Bottom -->
            <div style="border-top:1px solid ${borderGlass}; padding-top:16px; margin-top:12px;">
                <button id="btnClearAppData" style="width:100%; border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.1); color:#ef4444; border-radius:16px; padding:12px; font-size:13.5px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;">
                    ${Icons.trash}
                    <span>Clear App Data & Cache</span>
                </button>
            </div>
        `;

        wrapper.appendChild(sheet);
        document.body.appendChild(wrapper);

        wrapper.onclick = (e) => { if (e.target === wrapper) wrapper.remove(); };
        sheet.querySelector("#closeDownBtn").onclick = () => wrapper.remove();

        sheet.querySelector("#btnDLVideo").onclick = () => {
            triggerDownloadAnimation(vInfo.title);
            if (typeof window.ytproSabrDownload === "function") window.ytproSabrDownload();
            else if (typeof Android !== "undefined" && Android.downvid) Android.downvid(vInfo.title + ".mp4", window.location.href, "video/mp4");
            wrapper.remove();
        };

        sheet.querySelector("#btnDLAudio").onclick = () => {
            triggerDownloadAnimation(vInfo.title + ".mp3");
            if (typeof Android !== "undefined" && Android.downvid) Android.downvid(vInfo.title + ".mp3", window.location.href, "audio/mp3");
            wrapper.remove();
        };

        sheet.querySelector("#btnClearAppData").onclick = () => {
            if (confirm("Clear all cache, custom prompt, and saved configurations?")) {
                localStorage.clear();
                window.location.reload();
            }
        };
    }

    // Attach Fast Action Buttons Under Player
    function attachModernActionButtons() {
        if (window.location.pathname.indexOf("watch") < 0) return;
        if (document.getElementById("ytproMainDivE")) return;

        const anchor = document.querySelector(".slim-video-action-bar-actions") || document.querySelector("ytm-slim-video-action-bar-renderer");
        if (!anchor) return;

        const bar = document.createElement("div");
        bar.id = "ytproMainDivE";
        bar.style.cssText = "display:flex; gap:8px; overflow-x:auto; padding:8px 14px; scrollbar-width:none; align-items:center; width:100%;";

        bar.innerHTML = `
            <div id="btnMainGemini" style="display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; background:linear-gradient(135deg, rgba(66,133,244,0.15), rgba(217,101,112,0.15)); border:1px solid rgba(155, 114, 203, 0.4); color:${c}; font-size:12.5px; font-weight:600; cursor:pointer; flex-shrink:0;">
                ${Icons.sparkles} <span>Gemini AI</span>
            </div>
            <div id="btnMainDownload" style="display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; background:${cardBg}; border:1px solid ${borderGlass}; color:${c}; font-size:12.5px; font-weight:600; cursor:pointer; flex-shrink:0;">
                ${Icons.download} <span>Download</span>
            </div>
            <div id="btnMainSettings" style="display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; background:${cardBg}; border:1px solid ${borderGlass}; color:${c}; font-size:12.5px; font-weight:600; cursor:pointer; flex-shrink:0;">
                ${Icons.settings} <span>Settings</span>
            </div>
        `;

        anchor.after(bar);
        bar.querySelector("#btnMainGemini").onclick = () => geminiInfo();
        bar.querySelector("#btnMainDownload").onclick = () => openDownloadHub();
        bar.querySelector("#btnMainSettings").onclick = () => openSettings();
    }

    // Core Observers & Dynamic Media Session Sync
    const coreObserver = new MutationObserver(() => {
        attachModernActionButtons();
        setupMediaSession();
        
        // Loop toggle support
        if (localStorage.getItem("loopVideo") === "true") {
            const vid = document.querySelector("video");
            if (vid && !vid.loop) vid.loop = true;
        }
    });

    coreObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("hashchange", () => {
        if (window.location.hash === "#download") openDownloadHub();
        if (window.location.hash === "#settings") openSettings();
    });
}