class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
const taskbar = document.querySelector(".taskbar");
let icons;
function passIcons(elem){
    icons = elem
    reloadIcons()
}
function createIcon(icon){
    let a = document.createElement("div")
    a.className = "icon"
    a.innerHTML = `<img src="${icon.image}" onerror="this.style.opacity = '0'">${icon.title}`
    a.setAttribute("ondblclick", icon.action)
    icons.appendChild(a)
}
function startMenu(open, elem){
    if(open){
        document.querySelector(".start-menu").style.display = "flex";
        elem.setAttribute("onclick", "startMenu(false, this)");
        elem.children[0].className += " focus"
    }
    else{
        document.querySelector(".start-menu").style.display = "none";
        elem.setAttribute("onclick", "startMenu(true, this)");
        elem.children[0].className = elem.children[0].className.replace(" focus", "")
    }
}
function addStartMenuEntryLeft(name, icon, action){
    document.querySelector(".left-start").innerHTML += `<div class="start-option blue" onclick="${action}"><img src="${icon}"></img>${name}</div>`
}
function addStartMenuEntryRight(name, action){
    document.querySelector(".rstop").innerHTML += `<div class="start-option-right" onclick="${action}">${name}</div>`
}
function reloadIcons(){
    icons.innerHTML = ""
    JSON.parse(localStorage.appList).forEach((e) => {
        createIcon(new Icon(appListLocale[e], "../" + e + "/icon.png", "parent.loadApp('" + e + "')"))
    })
}
function passLeftBarAndTrayIcons(leftbar, trayicons){
    window.leftBar = leftbar
    window.trayicons = trayicons
}
addStartMenuEntryLeft("Version 0.0.1", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
addStartMenuEntryLeft("Version 0.0.2", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
addStartMenuEntryLeft("Version 0.1.0", "./res/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.0", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.2", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
addStartMenuEntryLeft("Welcome window", './res/icon.jpg', `msgbox('Welcome', 'Welcome to Windows Beta!'), true)`)