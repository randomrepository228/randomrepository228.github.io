loop = {drag: false, top: false, left: false, right: false, bottom: false};
prevx = 150;
prevy = 150;
let prevwidth;
let prevheight;
let origx;
let origy;
let activewindow;
let activetray;
let isLoaded = false;
let bootAnimationEnded = false;
let init = false;
class Window {
    constructor(x, y, width, height, title, innerhtml, icon) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.title = title;
        this.innerhtml = innerhtml;
        this.icon = icon
    }
}
class Tray {
    constructor(width, height, innerhtml, title) {
        this.height = height;
        this.width = width;
        this.innerhtml = innerhtml;
        this.title = title
    }
}
class TrayIcon {
    constructor(width, innerhtml) {
        this.width = width;
        this.innerhtml = innerhtml;
    }
}
if (!localStorage.theme) localStorage.theme = "aero"
theme.href = "./Resources/" + localStorage.theme + "/style.css"
if (!localStorage.wallpaper) localStorage.wallpaper = "./Web/img0.jpg"
if (!localStorage.wallpaperstretch) localStorage.wallpaperstretch = "stretch"
if (!localStorage.sounds) localStorage.sounds = '{"msgbox": "./media/Windows Exclamation.wav"}'
sounds = JSON.parse(localStorage.sounds)
function connectScript(path) {
    let script = document.createElement('script')
    script.src = path
    document.head.append(script)
}
function changeTheme(a){
    localStorage.theme = a
    theme.href = "./Resources/" + a + "/style.css"
    for (let i = 0; i < frames.length; i++) {
        frames[i].postMessage("theme|" + a, "*")
    }
}
function AddWindow(window, ispopup, options, id){
    newWindow = document.createElement("div")
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    if (typeof options.top == "number") options.top += "px"
    if (typeof options.left == "number") options.left += "px"
    if (typeof options.right == "number") options.right += "px"
    if (typeof options.bottom == "number") options.bottom += "px"
    if (options.NoGUI) newWindow.className += " nogui"
    newWindow.setAttribute("windowid", id)
    if (options.noTray) newWindow.setAttribute("notray", "true")
    if (options.left)
        newWindow.style.left = options.left
    if (options.top)
        newWindow.style.top = options.top
    if(!((options.left && options.top) || options.customPos)){
        if (ispopup){
            newWindow.style.left = (innerWidth / 2 ) - (options.width) / 2 + "px"
            newWindow.style.top = (innerHeight / 2 ) - (options.height) / 2 + "px"
        }
        else{
            const openedwindows = getAllWindows().length
            newWindow.style.left = (openedwindows * 25 + 50) % (innerWidth - options.width) + "px"
            newWindow.style.top = (openedwindows * 25 + 50) % (innerHeight - options.height) + "px"
        }
    }
    if (options.bottom)
        newWindow.style.bottom = options.bottom
    if (options.right)
        newWindow.style.right = options.right
    newWindow.style.display = "none"
    if(options.alwaysontop) newWindow.className += " alwaysontop"
    if(options.alwaysbehind) newWindow.className += " alwaysbehind"
    newWindow.innerHTML =
    `
    <div ${options.fullscreen ? 'style="display: none;"' : ''}class="topbar" ${options.noResize ? '' : 'ondblclick="maximise(this.parentElement)"'} onmousedown="windowMouseDown(event, this, 'drag', ${options.noResize})" ontouchstart="windowMouseDown(event, this, 'drag', ${options.noResize})">
        <left>
            <img src="${window.icon}" onerror="this.remove()">
            <p>${window.title}</p>
        </left>
        <div class="buttons">
            ${options.xOnly ? `` : `<div class="dash" ${options.noTray ? 'disabled' : 'onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"'}><img src="./Resources/aero/buttons/min/icon.png"></div>
            <div class="square" ${options.noResize ? 'disabled' : 'onclick="maximise(this.parentElement.parentElement.parentElement)"'}><img src="./Resources/aero/buttons/max/icon.png"></div>`}
            <div class="x" onclick="closeWindow(${id})"><img src="./Resources/aero/buttons/close/icon.png"></div>
        </div>
    </div>
    ${options.noResize ? `` : `<div onmousedown="windowResize(event, this, 'left', 'top')" class="topleft"></div>
    <div onmousedown="windowResize(event, this, 'right', 'top')" class="topright"></div>
    <div onmousedown="windowResize(event, this, 'left', 'bottom')" class="bottomleft"></div>
    <div onmousedown="windowResize(event, this, 'right', 'bottom')" class="bottomright"></div>
    <div onmousedown="windowResize(event, this, 'top')" class="top"></div>
    <div onmousedown="windowResize(event, this, 'left')" class="left"></div>
    <div onmousedown="windowResize(event, this, 'right')" class="right"></div>
    <div onmousedown="windowResize(event, this, 'bottom')" class="bottom"></div>`}
    <div class="content">
        <ignore></ignore>
        <text style="width: ${options.width}px; height: ${options.height}px">${window.innerhtml}</text>
        ${ispopup ? `<footer><button onclick="closeWindow(${id})">OK</button></div>` : ''}
    </div>
    `
    windows.append(newWindow)
    if(ispopup || options.noSelfOpen){
        showWindow(window.icon, id)
    }
    broadcast("newprocess|" + id)
}
function addTray(id, trayicon, tray, options){
    let newTray = document.createElement("div")
    newTray.className = `dock-br winapi_transparent winapi_shadow n${id} tray`
    newTray.setAttribute("windowid", id)
    newTray.style.width = tray.width + "px"
    newTray.style.height = tray.height + "px"
    newTray.style.display = "none"
    newTray.setAttribute("name", tray.title)
    newTray.innerHTML =
    `
    <div class="content">
        ${tray.innerhtml}
    </div>
    `
    trays.append(newTray)
    newTray = document.createElement("div")
    newTray.className = `trayicon n${id}`
    newTray.style.width = trayicon.width + "px"
    newTray.innerHTML =
    `
    <div style="width: 79px; margin-bottom: -40px; height: 40px;" onclick="showTray(getTray(${id}))"></div>
    ${trayicon.innerhtml}
    `
    trayicons.append(newTray)
    broadcast("newprocess|" + id)
}
function AddWindowNoGUI(window, ispopup, noResize, xOnly, noSelfOpen){
    newWindow = document.createElement("div")
    const randNum = Math.round(Math.random() * 99999)
    let id;
    for(let i = randNum;;i++){
        let idCollision = false
        for(const a of windows.children)
            if(a.getAttribute("windowid") == i.toString())
                idCollision = true
        if (!idCollision)
            id = i
            break
    }
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    newWindow.setAttribute("windowid", id)
    if(!window.x || !window.y){
        if (ispopup){
            newWindow.style.left = (innerWidth / 2 ) - (window.width) / 2 + "px"
            newWindow.style.top = (innerHeight / 2 ) - (window.height) / 2 + "px"
        }
        else{
            const openedwindows = getAllWindows().length
            let openedwindowsx = openedwindows
            let openedwindowsy = openedwindows
            if (openedwindows * 25 + 50 > innerHeight - window.height){
                openedwindowsy = -2
            }
            if (openedwindows * 25 + 50 > innerWidth - window.width){
                openedwindowsx = -2
            }
            newWindow.style.left = openedwindowsx * 25 + 50 + "px"
            newWindow.style.top = openedwindowsy * 25 + 50 + "px"
        }
    }
    else{
        newWindow.style.left = window.x
        newWindow.style.top = window.y
    }
    newWindow.style.display = "none"
    newWindow.innerHTML =
    `
    <div class="topbar" ${noResize ? '' : 'ondblclick="maximise(this.parentElement)"'} onmousedown="windowMouseDown(event, this, 'drag', ${noResize})" ontouchstart="windowMouseDown(event, this, 'drag', ${noResize})">
        <left>
            <p style="display: none;">${window.title}</p>
        </left>
        <div class="buttons">
            ${xOnly? `` : `<div class="dash" onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"><img src="./Resources/aero/buttons/min/icon.png"></div>
            <div class="square" ${noResize ? 'disabled' : 'onclick="maximise(this.parentElement.parentElement.parentElement)"'}><img src="./Resources/aero/buttons/max/icon.png"></div>`}
            <div class="x" onclick="closeWindow(${id})"><img src="./Resources/aero/buttons/close/icon.png"></div>
        </div>
    </div>
    ${noResize ? `` : `<div onmousedown="windowResize(event, this, 'left', 'top')" class="topleft"></div>
    <div onmousedown="windowResize(event, this, 'right', 'top')" class="topright"></div>
    <div onmousedown="windowResize(event, this, 'left', 'bottom')" class="bottomleft"></div>
    <div onmousedown="windowResize(event, this, 'right', 'bottom')" class="bottomright"></div>
    <div onmousedown="windowResize(event, this, 'top')" class="top"></div>
    <div onmousedown="windowResize(event, this, 'left')" class="left"></div>
    <div onmousedown="windowResize(event, this, 'right')" class="right"></div>
    <div onmousedown="windowResize(event, this, 'bottom')" class="bottom"></div>`}
    <ignore></ignore>
    <text style="width: ${window.width}px; height: ${window.height}px">${window.innerhtml}</text>
    ${ispopup ? `<footer><button onclick="closeWindow(${id})">OK</button></div>` : ''}
    `
    windows.append(newWindow)
    if(ispopup || noSelfOpen){
        showWindow(window.icon, id)
    }
}
function getId(){
    const randNum = Math.round(Math.random() * 99999)
    let id;
    for(let i = randNum;;i++){
        let idCollision = false
        for(const a of document.querySelectorAll("*[windowid]"))
            if(a.getAttribute("windowid") == i.toString())
                idCollision = true
        if (!idCollision)
            return i
    }
}
async function loadApp(packageName, path, args, id){
    if (!path) path = "../ProgramFiles/"
    path += packageName + "/"
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4){
            if(request.status == 200){
                const info = JSON.parse(request.responseText)
                if (typeof id == "undefined") id = getId()
                if (info.window){
                    if (info.noGUI)
                        AddWindowNoGUI(new Window(info.x, info.y, info.width, info.height, info.title, 
                            `<iframe src="${path}index.html" args="${args}" frameborder="0" onload="sendInfo(this)">`, 
                            path + info.icon, true), undefined, info.noResize, info.xOnly)
                    else
                        AddWindow(new Window(info.x, info.y, info.width, info.height, info.title, 
                            `<iframe src="${path}index.html" args="${args}" frameborder="0" onload="sendInfo(this)">`, 
                            path + info.icon, true), undefined, info, id)
                }
                else if (info.tray) {
                    addTray(id, new TrayIcon(info.tray.width, 
                        `<iframe src="${path}tray.html" ${info.tray.monochrome ? 'class="monochrome"' : ''} 
                        windowid="${id}" name="${info.title}" frameborder="0" sandbox="allow-scripts allow-same-origin" style="width: ${info.tray.width}px"></iframe>`, info.title), 
                        new Tray(info.width, info.height, `<iframe src="${path}index.html" frameborder="0"></iframe>`, info.title)
                    )
                }
            }
            else{
                msgbox(packageName, `Winda can't find ${packageName}. Make sure you typed the name correctly, and then try again`)
            }
        }
    }
    request.open("GET", path + "init.json", true);
    request.send();
}

async function loadAppNoInfo(packageName, path, name, args){
    if (!path) path = "../ProgramFiles/"
    path += packageName + "/"
    const id = getId()
    AddWindow(new Window(50, 50, window.innerWidth - 100, window.innerHeight - 100, name, `<iframe src="${path}index.html" args="${args}" sandbox="allow-scripts allow-same-origin" frameborder="0">`, '', true), undefined, {"window": true, "noSelfOpen": true, "title": packageName}, id)
}
async function loadOkna8App(packageName, path, name, args){
    if (!path) path = "../ProgramFiles/"
    path += packageName + "/"
    const id = getId()
    AddWindow(new Window(0, 0, 0, 0, name, `<iframe src="${path}index.html" args="${args}" frameborder="0">`, '', true), undefined, {"window": true, "noSelfOpen": true, "title": packageName, "left": 50, "top": 50, "width": window.innerWidth - 100, "height": window.innerHeight - 100}, id)
}

function showTray(tray){
    if (tray == activetray){
        tray.style.display = "none"
        activetray = undefined
        return
    }
    try{
        activetray.style.display = "none"
    } catch (e) {}
    activetray = tray
    activetray.style.display = "block"
}
function contextMenu(e){
    e.preventDefault();
    contextMenuElement.style.display = "flex";
    contextMenuElement.style.left = `${e.clientX}px`
    contextMenuElement.style.top = `${e.clientY}px`
}
function contextMenuOff(e){
    contextMenuElement.style.display = "none";
}

function desktopInit(){
    if (init) return
    try{
        winload.remove()
    }
    catch(e){
        console.log("Winload not found. skipped")
    }
    document.body.setAttribute("onmousemove", "move(event);"); 
    document.body.setAttribute("ontouchmove", "move(event);");
    document.querySelector(".explorer").style.display = "";
    loadApp("sfc", undefined, "/silent")
    loadApp("explorer", "", "", 0)
    init = true
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") isLoaded = true
    if (localStorage.fastBoot == "true" || localStorage.verboseBoot == "true" || bootAnimationEnded ) desktopInit()
}

bootAnimation.addEventListener("ended", e => {
    if (isLoaded) desktopInit()
    bootAnimationEnded = true;
    bootAnimation.currentTime = 3.02;
    bootAnimation.play()
    doesntloadwinload.style.display = "block"
})
function shutdown(){
    document.body.style.backgroundColor = "black"
    document.body.innerHTML = '<div style="position: absolute; left: 50vw; top: 50vh; transform: translate(-50%, -50%); color: white">It is now safe to turn off your computer</div>'
    wallpaper.innerHTML = 
    `
    :root{
        --wallpaper: none
    }
    `
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
    wallpaper.innerHTML = 
    `
    :root{
        --wallpaper: none
    }
    `
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
    document.querySelector(".explorer").style.display = "none"
    document.querySelector(".logonui").style.display = "block"
    windows.innerHTML = ""
    trays.innerHTML = ""
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
function changeWallpaper(wallpaperpath, nochange){
    if (wallpaperpath.length > 4000000) {
        msgbox("Storage", "Wallpaper is very big and may be causing problems with your saved data. Size: " + Math.round(wallpaperpath.length / 10000) / 100 * 2 + "MB")
        return
    }
    try{
        if (!nochange) localStorage.wallpaper = wallpaperpath
        wallpaper.innerHTML = 
        `
        :root{
            --wallpaper: url("${wallpaperpath}")
        }
        `
    }
    catch(e) {
        msgbox("Storage", "Not enough storage available for this operation.")
    }
}
function setWallpaperStretch(stretchmode){
    localStorage.wallpaperstretch = stretchmode
    if (stretchmode == "center")
        stretch.innerHTML = ``
    else if (stretchmode == "fill")
        stretch.innerHTML = `body{
    background-size: cover;
}`
    else if (stretchmode == "fit")
        stretch.innerHTML = `body{
    background-size: contain;
}`
    else if (stretchmode == "stretch")
        stretch.innerHTML = `body{
    background-size: 100% 100%;
}`
    else if (stretchmode == "tile")
        stretch.innerHTML = `body{
    background-repeat: repeat !important;
}`
}
changeWallpaper(localStorage.wallpaper, true)
setWallpaperStretch(localStorage.wallpaperstretch)