/**
 * Modified for YTPro - Premium UI Overhaul
 */
if(null==window.eruda&&"true"==localStorage.getItem("devMode")){var script=document.createElement("script");script.src="//youtube.com/ytpro_cdn/npm/eruda",document.body.appendChild(script),script.onload=()=>{eruda.init()}}if(!YTProVer){var YTProVer="3.98",ytoldV="",isF=!1,isAp=!1;const e=HTMLMediaElement.prototype.pause;window.PIPause=!1,window.isPIP=!1,window.pauseAllowed=!0;var sTime=[],webUrls=["m.youtube.com","youtube.com","yout.be","accounts.google.com"],GeminiAT="",GeminiModels={"3.0 Pro":'[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4],null,null,1]',"3.0 Flash":'[1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1]',"3.0 Flash Thinking":'[1,null,null,null,"5bf011840784117a",null,null,0,[4],null,null,1]',"3.0 Pro Plus":'[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,4]',"3.0 Flash Plus":'[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,4]',"3.0 Flash Thinking Plus":'[1,null,null,null,"e051ce1aa80aa576",null,null,0,[4],null,null,4]',"3.0 Pro Advanced":'[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4],null,null,2]',"3.0 Flash Advanced":'[1,null,null,null,"56fdd199312815e2",null,null,0,[4],null,null,2]',"3.0 Flash Thinking Advanced":'[1,null,null,null,"e051ce1aa80aa576",null,null,0,[4],null,null,2]'},YTPROCodecs={video:["AV1","VP8","VP9","H264"],audio:["Opus","Mp4a"]};let t=0,n=0,a=null;var sens=.005,vol=Android.getVolume(),brt=Android.getBrightness()/100;null!=localStorage.getItem("saveCInfo")&&null!=localStorage.getItem("gesC")&&null!=localStorage.getItem("gesM")&&null!=localStorage.getItem("bgplay")||(localStorage.setItem("autoSpn","true"),localStorage.setItem("bgplay","true"),localStorage.setItem("gesC","true"),localStorage.setItem("gesM","false"),localStorage.setItem("fzoom","false"),localStorage.setItem("saveCInfo","true"),localStorage.setItem("geminiModel","3.0 Flash"),localStorage.setItem("prompt","Give me details about this YouTube video Id: {videoId} , a detailed summary of timestamps with facts , resources and reviews of the main content"),localStorage.setItem("devMode","false"),localStorage.setItem("block_60fps","false"),YTPROCodecs.video.forEach((e=>{localStorage.setItem(e,"true")})),YTPROCodecs.audio.forEach((e=>{localStorage.setItem(e,"true")}))),"true"==localStorage.getItem("fzoom")&&document.getElementsByName("viewport")[0].setAttribute("content",""),["2.0 Flash","2.0 Flash Thinking","2.5 Flash","2.5 Pro"].includes(localStorage.getItem("geminiModel"))&&localStorage.setItem("geminiModel","3.0 Flash"),ytoldV=window.location.pathname.indexOf("shorts")>-1?window.location.pathname:new URLSearchParams(window.location.search).get("v");var c="#000",d="#f2f2f2",dc="#fff",isD=!1,dislikes="...";document.cookie.indexOf("f6=40000")>-1?(dc="#000",c="#fff",d="rgba(255,255,255,0.1)",isD=!0):(dc="#fff",c="#000",d="rgba(0,0,0,0.05)",isD=!1);var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">\n<path\nd="M16.59 9H15V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H7.41a1 1 0 0 0-.7 1.7l4.59 4.59a1 1 0 0 0 1.42 0l4.59-4.59a1 1 0 0 0-.72-1.7Z"\nstroke="${c}"\nstroke-width="1.8"\nstroke-linecap="round"\nstroke-linejoin="round"\n/>\n<rect x="5" y="17.2" width="14" height="1.8" rx="0.9" fill="${c}" />\n</svg>\n`;
function override(){var e=document.createElement("video"),t=e.canPlayType.bind(e);e.__proto__.canPlayType=makeModifiedTypeChecker(t);var n=window.MediaSource;if(void 0!==n){var a=n.isTypeSupported.bind(n);n.isTypeSupported=makeModifiedTypeChecker(a)}}function makeModifiedTypeChecker(e){return function(t){if(void 0===t)return"";var n=[];"false"===localStorage.H264&&n.push("avc"),"false"===localStorage.VP8&&n.push("vp8"),"false"===localStorage.VP9&&n.push("vp9","vp09"),"true"===localStorage.AV1&&n.push("av01","av99"),"false"===localStorage.Opus&&n.push("opus"),"false"===localStorage.Mp4a&&n.push("mp4a");for(var a=0;a<n.length;a++)if(-1!==t.indexOf(n[a]))return"";if("true"===localStorage.block_60fps){var o=/framerate=(\d+)/.exec(t);if(o&&o[1]>30)return""}return e(t)}}function insertAfter(e,t){try{e.parentNode.insertBefore(t,e.nextSibling)}catch{}}async function waitForElement(e,t){return new Promise((n=>{const a=document.querySelector(e);if(a){if(t&&""!=a.src)return n(a);if(!t)return n(a)}const o=new MutationObserver((()=>{const a=document.querySelector(e);a&&(t&&a.src&&(n(a),o.disconnect()),t||(n(a),o.disconnect()))}));o.observe(document.body,{childList:!0,subtree:!0})}))}override();var addSettingsTab=()=>{if(null==document.getElementById("setDiv")){var e=document.createElement("div");e.setAttribute("style","\nz-index:9999999999;\nfont-size:22px;\ntext-align:center;\nline-height:35px;\npointer-events:auto;\n"),e.setAttribute("id","setDiv");var t=document.createElement("ytm-pivot-bar-item-renderer");t.innerHTML=`<svg fill="${window.location.href.indexOf("watch")<0?c:"#fff"}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"  id="hSett"><path d="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"></path></svg>\n`,e.appendChild(t),insertAfter(document.getElementsByTagName("ytm-home-logo")[0],e),null!=document.getElementById("hSett")&&document.getElementById("hSett").addEventListener("click",(function(e){window.location.hash="settings"}))}};function getDislikesInLocale(e){var t=e;if(e<1e3)t=e;else{const n=Math.floor(Math.log10(e)-2),a=n+(n%3?1:0);t=Math.floor(e/10**a)*10**a}let n;if(document.documentElement.lang)n=document.documentElement.lang;else if(navigator.language)n=navigator.language;else try{n=new URL(Array.from(document.querySelectorAll("head > link[rel='search']"))?.find((e=>e?.getAttribute("href")?.includes("?locale=")))?.getAttribute("href"))?.searchParams?.get("locale")}catch{n="en"}return Intl.NumberFormat(n,{notation:"compact",compactDisplay:"short"}).format(t)}async function skipSponsor(){var e=document.createElement("div");e.setAttribute("style","height:3px;pointer-events:none;width:100%;position:absolute;z-index:99;"),e.setAttribute("id","sDiv");var t=document.getElementsByClassName("video-stream")[0].duration;if(!isNaN(t)){for(var n in sTime){var a=document.createElement("div"),o=sTime[n];a.setAttribute("style",`height:3px;width:${100/t*(o[1]-o[0])}%;background:#0f8;position:absolute;z-index:9;left:${100/t*o[0]}%;`),e.appendChild(a)}await waitForElement("yt-progress-bar",!1);if(null==document.getElementById("sDiv"))if(null!=document.getElementsByClassName("ytPlayerProgressBarHost")[0])document.getElementsByClassName("ytPlayerProgressBarHost")[0].appendChild(e);else try{document.getElementsByClassName("ytProgressBarLineProgressBarLine")[0].appendChild(e)}catch{}}}async function fDislikes(e){var t=new URL(e),n="";t.pathname.indexOf("shorts")>-1?n=t.pathname.substr(8,t.pathname.length):t.pathname.indexOf("watch")>-1&&(n=t.searchParams.get("v")),fetch("https://returnyoutubedislikeapi.com/votes?videoId="+n).then((e=>e.json())).then((e=>{"dislikes"in e&&(dislikes=getDislikesInLocale(parseInt(e.dislikes)))})).catch((e=>{}))}async function checkSponsors(e){if(e.indexOf("watch")>-1){sTime=[],await fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+new URL(e).searchParams.get("v")).then((e=>e.json())).then((e=>{for(var t in e){var n=e[t].segment;sTime.push(n)}})).catch((e=>{}));var t=await waitForElement(".video-stream",!0);t.ontimeupdate=()=>{skipSponsor();var e=t.currentTime;for(var n in sTime){var a=sTime[n];Math.floor(e)==Math.floor(a[0])&&"true"==localStorage.getItem("autoSpn")&&(t.currentTime=a[1],addSkipper(a[0]))}}}}function addSkipper(e){var t=document.createElement("div");t.setAttribute("style",`\nheight:50px;${screen.width>screen.height?"width:50%;":"width:80%;"}overflow:auto;background:rgba(130,130,130,.3);\nbackdrop-filter:blur(6px);\nposition:absolute;bottom:40px;\nline-height:50px;\nleft:calc(15% / 2 );padding-left:10px;padding-right:10px;\nz-index:99999999999999;text-align:center;border-radius:25px;\ncolor:white;text-align:center;\n`),t.innerHTML='<span style="height:30px;line-height:30px;margin-top:10px;display:block;font-family:monospace;font-size:16px;float:left;">Skipped Sponsor</span>\n<span style="height:30px;line-height:44px;float:right;padding-right:30px;margin-top:10px;display:block;padding-left:30px;border-left:1px solid white;">\n<svg data-action="rewind" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style="margin-top:0px;" fill="currentColor" viewBox="0 0 16 16">\n<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>\n<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>\n</svg>\n<svg data-action="close" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\n<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>\n</svg>\n</span>',document.getElementById("player-control-container").appendChild(t),t.addEventListener("click",(t=>{var n=t.target.closest("[data-action]");if(n){var a=n.dataset.action;"close"==a?n.parentElement.parentElement.remove():"rewind"==a&&(n.parentElement.parentElement.remove(),document.getElementsByClassName("video-stream")[0].currentTime=e+1)}})),setTimeout((()=>{t.remove()}),5e3)}if(fDislikes(window.location.href),checkSponsors(window.location.href),window.location.pathname.indexOf("watch")>-1||window.location.pathname.indexOf("shorts")>-1)var unV=setInterval((()=>{document.getElementsByClassName("video-stream")[0].muted=!1,document.getElementsByClassName("video-stream")[0].muted||clearInterval(unV)}),5);

function sty(e){
    var n={display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"500",height:"36px",minWidth:"80px",width:"auto",borderRadius:"18px",background:isD?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)",color:isD?"#fff":"#0f0f0f",fontSize:"14px",marginRight:"8px",padding:"0 16px",textAlign:"center",cursor:"pointer",border:"none",fontFamily:"Roboto, Arial, sans-serif"};
    for(let x in n) e.style[x]=n[x];
}

function getGeminiModels(){
    var e = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;"><b style="font-size:16px;">Select Model</b><div data-action="closeSub" style="padding:5px;cursor:pointer;">&times;</div></div>`;
    for(var t in GeminiModels){
        var bg = t == localStorage.getItem("geminiModel") ? (isD ? '#3ea6ff' : '#065fd4') : (isD ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
        var cl = t == localStorage.getItem("geminiModel") ? '#fff' : (isD ? '#fff' : '#0f0f0f');
        e += `<button data-action="saveModel" data-value="${t}" style="background:${bg};color:${cl};"> ${t} </button>`;
    }
    return e;
}

function getYTPROCodecs(){
    var e = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;"><b style="font-size:16px;">Video Codecs</b><div data-action="closeSub" style="padding:5px;cursor:pointer;">&times;</div></div>`;
    for(var t in YTPROCodecs.video) {
        var n = YTPROCodecs.video[t];
        var bg = "true" == localStorage.getItem(n) ? (isD ? '#3ea6ff' : '#065fd4') : (isD ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
        var cl = "true" == localStorage.getItem(n) ? '#fff' : (isD ? '#fff' : '#0f0f0f');
        e += `<button data-action="setRemoveCodec" data-value="${n}" style="background:${bg};color:${cl};">${n}</button>`;
    }
    e += `<div style="margin:15px 0 10px;font-weight:bold;font-size:16px;text-align:left;">Audio Codecs</div>`;
    for(var t in YTPROCodecs.audio) {
        var n = YTPROCodecs.audio[t];
        var bg = "true" == localStorage.getItem(n) ? (isD ? '#3ea6ff' : '#065fd4') : (isD ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
        var cl = "true" == localStorage.getItem(n) ? '#fff' : (isD ? '#fff' : '#0f0f0f');
        e += `<button data-action="setRemoveCodec" data-value="${n}" style="background:${bg};color:${cl};">${n}</button>`;
    }
    return e;
}

function setRemoveCodec(e, t) {
    var activeBg = isD ? "#3ea6ff" : "#065fd4";
    var inactiveBg = isD ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
    if ("true" == localStorage[e]) {
        localStorage.setItem(e, "false");
        t.style.background = inactiveBg;
        t.style.color = isD ? "#fff" : "#0f0f0f";
    } else {
        localStorage.setItem(e, "true");
        t.style.background = activeBg;
        t.style.color = "#fff";
    }
}

async function ytproSettings() {
    var e = document.createElement("div"), t = document.createElement("div");
    e.setAttribute("id", "settingsprodiv");
    t.setAttribute("id", "ssprodivI");
    e.setAttribute("style", `
        height:100%; width:100%; position:fixed; top:0; left:0;
        display:flex; justify-content:center; align-items:flex-end;
        background:rgba(0,0,0,0.6); z-index:9999;
        transition: opacity 0.3s;
    `);
    e.addEventListener("click", (function(ev){ ev.target == e && history.back() }));

    t.setAttribute("style", `
        height:82%; width:100%; max-width:600px; overflow:hidden; display:flex; flex-direction:column;
        background:${isD ? "#212121" : "#fff"};
        position:relative; border-radius:24px 24px 0 0;
        color:${isD ? "#fff" : "#0f0f0f"}; font-family: 'Roboto', Arial, sans-serif;
        animation: slideUp 0.3s ease-out; box-shadow: 0 -5px 15px rgba(0,0,0,0.3);
    `);

    var tHeader = `
        <style>
            @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .prem-title { font-size:20px; font-weight:700; padding:16px 20px; border-bottom:1px solid ${isD ? '#333' : '#e5e5e5'}; display:flex; justify-content:space-between; align-items:center; }
            .prem-content { overflow-y:auto; padding-bottom:30px; }
            .prem-section { margin-top: 20px; }
            .prem-section-title { font-size:13px; font-weight:600; color:${isD ? '#aaa' : '#606060'}; padding:0 20px 8px; text-transform:uppercase; letter-spacing:0.5px; }
            .prem-item { display:flex; align-items:center; padding:14px 20px; cursor:pointer; justify-content:space-between; }
            .prem-item:active { background:${isD ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
            .prem-item-left { display:flex; align-items:center; gap:16px; font-size:16px; }
            .prem-icon { width:24px; height:24px; fill:${isD ? '#fff' : '#0f0f0f'}; }
            .prem-switch { position:relative; width:40px; height:22px; border-radius:11px; transition:0.3s; }
            .prem-switch b { display:block; position:absolute; top:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:0.3s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
            .prem-input-container { padding: 15px 20px; }
            .prem-input { width:100%; height:44px; border:none; background:${isD ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}; border-radius:8px; padding:0 15px; color:${isD ? '#fff' : '#000'}; font-size:14px; box-sizing:border-box; }
            .prem-credit { text-align:center; padding: 25px 20px 10px; font-size: 13px; color: ${isD ? '#aaa' : '#606060'}; line-height:1.6; }
            /* Sub-menus */
            .geminiModels, .disableCodecs, .geminiPrompt { display:none; position:fixed; bottom:0; left:0; width:100%; height:auto; background:${isD ? "#212121" : "#fff"}; border-radius:24px 24px 0 0; z-index:999999; padding:20px; box-sizing:border-box; box-shadow:0 -5px 20px rgba(0,0,0,0.3); max-height:80%; overflow-y:auto; animation: slideUp 0.3s ease-out; }
            .geminiModels button, .disableCodecs button { width:100%; padding:14px; margin-bottom:10px; border-radius:12px; border:none; font-size:16px; cursor:pointer; text-align:left; transition: 0.2s; }
        </style>
        <div class="prem-title">
            <div>Settings <span style="font-size:12px; color:#888; font-weight:400; margin-left:8px;">v${YTProVer}</span></div>
            <div style="cursor:pointer; padding:5px;" onclick="history.back()">&times;</div>
        </div>
        <div class="prem-content">
            <div class="prem-input-container">
                <input type="url" placeholder="Enter Youtube URL" id="ytproUrlInput" class="prem-input">
            </div>

            <div class="prem-section">
                <div class="prem-section-title">Library</div>
                <div class="prem-item" data-action="hearts">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Liked Videos</div>
                </div>
                <div class="prem-item" data-action="downloads">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Downloads</div>
                </div>
            </div>

            <div class="prem-section">
                <div class="prem-section-title">Playback & UI</div>
                <div class="prem-item" data-action="sttCnf" data-value="autoSpn">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg> Autoskip Sponsors</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'autoSpn')}"><b style="${sttCnf(0,1,'autoSpn')}"></b></span>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="gesC">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.04.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/></svg> Gesture Controls</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'gesC')}"><b style="${sttCnf(0,1,'gesC')}"></b></span>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="gesM">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/></svg> Miniplayer Gesture</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'gesM')}"><b style="${sttCnf(0,1,'gesM')}"></b></span>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="fzoom">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"/></svg> Force Zoom</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'fzoom')}"><b style="${sttCnf(0,1,'fzoom')}"></b></span>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="bgplay">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 7.48 2 13h2c0-4.41 3.59-8 8-8s8 3.59 8 8h2c0-5.52-4.48-10-10-10zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> Background Play</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'bgplay')}"><b style="${sttCnf(0,1,'bgplay')}"></b></span>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="shorts">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M17.77 10.33l-1.95-.92L19.29 4h-2.58l-3.48 5.4L10 8.01 4.71 14h2.58l3.48-5.4 3.23 1.42L10.53 20h2.58l3.48-5.4z"/></svg> Hide Shorts</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'shorts')}"><b style="${sttCnf(0,1,'shorts')}"></b></span>
                </div>
            </div>

            <div class="prem-section">
                <div class="prem-section-title">Gemini AI</div>
                <div class="prem-item" data-action="sttCnf" data-value="saveCInfo">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg> Single Gemini chat</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'saveCInfo')}"><b style="${sttCnf(0,1,'saveCInfo')}"></b></span>
                </div>
                <div class="prem-item" data-action="geminiModels">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M19.5 9.5l-1.22 2.78L15.5 13.5l2.78 1.22L19.5 17.5l1.22-2.78L23.5 13.5l-2.78-1.22L19.5 9.5zM11 2L8.5 7.5 3 10l5.5 2.5L11 18l2.5-5.5L19 10l-5.5-2.5L11 2zm0 11.47L9.57 10 8.1 8.53 11 7.06l2.9 1.47L12.43 10 11 13.47z"/></svg> Select Gemini Model</div>
                </div>
                <div class="prem-item" data-action="geminiPrompt">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> Edit Gemini Prompt</div>
                </div>
            </div>

            <div class="prem-section">
                <div class="prem-section-title">Advanced & Support</div>
                <div class="prem-item" data-action="disableCodecs">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 C9.65,21.83,9.85,22,10.09,22h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg> Disable Codecs</div>
                </div>
                <div class="prem-item" data-action="sttCnf" data-value="devMode">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg> Developer Mode</div>
                    <span class="prem-switch" style="${sttCnf(0,0,'devMode')}"><b style="${sttCnf(0,1,'devMode')}"></b></span>
                </div>
                <div class="prem-item" data-action="issues">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg> Report Bugs</div>
                </div>
                <div class="prem-item" data-action="sponsor">
                    <div class="prem-item-left"><svg class="prem-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Become a Sponsor</div>
                </div>
            </div>

            <div class="prem-credit">
                <b>Disclaimer</b>: This is an unofficial OSS Youtube Mod, all the logos and brand names are property of Google LLC.<br>
                Source: <a href="https://github.com/prateek-chaubey/YTPRO" style="color:#065fd4;text-decoration:none;">github.com/prateek-chaubey/YTPRO</a><br>
                Made by Prateek Chaubey
            </div>
        </div>

        <div class="geminiModels"></div>
        <div class="geminiPrompt">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <b style="font-size:16px;">Edit Gemini Prompt</b>
                <button style="width:auto; padding:8px 16px; margin:0; background:${isD ? '#3ea6ff' : '#065fd4'}; color:#fff; border-radius:18px;" data-action="savePrompt">Save</button>
            </div>
            <textarea style="width:100%; height:200px; border-radius:12px; padding:15px; background:${isD ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}; color:${isD ? '#fff' : '#0f0f0f'}; border:none; box-sizing:border-box;">${localStorage.getItem("prompt")}</textarea>
        </div>
        <div class="disableCodecs"></div>
    `;
    
    t.innerHTML = tHeader;
    document.body.appendChild(e);
    e.appendChild(t);
    document.getElementById("ytproUrlInput").addEventListener("keyup", searchUrl);

    var n = {
        follow: () => { Android.oplink("https://www.instagram.com/habitius.daily"); },
        hearts: () => { window.location.hash = "#hearts"; },
        downloads: () => { window.location.hash = "#download"; },
        sttCnf: (e, t) => { sttCnf(e, t); },
        geminiModels: () => { 
            var el = document.getElementsByClassName("geminiModels")[0];
            el.style.display = "block"; 
            el.innerHTML = getGeminiModels(); 
        },
        geminiPrompt: () => { document.getElementsByClassName("geminiPrompt")[0].style.display = "block"; },
        issues: () => { Android.oplink("https://github.com/prateek-chaubey/YTPRO/issues"); },
        disableCodecs: () => { 
            var el = document.getElementsByClassName("disableCodecs")[0];
            el.style.display = "block"; 
            el.innerHTML = getYTPROCodecs(); 
        },
        sponsor: () => { Android.oplink("https://github.com/sponsors/prateek-chaubey"); },
        savePrompt: e => { 
            localStorage.setItem("prompt", e.parentElement.nextElementSibling.value); 
            e.parentElement.parentElement.style.display = "none"; 
        },
        closeSub: e => { e.parentElement.parentElement.style.display = "none"; },
        setRemoveCodec: (e, t) => { setRemoveCodec(t, e); },
        block_60fps: e => { sttCnf(e, "block_60fps"); },
        saveModel: (e, t) => { 
            localStorage.removeItem("geminiChatInfo"); 
            localStorage.setItem("geminiModel", t); 
            e.parentElement.style.display = "none"; 
        }
    };

    t.querySelectorAll("[data-action]").forEach(e => {
        e.addEventListener("click", () => {
            "sttCnf" == e.dataset.action ? n[e.dataset.action](e, e.dataset.value) : n[e.dataset.action](e);
        })
    });
    t.querySelector(".disableCodecs").addEventListener("click", e => {
        var tr = e.target.closest("[data-action]");
        tr && n[tr.dataset.action](tr, tr.dataset.value);
    });
    t.querySelector(".geminiModels").addEventListener("click", e => {
        var tr = e.target.closest("[data-action]");
        tr && n[tr.dataset.action](tr, tr.dataset.value);
    });
}

function searchUrl(e){if(13===e.keyCode||"Enter"===e){var t=e.target.value;const o=/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|shorts|live)\/))([a-zA-Z0-9_-]{11})/,i=t.match(o);var n=i?i[1]:null;if(n)return navigateInternalYtMweb(n);var a=document.createElement("a");a.href=t,document.body.appendChild(a);try{document.getElementById("settingsprodiv").remove()}catch{}a.click()}}
function checkUpdates(){parseFloat(Android.getInfo())<parseFloat(YTProVer)?updateModel():Android.showToast("Your app is up to date"),fetch("https://youtube.com/ytpro_cdn/npm/ytpro",{cache:"reload"}),fetch("https://youtube.com/ytpro_cdn/npm/ytpro/bgplay.js",{cache:"reload"}),fetch("https://youtube.com/ytpro_cdn/npm/ytpro/innertube.js",{cache:"reload"})}

function sttCnf(e, t, n) {
    var isDark = isD;
    var activeBg = isDark ? "#3ea6ff" : "#065fd4";
    var inactiveBg = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
    var thumbColor = "#fff";

    if ("string" == typeof n) {
        var isEnabled = localStorage.getItem(n) === "true";
        if (t === 0) return `background:${isEnabled ? activeBg : inactiveBg};`; 
        if (t === 1) return `background:${thumbColor}; left:${isEnabled ? 'calc(100% - 20px)' : '2px'}; right:auto;`;
    } else if (e && e.tagName) {
        var isEnabled = localStorage.getItem(t) === "true";
        if (isEnabled) {
            localStorage.setItem(t, "false");
            e.style.background = inactiveBg;
            e.children[0].style.left = "2px";
        } else {
            localStorage.setItem(t, "true");
            e.style.background = activeBg;
            e.children[0].style.left = "calc(100% - 20px)";
        }

        if (t === "fzoom") { "false" == localStorage.getItem("fzoom") ? document.getElementsByName("viewport")[0].setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,") : document.getElementsByName("viewport")[0].setAttribute("content", ""); }
        if (t === "bgplay") { "true" == localStorage.getItem("bgplay") ? Android.setBgPlay(!0) : Android.setBgPlay(!1); }
        if (t === "gesC") { if ("true" != localStorage.getItem("gesC")) try { document.getElementById("brtS").remove(); document.getElementById("volS").remove(); } catch (err) {} }
        if (t === "devMode") {
            if ("false" == localStorage.getItem("devMode")) try { eruda.destroy(); } catch (err) {}
            else if (!window.eruda && "true" == localStorage.getItem("devMode")) {
                var o = document.createElement("script");
                o.src = "//youtube.com/ytpro_cdn/npm/eruda";
                document.body.appendChild(o);
                o.onload = () => { eruda.init(); };
            }
        }
    }
}

function formatFileSize(e){var t=parseInt(e);for(var n=0;t>1024;n++)t/=1024;return`${t.toFixed(1)} ${["B","KB","MB","GB","TB","PB"][n]}`}
async function ytproDownVid(){
    // Insert Download Page premium styling matching bottom-sheet design
    var st = document.getElementById("ytpro-premium-styles");
    if(!st) {
        st = document.createElement("style");
        st.id = "ytpro-premium-styles";
        st.innerHTML = `
        #outerdownytprodiv, .sabr-download-container { background: rgba(0,0,0,0.6) !important; display: flex !important; align-items: flex-end !important; justify-content: center !important; }
        #downytprodiv, .ytpro-down-ui { background: ${isD ? "#212121" : "#fff"} !important; color: ${isD ? "#fff" : "#0f0f0f"} !important; border-radius: 24px 24px 0 0 !important; width: 100% !important; max-width: 600px !important; height: 80% !important; bottom:0 !important; top:auto !important; position: relative !important; font-family: 'Roboto', Arial, sans-serif !important; animation: slideUp 0.3s ease-out !important; box-shadow: 0 -4px 10px rgba(0,0,0,0.2) !important; padding: 20px !important; box-sizing: border-box !important; }
        #downytprodiv button, .ytpro-down-ui button { border-radius: 18px !important; font-weight: 500 !important; border:none !important; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `;
        document.head.appendChild(st);
    }
    window.ytproSabrDownload();
}

function showHideAdaptives(){document.querySelectorAll(".adpFormats").forEach((e=>{"none"==e.style.display?e.style.display="flex":e.style.display="none"}))}function downCap(e,t){Android.downvid(t,e,"plain/text")}function YTDownVid(e,t){var n="";".png"==t?n="image/png":".mp4"==t?n="video/mp4":".mp3"==t&&(n="audio/mp3"),Android.downvid(e.getAttribute("data-ytprotit")+t,e.getAttribute("data-ytprourl"),n)}var stopProp=!1,zoomIn=!1,scale=1;function checkDirection(e){n>t&&n-t>20?minimize(!0):n<t&&t-n>20&&minimize(!1)}function getDistance(e){const[t,n]=e;return Math.hypot(n.pageX-t.pageX,n.pageY-t.pageY)}function minimize(e){var t=document.getElementById("miniIframe")||(()=>{var e=document.createElement("iframe");e.setAttribute("id","miniIframe"),e.setAttribute("style",`\nheight:99.999%;width:100%;\nbackground:${c};\ntop:0px;\nline-height:50px;\nposition:fixed;\nleft:0;\nz-index:999;\nborder:0;\n`),e.src="https://m.youtube.com/",document.body.appendChild(e);var t=e.contentWindow||e.contentDocument.defaultView,n=t.document;"complete"==n.readyState&&t.trustedTypes&&t.trustedTypes.createPolicy&&!t.trustedTypes.defaultPolicy&&t.trustedTypes.createPolicy("default",{createHTML:e=>e,createScriptURL:e=>e,createScript:e=>e}),t.navigation.addEventListener("navigate",(e=>{if(e.destination.url.indexOf("youtube.com")>-1){(e.destination.url.indexOf("/watch")>-1||e.destination.url.indexOf("/shorts")>-1)&&(window.location.href=e.destination.url);n.createElement("script")}else window.location.href=e.destination.url}));var a=n.createElement("script"),o=n.createTextNode("window.addEventListener('DOMContentLoaded', function() {\nvar script2 = document.createElement('script');\nscript2.src=\"//youtube.com/ytpro_cdn/npm/ytpro\";\ndocument.body.appendChild(script2);\n});\n");return a.appendChild(o),n.body.appendChild(a),e})(),n=document.getElementById("player-container-id");e?(t.style.display="block",n.setAttribute("ogTop",getComputedStyle(n).top),n.style.transform="scale(0.65)",n.style.top=window.screen.height-2.5*n.getBoundingClientRect().height+"px",n.style.zIndex="9999"):(t.style.display="none",n.style.transform="scale(1)",n.style.top=n.getAttribute("ogTop"),n.style.zIndex="normal",n.removeAttribute("ogTop"))}function callbackSNlM0e(){return new Promise((e=>{callbackSNlM0e.resolve=e}))}function callbackGeminiClient(){return new Promise((e=>{callbackGeminiClient.resolve=e}))}function handleGeminiResponse(e){var t=e.stream;if(null==t)return document.getElementById("GeminiResponse").innerHTML='<center style="margin-top:15px" > An error Occurred while connecting to Gemini';var n=t.split("\n"),a=(e=>{for(var t in e)try{var n=JSON.parse(e[t][2]);if(n[4]?.[0]?.[0].indexOf("rc_")>-1)return n}catch(e){console.log("JSON parse error: "+e)}})(JSON.parse(n[2]))||[],o=[];o.push(a?.[1]?.[0]),o.push(a?.[1]?.[1]),o.push(a?.[4]?.[0]?.[0]),localStorage.setItem("geminiChatInfo",o.toString()),a=a?.[4]?.[0];var i=a?.[1]?.[0]||"";i=i.replace(/http:\/\/googleusercontent\.com\/\S+/g,"");var l=a?.[37]?.[0]?.[0]||null,r=[];for(var s in a?.[12]?.[1]){var d=a?.[12]?.[1]?.[s];r.push({url:d[0][0][0],alt:d[0][4],title:d[7][0]}),i+=`<center><img alt="${d[0][4]}" src="${d[0][0][0]}"></center>`}let c=new showdown.Converter;c.setFlavor("github");let p=(e=>{var t=e,n=t.match(/href="([^"]*)"/g)||[],a=[...n].map((e=>e.replace(/href="|"/g,"")));return n.forEach(((e,n)=>{var o=new URL(a[n]).searchParams.get("t");null!=o?t=t.replace(e,`href="javascript:void(0);" onclick="document.getElementsByClassName('video-stream')[0].currentTime='${o}'"`):a[n].indexOf("youtube.com")<0&&a[n].indexOf("youtu.be")<0&&(t=t.replace(e,`href="javascript:void(0);" onclick="try{document.getElementsByClassName('video-stream')[0].pause();}catch{}Android.oplink('${a[n]}')"`))})),t})(c.makeHtml(i)),u=null!=l?`<button onclick="(this.nextElementSibling.style.height=='auto') ? (this.children[0].style.transform='rotate(-90deg)',this.nextElementSibling.style.height='0') : (this.children[0].style.transform='rotate(90deg)',this.nextElementSibling.style.height='auto');" class="think" >Show Thinking \n<svg xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg);margin-left:10px" width="16" height="16" fill="${isD?"#ccc":"#444"}" viewBox="0 0 16 16">\n<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>\n</svg></button>\n<div class="geminiThoughts">\n<br>\n${c.makeHtml(l)}\n\n\n</div><br>`:"";document.getElementById("GeminiResponse").innerHTML=`<a href="https://gemini.google.com/chat/${o[0].replace("c_","")}" >Go to the chat</a><br><br>\n\n${u}\n\n\n\n<div class="geminiAnswer">\n${p}\n</div>\n`}async function geminiInfo(){if(null==document.getElementById("GeminiResponse"))(e=document.createElement("div")).setAttribute("style",`min-height:80px;max-height:400px;display:block;height:auto;overflow:scroll;font-weight:400;width:calc(92% - 20px);font-size:14px;padding:10px;position:relative;margin:auto;background:${d};border-radius:15px;margin-bottom:8px;`),e.setAttribute("id","GeminiResponse"),insertAfter(document.getElementById("ytproMainDivE"),e);else var e=document.getElementById("GeminiResponse");document.getElementById("GeminiResponse").innerHTML='\n<div class="geminiLoader"></div>';var t=Android.getAllCookies(window.location.href);if(t.indexOf("__Secure-1PSID=")<0)return void(e.innerHTML=`\n<center style="margin-top:15px">\n<span >Sign in to use Gemini<span>\n<br><br>\n<a href="https://accounts.google.com/ServiceLogin?service=youtube" >\n<button style="background:${c};color:${isD?"#000":"#fff"};font-weight:500;height:35px;width:90px;border-radius:25px;text-align:center;line-height:35px;">Sign In</button>\n</a>\n<br><br>\n\n</center>`);t=t.split(";");var n="";t.forEach((e=>{(e.indexOf("__Secure-1PSID=")>-1||e.indexOf("__Secure-1PSIDTS=")>-1)&&(n+=e+";")}));var a=JSON.stringify({accept:"*/*","accept-language":"en","content-type":"application/x-www-form-urlencoded;charset=UTF-8","x-goog-ext-525001261-jspb":GeminiModels[localStorage.getItem("geminiModel")],"x-same-domain":"1",cookie:n,Referer:"https://gemini.google.com/","Referrer-Policy":"origin"});if(""==GeminiAT){Android.getSNlM0e(n),GeminiAT=await callbackSNlM0e();var o=document.createElement("script");o.src="//youtube.com/ytpro_cdn/npm/showdown/dist/showdown.min.js",document.body.appendChild(o)}var i=localStorage.getItem("prompt").replaceAll("{url}",window.location.href).replaceAll("{videoId}",new URL(window.location.href).searchParams.get("v")).replaceAll("{title}",document.getElementsByClassName("slim-video-metadata-header")[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")),l=null;"true"==localStorage.getItem("saveCInfo")&&null!=localStorage.getItem("geminiChatInfo")&&(l=localStorage.getItem("geminiChatInfo").split(","));const r=new URLSearchParams;r.append("f.req",JSON.stringify([null,JSON.stringify([[i],null,l])])),r.append("at",GeminiAT),Android.GeminiClient("https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",a,r.toString()),handleGeminiResponse(await callbackGeminiClient())}document.body.addEventListener("touchstart",(e=>{t=e.changedTouches[0].screenY,2===e.touches.length&&(a=getDistance(e.touches))}),{capture:!0}),document.body.addEventListener("touchmove",(e=>{if(stopProp&&e.stopPropagation(),2===e.touches.length&&null!==a){const n=getDistance(e.touches)/a;if(stopProp=!0,(e.target.className.toString().includes("video-stream")||e.target.className.toString().includes("player-controls-background"))&&document.fullscreenElement)if(n>1.05){var t=document.getElementsByClassName("video-stream")[0];zoomIn=!0,scale=Math.max(screen.height/t.offsetHeight,screen.width/t.offsetWidth),addMaxButton()}else n<.95&&(zoomIn=!1,scale=1,addMaxButton())}}),{capture:!0}),document.body.addEventListener("touchend",(e=>{n=e.changedTouches[0].screenY,!e.target.className.toString().includes("video-stream")&&!e.target.className.toString().includes("player-controls-background")||document.fullscreenElement||"true"!=localStorage.getItem("gesM")||checkDirection(),e.touches.length<2&&(a=null,setTimeout((()=>{stopProp=!1}),500))}),{capture:!0}),navigation.addEventListener("navigate",(e=>{(e.destination.url.indexOf("watch")>-1||e.destination.url.indexOf("shorts")>-1)&&(dislikes="...",fDislikes(e.destination.url),checkSponsors(e.destination.url))}));var volSvg='<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" focusable="false" aria-hidden="true" style="pointer-events: none;filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%"><path fill="#fff" d="M11.485 2.143 3.913 6.687A6 6 0 001 11.832v.338a6 6 0 002.913 5.144l7.572 4.543A1 1 0 0013 21V3a1.001 1.001 0 00-1.515-.857Zm6.88 2.079a1 1 0 00-.001 1.414 9 9 0 010 12.728 1 1 0 001.414 1.414 11 11 0 000-15.556 1 1 0 00-1.413 0Zm-2.83 2.828a1 1 0 000 1.415 5 5 0 010 7.07 1 1 0 001.415 1.415 6.999 6.999 0 000-9.9 1 1 0 00-1.415 0Z"></path></svg>',brtSvg='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" style="filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%;"><rect fill="none" height="24" width="24"/><path fill="#fff" d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>';

async function pkc(){if(window.location.href.indexOf("youtube.com/watch")>-1){try{var e=document.getElementsByTagName("dislike-button-view-model")[0].children[0];if(e.children[0].children[0].style.width="auto",e.children[0].children[0].style.paddingRight="15px",document.getElementById("diskl"))document.getElementById("diskl").innerHTML=dislikes;else{var n=document.createElement("span");n.setAttribute("id","diskl"),n.innerHTML=dislikes,n.style.marginLeft="5px",insertAfter(e.getElementsByClassName("yt-spec-button-shape-next__icon")[0],n)}}catch(e){}try{if("true"==localStorage.getItem("gesC")){var a={height:"70%",width:.14*document.getElementById("player-container-id").getBoundingClientRect().width+"px",display:"flex","flex-direction":"column","align-items":"center","justify-content":"center",position:"absolute",top:"16%",right:"0px",opacity:"0"},o=document.createElement("div"),i=document.createElement("div");i.setAttribute("id","brtS"),o.setAttribute("id","volS"),Object.assign(o.style,a),Object.assign(i.style,a),i.style.left="0",o.innerHTML=`${volSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${100*vol}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 2px black;" id="volIS"></div></div>`,i.innerHTML=`${brtSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${100*brt}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 1px black;" id="brtIS"></div></div>`,document.getElementById("brtS")||(document.getElementById("player-container-id").appendChild(i),i.addEventListener("touchmove",(e=>{e.preventDefault(),i.style.opacity="1",t-e.touches[0].pageY>0?brt+=sens:brt-=sens,brt>1&&(brt=1),brt<0&&(brt=0),t=e.touches[0].pageY,Android.setBrightness(brt),document.getElementById("brtIS").style.height=100*brt+"%"}),{passive:!1}),i.addEventListener("touchend",(e=>{i.style.opacity="0"}),{passive:!1})),document.getElementById("volS")||(document.getElementById("player-container-id").appendChild(o),o.addEventListener("touchmove",(e=>{e.preventDefault(),o.style.opacity="1",t-e.touches[0].pageY>0?vol+=sens:vol-=sens,vol>1&&(vol=1),vol<0&&(vol=0),t=e.touches[0].pageY,Android.setVolume(vol),document.getElementById("volIS").style.height=100*vol+"%"}),{passive:!1}),o.addEventListener("touchend",(e=>{o.style.opacity="0"}),{passive:!1}))}}catch(e){console.log(e)}if(null==document.getElementById("ytproMainDivE")){var l=document.createElement("div");l.setAttribute("id","ytproMainDivE"),l.setAttribute("style","height:50px;width:100%;display:block;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;");insertAfter(document.getElementsByClassName("slim-video-action-bar-actions")[0],l);var r=document.createElement("div");r.setAttribute("style","height:50px;width:max-content;display:flex;overflow:visible;align-items:center;padding-left:16px;padding-right:16px;");l.appendChild(r);
var s=document.createElement("div");sty(s);s.style.position="relative";s.style.background=`linear-gradient(${isD?"#272727,#272727":"#f2f2f2,#f2f2f2"}) padding-box , linear-gradient(16deg ,#4285f4 ,#9b72cb ,#d96570) border-box`;s.style.border="2px solid transparent";
s.innerHTML=`\n<svg style="height:16px;width:16px" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs></svg>\n<span style="margin-left:4px">Gemini</span>\n<style type="text/css">\n#GeminiResponse img{\nmax-width:90%;\nheight:auto;\nborder-radius:10px;\nmargin-top:5px;\n}\n#GeminiResponse a{\ncolor:rgb(62,166,255);\n}\n.geminiLoader,.geminiLoader:before,.geminiLoader:after{\ncontent:'';\nheight:10px;\nwidth:70%;\nposition:absolute;\ntop:15px;\nborder-radius:5px;\nleft:10px;\nbackground:${d};\nanimation: geminiLoad 1s linear infinite alternate;\n}\n.geminiLoader:before{\ntop:27px;\nleft:0;\n}\n.geminiLoader:after{\ntop:54px;\nleft:0;\nwidth:90%;\n}\n@keyframes geminiLoad{\n0% {\nopacity:1;\n}\n100% {\nopacity:.4;\n}\n}\n.geminiThoughts{\nheight:0;\nwidth:calc(100% - 30px);\ntransition:5s;\nfloat:left;\noverflow:hidden;\npadding-left:5px;\nfont-style:italic;\nborder-left:3px solid ${d};\ndisplay:block;\nfloat:none;\nclear:both;\n}\n.geminiAnswer{\nheight:auto;\nwidth:100%;\ndisplay:block;\nfloat:none;\nclear:both;\n}\n#GeminiResponse .think{\nbackground:transparent;\nfont-size:1.45rem;\nwidth:calc(100% - 20px);\nheight:20px;\ncolor:${isD?"#ccc":"#444"};\nmargin-top:3px;\ntext-align:left;\ndisplay:flex;\npadding-left:5px;\nborder-left:3px solid ${d};\n}\n</style>\n`,r.appendChild(s),s.addEventListener("click",(async function(){parseFloat(Android.getInfo())<parseFloat(YTProVer)?updateModel():geminiInfo()}));
var p=document.createElement("div");sty(p);isHeart()?p.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg><span style="margin-left:6px">Heart<span>`:p.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg><span style="margin-left:6px">Heart<span>`,r.appendChild(p),p.addEventListener("click",(()=>{ytProHeart(p)}));
var u=document.createElement("div");sty(u);u.innerHTML=`${downBtn.replace('width="24"','width="20"').replace('height="24"','height="20"')}<span style="margin-left:6px">Download<span>`,r.appendChild(u),u.addEventListener("click",(function(){window.location.hash="download"}));
var h=document.createElement("div");sty(h);h.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path fill="${c}" d="M18 7h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm3-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm-1 16.01H4c-.55 0-1-.45-1-1V5.98c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.03c0 .55-.45 1-1 1z"/></svg><span style="margin-left:6px">PIP Mode<span>`,r.appendChild(h),h.addEventListener("click",(function(){PIPlayer(!0)}))}}else if(window.location.href.indexOf("youtube.com/shorts")>-1){let e=document.getElementById("brtS"),t=document.getElementById("volS");if(e&&e.remove(),t&&t.remove(),null==document.getElementById("ytproMainSDivE")){var m=document.createElement("div");m.setAttribute("id","ytproMainSDivE"),m.setAttribute("style","width:50px;height:auto;position:relative;display:block;"),ysDown=document.createElement("div"),ysDown.setAttribute("style","\nheight:48px;width:48px;display:flex;align-items:center;justify-content:center;\nfilter:drop-shadow(0 0 1px #0009);\nborder-radius:50%;\n"),ysDown.innerHTML=downBtn.replaceAll(`${c}`,"#fff").replace('width="24"','width="30"').replace('height="24"','height="30"'),ysDown.addEventListener("click",(function(){window.location.hash="download"})),ysHeart=document.createElement("div"),ysHeart.setAttribute("style","\nheight:48px;width:48px;\ndisplay:flex;align-items:center;justify-content:center;\nfilter:drop-shadow(0 0 1px #0009);\nborder-radius:50%;margin-bottom:0px;\n"),isHeart()?ysHeart.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>':ysHeart.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>',ysHeart.addEventListener("click",(function(){ytProHeart(ysHeart)}));try{document.getElementsByClassName("reel-player-overlay-actions")[0].children[0]&&(document.getElementsByClassName("reel-player-overlay-actions")[0].insertBefore(m,document.getElementsByClassName("reel-player-overlay-actions")[0].children[1]),m.appendChild(ysDown),m.appendChild(ysHeart))}catch{}}try{document.querySelectorAll("dislike-button-view-model")[0].children[0].children[0].children[0].children[1].children[0].innerHTML=dislikes}catch{}}}

async function showHearts() {
    var e = document.createElement("div"), t = document.createElement("div");
    e.setAttribute("id", "outerheartsdiv");
    t.setAttribute("id", "heartytprodiv");
    e.setAttribute("style", `
        height:100%; width:100%; position:fixed; top:0; left:0;
        display:flex; justify-content:center; align-items:flex-end;
        background:rgba(0,0,0,0.6); z-index:9999;
    `);
    t.setAttribute("style", `
        height:80%; width:100%; max-width:600px; overflow-y:auto; 
        background:${isD ? "#212121" : "#fff"};
        border-radius:24px 24px 0 0; padding:20px; box-sizing:border-box;
        color:${isD ? "#fff" : "#0f0f0f"}; font-family:'Roboto',sans-serif;
        animation: slideUp 0.3s ease-out; box-shadow: 0 -4px 10px rgba(0,0,0,0.2);
    `);
    t.innerHTML = `
        <style>@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }</style>
        <div style="font-size:20px; font-weight:700; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
            Liked Videos
            <div style="cursor:pointer; padding:5px;" onclick="history.back()">&times;</div>
        </div>
        <ul id='listurl' style="list-style:none; padding:0; margin:0;">
    `;
    if(null==localStorage.getItem("hearts")) t.innerHTML+="<div style='text-align:center; padding:20px;'>No Videos Found</div>";
    else {
        var n = JSON.parse(localStorage.getItem("hearts"));
        if(0===Object.keys(n).length) t.innerHTML+="<div style='text-align:center; padding:20px;'>No Videos Found</div>";
        else {
            for(var a=Object.keys(n).length-1;a>-1;a--){
                var o=Object.keys(n)[a];
                t.innerHTML+=`
                <li style="display:flex; align-items:center; padding:10px; border-radius:12px; margin-bottom:10px; background:${isD ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}; transition:0.2s;">
                    <img data-action="navigateInternalYtMweb" data-id="${o}" src="${n[o].thumb}" style="width:120px; height:68px; border-radius:8px; object-fit:cover; cursor:pointer; flex-shrink:0;">
                    <div style="margin:0 12px; flex-grow:1; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; font-size:14px; cursor:pointer; line-height:1.4;" data-action="navigateInternalYtMweb" data-id="${o}">${n[o].title}</div>
                    <div style="padding:10px; cursor:pointer;" data-action="remHeart" data-id="${o}">
                        <svg width="24" height="24" fill="${isD ? '#aaa' : '#666'}" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </div>
                </li>`;
            }
        }
    }
    t.innerHTML += "</ul>";
    document.body.appendChild(e);
    e.appendChild(t);
    e.addEventListener("click", (function(ev){ev.target==e&&history.back()}));
    t.addEventListener("click",(ev=>{var tr=ev.target.closest("[data-action]");tr&&("navigateInternalYtMweb"==tr.dataset.action?navigateInternalYtMweb(tr.dataset.id):"remHeart"==tr.dataset.action&&remHeart(tr,tr.dataset.id))}))
}

function navigateInternalYtMweb(e){window.location.hash="";const t=document.createElement("a");t.href=`/watch?v=${e}`,t.style.display="none",document.body.appendChild(t),t.click(),t.remove()}function remHeart(e,t){if(localStorage.getItem("hearts")?.indexOf(t)>-1){e.parentElement.parentElement.remove();var n=JSON.parse(localStorage.getItem("hearts")||"{}");delete n[t],localStorage.setItem("hearts",JSON.stringify(n))}}function ytProHeart(e){var t=new URLSearchParams(window.location.search).get("v")||window.location.pathname.replace("/shorts/",""),n=document.getElementsByClassName("video-stream")[0],a=document.createElement("canvas");a.style.width="1600px",a.style.height="900px",a.style.background="black";var o=a.getContext("2d");window.location.pathname.indexOf("shorts")>-1?o.drawImage(n,105,0,90,160):o.drawImage(n,0,0,320,180);var i=a.toDataURL("image/jpeg");if(window.location.pathname.indexOf("shorts")>-1)var l={thumb:i,title:document.getElementsByClassName("ytShortsVideoTitleViewModelShortsVideoTitle")[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")};else l={thumb:i,title:document.getElementsByClassName("slim-video-metadata-header")[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")};var r,s="16",d='<span style="margin-left:6px">Heart<span>';(d=window.location.href.indexOf("youtube.com/shorts")>-1?"":'<span style="margin-left:6px">Heart<span>',s=(window.location.href.indexOf("youtube.com/shorts"),"20"),localStorage.getItem("hearts")?.indexOf(t)>-1)?(delete(r=JSON.parse(localStorage.getItem("hearts")||"{}"))[t],localStorage.setItem("hearts",JSON.stringify(r)),e.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" fill="${window.location.href.indexOf("youtube.com/shorts")>-1?"#fff":c}" viewBox="0 0 24 24">\n<path d="M0 0h24v24H0V0z" fill="none"/><path fill="${window.location.href.indexOf("youtube.com/shorts")>-1?"#fff":c}" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>${d}`):((r=JSON.parse(localStorage.getItem("hearts")||"{}"))[t]=l,localStorage.setItem("hearts",JSON.stringify(r)),e.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${window.location.href.indexOf("youtube.com/shorts")>-1?"#fff":c}" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>${d}`)}function isHeart(){return localStorage.getItem("hearts")?.indexOf(new URLSearchParams(window.location.search).get("v"))>-1||localStorage.getItem("hearts")?.indexOf(window.location.pathname.replace("/shorts/",""))>-1}function removePIP(){isPIP=!1,pauseAllowed=!0,document.exitFullscreen(),document.getElementsByClassName("video-stream")[0].pause(),setTimeout((()=>{document.getElementsByClassName("video-stream")[0].play()}),5)}function PIPlayer(e=!1){var t=document.getElementsByClassName("video-stream")[0];e?t.getBoundingClientRect().height>t.getBoundingClientRect().width?Android.pipvid("portrait"):Android.pipvid("landscape"):(t.requestFullscreen(),t.play(),pauseAllowed=!1,isPIP=!0)}setInterval(pkc,0),HTMLMediaElement.prototype.pause=function(){if(pauseAllowed||PIPause)return e.apply(this,arguments);this.paused&&this.play().catch((()=>{}))};const o=document.exitFullscreen,i=Element.prototype.requestFullscreen;document.exitFullscreen=function(...e){if(!isPIP)return o.apply(this,e)},Element.prototype.requestFullscreen=function(...e){var t=document.getElementsByClassName("video-stream")[0];return t.getBoundingClientRect().height>t.getBoundingClientRect().width?Android.fullScreen(!0):Android.fullScreen(!1),i.apply(this,e)},window.onhashchange=()=>{try{document.getElementById("outerdownytprodiv").remove()}catch{}try{document.getElementById("outerheartsdiv").remove()}catch{}try{document.getElementById("settingsprodiv").remove()}catch{}"#download"==window.location.hash?ytproDownVid():"#settings"==window.location.hash?ytproSettings():"#hearts"==window.location.hash&&showHearts()},(()=>{const e=window.fetch;window.fetch=async function(t,n){try{const n="string"==typeof t?t:t.url;if(n.includes("googleads.g.doubleclick.net")||n.includes("youtube.com/youtubei/v1/player/ad_break")||n.includes("youtube.com/pagead/adview")||n.includes("youtube.com/api/stats/ads"))return"";if(n.includes("youtube.com/youtubei/")){const t=await e.apply(this,arguments);try{const e=t.clone();let n=await e.json();"adSlotRenderer"!=n?.responseContext?.webResponseContextExtensionData?.webResponseContextPreloadData?.preloadMessageNames?.[0]&&"shortsAdsRenderer"!=n?.responseContext?.webResponseContextExtensionData?.webResponseContextPreloadData?.preloadMessageNames?.[0]||(n={}),delete n?.adSlots,delete n?.playerAds,delete n?.adPlacements,delete n?.adBreakHeartbeatParams,delete n?.[0]?.playerResponse?.adSlots,delete n?.[0]?.playerResponse?.playerAds,delete n?.[0]?.playerResponse?.adPlacements,delete n?.[0]?.playerResponse?.adBreakHeartbeatParams;const a=JSON.stringify(n),o=new Headers(t.headers);return o.set("content-length",String(a.length)),o.set("content-type","application/json"),new Response(a,{status:t.status,statusText:t.statusText,headers:o})}catch(e){return t}}return e.apply(this,arguments)}catch(e){}return e.apply(this,arguments)}})();const l=window.XMLHttpRequest,r=l.prototype.open,s=l.prototype.send;function adsBlock(){try{document.getElementsByClassName("video-stream")[0].removeAttribute("disablepictureinpicture")}catch{}var e=document.getElementsByTagName("ad-slot-renderer");for(var t in e)try{e[t].remove()}catch{}try{document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].currentTime=document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].duration,document.getElementsByClassName("ytp-ad-skip-button-modern")[0].click()}catch{}try{document.getElementsByTagName("ytm-promoted-sparkles-web-renderer")[0].remove()}catch{}try{document.getElementsByTagName("ytm-companion-ad-renderer")[0].remove()}catch{}try{document.querySelectorAll("a").forEach((e=>{e.href.indexOf("intent://")>-1&&(e.style.display="none")}))}catch{}try{document.getElementsByTagName("ytm-paid-content-overlay-renderer")[0].style.display="none"}catch{}if("true"==localStorage.getItem("shorts")){for(t in document.getElementsByClassName("big-shorts-singleton"))try{document.getElementsByClassName("big-shorts-singleton")[t].remove()}catch{}for(t in document.getElementsByTagName("ytm-reel-shelf-renderer")){try{document.getElementsByTagName("ytm-reel-shelf-renderer")[t].remove()}catch{}for(t in document.getElementsByTagName("ytm-shorts-lockup-view-model"))try{document.getElementsByTagName("ytm-shorts-lockup-view-model")[t].remove()}catch{}}}}function addMaxButton(){var e=document.getElementById("player-container-id"),t=document.getElementById("player");document.getElementsByClassName("video-stream")[0];if(e===document.fullscreenElement)try{t.style.transform=zoomIn?`scale(${scale})`:"scale(1)"}catch{}else try{t.style.transform="scale(1)"}catch{}}async function extraSpeed(){var e=document.querySelector(".ytwVariableSpeedControllerViewModelButtonContainer");if(!e)return;const t=document.getElementById("slider");if(10!=t.max&&(t.max=10,t.ariaValueMax="10",t.addEventListener("input",(()=>{const e=document.querySelector(".video-stream");e&&(e.playbackRate=parseFloat(t.value))})),e.children.length>=6&&e.children[0].remove(),!document.getElementById("10xSpeed"))){var n=document.createElement("ytw-variable-speed-controller-speed-button-view-model");n.id="10xSpeed",n.className="ytwVariableSpeedControllerSpeedButtonViewModelHost ytwVariableSpeedControllerViewModelPlaybackSpeedButton",n.insertAdjacentHTML("beforeend",'<button-view-model class="ytSpecButtonViewModelHost"><button class="ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeS ytSpecButtonShapeNextEnableBackdropFilterExperiment" title="" aria-disabled="false" style=""><div class="ytSpecButtonShapeNextButtonTextContent ytSpecButtonShapeNextElevatedContent">10x</div><yt-touch-feedback-shape aria-hidden="true" class="ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"><div class="ytSpecTouchFeedbackShapeStroke"></div><div class="ytSpecTouchFeedbackShapeFill"></div></yt-touch-feedback-shape><yt-light-shape aria-hidden="true" class="contribYtLightShapeHost contribYtLightShapeStaticRimLight contribYtLightShapeStaticRimLightTonal" style="--yt-light-wash-opacity: 0; --yt-light-wash-x: 0px; --yt-light-wash-y: 0px; --yt-light-wash-size: 0px;"><div class="contribYtLightShapeStaticWashLight contribYtLightShapeStaticWashLightTonal" style=""></div></yt-light-shape></button></button-view-model>'),n.addEventListener("click",(()=>{t.value=10,t.dispatchEvent(new Event("input",{bubbles:!0}))})),e.appendChild(n)}}l.prototype.open=function(e,t,...n){return this._interceptedMethod=e,this._interceptedUrl=t,r.apply(this,[e,t,...n])},l.prototype.send=function(e){if(!(this._interceptedUrl.includes("googleads.g.doubleclick.net")||this._interceptedUrl.includes("youtube.com/youtubei/v1/player/ad_break")||this._interceptedUrl.includes("youtube.com/pagead/adview")||this._interceptedUrl.includes("youtube.com/api/stats/ads")))return s.apply(this,arguments)};const p=document.body,u={childList:!0,subtree:!0};function updateModel(){var e=document.createElement("div");e.setAttribute("style","height:100%;width:100%;position:fixed;display:grid;align-items:center;top:0;left:0;background:rgba(0,0,0,.6);z-index:99999;"),e.innerHTML=`\n<div style="height:auto;width:70%;padding:20px;background:rgba(0,0,0,.6);border:1px solid #888;box-shadow:0px 0px 5px black;color:white;backdrop-filter:blur(10px);border-radius:15px;margin:auto">\n<h2> Mandatory Update </h2><br>\nLatest Version ${YTProVer} of YTPRO is available , update the YTPRO to get latest features.\n<br>- This update is mandatory as it fixes a ton of bugs and improves functionality <br>\n- Fixed Downloads, switched to SABR downloader<br>\n- Added muxing to the youtube videos<br>\n- Fixed gestures for brightness and volume control<br>\n- Optimized the UI of both Download and Settings menu<br>\n- Added speed increase upto 10x<br>\n- Fixed bugs and improved functionality<br>\n- for the full list <u data-action="url" >click here</u>\n<br>\n<br>\n<div style="display:flex;">\n\x3c!--<button style="border:0;border-radius:10px;height:30px;width:150px;background:;" data-action="cancel">Cancel</button>--\x3e\n<button style="border:0;border-radius:10px;height:30px;width:150px;background:rgba(255,50,50,.7);float:right;" data-action="download" >Download</button>\n</div>\n\n</div>\n`,e.addEventListener("click",(e=>{var t=e.target.closest("[data-action]");if(t){var n=t.dataset.action;"url"==n?Android.oplink("https://github.com/prateek-chaubey/YTPRO/releases"):"download"==n?Android.downvid("YTPRO.zip","https://nightly.link/prateek-chaubey/YTPro/workflows/gradle/main/YTPRO.zip","application/zip"):"cancel"==n&&t.parentElement.parentElement.parentElement.remove()}})),document.body.appendChild(e)}new MutationObserver((()=>{extraSpeed(),adsBlock(),addMaxButton(),addSettingsTab();try{var e=document.getElementsByClassName("video-stream")[0];e.getBoundingClientRect().height>e.getBoundingClientRect().width?Android.fullScreen(!0):Android.fullScreen(!1)}catch{}})).observe(p,u),window.onload=function(){parseFloat(Android.getInfo())<parseFloat(YTProVer)&&("https://m.youtube.com/"==window.location.href||"https://m.youtube.com"==window.location.href)&&updateModel()},document.addEventListener("click",(e=>{let t=e.target.closest("a");if(t&&t.href.includes("www.youtube.com/redirect")){try{document.getElementsByClassName("video-stream")[0].pause()}catch{}const n=new URL(t.href).searchParams.get("q");setTimeout((()=>{Android.oplink(n)}),50),e.preventDefault(),e.stopPropagation()}}),!0)}