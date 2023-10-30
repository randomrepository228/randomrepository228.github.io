loop = false;
prevx = 150;
prevy = 150;
activewindow;
class Window {
    constructor(x, y, width, height, title, innerhtml) {
        this.height = height;
        this.width = width;
        this.title = title;
        this.x = x;
        this.y = y;
        this.innerhtml = innerhtml;
    }
}
function AddWindowDefault(){
    setTimeout(() => {document.getElementsByClassName("window")[0].className = "window winapi_transparent_nomargin winapi_shadow"}, 300);
    document.querySelector(".left-bar").innerHTML = '<div class="window-tray"></div>' + document.querySelector(".left-bar").innerHTML
}
function AddPopupWindow(window){
    document.body.innerHTML =
    `
    <div class="window opening winapi_shadow winapi_transparent_nomargin" style="left: ${window.x};top: ${window.y}; width: ${window.width}; height: ${window.height}">
        <div class="topbar" onmousedown="activewindow = this.parentElement;loop = true;prevx=event.clientX-this.getBoundingClientRect().x;prevy=event.clientY-this.getBoundingClientRect().y" onmouseup="loop = false;">
            ${window.title}
            <div class="buttons">
                <div class="dash">&ndash;</div>
                <div class="square">&#9723;</div>
                <div class="x" onclick="closeWindow(this.parentElement.parentElement.parentElement)">&#10006;</div>
            </div>
        </div>
        <div class="content" style="width: ${window.width-3}; height: ${window.height-3}">
            <div class="text">${window.innerhtml}</div>
            <div class="footer"><button class="windowbtn" onclick="closeWindow(this.parentElement.parentElement.parentElement)">OK</button></div>
        </div>
    </div>
    ` + document.body.innerHTML
    AddWindowDefault();
}
// function AddWindow(window){

// }
function closeWindow(window){
    function timeout(){
        window.remove()
    }
    window.className = "window closing winapi_shadow"
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
AddPopupWindow(new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 300, 300, "Welcome", "Welcome to Windows Beta!"))