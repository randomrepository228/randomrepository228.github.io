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
class Winda7Window {
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
theme.href = "./res/" + localStorage.theme + "/style.css"
if (!localStorage.wallpaper) localStorage.wallpaper = "./img/img0.jpg"
if (!localStorage.wallpaperstretch) localStorage.wallpaperstretch = "stretch"
if (!localStorage.sounds) localStorage.sounds = '{"msgbox": "./media/Windows Exclamation.flac"}'
sounds = JSON.parse(localStorage.sounds)
function connectScript(path) {
    let script = document.createElement('script')
    script.src = path
    document.head.append(script)
}
function changeTheme(a){
    if (a != "aero" && localStorage.maximiseTransparency){
        localStorage.maximiseTransparency = "false"
        refreshTransparency()
    }
    localStorage.theme = a
    theme.href = "./res/" + a + "/style.css"
    for (let i = 0; i < frames.length; i++) {
        frames[i].postMessage("theme|" + a, "*")
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
    if (!path) path = "bin/"
    path += packageName + "/"
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4){
            if(request.status == 200){
                const info = JSON.parse(request.responseText)
                if (typeof id == "undefined") id = getId()
                if (info.window){
                    AddWindow(new Winda7Window(info.x, info.y, info.width, info.height, info.title, 
                        `<iframe src="${path}index.html" args="${args}" frameborder="0" onload="sendInfo(this)">`, 
                        path + info.icon, true), undefined, info, id)
                }
                else if (info.tray) {
                    addTray(id, new TrayIcon(info.tray.width, 
                        `<iframe src="${path.replace("../bin", "..", 1)}tray.html" ${info.tray.monochrome ? 'class="monochrome"' : ''} 
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
    if (!path) path = "bin/"
    path += packageName + "/"
    const id = getId()
    AddWindow(new Winda7Window(50, 50, window.innerWidth - 100, window.innerHeight - 100, name, `<iframe src="${path}index.html" args="${args}" sandbox="allow-scripts allow-same-origin" frameborder="0">`, '', true), undefined, {"window": true, "noSelfOpen": true, "title": packageName}, id)
}
async function loadOkna8App(packageName, path, name, args){
    if (!path) path = "bin/"
    path += packageName + "/"
    const id = getId()
    AddWindow(new Winda7Window(0, 0, 0, 0, name, `<iframe src="${path}index.html" args="${args}" frameborder="0">`, '', true), undefined, {"window": true, "okna8": true, "title": packageName, "width": 800, "height": 600, "classes": " okna8 maximised"}, id)
}
function contextMenu(e, content, x, y, contextMenuType){
    let contextMenuElem;
    if (contextMenuType) contextMenuElem = contextMenuElement2
    else contextMenuElem = contextMenuElement
    if (e.preventDefault){
        e.preventDefault()
    }
    contextMenuElement.innerHTML = ""
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
    const boundClientRect = contextMenuElement.getBoundingClientRect()
    if (x > innerWidth - boundClientRect.width) x = innerWidth - boundClientRect.width
    if (y > innerHeight  - boundClientRect.height) y = innerHeight - boundClientRect.height
    contextMenuElement.style.left = `${x}px`
    contextMenuElement.style.top = `${y}px`
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
    if (move){
        document.body.setAttribute("onmousemove", "move(event);"); 
        document.body.setAttribute("ontouchmove", "move(event);");
    }
    else{
        msgbox("Window Manager", "Overlapping Window Manager is not found. Using fullscreen windows instead")
    }
    document.body.setAttribute("onmousedown", "if (!event.target.classList.contains('context-menu-part')) {contextMenuOff()}"); 
    document.body.setAttribute("ontouchstart", "if (!event.target.classList.contains('context-menu-part')) {event.preventDefault(); contextMenuOff()}");
    document.querySelector(".icons").setAttribute("onclick", "if (event.target.parentElement.parentElement !== contextMenuElement) contextMenuOff()")
    document.querySelector(".explorer").style.display = "";
    document.oncontextmenu = (e) => e.preventDefault()
    loadApp("sfc", undefined, "/silent")
    init = true
    if(!localStorage.prevver || localStorage.prevver != localStorage.ver){
        msgbox("New update", "<h1 style=\"margin: 0\">Welcome to 20240223!</h1>What's new?<br>Context menu!<br>You can now save files in Notepad!<br><a href=\"https://nekit270.ch/bcwd\">bcwd support!</a><br>Input box!")
        localStorage.prevver = localStorage.ver
        return;
    }
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
async function changeWallpaper(wallpaperpath, nochange){
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
function refreshTransparency(){
    maximisetransparency.innerHTML = localStorage.maximiseTransparency == "true" && localStorage.theme == "aero" ? ".maximised{background-color: black !important; backdrop-filter: none !important}" : ""
}
function refreshDpi(){
    dpiscale.setAttribute("content", `width=device-width, initial-scale=${localStorage.dpiscale == "true" ? 0.5 : 1}, user-scalable=no`)
}
// (async () => {
//     const data = await JSZip.loadAsync(await (await fetch("bin.zip")).arrayBuffer())
//     for (let [key, value] of Object.entries(data.files)){
//         if (key.endsWith("/"))
//             key += "."
//         await fs.writeFile(key, new Blob([await value.async("arraybuffer")]))
//     }
// })()
refreshDpi()