loop = false;
prevx = 150;
prevy = 150;
activewindows = [];
class Window {
    constructor(height, width, x, y) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
    }
}
function SetupWindow(window){
    a = true;
    e = 0;
    while(a){
        if (activewindows.includes(e)){
            e++
        }
        else{
            a = false;
            num = e;
        }
    }
    document.body.appendChild(document.createElement(`window_${num}`))
}
function closeWindow(window){
    window.style.display = "none";
}
const topbar = document.getElementById("main");
const window2 = document.querySelector(".window");
function move(e){
    if(loop){
        window2.style.left = `${e.clientX - prevx}px`
        window2.style.top = `${e.clientY - prevy}px`
    }
}