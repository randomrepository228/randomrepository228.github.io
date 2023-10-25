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
    document.querySelector(".left-start").innerHTML += `<div class="start-option" onclick="${action}"><img src="${icon}"></img>${name}</div>`
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
createIcon(new Icon("test window", "./Resources/icon.jpg", 'AddWindow(new Window(Math.random()*(innerWidth-200), Math.random()*(innerHeight-300), 200, 300, "test window", "hihihi"), true)'))
createIcon(new Icon("Example App", "../ProgramFiles/ExampleApp/icon.png", "loadApp('ExampleApp')"))
createIcon(new Icon("Registry Editor", "../ProgramFiles/regedit/icon.png", "loadApp('regedit')"))
addStartMenuEntryLeft("Welcome window", './Resources/icon.jpg', `AddWindow(
    new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 500, 500, 
    'Welcome', 
    'Welcome to Windows Beta!'), true)`)
