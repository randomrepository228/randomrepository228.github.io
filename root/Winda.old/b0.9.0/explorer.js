class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
function createIcon(icon){
    let a = document.createElement("div")
    a.className = "icon"
    a.innerHTML = `<img src="${icon.image}">${icon.title}`
    a.setAttribute("onclick", icon.action)
    document.querySelector(".icons").appendChild(a)
}
let activewindow;
// x, y, width, height, title, innerhtml, buttons
createIcon(new Icon("Version 0.0.1", "./img/icon.jpg", "window.location.href = './../0.0.1/simulator.html'"))
createIcon(new Icon("Version 0.0.2", "./img/icon.jpg", "window.location.href = './../0.0.2/simulator.html'"))
createIcon(new Icon("Version 0.1.0", "./img/icon.jpg", "window.location.href = './../0.1.0/simulator.html'"))
createIcon(new Icon("test window", "./img/icon.jpg", 'AddPopupWindow(new Window(Math.random()*window.innerWidth, Math.random()*window.innerHeight, 200, 300, "test window", "hihihi"))'))