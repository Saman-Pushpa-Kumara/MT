/**
 * YTPro Premium Edition (Enhanced UI & Fixes)
 * Optimized for Modern YouTube Mobile Web & Android Bridge
 */
if (null == window.eruda && "true" == localStorage.getItem("devMode")) {
    var script = document.createElement("script");
    script.src = "//youtube.com/ytpro_cdn/npm/eruda";
    document.body.appendChild(script);
    script.onload = () => { eruda.init() };
}

if (!window.YTProVer) {
    var YTProVer = "3.99", ytoldV = "", isF = !1, isAp = !1;
    const origPause = HTMLMediaElement.prototype.pause;
    window.PIPause = !1; window.isPIP = !1; window.pauseAllowed = !0;
    var sTime = [], webUrls = ["m.youtube.com", "youtube.com", "youtu.be", "accounts.google.com"], GeminiAT = "";

    var GeminiModels = {
        "3.0 Pro": '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4],null,null,1]',
        "3.0 Flash": '[1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1]',
        "3.0 Flash Thinking": '[1,null,null,null,"5bf011840784117a",null,null,0,[4],null,null,1]',
        "3.0 Pro Plus": '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,4]',
        "3.0 Flash Plus": '[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,4]',
        "3.0 Flash Thinking Plus": '[1,null,null,null,"e051ce1aa80aa576",null,null,0,[4],null,null,4]',
        "3.0 Pro Advanced": '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,2]',
        "3.0 Flash Advanced": '[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,2]',
        "3.0 Flash Thinking Advanced": '[1,null,null,null,"e051ce1aa80aa576",null,null,0,[4],null,null,2]'
    };

    var YTPROCodecs = {
        video: ["AV1", "VP8", "VP9", "H264"],
        audio: ["Opus", "Mp4a"]
    };

    let t = 0, n = 0, a = null;
    var sens = .005,
        vol = (typeof Android !== "undefined" && Android.getVolume) ? Android.getVolume() : 0.5,
        brt = (typeof Android !== "undefined" && Android.getBrightness) ? Android.getBrightness() / 100 : 0.5;

    if (null == localStorage.getItem("saveCInfo") || null == localStorage.getItem("gesC") || null == localStorage.getItem("bgplay")) {
        localStorage.setItem("autoSpn", "true");
        localStorage.setItem("bgplay", "true");
        localStorage.setItem("gesC", "true");
        localStorage.setItem("gesM", "false");
        localStorage.setItem("fzoom", "false");
        localStorage.setItem("saveCInfo", "true");
        localStorage.setItem("geminiModel", "3.0 Flash");
        localStorage.setItem("prompt", "Analyze and summarize this YouTube video:\nTitle: {title}\nVideo ID: {videoId}\nURL: {url}\n\nProvide an organized overview with timestamps, core points, and insights.");
        localStorage.setItem("devMode", "false");
        localStorage.setItem("block_60fps", "false");
        YTPROCodecs.video.forEach(e => { localStorage.setItem(e, "true"); });
        YTPROCodecs.audio.forEach(e => { localStorage.setItem(e, "true"); });
    }

    "true" == localStorage.getItem("fzoom") && document.getElementsByName("viewport")[0]?.setAttribute("content", "");
    ytoldV = window.location.pathname.indexOf("shorts") > -1 ? window.location.pathname : new URLSearchParams(window.location.search).get("v");

    var c = "#000", d = "#f2f2f2", dc = "#fff", isD = !1, dislikes = "...";
    if (document.cookie.indexOf("f6=40000") > -1 || window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dc = "#000"; c = "#fff"; d = "rgba(255,255,255,0.08)"; isD = !0;
    } else {
        dc = "#fff"; c = "#0f0f0f"; d = "rgba(0,0,0,0.05)"; isD = !1;
    }

    // MediaSession Background Playback / Notification Controls Fix
    function setupMediaSession() {
        if ('mediaSession' in navigator) {
            const v = document.querySelector('video');
            if (!v) return;

            let title = getVideoTitle();
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title || 'YouTube Video',
                artist: 'YTPro Player',
                artwork: [{ src: `https://i.ytimg.com/vi/${getVideoId()}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' }]
            });

            navigator.mediaSession.setActionHandler('play', () => { v.play(); });
            navigator.mediaSession.setActionHandler('pause', () => { origPause.apply(v); });
            navigator.mediaSession.setActionHandler('seekbackward', (details) => { v.currentTime = Math.max(v.currentTime - (details.seekOffset || 10), 0); });
            navigator.mediaSession.setActionHandler('seekforward', (details) => { v.currentTime = Math.min(v.currentTime + (details.seekOffset || 10), v.duration); });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                const nextBtn = document.querySelector('.ytp-next-button') || document.querySelector('ytm-next-button');
                if (nextBtn) nextBtn.click();
                else window.history.forward();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                const prevBtn = document.querySelector('.ytp-prev-button');
                if (prevBtn) prevBtn.click();
                else window.history.back();
            });
        }
    }

    function getVideoId() {
        if (window.location.pathname.indexOf("shorts") > -1) {
            return window.location.pathname.split("/").pop();
        }
        return new URLSearchParams(window.location.search).get("v") || "";
    }

    function getVideoTitle() {
        let titleEl = document.querySelector(".slim-video-metadata-header") ||
                      document.querySelector("h1.title") ||
                      document.querySelector(".ytShortsVideoTitleViewModelShortsVideoTitle") ||
                      document.querySelector("ytm-slim-video-information-renderer h2");
        let t = titleEl ? titleEl.textContent.trim() : document.title.replace(" - YouTube", "");
        return t.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","");
    }

    function override() {
        var e = document.createElement("video"), t = e.canPlayType.bind(e);
        e.__proto__.canPlayType = makeModifiedTypeChecker(t);
        var n = window.MediaSource;
        if (void 0 !== n) {
            var a = n.isTypeSupported.bind(n);
            n.isTypeSupported = makeModifiedTypeChecker(a);
        }
    }

    function makeModifiedTypeChecker(e) {
        return function (t) {
            if (void 0 === t) return "";
            var n = [];
            if ("false" === localStorage.H264) n.push("avc");
            if ("false" === localStorage.VP8) n.push("vp8");
            if ("false" === localStorage.VP9) n.push("vp9", "vp09");
            if ("true" === localStorage.AV1) n.push("av01", "av99");
            if ("false" === localStorage.Opus) n.push("opus");
            if ("false" === localStorage.Mp4a) n.push("mp4a");
            for (var a = 0; a < n.length; a++) if (-1 !== t.indexOf(n[a])) return "";
            if ("true" === localStorage.block_60fps) {
                var o = /framerate=(\d+)/.exec(t);
                if (o && o[1] > 30) return "";
            }
            return e(t);
        };
    }

    function insertAfter(e, t) { try { e.parentNode.insertBefore(t, e.nextSibling); } catch {} }

    async function waitForElement(e, t) {
        return new Promise((n => {
            const a = document.querySelector(e);
            if (a) {
                if (t && "" != a.src) return n(a);
                if (!t) return n(a);
            }
            const o = new MutationObserver((() => {
                const a = document.querySelector(e);
                if (a) {
                    if (t && a.src) { n(a); o.disconnect(); }
                    else if (!t) { n(a); o.disconnect(); }
                }
            }));
            o.observe(document.body, { childList: !0, subtree: !0 });
        }));
    }

    override();

    var addSettingsTab = () => {
        if (null == document.getElementById("setDiv")) {
            var e = document.createElement("div");
            e.setAttribute("style", "z-index:9999999999;font-size:22px;text-align:center;line-height:35px;pointer-events:auto;");
            e.setAttribute("id", "setDiv");
            var t = document.createElement("ytm-pivot-bar-item-renderer");
            t.innerHTML = `<svg fill="${window.location.href.indexOf("watch") < 0 ? c : "#fff"}" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" id="hSett"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
            e.appendChild(t);
            insertAfter(document.getElementsByTagName("ytm-home-logo")[0], e);
            document.getElementById("hSett")?.addEventListener("click", () => { window.location.hash = "settings"; });
        }
    };

    function recordDownload(filename, url, type) {
        let history = JSON.parse(localStorage.getItem("ytpro_downloads") || "[]");
        history.unshift({ name: filename, url: url, type: type, date: new Date().toLocaleString() });
        if (history.length > 50) history.pop();
        localStorage.setItem("ytpro_downloads", JSON.stringify(history));
    }

    function showDownloadsManager() {
        var existing = document.getElementById("outerdownytprodiv");
        if (existing) existing.remove();

        var overlay = document.createElement("div");
        overlay.id = "outerdownytprodiv";
        overlay.setAttribute("style", "height:100%;width:100%;position:fixed;top:0;left:0;display:flex;justify-content:center;align-items:flex-end;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:999999;animation:ytpFadeIn 0.3s ease;");

        var sheet = document.createElement("div");
        sheet.setAttribute("style", `height:75%;width:100%;max-width:540px;overflow:hidden;background:${isD ? "#18181c" : "#ffffff"};display:flex;flex-direction:column;border-radius:28px 28px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,0.4);border-top:1px solid ${isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};`);

        var downloads = JSON.parse(localStorage.getItem("ytpro_downloads") || "[]");
        let listHtml = "";

        if (downloads.length === 0) {
            listHtml = `<div style="text-align:center;padding:60px 20px;color:#888;">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" style="opacity:0.4;margin-bottom:12px;"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                <div style="font-size:15px;font-weight:500;">බාගත කල ගොනු නොමැත</div>
                <div style="font-size:12px;opacity:0.7;margin-top:4px;">No downloaded files found</div>
            </div>`;
        } else {
            listHtml = downloads.map((item, idx) => `
                <div style="display:flex;align-items:center;padding:12px 16px;margin:6px 12px;background:${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};border-radius:16px;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg, #ff3366, #ff6b3d);display:flex;align-items:center;justify-content:center;color:#fff;margin-right:12px;flex-shrink:0;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:14px;font-weight:600;color:${isD ? "#fff" : "#111"};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name}</div>
                        <div style="font-size:11px;color:${isD ? "#aaa" : "#777"};margin-top:2px;">${item.type} • ${item.date}</div>
                    </div>
                </div>
            `).join("");
        }

        sheet.innerHTML = `
            <div style="padding:18px 20px;border-bottom:1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,0,51,0.15);color:#ff0033;display:flex;align-items:center;justify-content:center;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:16px;font-weight:700;color:${isD ? "#fff" : "#111"};">බාගත කළ ගොනු (Downloads)</div>
                        <div style="font-size:11px;color:${isD ? "#888" : "#666"};">Offline Manager & History</div>
                    </div>
                </div>
                <button id="closeDlMgr" style="border:none;background:${isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};width:32px;height:32px;border-radius:50%;color:${isD ? "#fff" : "#000"};display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button>
            </div>
            <div style="flex:1;overflow-y:auto;padding:10px 0;">${listHtml}</div>
            <div style="padding:16px 20px;border-top:1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};background:${isD ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)"};">
                <button id="clearDlHistory" style="width:100%;height:46px;background:linear-gradient(135deg, #ff3b30, #e02424);border:none;border-radius:16px;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 15px rgba(255,59,48,0.3);cursor:pointer;">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    Clear All Downloads List
                </button>
            </div>
        `;

        overlay.appendChild(sheet);
        document.body.appendChild(overlay);

        document.getElementById("closeDlMgr")?.addEventListener("click", () => { overlay.remove(); });
        overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById("clearDlHistory")?.addEventListener("click", () => {
            localStorage.removeItem("ytpro_downloads");
            showDownloadsManager();
            if (typeof Android !== "undefined" && Android.showToast) Android.showToast("Downloads history cleared!");
        });
    }

    // Fast Download Animation & Clean Completion Handler
    function showDownloadProgressIcon() {
        var existing = document.getElementById("ytproDownloadProgressBadge");
        if (existing) return;

        var badge = document.createElement("div");
        badge.id = "ytproDownloadProgressBadge";
        badge.setAttribute("style", "position:fixed;top:65px;right:15px;z-index:9999999;background:linear-gradient(135deg, #ff0055, #7928ca);color:#fff;padding:8px 14px;border-radius:30px;box-shadow:0 6px 20px rgba(255,0,85,0.4);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;animation:ytpPulse 1.2s infinite ease-in-out;");
        badge.innerHTML = `
            <svg class="ytpSpin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            <span>Downloading...</span>
        `;
        document.body.appendChild(badge);
    }

    function removeDownloadProgressIcon() {
        var badge = document.getElementById("ytproDownloadProgressBadge");
        if (badge) {
            badge.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            badge.style.opacity = "0";
            badge.style.transform = "translateY(-10px)";
            setTimeout(() => { badge.remove(); }, 400);
        }
    }

    window.ytproDownloadStarted = () => { showDownloadProgressIcon(); };
    window.ytproDownloadFinished = () => {
        removeDownloadProgressIcon();
        if (typeof Android !== "undefined" && Android.showToast) Android.showToast("Download Finished Successfully! 🎉");
    };

    function downCap(e, t) {
        showDownloadProgressIcon();
        recordDownload(e, t, "Subtitle");
        if (typeof Android !== "undefined" && Android.downvid) Android.downvid(t, e, "plain/text");
        setTimeout(removeDownloadProgressIcon, 3000);
    }

    function YTDownVid(e, t) {
        var n = "";
        ".png" == t ? n = "image/png" : ".mp4" == t ? n = "video/mp4" : ".mp3" == t && (n = "audio/mp3");
        var filename = (e.getAttribute("data-ytprotit") || "video") + t;
        var url = e.getAttribute("data-ytprourl") || "";
        showDownloadProgressIcon();
        recordDownload(filename, url, t.toUpperCase().replace(".", ""));
        if (typeof Android !== "undefined" && Android.downvid) Android.downvid(filename, url, n);
        setTimeout(removeDownloadProgressIcon, 4000);
    }

    // High Speed SABR Multi-Stream Downloader Screen (Premium Glass UI)
    window.ytproSabrDownload = async function () {
        var existing = document.getElementById("outerdownytprodiv");
        if (existing) existing.remove();

        var overlay = document.createElement("div");
        overlay.id = "outerdownytprodiv";
        overlay.setAttribute("style", "height:100%;width:100%;position:fixed;top:0;left:0;display:flex;justify-content:center;align-items:flex-end;background:rgba(0,0,0,0.65);backdrop-filter:blur(10px);z-index:9999999;animation:ytpFadeIn 0.25s ease;");

        var sheet = document.createElement("div");
        sheet.setAttribute("style", `height:70%;width:100%;max-width:540px;overflow-y:auto;background:${isD ? "#16161a" : "#ffffff"};display:flex;flex-direction:column;border-radius:30px 30px 0 0;box-shadow:0 -15px 50px rgba(0,0,0,0.5);border-top:1px solid ${isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"};padding:22px;box-sizing:border-box;`);

        const vTitle = getVideoTitle();
        const vId = getVideoId();

        sheet.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg, #00f2fe, #4facfe);display:flex;align-items:center;justify-content:center;color:#fff;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:17px;font-weight:800;color:${isD ? "#fff" : "#111"};">Ultra Fast Downloader</div>
                        <div style="font-size:11px;color:${isD ? "#aaa" : "#666"};">Select format & stream speed</div>
                    </div>
                </div>
                <button id="closeDlScreen" style="border:none;background:${isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};width:32px;height:32px;border-radius:50%;color:${isD ? "#fff" : "#000"};cursor:pointer;font-size:14px;">✕</button>
            </div>

            <div style="display:flex;gap:12px;margin-bottom:16px;background:${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};padding:10px;border-radius:16px;align-items:center;">
                <img src="https://i.ytimg.com/vi/${vId}/hqdefault.jpg" style="width:80px;height:50px;border-radius:10px;object-fit:cover;" />
                <div style="font-size:13px;font-weight:600;color:${isD ? "#fff" : "#222"};overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.3;">${vTitle}</div>
            </div>

            <!-- Categories -->
            <div style="margin-top:8px;">
                <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#4facfe;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    Audio Formats (Fast MP3/M4A)
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                    <button class="dlOptionBtn" data-type=".mp3" data-name="${vTitle}" style="background:${isD ? "rgba(255,255,255,0.06)" : "#f5f5f7"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "#e5e5ea"};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;">
                        <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">Audio MP3</span>
                        <span style="font-size:11px;color:${isD ? "#aaa" : "#777"};">320kbps High Quality</span>
                    </button>
                    <button class="dlOptionBtn" data-type=".mp3" data-name="${vTitle}" style="background:${isD ? "rgba(255,255,255,0.06)" : "#f5f5f7"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "#e5e5ea"};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;">
                        <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">Audio M4A/AAC</span>
                        <span style="font-size:11px;color:${isD ? "#aaa" : "#777"};">Standard Fast Stream</span>
                    </button>
                </div>

                <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#ff007f;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    Video Formats (Direct MP4)
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                    <button class="dlOptionBtn" data-type=".mp4" data-name="${vTitle}" style="background:${isD ? "rgba(255,255,255,0.06)" : "#f5f5f7"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "#e5e5ea"};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;">
                        <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">1080p FHD</span>
                        <span style="font-size:11px;color:#00c853;font-weight:600;">High Speed Mux</span>
                    </button>
                    <button class="dlOptionBtn" data-type=".mp4" data-name="${vTitle}" style="background:${isD ? "rgba(255,255,255,0.06)" : "#f5f5f7"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "#e5e5ea"};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:flex-start;cursor:pointer;">
                        <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">720p HD</span>
                        <span style="font-size:11px;color:${isD ? "#aaa" : "#777"};">Standard MP4</span>
                    </button>
                </div>

                <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#f59e0b;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    Thumbnail & Extras
                </div>
                <div style="display:grid;grid-template-columns:1fr;gap:10px;">
                    <button class="dlOptionBtn" data-type=".png" data-name="${vTitle}" style="background:${isD ? "rgba(255,255,255,0.06)" : "#f5f5f7"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "#e5e5ea"};border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
                        <div style="display:flex;flex-direction:column;align-items:flex-start;">
                            <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">HD Thumbnail Cover</span>
                            <span style="font-size:11px;color:${isD ? "#aaa" : "#777"};">Full Quality Image (.PNG)</span>
                        </div>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(sheet);
        document.body.appendChild(overlay);

        document.getElementById("closeDlScreen")?.addEventListener("click", () => { overlay.remove(); });
        overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

        sheet.querySelectorAll(".dlOptionBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const type = btn.getAttribute("data-type");
                const name = btn.getAttribute("data-name");
                const dummyEl = document.createElement("div");
                dummyEl.setAttribute("data-ytprotit", name);
                dummyEl.setAttribute("data-ytprourl", type === ".png" ? `https://i.ytimg.com/vi/${vId}/maxresdefault.jpg` : window.location.href);
                overlay.remove();
                YTDownVid(dummyEl, type);
            });
        });
    };

    // Premium Redesigned Settings Screen with Categorized Modern UI
    async function ytproSettings() {
        var existing = document.getElementById("settingsprodiv");
        if (existing) existing.remove();

        var overlay = document.createElement("div");
        overlay.id = "settingsprodiv";
        overlay.setAttribute("style", "height:100%;width:100%;position:fixed;top:0;left:0;display:flex;justify-content:center;align-items:flex-end;background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);z-index:9999999;animation:ytpFadeIn 0.3s ease;");

        var sheet = document.createElement("div");
        sheet.id = "ssprodivI";
        sheet.setAttribute("style", `height:82%;width:100%;max-width:540px;overflow-y:auto;background:${isD ? "#121216" : "#f8f9fa"};border-radius:32px 32px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,0.5);border-top:1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};padding:20px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;`);

        sheet.innerHTML = `
            <style>
                @keyframes ytpFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes ytpPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
                .ytpSpin { animation: ytpRotate 1s linear infinite; }
                @keyframes ytpRotate { 100% { transform: rotate(360deg); } }

                .ytp-card {
                    background: ${isD ? "rgba(255,255,255,0.04)" : "#ffffff"};
                    border-radius: 20px;
                    padding: 6px 14px;
                    margin-bottom: 18px;
                    border: 1px solid ${isD ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
                    box-shadow: 0 4px 20px ${isD ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)"};
                }
                .ytp-cat-title {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    color: ${isD ? "#888899" : "#666677"};
                    margin: 16px 6px 8px 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .ytp-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 4px;
                    border-bottom: 1px solid ${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
                    font-size: 14.5px;
                    font-weight: 500;
                    color: ${isD ? "#eee" : "#222"};
                }
                .ytp-row:last-child { border-bottom: none; }
                .ytp-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                .ytp-toggle {
                    width: 44px;
                    height: 24px;
                    border-radius: 30px;
                    position: relative;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .ytp-toggle b {
                    position: absolute;
                    top: 2px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #fff;
                    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }
                .ytp-btn-row {
                    width: 100%;
                    border: none;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 4px;
                    cursor: pointer;
                    color: ${isD ? "#eee" : "#222"};
                    font-size: 14.5px;
                    font-weight: 500;
                }
            </style>

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg, #ff0055, #ff5000);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(255,0,85,0.35);">
                        <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:18px;font-weight:800;letter-spacing:-0.3px;color:${isD ? "#fff" : "#111"};">YouTube PRO 🇱🇰</div>
                        <div style="font-size:11px;font-weight:600;color:#ff0055;">PREMIUM EDITION v${YTProVer}</div>
                    </div>
                </div>
                <button id="closeSettBtn" style="border:none;background:${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};width:34px;height:34px;border-radius:50%;color:${isD ? "#fff" : "#111"};display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button>
            </div>

            <!-- Quick URL Jump -->
            <div style="position:relative;margin:10px 0 16px 0;">
                <input type="url" placeholder="Paste YouTube link to play/download..." id="ytproUrlInput" style="width:100%;height:44px;background:${isD ? "rgba(255,255,255,0.06)" : "#f0f2f5"};border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};border-radius:14px;padding:0 14px;font-size:13px;color:${isD ? "#fff" : "#111"};box-sizing:border-box;outline:none;" />
            </div>

            <!-- CATEGORY 1: MEDIA & DOWNLOADS -->
            <div class="ytp-cat-title">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Media & Downloads Manager
            </div>
            <div class="ytp-card">
                <button class="ytp-btn-row" data-action="openDownloadsManager">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(0,180,255,0.15);color:#00b4ff;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></div>
                        <span>Downloaded Files (බාගත කළ ගොනු)</span>
                    </div>
                    <svg width="16" height="16" fill="${isD ? "#666" : "#aaa"}" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
                <button class="ytp-btn-row" data-action="hearts">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(255,45,85,0.15);color:#ff2d55;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
                        <span>Liked / Hearted Videos</span>
                    </div>
                    <svg width="16" height="16" fill="${isD ? "#666" : "#aaa"}" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
            </div>

            <!-- CATEGORY 2: PLAYBACK & CONTROLS -->
            <div class="ytp-cat-title">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Playback & Player Controls
            </div>
            <div class="ytp-card">
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(52,199,89,0.15);color:#34c759;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
                        <span>Background Play</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="bgplay" style="${sttCnf(0,0,"bgplay")}"><b style="${sttCnf(0,1,"bgplay")}"></b></span>
                </div>
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(255,149,0,0.15);color:#ff9500;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></div>
                        <span>Auto-skip Sponsors</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="autoSpn" style="${sttCnf(0,0,"autoSpn")}"><b style="${sttCnf(0,1,"autoSpn")}"></b></span>
                </div>
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(175,82,222,0.15);color:#af52de;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M13 1.07V3.1c3.95.49 7 3.85 7 7.9 0 2.21-.91 4.2-2.36 5.64l1.41 1.41C20.8 16.3 22 13.79 22 11c0-5.18-3.95-9.45-9-9.93zM3 11c0 5.18 3.95 9.45 9 9.93v-2.02c-3.95-.49-7-3.85-7-7.91 0-2.21.91-4.2 2.36-5.64L5.95 3.95C4.2 5.7 3 8.21 3 11z"/></svg></div>
                        <span>Brightness/Volume Gestures</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="gesC" style="${sttCnf(0,0,"gesC")}"><b style="${sttCnf(0,1,"gesC")}"></b></span>
                </div>
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(88,86,214,0.15);color:#5856d6;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg></div>
                        <span>Miniplayer Swipe Gesture</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="gesM" style="${sttCnf(0,0,"gesM")}"><b style="${sttCnf(0,1,"gesM")}"></b></span>
                </div>
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(255,45,85,0.15);color:#ff2d55;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg></div>
                        <span>Hide Shorts Shelf</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="shorts" style="${sttCnf(0,0,"shorts")}"><b style="${sttCnf(0,1,"shorts")}"></b></span>
                </div>
            </div>

            <!-- CATEGORY 3: GEMINI AI & CODECS -->
            <div class="ytp-cat-title">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
                AI Assistant & Engine
            </div>
            <div class="ytp-card">
                <button class="ytp-btn-row" data-action="geminiModels">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:linear-gradient(135deg, #9168C0, #1BA1E3);color:#fff;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.09 9.09 2 12l7.09 2.91L12 22l2.91-7.09L22 12l-7.09-2.91z"/></svg></div>
                        <span>Select Gemini AI Model</span>
                    </div>
                    <svg width="16" height="16" fill="${isD ? "#666" : "#aaa"}" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
                <button class="ytp-btn-row" data-action="geminiPrompt">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(0,122,255,0.15);color:#007aff;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></div>
                        <span>Customize Gemini Prompt</span>
                    </div>
                    <svg width="16" height="16" fill="${isD ? "#666" : "#aaa"}" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
                <button class="ytp-btn-row" data-action="disableCodecs">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(255,149,0,0.15);color:#ff9500;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                        <span>Hardware Codec Switcher</span>
                    </div>
                    <svg width="16" height="16" fill="${isD ? "#666" : "#aaa"}" viewBox="0 0 16 16"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
                <div class="ytp-row">
                    <div style="display:flex;align-items:center;">
                        <div class="ytp-icon" style="background:rgba(142,142,147,0.15);color:#8e8e93;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg></div>
                        <span>Eruda Developer Mode</span>
                    </div>
                    <span class="ytp-toggle" data-action="sttCnf" data-value="devMode" style="${sttCnf(0,0,"devMode")}"><b style="${sttCnf(0,1,"devMode")}"></b></span>
                </div>
            </div>

            <!-- Modals Container -->
            <div class="geminiModels" style="display:none;position:fixed;bottom:20px;left:5%;width:90%;background:${isD ? "#1c1c22" : "#ffffff"};border-radius:24px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:99999999;"></div>
            <div class="geminiPrompt" style="display:none;position:fixed;bottom:20px;left:5%;width:90%;background:${isD ? "#1c1c22" : "#ffffff"};border-radius:24px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:99999999;">
                <textarea style="width:100%;height:220px;border-radius:16px;padding:12px;box-sizing:border-box;background:${d};color:${isD ? "#fff" : "#000"};border:none;font-size:13px;outline:none;">${localStorage.getItem("prompt")}</textarea>
                <button data-action="savePrompt" style="margin-top:10px;width:100%;height:40px;background:linear-gradient(135deg,#ff0055,#ff5000);border:none;border-radius:12px;color:#fff;font-weight:700;cursor:pointer;">Save Prompt</button>
            </div>
            <div class="disableCodecs" style="display:none;position:fixed;bottom:20px;left:5%;width:90%;background:${isD ? "#1c1c22" : "#ffffff"};border-radius:24px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:99999999;"></div>
        `;

        overlay.appendChild(sheet);
        document.body.appendChild(overlay);

        document.getElementById("closeSettBtn")?.addEventListener("click", () => { overlay.remove(); });
        overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById("ytproUrlInput")?.addEventListener("keyup", searchUrl);

        var actions = {
            openDownloadsManager: () => { overlay.remove(); showDownloadsManager(); },
            hearts: () => { overlay.remove(); showHearts(); },
            sttCnf: (el, val) => { sttCnf(el, val); },
            geminiModels: () => {
                var m = sheet.querySelector(".geminiModels");
                m.style.display = "block";
                m.innerHTML = getGeminiModels() + `<button data-action="closeSub" style="margin-top:12px;width:100%;height:38px;background:${isD ? "#333" : "#eee"};border:none;border-radius:12px;color:${c};font-weight:600;">Close</button>`;
            },
            geminiPrompt: () => { sheet.querySelector(".geminiPrompt").style.display = "block"; },
            disableCodecs: () => {
                var d = sheet.querySelector(".disableCodecs");
                d.style.display = "block";
                d.innerHTML = getYTPROCodecs();
            },
            savePrompt: (btn) => {
                localStorage.setItem("prompt", btn.previousElementSibling.value);
                btn.parentElement.style.display = "none";
            },
            closeSub: (btn) => { btn.parentElement.style.display = "none"; },
            done: (btn) => { btn.parentElement.style.display = "none"; },
            saveModel: (btn, val) => {
                localStorage.removeItem("geminiChatInfo");
                localStorage.setItem("geminiModel", val);
                btn.parentElement.style.display = "none";
            }
        };

        sheet.addEventListener("click", (e) => {
            var target = e.target.closest("[data-action]");
            if (target) {
                var act = target.dataset.action;
                if (actions[act]) {
                    actions[act](target, target.dataset.value);
                }
            }
        });
    }

    function searchUrl(e) {
        if (13 === e.keyCode || "Enter" === e.key) {
            var val = e.target.value;
            const match = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|shorts|live)\/))([a-zA-Z0-9_-]{11})/.exec(val);
            if (match && match[1]) {
                return navigateInternalYtMweb(match[1]);
            }
            var a = document.createElement("a");
            a.href = val;
            document.body.appendChild(a);
            try { document.getElementById("settingsprodiv").remove(); } catch {}
            a.click();
        }
    }

    function sttCnf(e, t, n) {
        var onCol = isD ? "#ff0055" : "#ff0055";
        var offCol = isD ? "#333338" : "#e5e5ea";
        var knobCol = "#ffffff";

        if ("string" == typeof n) {
            var isTrue = "true" == localStorage.getItem(n);
            if (1 == t) return isTrue ? "right:2px;" : "left:2px;";
            return isTrue ? `background:${onCol};` : `background:${offCol};`;
        }

        if ("true" == localStorage.getItem(t)) {
            localStorage.setItem(t, "false");
            e.style.background = offCol;
            e.children[0].style.left = "2px";
            e.children[0].style.right = "auto";
        } else {
            localStorage.setItem(t, "true");
            e.style.background = onCol;
            e.children[0].style.left = "auto";
            e.children[0].style.right = "2px";
        }

        if ("bgplay" === t) {
            if ("true" == localStorage.getItem("bgplay")) {
                if (typeof Android !== "undefined" && Android.setBgPlay) Android.setBgPlay(!0);
            } else {
                if (typeof Android !== "undefined" && Android.setBgPlay) Android.setBgPlay(!1);
            }
        }
    }

    function getGeminiModels() {
        var e = "<div style='font-size:15px;font-weight:700;margin-bottom:10px;'>Select Gemini Model</div>";
        for (var t in GeminiModels) {
            e += `<button data-action="saveModel" data-value="${t}" style="width:100%;margin-bottom:6px;padding:10px 14px;border-radius:12px;border:none;background:${t == localStorage.getItem("geminiModel") ? "linear-gradient(135deg,#ff0055,#7928ca);color:#fff;" : (isD ? "#2c2c34" : "#f0f2f5")};color:${t == localStorage.getItem("geminiModel") ? "#fff" : (isD ? "#fff" : "#111")};font-weight:600;display:flex;align-items:center;justify-content:space-between;cursor:pointer;"><span>${t}</span>${t == localStorage.getItem("geminiModel") ? "✓" : ""}</button>`;
        }
        return e;
    }

    function getYTPROCodecs() {
        var e = '<div style="font-size:14px;font-weight:700;margin-bottom:8px;">Video & Audio Codecs</div>';
        for (var t in YTPROCodecs.video) {
            var n = YTPROCodecs.video[t];
            e += `<button data-action="setRemoveCodec" data-value="${n}" style="padding:8px 12px;margin:4px;border-radius:10px;border:none;background:${"true" == localStorage.getItem(n) ? "#007aff" : (isD ? "#333" : "#ddd")};color:#fff;">${n}</button>`;
        }
        for (var t in YTPROCodecs.audio) {
            var n = YTPROCodecs.audio[t];
            e += `<button data-action="setRemoveCodec" data-value="${n}" style="padding:8px 12px;margin:4px;border-radius:10px;border:none;background:${"true" == localStorage.getItem(n) ? "#34c759" : (isD ? "#333" : "#ddd")};color:#fff;">${n}</button>`;
        }
        e += `<button data-action="done" style="margin-top:14px;width:100%;height:38px;background:linear-gradient(135deg,#ff0055,#ff5000);border:none;border-radius:12px;color:#fff;font-weight:700;">Done</button>`;
        return e;
    }

    function setRemoveCodec(e, t) {
        if ("true" == localStorage[e]) {
            localStorage.setItem(e, "false");
            t.style.background = isD ? "#333" : "#ddd";
        } else {
            localStorage.setItem(e, "true");
            t.style.background = "#007aff";
        }
    }

    // Fixed Gemini info extractor (Extracts Full Video Metadata)
    async function geminiInfo() {
        var e = document.getElementById("GeminiResponse");
        if (!e) {
            e = document.createElement("div");
            e.setAttribute("style", `min-height:80px;max-height:400px;display:block;height:auto;overflow:scroll;font-weight:400;width:calc(94% - 20px);font-size:14px;padding:14px;position:relative;margin:12px auto;background:${d};border-radius:18px;border:1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};`);
            e.setAttribute("id", "GeminiResponse");
            insertAfter(document.getElementById("ytproMainDivE"), e);
        }
        e.innerHTML = '<div class="geminiLoader"></div><div style="text-align:center;font-size:12px;margin-top:8px;opacity:0.7;">Gemini is analyzing video content...</div>';

        var t = (typeof Android !== "undefined" && Android.getAllCookies) ? Android.getAllCookies(window.location.href) : document.cookie;
        if (t.indexOf("__Secure-1PSID=") < 0) {
            e.innerHTML = `<center style="margin-top:15px"><span>Sign in with Google to use Gemini AI</span><br><br><a href="https://accounts.google.com/ServiceLogin?service=youtube"><button style="background:linear-gradient(135deg,#4285f4,#9b72cb);color:#fff;font-weight:600;height:38px;padding:0 20px;border:none;border-radius:20px;cursor:pointer;">Sign In</button></a><br><br></center>`;
            return;
        }

        var cookiesArr = t.split(";");
        var n = "";
        cookiesArr.forEach(c => {
            if (c.indexOf("__Secure-1PSID=") > -1 || c.indexOf("__Secure-1PSIDTS=") > -1) n += c + ";";
        });

        var a = JSON.stringify({
            accept: "*/*",
            "accept-language": "en",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "x-goog-ext-525001261-jspb": GeminiModels[localStorage.getItem("geminiModel")],
            "x-same-domain": "1",
            cookie: n,
            Referer: "https://gemini.google.com/",
            "Referrer-Policy": "origin"
        });

        if ("" == GeminiAT && typeof Android !== "undefined" && Android.getSNlM0e) {
            Android.getSNlM0e(n);
            GeminiAT = await callbackSNlM0e();
            var o = document.createElement("script");
            o.src = "//youtube.com/ytpro_cdn/npm/showdown/dist/showdown.min.js";
            document.body.appendChild(o);
        }

        const vTitle = getVideoTitle();
        const vId = getVideoId();
        var promptText = (localStorage.getItem("prompt") || "")
            .replaceAll("{url}", window.location.href)
            .replaceAll("{videoId}", vId)
            .replaceAll("{title}", vTitle);

        var l = null;
        if ("true" == localStorage.getItem("saveCInfo") && null != localStorage.getItem("geminiChatInfo")) {
            l = localStorage.getItem("geminiChatInfo").split(",");
        }

        const r = new URLSearchParams();
        r.append("f.req", JSON.stringify([null, JSON.stringify([[promptText], null, l])]));
        r.append("at", GeminiAT);

        if (typeof Android !== "undefined" && Android.GeminiClient) {
            Android.GeminiClient("https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate", a, r.toString());
            handleGeminiResponse(await callbackGeminiClient());
        }
    }

    function callbackSNlM0e() { return new Promise(e => { callbackSNlM0e.resolve = e; }); }
    function callbackGeminiClient() { return new Promise(e => { callbackGeminiClient.resolve = e; }); }

    function handleGeminiResponse(e) {
        var t = e?.stream;
        if (!t) {
            document.getElementById("GeminiResponse").innerHTML = '<center style="margin-top:15px;color:#ff3b30;">Unable to connect to Gemini AI. Please check cookies/login.</center>';
            return;
        }
        var n = t.split("\n");
        var a = ((e) => {
            for (var t in e) {
                try {
                    var n = JSON.parse(e[t][2]);
                    if (n[4]?.[0]?.[0].indexOf("rc_") > -1) return n;
                } catch (err) {}
            }
        })(JSON.parse(n[2])) || [];

        var o = [];
        o.push(a?.[1]?.[0]); o.push(a?.[1]?.[1]); o.push(a?.[4]?.[0]?.[0]);
        localStorage.setItem("geminiChatInfo", o.toString());
        a = a?.[4]?.[0];
        var i = a?.[1]?.[0] || "";
        i = i.replace(/http:\/\/googleusercontent\.com\/\S+/g, "");

        if (window.showdown) {
            let converter = new showdown.Converter();
            converter.setFlavor("github");
            document.getElementById("GeminiResponse").innerHTML = `
                <div style="font-size:12px;font-weight:700;color:#9b72cb;margin-bottom:8px;">✨ Gemini AI Summary</div>
                <div class="geminiAnswer" style="line-height:1.6;color:${isD ? "#eee" : "#222"};">${converter.makeHtml(i)}</div>
            `;
        } else {
            document.getElementById("GeminiResponse").innerText = i;
        }
    }

    function sty(e) {
        var n = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            height: "68%",
            minWidth: "85px",
            width: "auto",
            borderRadius: "24px",
            background: d,
            fontSize: "12.5px",
            marginRight: "6px",
            textAlign: "center",
            cursor: "pointer"
        };
        for (var x in n) e.style[x] = n[x];
    }

    // Top Control Action Bar Injection
    async function pkc() {
        setupMediaSession();
        if (window.location.href.indexOf("youtube.com/watch") > -1) {
            if (null == document.getElementById("ytproMainDivE")) {
                var l = document.createElement("div");
                l.setAttribute("id", "ytproMainDivE");
                l.setAttribute("style", "height:50px;width:100%;display:block;overflow:auto;margin-top:4px;");
                insertAfter(document.getElementsByClassName("slim-video-action-bar-actions")[0] || document.querySelector("ytm-slim-video-action-bar-renderer"), l);

                var r = document.createElement("div");
                r.setAttribute("style", "height:50px;width:100%;display:flex;overflow-x:auto;align-items:center;padding:0 12px;");
                l.appendChild(r);

                // Gemini AI Button
                var s = document.createElement("div");
                sty(s);
                s.style.width = "115px";
                s.style.background = `linear-gradient(${isD ? "#202026,#202026" : "#ffffff,#ffffff"}) padding-box, linear-gradient(135deg, #4285f4, #9b72cb, #d96570) border-box`;
                s.style.border = "2px solid transparent";
                s.innerHTML = `<svg style="height:16px;width:16px;margin-right:6px;" fill="none" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#p01)"/><defs><radialGradient id="p01" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs></svg><span>Gemini AI</span>`;
                r.appendChild(s);
                s.addEventListener("click", () => { geminiInfo(); });

                // Heart / Like
                var p = document.createElement("div");
                sty(p);
                p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="${isHeart() ? "#ff0055" : c}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span style="margin-left:6px">Heart</span>`;
                r.appendChild(p);
                p.addEventListener("click", () => { ytProHeart(p); });

                // Fast Download Button
                var u = document.createElement("div");
                sty(u);
                u.style.width = "125px";
                u.style.background = "linear-gradient(135deg, #00f2fe, #4facfe)";
                u.style.color = "#fff";
                u.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg><span style="margin-left:6px;font-weight:700;">Download</span>`;
                r.appendChild(u);
                u.addEventListener("click", () => { window.location.hash = "download"; });

                // PIP Button
                var h = document.createElement("div");
                sty(h);
                h.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="${c}"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg><span style="margin-left:6px">PIP</span>`;
                r.appendChild(h);
                h.addEventListener("click", () => { PIPlayer(!0); });
            }
        }
    }

    function isHeart() {
        var id = getVideoId();
        return (localStorage.getItem("hearts") || "").indexOf(id) > -1;
    }

    function ytProHeart(btn) {
        var id = getVideoId();
        var hearts = JSON.parse(localStorage.getItem("hearts") || "{}");
        if (hearts[id]) {
            delete hearts[id];
            localStorage.setItem("hearts", JSON.stringify(hearts));
            btn.querySelector("svg").setAttribute("fill", c);
        } else {
            hearts[id] = { title: getVideoTitle(), thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
            localStorage.setItem("hearts", JSON.stringify(hearts));
            btn.querySelector("svg").setAttribute("fill", "#ff0055");
        }
    }

    function PIPlayer(e = !1) {
        var t = document.getElementsByClassName("video-stream")[0];
        if (!t) return;
        if (e && typeof Android !== "undefined" && Android.pipvid) {
            t.getBoundingClientRect().height > t.getBoundingClientRect().width ? Android.pipvid("portrait") : Android.pipvid("landscape");
        } else {
            t.requestFullscreen?.();
            t.play();
            window.pauseAllowed = !1;
            window.isPIP = !0;
        }
    }

    setInterval(pkc, 1000);

    window.onhashchange = () => {
        try { document.getElementById("outerdownytprodiv")?.remove(); } catch {}
        try { document.getElementById("settingsprodiv")?.remove(); } catch {}
        if ("#download" == window.location.hash) ytproSabrDownload();
        else if ("#settings" == window.location.hash) ytproSettings();
        else if ("#hearts" == window.location.hash) showHearts();
    };

    new MutationObserver(() => {
        addSettingsTab();
    }).observe(document.body, { childList: !0, subtree: !0 });
}