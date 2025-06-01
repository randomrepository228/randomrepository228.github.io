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
        let audio = new Audio(sound)
        audio.volume = (+localStorage.volume) / 100
        audio.play()
    },
    changeTheme: (a) => {
        localStorage.theme = a
        theme.href = "./res/themes/" + a + "/style.css"
        for (let i = 0; i < frames.length; i++) {
            frames[i].postMessage("theme|" + a, "*")
        }
    },
    pidCounter: 0
};
function sleep(milliseconds){
    return new Promise(res => setTimeout(res, milliseconds))
}
window.processList = []
window.lastPID = 0
window.windowInfo = []
window.keysPressed = {"shift": false, "ctrl": false, "alt": false}
if (!localStorage.theme) localStorage.theme = "aero"
theme.href = "./res/themes/" + localStorage.theme + "/style.css"
if (!localStorage.volume) localStorage.volume = 50
if (!localStorage.wallpaper) localStorage.wallpaper = "./res/img/img0.jpg"
if (!localStorage.wallpaperstretch) localStorage.wallpaperstretch = "stretch"
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
            function click(e){
                e.preventDefault(); 
                contextMenuOff(); 
                a[2]()
            }
            contextMenuOption.onclick = click
            contextMenuOption.onmouseup = click
            contextMenuOption.ontouchend = click
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
    cmoffcmd = (e) => {
        if (!e.target.classList.contains('context-menu-part')) contextMenuOff()
        if (!wm.activeMenuBar) return
        if (event.target.parentElement && event.target.parentElement === wm.activeMenuBar) return
        wm.activeMenuBar.mouseDown = false;
        const el = wm.activeMenuBar.querySelector(".active")
        if (el) el.classList.remove("active")
        wm.activeMenuBar = undefined
    }
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
    if (a == "r"){
        logoff();
        return
    }
    document.body.style.backgroundColor = "black"
    document.body.innerHTML = '<div style="position: absolute; left: 50vw; top: 50vh; transform: translate(-50%, -50%); color: white">It is now safe to turn off your computer</div>'
    document.body.style.backgroundImage = "none"
}
function logoff(){
    shell.style.display = "none"
    findWindowBy("title", "LogonUI").style.display = ""
    for (let a of windows.children){
        if (!a.id) return
        windows.children[a].remove()
    }
    leftBar.innerHTML = ""
    winda.shell.startMenu(false)
    winda.playSound('./res/media/Windows Logoff Sound.flac'); 
}
async function desktopInit(){
    if (!window.config){
        window.config = JSON.parse(await fs.readFile("config/system", "utf-8"))
    }
    setWallpaperStretch(localStorage.wallpaperstretch)
    document.querySelector(".logonui-users-container").style.display = "none";
    document.querySelector(".logonui-status").style.display = "";
    await changeWallpaper(localStorage.wallpaper, true, true)
    findWindowBy("title", "LogonUI").hide();
    document.querySelector(".logonui-users-container").style.display = "";
    document.querySelector(".logonui-status").style.display = "none";
    loadScript("bin/shell.js")
    loadScript("bin/update.js")
    init = true
}
async function login(user, password){
    if (!init) await desktopInit();
    else{
        findWindowBy("title", "LogonUI").hide();
        document.querySelector(".explorer").style.display = "";
    }
    winda.playSound('./res/media/Windows Logon Sound.flac'); 
}
async function changeWallpaper(wallpaperpath, nochange, nosplash){
    try{
        if (!nochange) localStorage.wallpaper = wallpaperpath
        if (wallpaperpath.startsWith("./") && !boot.params.debug){
            if (!nosplash){
                changethemesplash.style.display = "block"
            }
            const s = await fs.downloadFile(wallpaperpath.substring(2), "blob")
            wallpaperpath = URL.createObjectURL(s)
            if (!nosplash){
                let audio = new Audio('../res/media/Windows Logon Sound.flac')
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
        if (e.key.toLowerCase() === "e") loadScript("bin/filemgr.js")
        if (e.key.toLowerCase() === "z") zHold = true
        if (e.key.toLowerCase() === "tab") {}
        keysPressed.alt = true
    }
    if (e.ctrlKey) keysPressed.ctrl = true
    if (e.shiftKey) keysPressed.shift = true
    if (e.altKey) keysPressed.alt = true
})
class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
boot.log("Welcome to Winda7 [Version " + boot.ver + "]\n(c) kitaes, 2025\n")