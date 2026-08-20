/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.9.8
URI: https://github.com/prateek-chaubey/YTPRO
Modded for High-Speed Loading, Max Download Speeds & Unified Video+Audio Format
*/

window.ytproSabrDownload = async function() {
    // Remove any previous cached download dialogs to force-render new modern UI
    document.getElementById("outerdownytprodiv")?.remove();
    var ytproDownDiv = getDownloadElement();

    // Fast Skeleton Loader
    ytproDownDiv.querySelector("#videoViewDiv").innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 0;gap:14px;">
            <div style="width:36px;height:36px;border:3.5px solid ${isD ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"};border-top-color:#0a84ff;border-radius:50%;animation:ytSpin 0.7s linear infinite;"></div>
            <span style="font-size:13.5px;font-weight:600;opacity:0.75;letter-spacing:-0.2px;">Fetching high-speed streams...</span>
        </div>
    `;

    // 1. Get Video ID
    var videoId = "";
    if (window.location.pathname.indexOf("shorts") > -1) {
        videoId = window.location.pathname.substr(8, window.location.pathname.length);
    } else {
        videoId = new URLSearchParams(window.location.search).get("v");
    }

    if (!videoId) { 
        window.Android?.showToast?.('No video ID found in URL.'); 
        return; 
    }

    // 2. Global Module Cache for Instant Loading on Next Clicks
    if (!window._ytproCache) {
        const [innertubeMod, sabrMod, utilsMod, bgMod] = await Promise.all([
            import('https://cdn.jsdelivr.net/npm/youtubei.js@17.0.1/bundle/browser.min.js'),
            import('https://esm.sh/googlevideo@4.0.4/sabr-stream'),
            import('https://esm.sh/googlevideo@4.0.4/utils'),
            import('https://esm.sh/bgutils-js@3.2.0')
        ]);
        window._ytproCache = {
            Innertube: innertubeMod.Innertube,
            Platform: innertubeMod.Platform,
            SabrStream: sabrMod.SabrStream,
            buildSabrFormat: utilsMod.buildSabrFormat,
            EnabledTrackTypes: utilsMod.EnabledTrackTypes,
            BG: bgMod.BG,
            buildURL: bgMod.buildURL,
            getHeaders: bgMod.getHeaders
        };
    }

    const { Innertube, Platform, SabrStream, buildSabrFormat, EnabledTrackTypes, BG, buildURL, getHeaders } = window._ytproCache;

    Platform.shim.eval = async (data, env) => {
        const props = [];
        if (env.n)   props.push(`n: exportedVars.nFunction("${env.n}")`);
        if (env.sig) props.push(`sig: exportedVars.sigFunction("${env.sig}")`);
        return new Function(`${data.output}\nreturn { ${props.join(', ')} }`)();
    };

    const cookies = window.Android?.getAllCookies?.('https://www.youtube.com') ?? '';

    // Create / Reuse Innertube Instance
    if (!window._ytInstance) {
        window._ytInstance = await Innertube.create({
            cookie: cookies,
            retrieve_player: true,
            generate_session_locally: true,
            fetch: async (input, init = {}) => {
                const reqUrl = input instanceof Request ? input.url : input.toString();
                const url = new URL(reqUrl);
                const method = init.method ?? (input instanceof Request ? input.method : 'GET');
                const headers = new Headers();

                if (input instanceof Request) input.headers.forEach((v, k) => headers.set(k, v));
                if (init.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));

                headers.set('User-Agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
                headers.set('Sec-Ch-Ua', '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"');
                headers.set('Sec-Ch-Ua-Mobile', '?0');
                headers.set('Sec-Ch-Ua-Platform', '"Windows"');

                const playerId = Array.from(document.scripts)
                    .map(s => s.src.match(/player\/(.*?)\/player/))
                    .find(m => m)?.[1] || '4b0d80ee';

                if (url.pathname === '/iframe_api') {
                    const mockedApiCode = `var scriptUrl = 'https:\\/\\/www.youtube.com\\/s\\/player\\/${playerId}\\/www-widgetapi.vflset\\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}var YT;if(!window["YT"])YT={loading:0,loaded:0};var YTConfig;if(!window["YTConfig"])YTConfig={"host":"https://www.youtube.com"};if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;var i=0;for(;i<l.length;i++)try{l[i]()}catch(e){}};YT.setConfig=function(c){var k;for(k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()};`;
                    return new Response(mockedApiCode, { status: 200, headers: { 'Content-Type': 'text/javascript' } });
                }

                if (url.pathname.startsWith('/s/player/')) {
                    url.hostname = 'www.youtube.com';
                    headers.delete('Cookie');
                    headers.set('Origin', 'https://www.youtube.com');
                    headers.set('Referer', 'https://www.youtube.com/');
                } else {
                    if (url.hostname.includes('youtube.com')) url.hostname = 'm.youtube.com';
                    headers.set('Origin', 'https://m.youtube.com');
                    headers.set('Referer', 'https://m.youtube.com/');
                    if (cookies) headers.set('Cookie', cookies);
                }

                let body = init.body ?? null;
                if (!body && input instanceof Request && method !== 'GET' && method !== 'HEAD') {
                    body = await input.arrayBuffer();
                }
                return fetch(url.toString(), { method, headers, body, credentials: 'omit' });
            }
        });
    }

    const yt = window._ytInstance;

    // Parallel Background PoToken Generator (Non-blocking)
    let placeholderPoToken = null;
    try { placeholderPoToken = BG.PoToken.generatePlaceholder(videoId); } catch (e) {}

    async function generateFullPoToken() {
        try {
            const challengeResponse = await yt.getAttestationChallenge('ENGAGEMENT_TYPE_UNBOUND');
            const bg = challengeResponse.bg_challenge;
            const challenge = {
                interpreterUrl: {
                    privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: bg.interpreter_url.private_do_not_access_or_else_trusted_resource_url_wrapped_value,
                },
                interpreterHash: bg.interpreter_hash,
                program: bg.program,
                globalName: bg.global_name,
                clientExperimentsStateBlob: bg.client_experiments_state_blob,
            };
            const interpreterJsRes = await fetch(`https:${challenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue}`);
            const interpreterJS = await interpreterJsRes.text();
            new Function(interpreterJS)();
            const bgClient = await BG.BotGuardClient.create({ program: challenge.program, globalName: challenge.globalName, globalObj: window });
            const webPoSignalOutput = [];
            const botguardResponse = await bgClient.snapshot({ webPoSignalOutput });
            const REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';
            const integrityTokenRes = await fetch(buildURL('GenerateIT'), {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify([REQUEST_KEY, botguardResponse]),
            });
            const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] = await integrityTokenRes.json();
            if (!integrityToken) throw new Error('Empty integrity token');
            const minter = await BG.WebPoMinter.create({ integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken }, webPoSignalOutput);
            return await minter.mintAsWebsafeString(videoId);
        } catch (e) {
            return null;
        }
    }

    const fullTokenPromise = generateFullPoToken(); // Runs in background without blocking

    // Fast Info Fetching
    const info = await yt.getBasicInfo(videoId, { client: 'WEB' });
    const player = yt.session.player;
    const streamingData = info.streaming_data;

    if (!streamingData || !player) { 
        window.Android?.showToast?.('No streaming data or player found.'); 
        return; 
    }

    const safeTitle = info.basic_info.title.replace(/[\/\\?%*:|"<>]/g, '-');

    const formatBytes = (bytes) => {
        if (window.formatFileSize) return window.formatFileSize(bytes);
        if (bytes === 0 || isNaN(bytes)) return "Unknown Size";
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const cleanFormat = (f) => {
        const durationSec = (f.approxDurationMs || f.approx_duration_ms || info.basic_info.duration * 1000 || 0) / 1000;
        const bytes = f.contentLength ? parseInt(f.contentLength) : (f.bitrate ? Math.floor((f.bitrate * durationSec) / 8) : 0);
        const mime = f.mimeType || f.mime_type || "";
        const isWebm = mime.includes('webm');
        const isMp4 = mime.includes('mp4');
        const codec = mime.match(/codecs="(.*?)"/)?.[1] || "";

        return {
            itag: f.itag,
            mimeType: mime,
            container: isWebm ? 'webm' : (isMp4 ? 'mp4' : 'mp4'),
            codec: codec,
            qualityLabel: f.qualityLabel || f.quality_label || null,
            bitrate: f.bitrate,
            width: f.width,
            hasVideo: !!f.width,
            hasAudio: !!f.audioSampleRate || !!f.audio_sample_rate || mime.startsWith('audio/'),
            languageId: f.language || f.audioTrack?.id || f.audio_track?.id || 'default',
            languageName: f.audioTrack?.displayName || f.audio_track?.display_name || 'Default',
            isDefaultAudio: f.audioTrack?.audioIsDefault || f.audio_track?.audio_is_default || (!f.audioTrack && !f.audio_track),
            sizeBytes: bytes,
            audioQuality: f.audio_quality || null,
            audioTrackId: f.audio_track?.id,
            sizeFormatted: formatBytes(bytes)
        };
    };

    const rawAdaptive = streamingData.adaptive_formats || [];
    const adaptive = rawAdaptive.map(cleanFormat);

    const videoOnly = adaptive.filter(f => f.hasVideo && !f.hasAudio);
    const audioOnly = adaptive.filter(f => f.hasAudio && !f.hasVideo);

    const muxableOptions = [];
    const uniqueQualities = [...new Set(videoOnly.map(v => v.qualityLabel).filter(Boolean))]
        .sort((a, b) => parseInt(b) - parseInt(a));

    const uniqueLanguages = [];
    const langMap = new Map();
    audioOnly.forEach(a => {
        if (!langMap.has(a.languageId)) {
            langMap.set(a.languageId, { id: a.languageId, name: a.languageName, isDefault: a.isDefaultAudio });
            uniqueLanguages.push(langMap.get(a.languageId));
        }
    });

    // Default to first if none marked
    if (uniqueLanguages.length > 0 && !uniqueLanguages.some(l => l.isDefault)) {
        uniqueLanguages[0].isDefault = true;
    }

    uniqueQualities.forEach(quality => {
        const vForQuality = videoOnly.filter(v => v.qualityLabel === quality && !v.codec.includes('av01'));
        const mp4Video = vForQuality.filter(v => v.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0] || vForQuality[0];
        const webmVideo = vForQuality.filter(v => v.container === 'webm').sort((a,b) => b.bitrate - a.bitrate)[0];

        uniqueLanguages.forEach(lang => {
            const aForLang = audioOnly.filter(a => a.languageId === lang.id);
            const mp4Audio = aForLang.filter(a => a.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0] || aForLang[0];
            const webmAudio = aForLang.filter(a => a.container === 'webm').sort((a,b) => b.bitrate - a.bitrate)[0];

            if (mp4Video && mp4Audio) {
                muxableOptions.push({
                    type: 'muxable',
                    qualityLabel: quality,
                    language: lang.name,
                    languageId: lang.id,
                    isDefaultLanguage: lang.isDefault,
                    container: 'mp4',
                    totalBytes: mp4Video.sizeBytes + mp4Audio.sizeBytes,
                    totalSizeFormatted: formatBytes(mp4Video.sizeBytes + mp4Audio.sizeBytes),
                    videoItag: mp4Video.itag,
                    audioItag: mp4Audio.itag,
                    videoDetails: mp4Video,
                    audioDetails: mp4Audio
                });
            }

            if (webmVideo && webmAudio) {
                muxableOptions.push({
                    type: 'muxable',
                    qualityLabel: quality,
                    language: lang.name,
                    languageId: lang.id,
                    isDefaultLanguage: lang.isDefault,
                    container: 'webm',
                    totalBytes: webmVideo.sizeBytes + webmAudio.sizeBytes,
                    totalSizeFormatted: formatBytes(webmVideo.sizeBytes + webmAudio.sizeBytes),
                    videoItag: webmVideo.itag,
                    audioItag: webmAudio.itag,
                    videoDetails: webmVideo,
                    audioDetails: webmAudio
                });
            }
        });
    });

    // Language Dropdown Row
    ytproDownDiv.querySelector("#videoViewDiv").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;background:${isD ? "#212124" : "#f6f6f9"};padding:10px 14px;border-radius:18px;margin-bottom:14px;border:1px solid ${isD ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};">
            <span style="font-size:13.5px;font-weight:600;">Audio Language</span>
            <select id="selectLang" style="height:32px;border-radius:10px;border:0;padding:0 10px;font-size:13px;font-weight:600;color:${c};background:${isD ? "#2c2c2e" : "#e5e5ea"};outline:none;cursor:pointer;"></select>
        </div>
    `;

    var langList = ytproDownDiv.querySelector("#selectLang");
    uniqueLanguages.forEach(l => {
        var sl = document.createElement("option");
        sl.textContent = l.name;
        sl.value = l.id;
        if (l.isDefault === true) sl.selected = true;
        langList.appendChild(sl);
    });

    langList.addEventListener("change", (e) => {
        updateMuxFormats(e.target.value);
        updateAudioOnlyFormats(e.target.value);
    });

    var createAndAppend = () => {
        var div = document.createElement("div");
        ytproDownDiv.querySelector("#videoViewDiv").appendChild(div);
        return div;
    };

    var muxedDiv = createAndAppend();
    var audioOnlyDiv = createAndAppend();
    var videoOnlyDiv = createAndAppend();

    // ── 1. Video + Audio (Single Unified Video File) ──
    function updateMuxFormats(langId = uniqueLanguages.find(arr => arr.isDefault)?.id || uniqueLanguages[0]?.id) {
        muxedDiv.innerHTML = `
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${isD ? "#8e8e93" : "#86868b"};margin:12px 0 6px 6px;text-align:left;">Video with Audio (Unified File)</div>
            <div class="yt-dl-card" style="background:${isD ? "#212124" : "#f6f6f9"};border-radius:20px;padding:4px 12px;margin-bottom:14px;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};"></div>
        `;
        var container = muxedDiv.querySelector(".yt-dl-card");

        muxableOptions.forEach(mux => {
            if (mux.languageId != langId) return;

            var item = document.createElement("div");
            item.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:12px 4px;min-height:50px;cursor:pointer;border-bottom:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;
            Object.assign(item.dataset, {
                langId: mux.audioDetails.audioTrackId,
                isWebm: mux.container == "webm",
                audioItag: mux.audioItag,
                videoItag: mux.videoItag,
                trackMode: "combined"
            });

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:15px;font-weight:700;color:${isD ? "#fff" : "#111"};">${mux.qualityLabel}</span>
                        <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(52,199,89,0.15);color:#34c759;text-transform:uppercase;">WITH SOUND</span>
                        <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;background:${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};opacity:0.8;">${mux.container.toUpperCase()}</span>
                    </div>
                    <span style="font-size:12px;font-weight:500;opacity:0.65;margin-top:3px;">Full Video • ${mux.totalSizeFormatted}</span>
                </div>
                <div style="height:34px;width:34px;border-radius:50%;background:${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};display:flex;align-items:center;justify-content:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // ── 2. Audio Only (Collapsible) ──
    function updateAudioOnlyFormats(langId = uniqueLanguages.find(arr => arr.isDefault)?.id || uniqueLanguages[0]?.id) {
        audioOnlyDiv.innerHTML = "";
        var card = document.createElement("div");
        card.style.cssText = `background:${isD ? "#212124" : "#f6f6f9"};border-radius:20px;padding:6px 12px;margin-bottom:14px;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;

        var header = document.createElement("div");
        header.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:10px 4px;font-size:14px;font-weight:600;cursor:pointer;user-select:none;color:${isD ? "#98989d" : "#6e6e73"};`;
        header.innerHTML = `
            <span>Audio Only Streams</span>
            <svg style="transition:transform 0.25s ease;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="${isD ? "#8e8e93" : "#86868b"}" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
        `;
        card.appendChild(header);

        var listWrapper = document.createElement("div");
        listWrapper.style.display = "none";

        audioOnly.forEach(aud => {
            if (aud.languageId != langId) return;

            var item = document.createElement("div");
            item.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:12px 4px;cursor:pointer;border-top:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;
            Object.assign(item.dataset, {
                langId: aud.audioTrackId,
                isWebm: aud.container == "webm",
                audioItag: aud.itag,
                trackMode: "audio"
            });

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">${aud.audioQuality ? aud.audioQuality.replace("AUDIO_QUALITY_", "") : "Standard Audio"}</span>
                    <span style="font-size:12px;font-weight:500;opacity:0.65;margin-top:2px;">${aud.container.toUpperCase()} • ${aud.sizeFormatted}</span>
                </div>
                <div style="height:32px;width:32px;border-radius:50%;background:${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};display:flex;align-items:center;justify-content:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                </div>
            `;
            listWrapper.appendChild(item);
        });

        card.appendChild(listWrapper);
        audioOnlyDiv.appendChild(card);

        header.addEventListener("click", () => {
            const isHidden = listWrapper.style.display === "none";
            listWrapper.style.display = isHidden ? "block" : "none";
            header.querySelector("svg").style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        });
    }

    // ── 3. Video Only Muted (Collapsible) ──
    function updateVideoOnlyFormats() {
        videoOnlyDiv.innerHTML = "";
        var card = document.createElement("div");
        card.style.cssText = `background:${isD ? "#212124" : "#f6f6f9"};border-radius:20px;padding:6px 12px;margin-bottom:14px;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;

        var header = document.createElement("div");
        header.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:10px 4px;font-size:14px;font-weight:600;cursor:pointer;user-select:none;color:${isD ? "#98989d" : "#6e6e73"};`;
        header.innerHTML = `
            <span>Video Only (Muted / No Sound)</span>
            <svg style="transition:transform 0.25s ease;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="${isD ? "#8e8e93" : "#86868b"}" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
        `;
        card.appendChild(header);

        var listWrapper = document.createElement("div");
        listWrapper.style.display = "none";

        videoOnly.forEach(vid => {
            var item = document.createElement("div");
            item.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:12px 4px;cursor:pointer;border-top:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;
            item.dataset.videoItag = vid.itag;
            item.dataset.isWebm = vid.container == "webm";
            item.dataset.trackMode = "video";

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <span style="font-size:14px;font-weight:700;color:${isD ? "#fff" : "#111"};">${vid.qualityLabel}</span>
                    <span style="font-size:12px;font-weight:500;opacity:0.65;margin-top:2px;">${vid.container.toUpperCase()} • ${vid.sizeFormatted}</span>
                </div>
                <div style="height:32px;width:32px;border-radius:50%;background:${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};display:flex;align-items:center;justify-content:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                </div>
            `;
            listWrapper.appendChild(item);
        });

        card.appendChild(listWrapper);
        videoOnlyDiv.appendChild(card);

        header.addEventListener("click", () => {
            const isHidden = listWrapper.style.display === "none";
            listWrapper.style.display = isHidden ? "block" : "none";
            header.querySelector("svg").style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        });
    }

    // ── 4. Thumbnails Tab ──
    function updateThumbnails() {
        var div = ytproDownDiv.querySelector("#thumbViewDiv");
        div.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;"></div>`;
        var grid = div.querySelector("div");

        var thumbs = info.basic_info.thumbnail || [];
        thumbs.forEach(thumb => {
            var card = document.createElement("div");
            card.setAttribute("data-url", thumb.url);
            card.setAttribute("data-title", `Thumbnail ${thumb.height}x${thumb.width} ${safeTitle} YTPRO.jpg`);
            card.style.cssText = `background:${isD ? "#212124" : "#f6f6f9"};border-radius:18px;padding:8px;cursor:pointer;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};text-align:center;`;
            card.innerHTML = `
                <img src="${thumb.url}" style="width:100%;height:85px;object-fit:cover;border-radius:12px;margin-bottom:6px;">
                <div style="font-size:12px;font-weight:600;opacity:0.8;">${thumb.height} × ${thumb.width}</div>
            `;
            grid.appendChild(card);
        });

        div.addEventListener("click", (e) => {
            var el = e.target.closest("[data-url]");
            if (!el) return;
            Android.downvid(el.dataset.title, el.dataset.url, "image/jpg");
        });
    }

    // ── 5. Captions Tab ──
    function updateCaptions() {
        var div = ytproDownDiv.querySelector("#captionsViewDiv");
        var captions = info?.captions?.caption_tracks;

        if (!captions || captions.length === 0) {
            div.innerHTML = `<div style="padding:40px 0;opacity:0.6;font-size:14px;text-align:center;">No Subtitles Available</div>`;
            return;
        }

        div.innerHTML = `<div style="background:${isD ? "#212124" : "#f6f6f9"};border-radius:20px;padding:6px 12px;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};"></div>`;
        var card = div.querySelector("div");
        var t = `Captions ${safeTitle} YTPRO`;

        captions.forEach(cap => {
            cap.baseUrl = cap.base_url.replace("&fmt=srv3", "");
            var row = document.createElement("div");
            row.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:12px 4px;border-bottom:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;
            row.innerHTML = `
                <span style="font-size:13.5px;font-weight:600;">${cap?.name?.text}</span>
                <div style="display:flex;gap:6px;">
                    <span data-url="${cap.baseUrl}&fmt=srt" data-title="${t}" data-ext=".srt" style="padding:4px 8px;font-size:11px;font-weight:700;background:${isD ? "#2c2c2e" : "#e5e5ea"};border-radius:8px;cursor:pointer;">SRT</span>
                    <span data-url="${cap.baseUrl}&fmt=vtt" data-title="${t}" data-ext=".vtt" style="padding:4px 8px;font-size:11px;font-weight:700;background:${isD ? "#2c2c2e" : "#e5e5ea"};border-radius:8px;cursor:pointer;">VTT</span>
                    <span data-url="${cap.baseUrl}&fmt=sbv" data-title="${t}" data-ext=".txt" style="padding:4px 8px;font-size:11px;font-weight:700;background:${isD ? "#2c2c2e" : "#e5e5ea"};border-radius:8px;cursor:pointer;">TXT</span>
                </div>
            `;
            card.appendChild(row);
        });

        div.addEventListener("click", (e) => {
            var el = e.target.closest("[data-url]");
            if (!el) return;
            Android.downvid(el.dataset.title + el.dataset.ext, el.dataset.url, "plain/text");
        });
    }

    // Unified Click Listeners
    muxedDiv.addEventListener("click", (e) => {
        var el = e.target.closest("[data-audio-itag]");
        if (!el) return;
        downloadSABRStream(el.dataset.videoItag, el.dataset.audioItag, el.dataset.isWebm, el.dataset.langId, EnabledTrackTypes.VIDEO_AND_AUDIO);
    });

    audioOnlyDiv.addEventListener("click", (e) => {
        var el = e.target.closest("[data-audio-itag]");
        if (!el) return;
        downloadSABRStream(null, el.dataset.audioItag, el.dataset.isWebm, el.dataset.langId, EnabledTrackTypes.AUDIO_ONLY);
    });

    videoOnlyDiv.addEventListener("click", (e) => {
        var el = e.target.closest("[data-video-itag]");
        if (!el) return;
        downloadSABRStream(el.dataset.videoItag, null, el.dataset.isWebm, null, EnabledTrackTypes.VIDEO_ONLY);
    });

    if (info?.basic_info?.is_live || info?.basic_info?.is_live_content) {
        ytproDownDiv.querySelector("#videoViewDiv").innerHTML = `<div style="padding:40px 0;opacity:0.7;font-size:14px;text-align:center;">Live stream downloads are not supported.</div>`;
    } else {
        updateMuxFormats();
        updateAudioOnlyFormats();
        updateVideoOnlyFormats();
    }
    updateThumbnails();
    updateCaptions();

    // ── High Speed SABR Streaming Engine ──
    async function extractSabrConfig(playerInfo) {
        const url = await player.decipher(playerInfo.streaming_data?.server_abr_streaming_url);
        const cfg = playerInfo.player_config?.media_common_config?.media_ustreamer_request_config?.video_playback_ustreamer_config;
        return { url, cfg };
    }

    const { url: serverAbrUrl, cfg: ustreamerConfig } = await extractSabrConfig(info);
    if (!serverAbrUrl || !ustreamerConfig) {
        window.Android?.showToast?.('Missing SABR config.');
        return;
    }

    const rawUstreamerConfig = typeof ustreamerConfig === 'string' ? ustreamerConfig : JSON.stringify(ustreamerConfig);
    const adaptiveFormats = streamingData.adaptive_formats ?? [];
    const sabrFormats = adaptiveFormats.map(f => buildSabrFormat(f));

    async function downloadSABRStream(videoItag, audioItag, isWebm, langId, enabledTrack) {
        if (!Android.isWebViewSupported()) {
            Android.showToast("Please Update your WebView.");
            return;
        }
        if (!Android.hasStoragePermission()) return;

        Android.showToast("Starting High-Speed Download...");

        const containerExt = isWebm == "true" ? 'webm' : 'mp4';
        const lowestAudio = audioOnly.sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0]?.itag;
        const lowestVideo = adaptiveFormats.filter(f => f.width).sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0]?.itag;

        const trashSabrAudio = sabrFormats.find(s => s.itag == lowestAudio);
        const trashSabrVideo = sabrFormats.find(s => s.itag == lowestVideo);

        const targetSabrVideo = sabrFormats.find(s => s.itag == videoItag) || trashSabrVideo;
        var targetSabrAudio;
        if (langId && langId != "undefined") {
            targetSabrAudio = sabrFormats.find(s => s.itag == audioItag && s.audioTrackId == langId) || trashSabrAudio;
        } else {
            targetSabrAudio = sabrFormats.find(s => s.itag == audioItag) || trashSabrAudio;
        }

        const sabrStream = new SabrStream({
            videoId: videoId,
            cpn: info.cpn,
            serverAbrStreamingUrl: serverAbrUrl,
            videoPlaybackUstreamerConfig: rawUstreamerConfig,
            formats: sabrFormats,
            poToken: placeholderPoToken ?? undefined,
            clientInfo: {
                clientName: 1,
                clientVersion: yt.session.context.client.clientVersion,
                osName: 'Windows',
                osVersion: '10.0',
            },
            durationMs: (info.basic_info.duration ?? 0) * 1000,
            fetch: async (input, init = {}) => {
                const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
                return fetch(url, { ...init, mode: 'cors', credentials: 'include' });
            },
        });

        sabrStream.on('reloadPlayerResponse', async () => {
            try {
                const freshInfo = await yt.getBasicInfo(videoId, { client: 'WEB' });
                const { url: newUrl, cfg: newCfg } = await extractSabrConfig(freshInfo);
                if (newUrl) sabrStream.setStreamingURL(newUrl);
                if (newCfg) sabrStream.setUstreamerConfig(typeof newCfg === 'string' ? newCfg : JSON.stringify(newCfg));
            } catch (e) {}
        });

        let isTokenApplied = false;
        sabrStream.on('streamProtectionStatusUpdate', async (data) => {
            if ((data.status === 2 || data.status === 3) && !isTokenApplied) {
                isTokenApplied = true;
                try {
                    const fullToken = await fullTokenPromise;
                    if (fullToken) sabrStream.poToken = fullToken;
                } catch (err) {}
            }
        });

        const { videoStream, audioStream } = await sabrStream.start({
            preferMp4: !isWebm,
            preferH264: !isWebm,
            videoFormat: () => targetSabrVideo,
            audioFormat: () => targetSabrAudio,
            enabledTrackTypes: enabledTrack,
        });

        const durationSec = info.basic_info.duration || 0;

        createDownloaderStatus();
        createDownloaderIndicator();

        var downloaderDiv = document.querySelector("#ytProDownloaderDiv");

        function createProgressRow(streamTitle) {
            var elWrapper = document.createElement("div");
            elWrapper.style.cssText = "margin-bottom:12px;";

            var elDetails = document.createElement("div");
            elDetails.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px;";
            elDetails.innerHTML = `<span style="font-weight:600;">${streamTitle}</span><span style="opacity:0.75;font-weight:500;">Starting...</span>`;

            var elProgressBar = document.createElement("div");
            elProgressBar.style.cssText = `display:flex;width:100%;height:14px;background:${isD ? "#2c2c2e" : "#e5e5ea"};border-radius:20px;overflow:hidden;`;

            var elProgress = document.createElement("div");
            elProgress.style.cssText = `display:flex;align-items:center;justify-content:center;width:0%;height:100%;background:#0a84ff;border-radius:20px;color:#fff;font-size:10px;font-weight:700;transition:width 0.15s ease;`;
            elProgressBar.appendChild(elProgress);

            elWrapper.appendChild(elDetails);
            elWrapper.appendChild(elProgressBar);
            downloaderDiv.appendChild(elWrapper);

            return { elDetails, elProgress };
        }

        downloaderDiv.innerHTML = `
            <div style="font-size:14.5px;font-weight:700;margin-bottom:2px;color:${isD ? "#fff" : "#000"};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden;">${safeTitle}</div>
            <div style="font-size:11.5px;opacity:0.6;margin-bottom:14px;">High-speed streaming in progress...</div>
        `;

        // Video Only Mode
        if (enabledTrack == EnabledTrackTypes.VIDEO_ONLY) {
            const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);
            var fileName = `${safeTitle}_muted_${new Date().getTime()}.${containerExt}`;
            var { elDetails, elProgress } = createProgressRow("Video Stream");
            await pipeToDiskFast(videoStream, fileName, estVideoBytes, elDetails, elProgress);
        } 
        // Audio Only Mode
        else if (enabledTrack == EnabledTrackTypes.AUDIO_ONLY) {
            const estAudioBytes = targetSabrAudio.contentLength || (targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);
            var fileName = `${safeTitle}_${new Date().getTime()}.${containerExt == 'mp4' ? 'm4a' : 'opus'}`;
            var { elDetails, elProgress } = createProgressRow("Audio Stream");
            await pipeToDiskFast(audioStream, fileName, estAudioBytes, elDetails, elProgress);
        } 
        // Single File Mode: Downloads Video + Audio simultaneously & merges into single complete video
        else if (enabledTrack == EnabledTrackTypes.VIDEO_AND_AUDIO) {
            const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);
            const estAudioBytes = targetSabrAudio.contentLength || (targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);

            var videoEl = createProgressRow("Video Track");
            var audioEl = createProgressRow("Audio Track");

            var tempVideoFile = `temp_v_${new Date().getTime()}.${containerExt}`;
            var tempAudioFile = `temp_a_${new Date().getTime()}.${containerExt}`;
            var finalUnifiedFile = `${safeTitle}.${containerExt}`;

            await Promise.all([
                pipeToDiskFast(videoStream, tempVideoFile, estVideoBytes, videoEl.elDetails, videoEl.elProgress),
                pipeToDiskFast(audioStream, tempAudioFile, estAudioBytes, audioEl.elDetails, audioEl.elProgress)
            ]);

            window.Android?.showToast?.('Combining Video & Sound into Single File...');
            if (window.Android?.muxVideoAudio) {
                window.Android.muxVideoAudio(tempVideoFile, tempAudioFile, finalUnifiedFile);
            }
        }
    }
};

function getDownloadElement() {
    const ytproDown = document.createElement("div");
    const ytproDownDiv = document.createElement("div");

    ytproDown.id = "outerdownytprodiv";
    ytproDownDiv.id = "downytprodiv";

    Object.assign(ytproDown.style, {
        height: "100%", width: "100%", position: "fixed",
        top: "0", left: "0", display: "flex", alignItems: "flex-end",
        justifyContent: "center", background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)", webkitBackdropFilter: "blur(12px)",
        zIndex: "9999999", animation: "fadeIn .25s ease-out"
    });

    Object.assign(ytproDownDiv.style, {
        maxHeight: "86vh", width: "100%", maxWidth: "540px",
        overflowY: "auto", overflowX: "hidden",
        background: isD ? "#161618" : "#ffffff",
        position: "relative", zIndex: "99999999",
        padding: "16px 18px 30px", borderRadius: "32px 32px 0 0",
        color: isD ? "#f5f5f7" : "#1d1d1f",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
        border: `1px solid ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        boxSizing: "border-box", animation: "slideUp .3s cubic-bezier(0.2,0.9,0.3,1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    });

    ytproDown.addEventListener("click", (ev) => {
        if (!ytproDownDiv.contains(ev.target)) history.back();
    });

    const TABS = [
        { label: "Formats",    viewId: "videoViewDiv"    },
        { label: "Thumbnails", viewId: "thumbViewDiv"    },
        { label: "Captions",   viewId: "captionsViewDiv" },
    ];

    const tabs = document.createElement("div");
    Object.assign(tabs.style, {
        height: "40px", width: "100%", display: "flex",
        background: isD ? "#212124" : "#f6f6f9",
        borderRadius: "16px", padding: "4px", gap: "4px",
        marginBottom: "16px", border: `1px solid ${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
    });

    const views = [];

    TABS.forEach(({ label, viewId }, idx) => {
        const tab = document.createElement("div");
        tab.style.cssText = `flex:1;display:flex;align-items:center;justify-content:center;border-radius:12px;font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.2s ease;color:${isD ? "#8e8e93" : "#86868b"};`;
        tab.textContent = label;
        tab.dataset.view = `#${viewId}`;
        tabs.appendChild(tab);

        const view = document.createElement("div");
        view.id = viewId;
        view.style.display = idx === 0 ? "block" : "none";
        ytproDownDiv.appendChild(view);
        views.push(view);
    });

    tabs.children[0].style.background = isD ? "rgba(255,255,255,0.12)" : "#ffffff";
    tabs.children[0].style.color = isD ? "#ffffff" : "#000000";
    tabs.children[0].style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";

    tabs.addEventListener("click", (e) => {
        const el = e.target.closest("[data-view]");
        if (!el) return;

        [...tabs.children].forEach(child => {
            child.style.background = "transparent";
            child.style.color = isD ? "#8e8e93" : "#86868b";
            child.style.boxShadow = "none";
        });

        views.forEach(v => v.style.display = "none");

        document.querySelector(el.dataset.view).style.display = "block";
        el.style.background = isD ? "rgba(255,255,255,0.12)" : "#ffffff";
        el.style.color = isD ? "#ffffff" : "#000000";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    });

    document.body.appendChild(ytproDown);
    ytproDown.appendChild(ytproDownDiv);
    ytproDownDiv.prepend(tabs);

    return ytproDownDiv;
}

// ── Ultra-Fast Binary Pipe Streaming (No Throttling/Zero Artificial Delays) ──
const pendingStreams = {};
window.addEventListener("message", (event) => {
    if (typeof event.data === "string" && event.data.startsWith("PORT_FOR:") && event.ports.length > 0) {
        const fileName = event.data.substring(9);
        if (pendingStreams[fileName]) {
            pendingStreams[fileName](event.ports[0]);
            delete pendingStreams[fileName];
        }
    }
});

function createDedicatedPipe(fileName) {
    return new Promise((resolve) => {
        pendingStreams[fileName] = resolve;
        window.Android?.requestBinaryPort?.(fileName);
    });
}

async function pipeToDiskFast(stream, fileName, expectedTotalBytesStr, elDetails, elProgress) {
    const expectedBytes = parseInt(expectedTotalBytesStr || "0", 10);
    const totalMB = expectedBytes > 0 ? (expectedBytes / (1024 * 1024)).toFixed(1) : '?';

    const filePort = await createDedicatedPipe(fileName);
    if (!filePort) {
        console.error(`[YTPRO] Failed to get binary port for ${fileName}`);
        return 0;
    }

    const reader = stream.getReader();
    let total = 0;
    let lastLogMB = -1;

    try {
        const CHUNK_SIZE = 1024 * 1024; // 1MB Buffer for Maximum Throughput
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value?.length > 0) {
                let offset = 0;
                while (offset < value.length) {
                    const chunkBuffer = value.slice(offset, offset + CHUNK_SIZE).buffer;
                    filePort.postMessage(chunkBuffer);

                    const bytesWritten = chunkBuffer.byteLength;
                    offset += bytesWritten;
                    total += bytesWritten;

                    const currentMBFloor = Math.floor(total / (1024 * 1024));
                    if (currentMBFloor > lastLogMB) {
                        const downloadedMB = (total / (1024 * 1024)).toFixed(1);
                        const percent = expectedBytes > 0 ? Math.min(100, Math.round((total / expectedBytes) * 100)) : 0;

                        if (elDetails?.children?.[1]) elDetails.children[1].innerHTML = `${downloadedMB} / ${totalMB} MB (${percent}%)`;
                        if (elProgress) {
                            elProgress.style.width = percent + "%";
                            elProgress.innerHTML = percent > 15 ? percent + "%" : "";
                        }

                        window.Android?.onDownloadProgress?.(percent, total);
                        lastLogMB = currentMBFloor;
                    }
                }
            }
        }
    } finally {
        filePort.postMessage("END");
    }

    const finalMB = (total / (1024 * 1024)).toFixed(1);
    if (elDetails?.children?.[1]) elDetails.children[1].innerHTML = `${finalMB} MB (Done)`;
    if (elProgress) {
        elProgress.style.width = "100%";
        elProgress.innerHTML = "100%";
    }
    return total;
}

function createDownloaderStatus() {
    if (document.querySelector("#ytProDownloaderDiv")) return;

    var div = document.createElement("div");
    div.id = "ytProDownloaderDiv";

    Object.assign(div.style, {
        maxHeight: "320px", overflowY: "auto", width: "calc(100% - 32px)", maxWidth: "500px",
        zIndex: "9999999999", position: "fixed", padding: "18px",
        bottom: "85px", left: "50%", transform: "translateX(-50%)",
        display: "none", background: isD ? "#1e1e20" : "#ffffff",
        borderRadius: "26px", textAlign: "left",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        border: `1px solid ${isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`
    });

    document.body.appendChild(div);
}

function createDownloaderIndicator() {
    if (document.querySelector("#ytproDownloadIndicator")) return;
    var div = document.createElement("div");
    div.id = "ytproDownloadIndicator";

    Object.assign(div.style, {
        height: "50px", width: "50px", zIndex: "999999999",
        position: "fixed", bottom: "24px", right: "20px",
        background: "#0a84ff", borderRadius: "50%",
        boxShadow: "0 6px 20px rgba(10,132,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "transform 0.2s ease"
    });

    div.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
        </svg>
    `;

    document.body.appendChild(div);

    div.addEventListener("click", () => {
        var el = document.querySelector("#ytProDownloaderDiv");
        if (el.style.display == "block") {
            el.style.display = "none";
            div.style.transform = "scale(1)";
        } else {
            el.style.display = "block";
            div.style.transform = "scale(1.08)";
        }
    });
}