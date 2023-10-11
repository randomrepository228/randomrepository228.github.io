loop = false;
prevx = 150;
prevy = 150;
activewindow;
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
    document.querySelector(".left-bar").innerHTML = `<div class="n${num} window-tray" onclick="wnd = document.querySelector('.n${num}');if (wnd.style.display == 'none'){wnd.style.display = 'flex'} else{wnd.style.display = 'none'}"><img src=${icon} onerror="this.remove()"></div>` + document.querySelector(".left-bar").innerHTML
    document.querySelector(`.n${num}`).animate(
        [
            {transform: "perspective(400px) rotateX(20deg)", opacity: 0},
            {transform: "perspective(400px) rotateX(0deg)", opacity: 1}
        ],
        {
            duration: 300,
            iterations: 1,
        }
    )
}
let openedwindows = []
function windowMouseDown(event, elem){
    let touch = false;
    activewindow = elem.parentElement
    loop = true;
    if (event.touches) {
        event = event.touches[0];
        touch = true;
        console.log(event)
    }
    prevx=event.clientX-elem.getBoundingClientRect().x
    prevy=event.clientY-elem.getBoundingClientRect().y
    if (!touch)
        document.addEventListener("mouseup", () => {loop = false}, {once: true});
    else
        document.addEventListener("touchend", () => {loop = false}, {once: true});
}
function AddPopupWindow(window){
    for(var gg = 0; gg<=openedwindows.length; gg++){}
    openedwindows.push(gg)
    document.body.innerHTML =
    `
    <div class="n${gg} window winapi_shadow winapi_transparent_nomargin" style="left: ${window.x}px;top: ${window.y}px; width: ${window.width}px; height: ${window.height}px">
        <div class="topbar" ondblclick="maximise(this.parentElement)" onmousedown="windowMouseDown(event, this)" ontouchstart="windowMouseDown(event, this)">
            <left>
                <img src="${window.icon}" onerror="this.remove()">
                ${window.title}
            </left>
            <div class="buttons">
                <div class="dash" onclick="this.parentElement.parentElement.parentElement.style.display = 'none'"><img src="./Resources/minimise_icon.png"></div>
                <div class="square" onclick="maximise(this.parentElement.parentElement.parentElement)"><img src="./Resources/maximise_icon.png"></div>
                <div class="x" onclick="closeWindow(this.parentElement.parentElement.parentElement)"><img src="./Resources/x_icon.png"></div>
            </div>
        </div>
        <div class="content">
            <div class="text">${window.innerhtml}</div>
            <div class="footer"><button class="windowbtn" onclick="closeWindow(this.parentElement.parentElement.parentElement)">OK</button></div>
        </div>
    </div>
    ` + document.body.innerHTML
    AddWindowDefault(window.icon, gg);
}
// function AddWindow(window){

// }
function closeWindow(window){
    function timeout(){
        window.remove()
    }
    window.className += " closing"
    document.getElementsByClassName(window.className.split(" ")[0])[1].remove()
    setTimeout(timeout, 300);
}
function minimizeWindow(window){
    window.style.display = "none";
}
function maximise(window){
    if (window.className.search("maximised") == -1)
        window.className = window.className.replace("window", "maximised window")
    else
    window.className = window.className.replace("maximised window", "window")
}
function move(e){
    if (e.touches) e = e.touches[0]
    if(loop){
        activewindow.style.left = `${e.clientX - prevx}px`
        activewindow.style.top = `${e.clientY - prevy}px`
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
AddPopupWindow(new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 500, 300, "Welcome", "Welcome to Windows Beta!", "./img/icon.jpg"))