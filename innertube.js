/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.9.8
URI: https://github.com/prateek-chaubey/YTPRO
Modded for Modern & Professional UI + Auto Audio-Video Muxing
*/

window.ytproSabrDownload = async function() {
    var ytproDownDiv = getDownloadElement();
    ytproDownDiv.querySelector("#videoViewDiv").innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 0;gap:12px;">
            <div style="width:32px;height:32px;border:3px solid ${isD ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"};border-top-color:${c};border-radius:50%;animation:ytSpin 0.8s linear infinite;"></div>
            <span style="font-size:14px;font-weight:600;opacity:0.8;">Fetching stream formats...</span>
        </div>
    `;

    // Get Video ID
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

    // Imports
    const { Innertube, Platform } = await import(
        'https://cdn.jsdelivr.net/npm/youtubei.js@17.0.1/bundle/browser.min.js'
    );
    const { SabrStream } = await import('https://esm.sh/googlevideo@4.0.4/sabr-stream');
    const { buildSabrFormat, EnabledTrackTypes } = await import('https://esm.sh/googlevideo@4.0.4/utils');
    const { BG, buildURL, getHeaders } = await import('https://esm.sh/bgutils-js@3.2.0');

    Platform.shim.eval = async (data, env) => {
        const props = [];
        if (env.n)   props.push(`n: exportedVars.nFunction("${env.n}")`);
        if (env.sig) props.push(`sig: exportedVars.sigFunction("${env.sig}")`);
        return new Function(`${data.output}\nreturn { ${props.join(', ')} }`)();
    };

    // Create Innertube
    const cookies = window.Android?.getAllCookies?.('https://www.youtube.com') ?? '';

    const yt = await Innertube.create({
        cookie: cookies,
        retrieve_player: true,
        generate_session_locally: true,
        fetch: async (input, init = {}) => {
            const reqUrl = input instanceof Request ? input.url : input.toString();
            const url    = new URL(reqUrl);
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
                const mockedApiCode = `var scriptUrl = 'https:\\/\\/www.youtube.com\\/s\\/player\\/${playerId}\\/www-widgetapi.vflset\\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}var YT;if(!window["YT"])YT={loading:0,loaded:0};var YTConfig;if(!window["YTConfig"])YTConfig={"host":"https://www.youtube.com"};\nif(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;var i=0;for(;i<l.length;i++)try{l[i]()}catch(e){}};YT.setConfig=function(c){var k;for(k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",\nn)}var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()};`;
                return new Response(mockedApiCode, { status: 200, headers: { 'Content-Type': 'text/javascript' } });
            }

            if (url.pathname.startsWith('/s/player/')) {
                url.hostname = 'www.youtube.com';
                headers.delete('Cookie');
                headers.set('Origin',  'https://www.youtube.com');
                headers.set('Referer', 'https://www.youtube.com/');
            } else {
                if (url.hostname.includes('youtube.com')) url.hostname = 'm.youtube.com';
                headers.set('Origin',  'https://m.youtube.com');
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

    // PoToken Generator 
    let placeholderPoToken = null;
    try { placeholderPoToken = BG.PoToken.generatePlaceholder(videoId); } catch (e) {}

    async function generateFullPoToken() {
        try {
            const challengeResponse = await yt.getAttestationChallenge('ENGAGEMENT_TYPE_UNBOUND');
            const bg = challengeResponse.bg_challenge;

            const challenge = {
                interpreterUrl: {
                    privateDoNotAccessOrElseTrustedResourceUrlWrappedValue:
                    bg.interpreter_url.private_do_not_access_or_else_trusted_resource_url_wrapped_value,
                },
                interpreterHash:            bg.interpreter_hash,
                program:                    bg.program,
                globalName:                 bg.global_name,
                clientExperimentsStateBlob: bg.client_experiments_state_blob,
            };

            const interpreterJsRes = await fetch(
                `https:${challenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue}`
            );
            const interpreterJS = await interpreterJsRes.text();

            new Function(interpreterJS)();
            const bgClient = await BG.BotGuardClient.create({
                program:    challenge.program,
                globalName: challenge.globalName,
                globalObj:  window,
            });

            const webPoSignalOutput = [];
            const botguardResponse  = await bgClient.snapshot({ webPoSignalOutput });

            const REQUEST_KEY       = 'O43z0dpjhgX20SCx4KAo';
            const integrityTokenRes = await fetch(buildURL('GenerateIT'), {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify([REQUEST_KEY, botguardResponse]),
            });
            const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] =
            await integrityTokenRes.json();

            if (!integrityToken) throw new Error('Empty integrity token');

            const minter  = await BG.WebPoMinter.create(
                { integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken },
                webPoSignalOutput
            );

            return await minter.mintAsWebsafeString(videoId);
        } catch (e) {
            console.error('[YTPRO] PoToken generation failed:', e);
            return null;
        }
    }

    const fullTokenPromise = await generateFullPoToken();

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
            container: isWebm ? 'webm' : (isMp4 ? 'mp4' : 'other'),
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

    uniqueQualities.forEach(quality => {
        const vForQuality = videoOnly.filter(v => v.qualityLabel === quality && !v.codec.includes('av01'));
        const mp4Video = vForQuality.filter(v => v.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0];
        const webmVideo = vForQuality.filter(v => v.container === 'webm').sort((a,b) => b.bitrate - a.bitrate)[0];

        uniqueLanguages.forEach(lang => {
            const aForLang = audioOnly.filter(a => a.languageId === lang.id);
            const mp4Audio = aForLang.filter(a => a.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0];
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

    // Modern styling injection
    ytproDownDiv.insertAdjacentHTML('beforeend', `
        <style>
        @keyframes ytSpin { to { transform: rotate(360deg); } }
        #downytprodiv * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; }
        .yt-dl-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: ${isD ? "#8e8e93" : "#86868b"}; margin: 16px 0 8px 4px; text-align: left; }
        .yt-dl-card { background: ${isD ? "#212124" : "#f6f6f9"}; border-radius: 20px; padding: 6px 12px; margin-bottom: 12px; border: 1px solid ${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; }
        .yt-dl-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 4px; min-height: 48px; border-radius: 14px; cursor: pointer; transition: background 0.15s ease; text-decoration: none; }
        .yt-dl-item:not(:last-child) { border-bottom: 1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}; }
        .yt-dl-item:active { opacity: 0.7; }
        .yt-badge-res { font-size: 14px; font-weight: 700; color: ${isD ? "#fff" : "#111"}; }
        .yt-badge-sub { font-size: 11.5px; font-weight: 500; opacity: 0.65; margin-top: 2px; }
        .yt-dl-btn { height: 32px; width: 32px; border-radius: 50%; background: ${isD ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .yt-dl-tag { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: rgba(10,132,255,0.15); color: #0a84ff; margin-left: 6px; text-transform: uppercase; }
        .yt-dl-accordion-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 6px; font-size: 13.5px; font-weight: 600; color: ${isD ? "#98989d" : "#6e6e73"}; cursor: pointer; user-select: none; }
        .yt-select-lang { height: 34px; border-radius: 12px; border: 0; padding: 0 10px; font-size: 13px; font-weight: 600; color: ${c}; background: ${isD ? "#2a2a2d" : "#eaeaea"}; outline: none; }
        </style>
    `);

    // Top Language Picker Row
    ytproDownDiv.querySelector("#videoViewDiv").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;background:${isD ? "#212124" : "#f6f6f9"};padding:8px 14px;border-radius:16px;margin-bottom:14px;border:1px solid ${isD ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};">
            <span style="font-size:13.5px;font-weight:600;">Audio Language</span>
            <select id="selectLang" class="yt-select-lang"></select>
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

    // ── 1. Video with Sound (Pre-Muxed Master List) ──
    function updateMuxFormats(langId = uniqueLanguages.filter(arr => arr.isDefault)[0]?.id || uniqueLanguages[0]?.id) {
        muxedDiv.innerHTML = `<div class="yt-dl-section-title">Video with Audio (Complete)</div><div class="yt-dl-card"></div>`;
        var container = muxedDiv.querySelector(".yt-dl-card");

        muxableOptions.forEach(mux => {
            if (mux.languageId != langId) return;

            var item = document.createElement("div");
            item.className = "yt-dl-item";
            Object.assign(item.dataset, {
                langId: mux.audioDetails.audioTrackId,
                isWebm: mux.container == "webm",
                audioItag: mux.audioItag,
                videoItag: mux.videoItag
            });

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <div style="display:flex;align-items:center;">
                        <span class="yt-badge-res">${mux.qualityLabel}</span>
                        <span class="yt-dl-tag">${mux.container}</span>
                    </div>
                    <span class="yt-badge-sub">Video + Audio • ${mux.totalSizeFormatted}</span>
                </div>
                <div class="yt-dl-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // ── 2. Audio Only Section ──
    function updateAudioOnlyFormats(langId = uniqueLanguages.filter(arr => arr.isDefault)[0]?.id || uniqueLanguages[0]?.id) {
        audioOnlyDiv.innerHTML = "";
        var card = document.createElement("div");
        card.className = "yt-dl-card";

        var header = document.createElement("div");
        header.className = "yt-dl-accordion-btn";
        header.innerHTML = `
            <span>Audio Only Tracks</span>
            <svg style="transition:transform 0.25s ease;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="${isD ? "#8e8e93" : "#86868b"}" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
        `;
        card.appendChild(header);

        var listWrapper = document.createElement("div");
        listWrapper.style.display = "none";

        audioOnly.forEach(aud => {
            if (aud.languageId != langId) return;

            var item = document.createElement("div");
            item.className = "yt-dl-item";
            Object.assign(item.dataset, {
                langId: aud.audioTrackId,
                isWebm: aud.container == "webm",
                audioItag: aud.itag
            });

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <span class="yt-badge-res">${aud.audioQuality ? aud.audioQuality.replace("AUDIO_QUALITY_", "").toLowerCase() : "Audio"}</span>
                    <span class="yt-badge-sub">${aud.container.toUpperCase()} • ${aud.sizeFormatted}</span>
                </div>
                <div class="yt-dl-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
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

    // ── 3. Video Only (Muted) Section ──
    function updateVideoOnlyFormats() {
        videoOnlyDiv.innerHTML = "";
        var card = document.createElement("div");
        card.className = "yt-dl-card";

        var header = document.createElement("div");
        header.className = "yt-dl-accordion-btn";
        header.innerHTML = `
            <span>Video Only (No Sound)</span>
            <svg style="transition:transform 0.25s ease;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="${isD ? "#8e8e93" : "#86868b"}" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
        `;
        card.appendChild(header);

        var listWrapper = document.createElement("div");
        listWrapper.style.display = "none";

        videoOnly.forEach(vid => {
            var item = document.createElement("div");
            item.className = "yt-dl-item";
            item.dataset.videoItag = vid.itag;
            item.dataset.isWebm = vid.container == "webm";

            item.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:flex-start;text-align:left;">
                    <span class="yt-badge-res">${vid.qualityLabel}</span>
                    <span class="yt-badge-sub">${vid.container.toUpperCase()} • ${vid.sizeFormatted}</span>
                </div>
                <div class="yt-dl-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
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

    // ── Thumbnails View ──
    function updateThumbnails() {
        var div = ytproDownDiv.querySelector("#thumbViewDiv");
        div.innerHTML = `<div class="yt-dl-section-title">Thumbnails</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;"></div>`;
        var grid = div.querySelector("div:last-child");

        var thumbs = info.basic_info.thumbnail || [];
        thumbs.forEach(thumb => {
            var card = document.createElement("div");
            card.setAttribute("data-url", thumb.url);
            card.setAttribute("data-title", `Thumbnail ${thumb.height}x${thumb.width} ${safeTitle} YTPRO.jpg`);
            card.style.cssText = `background:${isD ? "#212124" : "#f6f6f9"};border-radius:16px;padding:8px;cursor:pointer;border:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};text-align:center;`;
            card.innerHTML = `
                <img src="${thumb.url}" style="width:100%;height:85px;object-fit:cover;border-radius:10px;margin-bottom:6px;">
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

    // ── Captions View ──
    function updateCaptions() {
        var div = ytproDownDiv.querySelector("#captionsViewDiv");
        var captions = info?.captions?.caption_tracks;

        if (!captions || captions.length === 0) {
            div.innerHTML = `<div style="padding:40px 0;opacity:0.6;font-size:14px;text-align:center;">No Subtitles / Captions Found</div>`;
            return;
        }

        div.innerHTML = `<div class="yt-dl-section-title">Subtitles & Captions</div><div class="yt-dl-card"></div>`;
        var card = div.querySelector(".yt-dl-card");
        var t = `Captions ${safeTitle} YTPRO`;

        captions.forEach(cap => {
            cap.baseUrl = cap.base_url.replace("&fmt=srv3", "");
            var row = document.createElement("div");
            row.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:10px 4px;border-bottom:1px solid ${isD ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};`;
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

    // Event Listeners for Downloads
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

    // ── Extract SABR Config ──
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

    // ── Core Downloader & Unified Muxing ──
    async function downloadSABRStream(videoItag, audioItag, isWebm, langId, enabledTrack) {
        if (!Android.isWebViewSupported()) {
            Android.showToast("Please Update your WebView.");
            return;
        }
        if (!Android.hasStoragePermission()) {
            return;
        }

        Android.showToast("Download Started");

        const containerExt = isWebm == "true" ? 'webm' : 'mp4';
        const lowestAudio = audioOnly.sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0]?.itag;
        const lowestVideo = adaptiveFormats.filter(f => f.width).sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0]?.itag;

        const trashSabrAudio = sabrFormats.filter(s => s.itag == lowestAudio)[0];
        const trashSabrVideo = sabrFormats.filter(s => s.itag == lowestVideo)[0];

        const targetSabrVideo = sabrFormats.filter(s => s.itag == videoItag)[0] || trashSabrVideo;
        var targetSabrAudio;
        if (langId != "undefined" && langId != null) {
            targetSabrAudio = sabrFormats.filter(s => s.itag == audioItag && s.audioTrackId == langId)[0] || trashSabrAudio;
        } else {
            targetSabrAudio = sabrFormats.filter(s => s.itag == audioItag)[0] || trashSabrAudio;
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

        function createProgreses(streamName) {
            var elWrapper = document.createElement("div");
            elWrapper.style.cssText = "margin-bottom:12px;";

            var elDetails = document.createElement("div");
            elDetails.className = "ytproDetails";
            elDetails.innerHTML = `<span style="font-weight:600;">${streamName}</span><span style="font-size:12px;opacity:0.7;">Connecting...</span>`;

            var elProgressBar = document.createElement("div");
            elProgressBar.className = "ytproProgressBar";

            var elProgress = document.createElement("div");
            elProgress.className = "ytproProgress";
            elProgressBar.appendChild(elProgress);

            elWrapper.appendChild(elDetails);
            elWrapper.appendChild(elProgressBar);
            downloaderDiv.appendChild(elWrapper);

            return { elDetails, elProgress };
        }

        downloaderDiv.innerHTML = `
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:${isD ? "#fff" : "#000"};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden;">${safeTitle}</div>
            <div style="font-size:12px;opacity:0.6;margin-bottom:14px;">Do not close the app while downloading</div>
        `;

        if (enabledTrack == EnabledTrackTypes.VIDEO_ONLY) {
            const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);
            var fileName = `${safeTitle}_video_${new Date().getTime()}.${containerExt}`;
            var { elDetails, elProgress } = createProgreses("Video Stream");
            await pipeToDisk(videoStream, fileName, estVideoBytes, elDetails, elProgress);
        } else if (enabledTrack == EnabledTrackTypes.AUDIO_ONLY) {
            const estAudioBytes = targetSabrAudio.contentLength || (targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);
            var fileName = `${safeTitle}_audio_${new Date().getTime()}.${containerExt}`;
            var { elDetails, elProgress } = createProgreses("Audio Stream");
            await pipeToDisk(audioStream, fileName, estAudioBytes, elDetails, elProgress);
        } else if (enabledTrack == EnabledTrackTypes.VIDEO_AND_AUDIO) {
            // Both Video + Audio: Download simultaneously and Mux into a single format file
            const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);
            const estAudioBytes = targetSabrAudio.contentLength || (targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);

            var videoEl = createProgreses("Video Track");
            var audioEl = createProgreses("Audio Track");

            var videoFileName = `temp_v_${new Date().getTime()}.${containerExt}`;
            var audioFileName = `temp_a_${new Date().getTime()}.${containerExt}`;
            var finalFileName = `${safeTitle}.${containerExt}`;

            const downloadTasks = [];
            if (videoStream) {
                downloadTasks.push(pipeToDisk(videoStream, videoFileName, estVideoBytes, videoEl.elDetails, videoEl.elProgress));
            }
            if (audioStream) {
                downloadTasks.push(pipeToDisk(audioStream, audioFileName, estAudioBytes, audioEl.elDetails, audioEl.elProgress));
            }

            await Promise.all(downloadTasks);

            window.Android?.showToast?.('Merging Video and Audio into Single File...');
            if (window.Android?.muxVideoAudio) {
                window.Android.muxVideoAudio(videoFileName, audioFileName, finalFileName);
            }
        }
    }
};

function getDownloadElement() {
    const isExisting = (id) => document.getElementById(id);
    const ytproDown = isExisting("outerdownytprodiv") || document.createElement("div");
    const ytproDownDiv = isExisting("downytprodiv") || document.createElement("div");

    ytproDown.id = "outerdownytprodiv";
    ytproDownDiv.id = "downytprodiv";

    Object.assign(ytproDown.style, {
        height: "100%", width: "100%", position: "fixed",
        top: "0", left: "0", display: "flex", alignItems: "flex-end",
        justifyContent: "center", background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(10px)", webkitBackdropFilter: "blur(10px)",
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
        boxSizing: "border-box", animation: "slideUp .3s cubic-bezier(0.2,0.9,0.3,1)"
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

// Global registry for Port Streaming
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

async function pipeToDisk(stream, fileName, expectedTotalBytesStr, elDetails, elProgress) {
    const expectedBytes = parseInt(expectedTotalBytesStr || "0", 10);
    const totalMB = expectedBytes > 0 ? (expectedBytes / (1024 * 1024)).toFixed(1) : '?';

    const filePort = await createDedicatedPipe(fileName);
    if (!filePort) {
        console.error(`[YTPRO] Failed to get port for ${fileName}`);
        return 0;
    }

    const reader = stream.getReader();
    let total = 0;
    let lastLogMB = -1;

    try {
        const CHUNK_SIZE = 1024 * 512;
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
                    await new Promise(r => setTimeout(r, 4));
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

    div.innerHTML = `
        <style>
        .ytproDetails { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 6px; font-size: 13.5px; }
        .ytproProgressBar { display: flex; width: 100%; height: 16px; background: ${isD ? "#2c2c2e" : "#e5e5ea"}; border-radius: 20px; overflow: hidden; }
        .ytproProgress { display: flex; align-items: center; justify-content: center; width: 0%; height: 100%; background: #0a84ff; border-radius: 20px; color: #fff; font-size: 10px; font-weight: 700; transition: width 0.2s ease; }
        </style>
    `;
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