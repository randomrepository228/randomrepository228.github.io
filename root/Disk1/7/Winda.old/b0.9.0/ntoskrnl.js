loop = false;
prevx = 150;
prevy = 150;
activewindow;
function WINAPI_BUTTON(content, action){
    if (content){
        if (!action){
            return `<button class="windowbtn">${content}</button>`
        }
        else{
            return `<button class="windowbtn" onclick="${action}">${content}</button>`
        }
    }
    else{
        return `<button class="windowbtn"></button>`
    }
}
function WINAPI_FOOTER(content){
    if (content){
        return `<div class="footer">${content}</div>`
    }
    else{
        return '<div class="footer"></div>'
    }
}
function WINAPI_VERTICAL_SCROLL(content){
    if (content){
        return `<div class="scrollable">${content}</div>`
    }
    else{
        return '<div class="scrollable"></div>'
    }
}
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
function AddPopupWindow(window){
    document.body.innerHTML =
    `
    <div class="window opening" style="left: ${window.x};top: ${window.y}; width: ${window.width}; height: ${window.height}">
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
    setTimeout(() => {document.getElementsByClassName("window")[0].className = "window"}, 300);
}
function AddWindow(window){

}
function closeWindow(window){
    function timeout(){
        window.remove()
    }
    window.className = "window closing"
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