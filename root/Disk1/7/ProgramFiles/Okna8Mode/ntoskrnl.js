loop = {drag: false, top: false, left: false, right: false, bottom: false};
prevx = 150;
prevy = 150;
let prevwidth;
let prevheight;
let origx;
let origy;
let activewindow;
let id = 0;
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
if (!localStorage.theme) localStorage.theme = "aero"
theme.href = "./Resources/" + localStorage.theme + "/style.css"
function connectScript(path) {
    let script = document.createElement('script')
    script.src = path
    document.head.append(script)
}
function changeTheme(a){
    localStorage.theme = a
    theme.href = "./Resources/" + a + "/style.css"
}
function setActive(window){
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = window;
    activewindow.style.zIndex = 1;
    for(element of document.querySelector(".left-bar").children)
        element.removeAttribute("focus")
    document.querySelector(`.n${activewindow.getAttribute("windowid")}.window-tray`).setAttribute("focus", "")
}
function setInactive(){
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = undefined;
    for(element of document.querySelector(".left-bar").children)
        element.removeAttribute("focus")
}
function AddWindowDefault(icon, num){
    document.querySelector(".left-bar").innerHTML += `
    <div class="n${num} window-tray" windowid="${num}" onclick="windowSelectHandler(document.querySelectorAll('.n${num}')[1])">
        <img src="${icon}" onerror="this.remove()">
    </div>`
    if(localStorage.theme == "aero"){
        let window = document.querySelectorAll(`.n${num}`)
        window[window.length-1].animate(
            [
                {transform: "perspective(400px) rotateX(-5deg)", opacity: 0, scale: 0.9},
                {transform: "perspective(400px) rotateX(0deg)", opacity: 1, scale: 1}
            ],
            {
                duration: 300,
                iterations: 1,
            }
        )
        document.querySelector(`.n${num}.window-tray`).animate(
            [{opacity: 0}, {opacity: 1}],
            {
                duration: 300,
                iterations: 1,
                easing: "ease-in-out"
            }
        )
    }
    setActive(document.querySelector(`.n${num}`))
}
let openedwindows = []
function windowMouseDown(event, elem){
    if(elem.children[1].matches(":hover")) return;
    let touch = false;
    let evName;
    setActive(elem.parentElement);
    loop.drag = true;
    iframeignore.innerHTML = "ignore{display:block !important}"
    if (event.touches) {
        event = event.touches[0];
        touch = true;
    }
    prevx=event.clientX-elem.getBoundingClientRect().x
    prevy=event.clientY-elem.getBoundingClientRect().y
    prevheight=activewindow.getBoundingClientRect().height
    prevwidth=activewindow.getBoundingClientRect().width
    if (!touch) evName = "mouseup"
    else evName = "touchend"
    document.addEventListener(evName, e => {
        loop.drag = false; 
        iframeignore.innerHTML = "";
        console.log(e.clientX, e.clientY)
        if (e.clientX < 1) {snapLeft(activewindow); return}
        if (e.clientX > innerWidth - 2) {snapRight(activewindow); return}
        if (e.clientY < 1) maximise(activewindow)
    }, {once: true});
}
function windowResize(event, elem, ...actions){
    let touch = false;
    activewindow = elem.parentElement
    loop = {drag: false, top: false, left: false, right: false, bottom: false}
    for (a of actions) loop[a] = true
    iframeignore.innerHTML = "ignore{display:block !important}"
    if (event.touches) {
        event = event.touches[0];
        touch = true;
    }
    prevx=event.clientX-elem.getBoundingClientRect().x
    prevy=event.clientY-elem.getBoundingClientRect().y
    origx=event.clientX-elem.getBoundingClientRect().width
    origy=event.clientY-elem.getBoundingClientRect().height
    prevheight=activewindow.getBoundingClientRect().height
    prevwidth=activewindow.getBoundingClientRect().width
    if (activewindow.classList.contains("snap-left") || activewindow.classList.contains("snap-right")){
        activewindow.style.height = prevheight + "px"
        activewindow.style.width = prevwidth + "px"
        activewindow.style.top = activewindow.getBoundingClientRect().y + "px"
        activewindow.style.left = activewindow.getBoundingClientRect().x + "px"
        activewindow.className = activewindow.className.replace("snap-right ", "")
        activewindow.className = activewindow.className.replace("snap-left ", "")
    }
    if (!touch)
        document.addEventListener("mouseup", () => {resized = 0; for (a of actions) loop[a] = false; iframeignore.innerHTML = ""}, {once: true});
    else
        document.addEventListener("touchend", () => {resized = 0; for (a of actions) loop[a] = false; iframeignore.innerHTML = ""}, {once: true});
}
function AddWindow(window, ispopup, noResize){
    openedwindows.push(id)
    newWindow = document.createElement("div")
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    newWindow.setAttribute("windowid", id)
    newWindow.style.left = window.x + "px"
    newWindow.style.top = window.y + "px"
    newWindow.style.width = window.width + "px"
    newWindow.style.height = window.height + "px"
    newWindow.style.opacity = 1
    newWindow.innerHTML =
    `
    <div class="topbar" ondblclick="maximise(this.parentElement)" onmousedown="windowMouseDown(event, this, 'drag')" ontouchstart="windowMouseDown(event, this, 'drag')">
        <left>
            <img src="${window.icon}" onerror="this.remove()">
            <p>${window.title}</p>
        </left>
        <div class="buttons">
            <div class="dash" onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"><img src="./Resources/aero/buttons/min/icon.png"></div>
            <div class="square" onclick="maximise(this.parentElement.parentElement.parentElement)"><img src="./Resources/aero/buttons/max/icon.png"></div>
            <div class="x" onclick="closeWindow(this.parentElement.parentElement.parentElement)"><img src="./Resources/aero/buttons/close/icon.png"></div>
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
    <div class="content">
        <ignore></ignore>
        <text>${window.innerhtml}</text>
        ${ispopup ? '<footer><button onclick="closeWindow(this.parentElement.parentElement.parentElement)">OK</button></div>' : ''}
    </div>
    `
    windows.append(newWindow)
    AddWindowDefault(window.icon, id);
    id++
}
function AddWindowNoGUI(window, noResize){
    openedwindows.push(id)
    newWindow = document.createElement("div")
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    newWindow.setAttribute("windowid", id)
    newWindow.style.left = window.x + "px"
    newWindow.style.top = window.y + "px"
    newWindow.style.width = window.width + "px"
    newWindow.style.height = window.height + "px"
    newWindow.style.opacity = 1
    newWindow.innerHTML =
    `
        ${noResize ? `` : `<div onmousedown="windowResize(event, this, 'left', 'top')" class="topleft"></div>
        <div onmousedown="windowResize(event, this, 'right', 'top')" class="topright"></div>
        <div onmousedown="windowResize(event, this, 'left', 'bottom')" class="bottomleft"></div>
        <div onmousedown="windowResize(event, this, 'right', 'bottom')" class="bottomright"></div>
        <div onmousedown="windowResize(event, this, 'top')" class="top"></div>
        <div onmousedown="windowResize(event, this, 'left')" class="left"></div>
        <div onmousedown="windowResize(event, this, 'right')" class="right"></div>
        <div onmousedown="windowResize(event, this, 'bottom')" class="bottom"></div>`}
        <div class="custom-content">
            <ignore></ignore>
            <text>${window.innerHTML}</text>
        </div>
    `
    windows.append(newWindow)
    AddWindowDefault(window.icon, id);
    id++
}
async function loadApp(packageName, path, args){
    if (!path) path = "../ProgramFiles/"
    path += packageName + "/"
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4){
            console.log(request.responseText)
            const info = JSON.parse(request.responseText)
            AddWindow(new Window(info.x, info.y, info.width, info.height, info.title, 
                `<iframe src="${path}index.html" args="${args}" frameborder="0">`, 
                path + info.icon, true))
        }
    }
    request.open("GET", path + "init.json", true);
    request.send();
}
async function loadAppNoInfo(packageName, path, args){
    if (!path) path = "../ProgramFiles/"
    path += packageName + "/"
    AddWindow(new Window(50, 50, window.innerWidth - 100, window.innerHeight - 100, packageName, `<iframe src="${path}index.html" args="${args}" frameborder="0">`, '', true))
}
function closeWindow(window){
    if (localStorage.theme != "aero") timeout()
    function timeout(){
        for (a of document.querySelectorAll(".n" + window.attributes.windowid.value)) a.remove()
    }
    openedwindows = openedwindows.splice(openedwindows.indexOf(window.attributes.windowid.value), 1);
    window.className += " closing"
    document.querySelector(`.n${window.attributes.windowid.value}.window-tray`).style.opacity = 0
    document.querySelector(`.n${window.attributes.windowid.value}.window-tray`).animate(
        [{opacity: 1}, {opacity: 0}],
        {
            duration: 300,
            iterations: 1,
            easing: "ease-in-out"
        }
    )
    setTimeout(timeout, 300);
}
function minimizeWindow(window){
    const animtime = {
        duration: 300,
        iterations: 1,
    };
    if (window.style.opacity === '0'){
        window.style.opacity = '1'
        window.style.pointerEvents = 'auto'
        setActive(window)
        if (localStorage.theme != "basic") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().y - 100}px`
            },
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }
        ], animtime)
    } else {
        setInactive()
        window.style.opacity = '0'
        window.style.pointerEvents = 'none'
        if (localStorage.theme != "basic") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }, 
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().y - 100}px`
            }
        ], animtime)
    }
}
function restoreWindow(window){
    const animtime = {
        duration: 300,
        iterations: 1,
    };
    if (window.style.opacity == '0'){
        window.style.opacity = '1'
        window.style.pointerEvents = 'auto'
        setActive(window)
        if (localStorage.theme != "basic") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${document.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().y - 100}px`
            },
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }
        ], animtime)
    }
}
function windowSelectHandler(window){
    if(activewindow !== window){
        setActive(window)
        restoreWindow(window)
        return
    }
    minimizeWindow(window)
}
function maximise(window){
    if (window.className.search("maximised") == -1){
        window.className = window.className.replace("", "maximised ")
        window.className = window.className.replace("snap-right ", "")
        window.className = window.className.replace("snap-left ", "")
    }
    else
        window.className = window.className.replace("maximised ", "")
}
function move(e){
    if (e.touches) e = e.touches[0]
    if(loop.drag){
        activewindow.style.top = `${e.clientY - prevy}px`
        if(activewindow.classList.contains("maximised") || activewindow.classList.contains("snap-right") || activewindow.classList.contains("snap-left")) {
            activewindow.className = activewindow.className.replace("maximised ", "");
            activewindow.className = activewindow.className.replace("snap-right ", "")
            activewindow.className = activewindow.className.replace("snap-left ", "")
            activewindow.style.top = "-10px";
            prevx = activewindow.getBoundingClientRect().width / 2;
            prevy += 10
            return
        }
        activewindow.style.left = `${e.clientX - prevx}px`
    }
    if(loop.right){
        activewindow.style.width = `${e.clientX - +activewindow.style.left.substring(0, activewindow.style.left.length - 2) - 7}px`
    }
    if(loop.bottom){
        activewindow.style.height = `${e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 4}px`
    }
    if(loop.top){
        activewindow.style.top = `${e.clientY - prevy}px`
        activewindow.style.height = `${prevheight + origy - e.pageY}px`
    }
    if(loop.left){
        activewindow.style.left = `${e.clientX - prevx}px`
        activewindow.style.width = `${prevwidth + origx - e.pageX}px`
    }
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
AddWindow(new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 500, 300, "Welcome", "Welcome to Windows Beta!", "./Resources/icon.jpg"), true)
function minimiseAll(){
    for (id of openedwindows){
        let wnd = document.querySelector(".n" + id)
        wnd.style.opacity = '0'
        wnd.style.pointerEvents = 'none'
    }
    setInactive()
}
function snapLeft(window){
    window.className = window.className.replace("", "snap-left ")
}
function snapRight(window){
    window.className = window.className.replace("", "snap-right ")
}

// OKNA 8 MODE ONLY

if (!localStorage.OKNA8_locale){
    localStorage.OKNA8_NetworkDetecting = "true"
    localStorage.OKNA8_locale = "en-us"
    localStorage.OKNA8_lockscreenWallpaper = "img104"
    localStorage.OKNA8_pcname = "Okna 8 Runtime"
    localStorage.OKNA8_setupState = "1"
    localStorage.OKNA8_soundlevel = "50"
    localStorage.OKNA8_user_user0_StartScreenBackground = "22000"
    localStorage.OKNA8_user_user0_color_background = "0,60,0"
    localStorage.OKNA8_user_user0_color_foreground = "22,153,0"
    localStorage.OKNA8_user_user0_desktopWallpaper = "img0"
    localStorage.OKNA8_user_user0_eosnotify_skip = "true"
    localStorage.OKNA8_user_user0_password = ""
    localStorage["OKNA8_user_user0_startScreen-layout"] = "92metrotile, wide, 2, rgb(1,111,193), rgb(0,141,211), Mail, rgb(1,111,193), ../../metro/Mail, |metrotile, wide, 14, rgb(81,51,171), rgb(100,62,191), Sports, rgb(81,51,171), ../../metro/Sports, |metrotile, standart, 10, rgb(210,71,38), rgb(220,87,46), People, rgb(210,71,38), ../../metro/People, |metrotile, standart, 13, rgb(0,175,240), rgb(26,200,243), Skype, rgb(0,175,240), ../../metro/Skype, |desktoptile, wide, 6|metrotile, wide, 12, rgb(81,51,171), rgb(100,62,191), Calendar, rgb(81,51,171), ../../metro/Calendar, |metrotile, wide, 15, rgb(0,138,0), rgb(0,166,0), Money, rgb(0,138,0), ../../metro/Money, |metrotile, large, 11, rgb(38,114,236), rgb(46,141,239), Weather, rgb(38,114,236), ../../metro/Weather, |metrotile, standart, 5, rgb(38,114,236), rgb(46,141,239), InternetExplorer, rgb(38,114,236), ../../metro/InternetExplorer, |metrotile, standart, 4, rgb(210,71,38), rgb(220,86,46), Music, rgb(210,71,38), ../../metro/Music, |metrotile, wide, 16, rgb(0,130,153), rgb(0,160,177), Photos, rgb(0,130,153), ../../metro/Photos, "
    localStorage.OKNA8_user_user0_theme_color = "42,81,67"
    localStorage.OKNA8_user_user0_userPrepared = "true"
    localStorage.OKNA8_user_user0_username = "Okna 8 Mode User"
    localStorage.OKNA8_users = "user0"
}