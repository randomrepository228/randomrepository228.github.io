loop = false;
prevx = 150;
prevy = 150;
activewindow;
class Window {
    constructor(x, y, width, height, title, innerhtml, icon) {
        this.height = height;
        this.width = width;
        this.title = title;
        this.x = x;
        this.y = y;
        this.innerhtml = innerhtml;
        this.icon = icon
    }
}
function AddWindowDefault(icon, num){
    setTimeout(() => {document.getElementsByClassName("window")[0].className = `n${num} window winapi_transparent_nomargin winapi_shadow`}, 300);
    document.querySelector(".left-bar").innerHTML = `<div class="n${num} window-tray" onclick="wnd = document.querySelector('.n${num}');if (wnd.style.display == 'none'){wnd.style.display = 'flex'} else{wnd.style.display = 'none'}"><img src=${icon} onerror="this.remove()"></div>` + document.querySelector(".left-bar").innerHTML
}
let openedwindows = []
function AddPopupWindow(window){
    for(var gg = 0; gg<=openedwindows.length; gg++){}
    openedwindows.push(gg)
    document.body.innerHTML =
    `
    <div class="n${gg} window opening winapi_shadow winapi_transparent_nomargin" style="left: ${window.x}px;top: ${window.y}px; width: ${window.width}; height: ${window.height}">
        <div class="topbar" onmousedown="activewindow = this.parentElement;loop = true;prevx=event.clientX-this.getBoundingClientRect().x;prevy=event.clientY-this.getBoundingClientRect().y" onmouseup="loop = false;">
            <left>
                <img src="${window.icon}" onerror="this.style.opacity = '0'">
                ${window.title}
            </left>
            <div class="buttons">
                <div class="dash" onclick="this.parentElement.parentElement.parentElement.style.display = 'none'">&ndash;</div>
                <div class="square">&#9723;</div>
                <div class="x" onclick="closeWindow(this.parentElement.parentElement.parentElement)">&#9747;</div>
            </div>
        </div>
        <div class="content" style="width: ${window.width-3}; height: ${window.height-3}">
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
    setTimeout(timeout, 600); // = 300
}
function minimizeWindow(window){
    window.style.display = "none";
}
function move(e){
    if(loop){
        activewindow.style.left = `${e.clientX - prevx}px`
        activewindow.style.top = `${e.clientY - prevy}px`
    }
}
AddPopupWindow(new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 300, 300, "Welcome", "Welcome to Windows Beta!", "./img/icon.jpg"))