loop = {drag: false, top: false, left: false, right: false, bottom: false};
prevx = 150;
prevy = 150;
let activewindow;
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
    if(elem.parentElement.classList.contains("maximised")) return;
    if(elem.children[1].matches(":hover")) return;
    let touch = false;
    activewindow = elem.parentElement
    loop.drag = true;
    iframeignore.innerHTML = "ignore{display:block !important}"
    if (event.touches) {
        event = event.touches[0];
        touch = true;
        console.log(event)
    }
    prevx=event.clientX-elem.getBoundingClientRect().x
    prevy=event.clientY-elem.getBoundingClientRect().y
    if (!touch)
        document.addEventListener("mouseup", () => {loop.drag = false, iframeignore.innerHTML = ""}, {once: true});
    else
        document.addEventListener("touchend", () => {loop.drag = false, iframeignore.innerHTML = ""}, {once: true});
}
function AddPopupWindow(window){
    gg = openedwindows.length
    openedwindows.push(gg)
    document.body.innerHTML =
    `
    <div class="n${gg} window winapi_shadow winapi_transparent" windowid="${gg}" style="left: ${window.x}px;top: ${window.y}px; width: ${window.width}px; height: ${window.height}px">
        <div class="topbar" ondblclick="maximise(this.parentElement)" onmousedown="windowMouseDown(event, this)" ontouchstart="windowMouseDown(event, this)">
            <left>
                <img src="${window.icon}" onerror="this.remove()">
                <p>${window.title}</p>
            </left>
            <div class="buttons">
                <div class="dash" onclick="this.parentElement.parentElement.parentElement.style.display = 'none'"><img src="./Resources/buttons/min/icon.png"></div>
                <div class="square" onclick="maximise(this.parentElement.parentElement.parentElement)"><img src="./Resources/buttons/max/icon.png"></div>
                <div class="x" onclick="closeWindow(this.parentElement.parentElement.parentElement)"><img src="./Resources/buttons/close/icon.png"></div>
            </div>
        </div>
        <div class="topleft"></div>
        <div class="topright"></div>
        <div class="bottomleft"></div>
        <div class="bottomright"></div>
        <div class="top"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="bottom"></div>
        <div class="content">
            <ignore></ignore>
            <text>${window.innerhtml}</text>
            <footer><button onclick="closeWindow(this.parentElement.parentElement.parentElement)">OK</button></div>
        </div>
    </div>
    ` + document.body.innerHTML
    AddWindowDefault(window.icon, gg);
}
// function AddWindow(window){

// }
function closeWindow(window){
    function timeout(){
        for (a of document.querySelectorAll(".n" + window.attributes.windowid.value)) a.remove()
        openedwindows = openedwindows.splice(openedwindows.indexOf(window.attributes.windowid.value), 1);
    }
    window.className += " closing"
    setTimeout(timeout, 300);
}
function minimizeWindow(window){
    if (window.style.display == 'none')
        window.style.display = 'flex'
    else 
        window.style.display = 'none'
}
function maximise(window){
    if (window.className.search("maximised") == -1)
        window.className = window.className.replace("window", "maximised window")
    else
    window.className = window.className.replace("maximised window", "window")
}
function move(e){
    if (e.touches) e = e.touches[0]
    if(loop.drag){
        activewindow.style.left = `${e.clientX - prevx}px`
        activewindow.style.top = `${e.clientY - prevy}px`
    }
}
addEventListener("message", move)
function contextMenu(e){
    e.preventDefault();
    contextMenuElement.style.display = "flex";
    contextMenuElement.style.left = `${e.clientX}px`
    contextMenuElement.style.top = `${e.clientY}px`
}
function contextMenuOff(e){
    contextMenuElement.style.display = "none";
}
AddPopupWindow(new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 500, 300, "Welcome", "Welcome to Windows Beta!", "./Resources/icon.jpg"))