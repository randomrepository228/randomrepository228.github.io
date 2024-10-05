localStorage.ver = "Prerelease"
window.loop = {drag: false, top: false, left: false, right: false, bottom: false};
window.activewindow = 0;
window.activetray = 0;
window.isLoaded = false;
window.bootAnimationEnded = false;
window.init = false;
window.currentUser = "SYSTEM";
window.allWindows = [];
window.winda = {
    playSound: async (sound) => {
        const file = await fs.readFile(sound)
        if (!file) return
        const url = URL.createObjectURL(file)
        let audio = new Audio(url)
        audio.volume = (+localStorage.volume) / 100
        audio.addEventListener("ended", () => {
            URL.revokeObjectURL(url)
        })
        audio.play()
    },
    changeTheme: (a) => {
        localStorage.theme = a
        theme.href = "./res/" + a + "/style.css"
        for (let i = 0; i < frames.length; i++) {
            frames[i].postMessage("theme|" + a, "*")
        }
    },
    pidCounter: 0
};
window.processList = []
window.lastPID = 0
window.windowInfo = []
if (!localStorage.theme) localStorage.theme = "aero"
theme.href = "./res/" + localStorage.theme + "/style.css"
if (!localStorage.volume) localStorage.volume = 50
if (!localStorage.wallpaper) localStorage.wallpaper = "./img/img0.jpg"
if (!localStorage.wallpaperstretch) localStorage.wallpaperstretch = "stretch"
if (!localStorage.sounds) localStorage.sounds = '{"msgbox": "./media/Windows Exclamation.flac"}'
sounds = JSON.parse(localStorage.sounds)
let ctmContainer = document.createElement("div")
window.contextMenuElement = ctmContainer
document.body.appendChild(ctmContainer)
function contextMenu(e, content, x, y, pd){
    let contextMenuElement = document.createElement("div")
    contextMenuElement.className = "context-menu context-menu-part"
    if (e.preventDefault && !pd){
        e.preventDefault()
    }
    if (content){
        for (const a of content){
            let contextMenuOption = document.createElement("div")
            contextMenuOption.className = "context-menu-option context-menu-part"
            contextMenuOption.onclick = (e) => {e.preventDefault(); contextMenuOff(); a[2]()}
            contextMenuOption.innerHTML += `<img src="${a[0]}" onerror="this.style.opacity = 0;" class="context-menu-part"><div class="context-menu-part">${a[1]}</div>`
            contextMenuElement.appendChild(contextMenuOption)
        }
    }
    else{
        contextMenuElement.innerHTML += `<div class="context-menu-option context-menu-part"><img src="" onerror="this.style.opacity = 0;" class="context-menu-part"><div class="context-menu-part">(No options available)</div></div>`
    }
    contextMenuElement.style.display = "flex";
    ctmContainer.appendChild(contextMenuElement)
    const boundClientRect = contextMenuElement.getBoundingClientRect()
    if (x > innerWidth - boundClientRect.width) contextMenuElement.style.right = innerWidth - x + 'px'
    else contextMenuElement.style.left = x + 'px'
    if (y > innerHeight  - boundClientRect.height) contextMenuElement.style.bottom = innerHeight - y + 'px'
    else contextMenuElement.style.top = y + 'px'
    return 0
}
function contextMenuOff(e){
    ctmContainer.innerHTML = ""
}

async function showLogonUI(_){
    bootloader.style.display = "none"
    loadScript("bin/logonui.js")
    if (window.move){
        window.addEventListener("mousemove", window.move); 
        window.addEventListener("touchmove", window.move);
    }
    else{
        msgbox("Window manager", "Window manager not found ok?", undefined, "error")
    }
    cmoffcmd = (e) => {if (!e.target.classList.contains('context-menu-part')) contextMenuOff()}
    window.addEventListener("mousedown", cmoffcmd); 
    window.addEventListener("touchstart", cmoffcmd);
    window.addEventListener("click", (e) => {if(!e.target.parentElement) return; if (e.target.classList.contains("context-menu-part")) contextMenuOff()})
    document.oncontextmenu = (e) => e.preventDefault()
}

try{bootAnimation.addEventListener("ended", e => {
    if (isLoaded) showLogonUI()
    bootAnimationEnded = true;
    bootAnimation.currentTime = 3.02;
    bootAnimation.play()
})}
catch(e){}
function shutdown(a){
    console.log(a)
    if (a == "r"){
        logoff();
        return
    }
    document.body.style.backgroundColor = "black"
    document.body.innerHTML = '<div style="position: absolute; left: 50vw; top: 50vh; transform: translate(-50%, -50%); color: white">It is now safe to turn off your computer</div>'
    document.body.style.setProperty("--wallpaper", "none")
}
function displayBSOD(reason){
    if (!reason) reason = "NULL"
    document.body.innerHTML = `
A problem has been detected and windows has been shut down to prevent damage
to your computer.

${reason.replace(/\n/g, "")}

If this is the first time you've seen this Stop error screen,
restart your computer. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacturer
for any windows updates you might need.

If problems continue, disable or remove any newly installed hardware
or software. Disable BIOS memory options such as caching or shadowing.
If you need to use Safe Mode to remove or disable components, restart
your computer, press F8 to select Advanced Startup options, and then
select Safe Mode.

Technical information:

***&nbsp;STOP:&nbsp;0x00000000&nbsp;(0x0000000000000000,0x0000000000000000,0x0000000000000000,0x0000080000000000)



Collecting data for crash dump ...
Initializing disk for crash dump ...
Beginning dump of physical memory. 
Dumping physical memory to disk:  <span id="bsodCounter" style="font-family: 'bsod'; line-height: 100%">0</span>`
    document.body.style.setProperty("--wallpaper", "none")
    document.body.setAttribute("style", "background-color: navy; white-space: pre-wrap; line-height: 100%; font-size: min(3vh, 2.02vw); color: white; font-family: 'bsod'; word-break: break-word;")
    removeEventListener("resize", resizeHandler)
    bsodProgress = 0;
    const magicVariable = setInterval(() => {
        bsodProgress += 5
        if (bsodProgress > 99) {
            bsodCounter.innerText = "100\nPhysical memory dump complete.\nContact your system admin or technical support group for further assistance."
            if (bsodProgress > 100) {
                clearInterval(magicVariable)
                window.location.reload()
            }
            return
        }
        bsodCounter.innerText = bsodProgress
    }, 200)
}
function logoff(){
    shell.style.display = "none"
    findWindowBy("title", "LogonUI").style.display = ""
    for (let a of windows.children){
        if (!a.id) return
        windows.children[a].remove()
    }
    leftBar.innerHTML = ""
    startMenu(false)
    winda.playSound('./media/Windows Logoff Sound.flac'); 
}
async function desktopInit(){
    if (!(await fs.exists("config/associations"))) await fs.writeFile("config/associations", JSON.stringify({
        ".png": {desc: "PNG image", program: "app:paint"},
        ".webp": {desc: "WEBP image", program: "app:paint"},
        ".gif": {desc: "GIF image", program: "app:paint"},
        ".bmp": {desc: "BMP image", program: "app:paint"},
        ".jpg": {desc: "JPEG image", program: "app:paint"},
        ".jpeg": {desc: "JPEG image", program: "app:paint"},
        ".ca": {desc: "bcwd application", program: "command:loadScript"},
        ".txt": {desc: "Text file", program: "app:notepad"},
        ".md": {desc: "Markdown file", program: "app:notepad"},
        ".mp4": {desc: "MP4 video", program: "app:wmplayer"},
        ".avi": {desc: "AVI video", program: "app:wmplayer"},
        ".webm": {desc: "WEBM video", program: "app:wmplayer"},
        ".wav": {desc: "WAVE audio", program: "app:wmplayer"},
        ".mp3": {desc: "MP3 audio", program: "app:wmplayer"},
        ".ogg": {desc: "Vorbis audio", program: "app:wmplayer"},
        ".flac": {desc: "FLAC audio", program: "app:wmplayer"},
        ".html": {desc: "HTML document", program: "app:iexplore"},
        ".htm": {desc: "HTML document", program: "app:iexplore"},
    }))
    changeWallpaper(localStorage.wallpaper, true, true).then(() => {
        findWindowBy("title", "LogonUI").context.hide();
        document.querySelector(".logonui-users-container").style.display = "";
        document.querySelector(".logonui-status").style.display = "none";
        loadScript("bin/shell.js")
        if (init) return
        if (!window.move){
            msgbox("Window Manager", "Overlapping Window Manager is not found. Using fullscreen windows instead")
        }
        init = true
        if(!localStorage.prevver || localStorage.prevver != localStorage.ver){
            msgbox("New update", "<h1 style=\"margin: 0\">Welcome to 0.9.0.2!</h1>What's new?<br><ul><li>Semi-integration with filesystem</li><li>Welcome and change theme screen</li><li>fixed close button being red when it's the only button</li><li>Texture file optimization</li><li>Added file dialog</li><li>Added new boot manager!</li><li>Added different types of message boxes</li></ul>")
            localStorage.prevver = localStorage.ver
            return;
        }
    })
    setWallpaperStretch(localStorage.wallpaperstretch)
    document.querySelector(".logonui-users-container").style.display = "none";
    document.querySelector(".logonui-status").style.display = "";
    // initShellIcons()
}
async function login(user, password){
    if (!init) await desktopInit();
    else{
        findWindowBy("title", "LogonUI").context.hide();
        document.querySelector(".explorer").style.display = "";
    }
    winda.playSound('./media/Windows Logon Sound.flac'); 
}
function html2canvas(html, canvas){

    const ctx = canvas.getContext( '2d' );

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
<foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
</foreignObject>
</svg>`;

    const svgBlob = new Blob( [svg], { type: 'image/svg+xml;charset=utf-8' } );
    const svgObjectUrl = URL.createObjectURL( svgBlob );

    const tempImg = new Image();
    tempImg.addEventListener( 'load', function() {
        ctx.drawImage( tempImg, 0, 0 );
        URL.revokeObjectURL( svgObjectUrl );
    } );

    tempImg.src = svgObjectUrl;
}
async function changeWallpaper(wallpaperpath, nochange, nosplash){
    if (wallpaperpath.length > 4000000) {
        msgbox("Storage", "Wallpaper is very big and may be causing problems with your saved data. Custom wallpapers are not ported to FS yet. Size: " + Math.round(wallpaperpath.length / 10000) / 100 * 2 + "MB")
        return
    }
    // const formats = [".png", ".jpg", ".gif", ".bmp", ".webp"]
    // for (a of formats)
    //     if (wallpaperpath.endswith(a)){
    //         if (wallpaperpath.startsWith(".")){
    //             wallpaperpath = wallpaperpath.substring(1, wallpaperpath.length)
    //         }
    //         try{
    //             await fs.readFile(wallpaperpath)

    //         }
    //         catch(e){}
    //     }
    // }
    try{
        if (!nochange) localStorage.wallpaper = wallpaperpath
        if (wallpaperpath.startsWith("./") && !boot.params.debug){
            if (!nosplash){
                changethemesplash.style.display = "block"
            }
            let file = await fs.downloadFile(wallpaperpath)
            const url = URL.createObjectURL(file)
            wallpaperpath = url
            if (!nosplash){
                let audio = new Audio('../media/Windows Logon Sound.flac')
                audio.oncanplay = () => {
                    audio.play()
                    changethemesplash.style.display = ""
                }
                audio.play()
            }
        }
        document.body.style.backgroundImage = "url(" + wallpaperpath + ")"
    }
    catch(e) {
        msgbox("Wallpaper error", e)
    }
}
function setWallpaperStretch(stretchmode){
    localStorage.wallpaperstretch = stretchmode
    if (stretchmode == "center"){
        document.body.style.backgroundSize = ""
        document.body.style.backgroundRepeat = ""
    }
    else if (stretchmode == "fill")
        document.body.style.backgroundSize = "cover"
    else if (stretchmode == "fit")
        document.body.style.backgroundSize = "contain"
    else if (stretchmode == "stretch")
        document.body.style.backgroundSize = "100% 100%"
    else if (stretchmode == "tile")
    document.bodys.style.backgroundRepeat = "repeat"
}
window.changethemesplash = document.createElement("div")
changethemesplash.id = "changethemesplash"
document.body.appendChild(changethemesplash)
addEventListener("sysloaded", showLogonUI)
let zHold = false
addEventListener("keydown", (e) => {
    if (e.altKey){
        e.preventDefault()
        if (e.key.toLowerCase() === "r") loadApp("run")
        if (e.key.toLowerCase() === "e") loadApp("explorer-file-manager")
        if (e.key.toLowerCase() === "z") zHold = true
        if (e.key.toLowerCase() === "tab") {}
    }
})
class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
boot.log("Welcome to Winda7\n(c) kitaes, 2024\n")