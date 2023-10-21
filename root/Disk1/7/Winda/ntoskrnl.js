loop = {drag: false, top: false, left: false, right: false, bottom: false};
prevx = 150;
prevy = 150;
let prevwidth;
let prevheight;
let origx;
let origy;
let activewindow;
let id = 0;
if (localStorage.theme == "basic") theme.href = "./Resources/basic/style.css"
if (!localStorage.theme) localStorage.theme = "aero"
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
function AddWindowDefault(icon, num){
    document.querySelector(".left-bar").innerHTML += `
    <div class="n${num} window-tray" windowid="${num}" onclick="minimizeWindow(document.querySelector('.n${num}'))">
        <img src=${icon} onerror="this.remove()">
    </div>`
    if(localStorage.theme == "aero")
        document.querySelector(`.n${num}`).animate(
            [
                {transform: "perspective(400px) rotateX(-5deg)", opacity: 0, scale: 0.9},
                {transform: "perspective(400px) rotateX(0deg)", opacity: 1, scale: 1}
            ],
            {
                duration: 300,
                iterations: 1,
            }
        )
}
let openedwindows = []
function windowMouseDown(event, elem){
    if(elem.children[1].matches(":hover")) return;
    let touch = false;
    let evName;
    activewindow = elem.parentElement
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
function AddWindow(window, ispopup){
    openedwindows.push(id)
    document.body.innerHTML =
    `
    <div class="n${id} window winapi_shadow winapi_transparent" windowid="${id}" style="left: ${window.x}px;top: ${window.y}px; width: ${window.width}px; height: ${window.height}px">
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
        <div onmousedown="windowResize(event, this, 'left', 'top')" class="topleft"></div>
        <div onmousedown="windowResize(event, this, 'right', 'top')" class="topright"></div>
        <div onmousedown="windowResize(event, this, 'left', 'bottom')" class="bottomleft"></div>
        <div onmousedown="windowResize(event, this, 'right', 'bottom')" class="bottomright"></div>
        <div onmousedown="windowResize(event, this, 'top')" class="top"></div>
        <div onmousedown="windowResize(event, this, 'left')" class="left"></div>
        <div onmousedown="windowResize(event, this, 'right')" class="right"></div>
        <div onmousedown="windowResize(event, this, 'bottom')" class="bottom"></div>
        <div class="content">
            <ignore></ignore>
            <text>${window.innerhtml}</text>
            ${ispopup ? '<footer><button onclick="closeWindow(this.parentElement.parentElement.parentElement)">OK</button></div>' : ''}
        </div>
    </div>
    ` + document.body.innerHTML
    AddWindowDefault(window.icon, id);
    id++
}
function closeWindow(window){
    if (localStorage.theme != "aero") timeout()
    function timeout(){
        for (a of document.querySelectorAll(".n" + window.attributes.windowid.value)) a.remove()
    }
    openedwindows = openedwindows.splice(openedwindows.indexOf(window.attributes.windowid.value), 1);
    window.className += " closing"
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
        window.animate([
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
        window.style.opacity = '0'
        window.style.pointerEvents = 'none'
        window.animate([
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
}
function snapLeft(window){
    window.className = window.className.replace("", "snap-left ")
}
function snapRight(window){
    window.className = window.className.replace("", "snap-right ")
}