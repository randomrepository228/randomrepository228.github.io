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
    a.innerHTML = `<img src="${icon.image}">${icon.title}`
    a.setAttribute("ondblclick", icon.action)
    document.querySelector(".icons").appendChild(a)
}
function startMenu(open){
    if (open === true) timeMenu(false)
    if(open){
        document.querySelector(".start-menu").style.display = "flex";
        document.querySelector(".wrapper").setAttribute("onclick", "startMenu(false)");
    }
    else{
        document.querySelector(".start-menu").style.display = "none";
        document.querySelector(".wrapper").setAttribute("onclick", "startMenu(true)");
    }
}
function timeMenu(open){
    if (open === true) startMenu(false)
    if(open){
        timepanel.style.display = "flex";
        document.querySelector(".time").setAttribute("onclick", "timeMenu(false)");
    }
    else{
        timepanel.style.display = "none";
        document.querySelector(".time").setAttribute("onclick", "timeMenu(true)");
    }
}
function addStartMenuEntryLeft(name, icon, action){
    document.querySelector(".left-start").innerHTML += `<div class="start-option blue" onclick="${action}"><img src="${icon}"></img>${name}</div>`
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('.');
}
function formatTime(date) {
    return [date.getHours(), padTo2Digits(date.getMinutes())].join(':');
}
function formatMonth(date){
    return ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"][date.getMonth()]
}
function changeTime(){
    const time = new Date()
    document.querySelector(".time").innerHTML = `${formatTime(time)}<br>${formatDate(time)}`
}
changeTime()
setInterval(changeTime, 1000)
addStartMenuEntryLeft("Version 0.0.1", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
addStartMenuEntryLeft("Version 0.0.2", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
addStartMenuEntryLeft("Version 0.1.0", "./Resources/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.0", "./Resources/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
addStartMenuEntryLeft("Version 0.9.2", "./Resources/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
createIcon(new Icon("Example App", "../ProgramFiles/ExampleApp/icon.png", "loadApp('ExampleApp')"))
createIcon(new Icon("Registry Editor", "../ProgramFiles/regedit/icon.png", "loadApp('regedit')"))
createIcon(new Icon("Okna 8 Mode", "../ProgramFiles/Okna8Mode/icon.png", "loadApp('Okna8Mode')"))
createIcon(new Icon("Winda Control Panel", "../ProgramFiles/control/icon.png", "loadApp('control')"))
createIcon(new Icon("Task Manager", "../ProgramFiles/taskmgr/icon.png", "loadApp('taskmgr')"))
createIcon(new Icon("Calculator", "../ProgramFiles/calc/icon.png", "loadApp('calc')"))
createIcon(new Icon("Run", "../ProgramFiles/run/icon.png", "loadApp('run')"))
createIcon(new Icon("Changelog", "../ProgramFiles/changelog/icon.png", "loadApp('changelog')"))
createIcon(new Icon("OBS Studio (Fleen5177)", "../ProgramFiles/fleen5177-obs/icon.png", "loadApp('fleen5177-obs')"))
addStartMenuEntryLeft("Welcome window", './Resources/icon.jpg', `AddWindow(
    new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 500, 500, 
    'Welcome', 
    'Welcome to Windows Beta!'), true)`)