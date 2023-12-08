explorerbottomrightinfo.innerHTML = "Build " + localStorage.ver
class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
function closeAllElements(){
    timeMenu(false)
    startMenu(false)
}
const taskbar = document.querySelector(".taskbar");
function createIcon(icon){
    let a = document.createElement("div")
    a.className = "icon"
    a.innerHTML = `<img src="${icon.image}" onerror="this.style.opacity = '0'">${icon.title}`
    a.setAttribute("ondblclick", icon.action)
    document.querySelector(".icons").appendChild(a)
}
function startMenu(open){
    // if (open === true) timeMenu(false)
    if(open){
        document.querySelector(".start-menu").style.display = "flex";
        document.querySelector(".wrapper").setAttribute("onclick", "startMenu(false)");
    }
    else{
        document.querySelector(".start-menu").style.display = "none";
        document.querySelector(".wrapper").setAttribute("onclick", "startMenu(true)");
    }
}
// function timeMenu(open){
//     if (open === true) startMenu(false)
//     if(open){
//         timepanel.style.display = "flex";
//         document.querySelector(".time").setAttribute("onclick", "timeMenu(false)");
//     }
//     else{
//         timepanel.style.display = "none";
//         document.querySelector(".time").setAttribute("onclick", "timeMenu(true)");
//     }
// }
function addStartMenuEntryLeft(name, icon, action){
    document.querySelector(".left-start").innerHTML += `<div class="start-option blue" onclick="${action}"><img src="${icon}"></img>${name}</div>`
}
addStartMenuEntryLeft("Version 0.0.1", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
addStartMenuEntryLeft("Version 0.0.2", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
addStartMenuEntryLeft("Version 0.1.0", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.0", "./Resources/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.2", "./Resources/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
function reloadIcons(){
    document.querySelector(".icons").innerHTML = ""
    JSON.parse(localStorage.appList).forEach((e) => {
        createIcon(new Icon(e, "../ProgramFiles/" + e + "/icon.png", "loadApp('" + e + "')"))
    })
}
reloadIcons()
// createIcon(new Icon("OBS Studio (Fleen5177)", "../ProgramFiles/fleen5177-obs/icon.png", "loadApp('fleen5177-obs')"))
addStartMenuEntryLeft("Welcome window", './Resources/icon.jpg', `msgbox('Welcome', 'Welcome to Windows Beta!'), true)`)