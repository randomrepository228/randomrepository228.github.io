class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
const taskbar = document.querySelector(".taskbar");

function createIcon(icon){
    let a = document.createElement("div")
    a.className = "icon"
    a.innerHTML = `<img src="${icon.image}">${icon.title}`
    a.setAttribute("onclick", icon.action)
    document.querySelector(".icons").appendChild(a)
}
function startMenu(open){
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
    if(open){
        document.querySelector(".time-2").style.display = "flex";
        document.querySelector(".time").setAttribute("onclick", "timeMenu(false)");
    }
    else{
        document.querySelector(".time-2").style.display = "none";
        document.querySelector(".time").setAttribute("onclick", "timeMenu(true)");
    }
}
function addStartMenuEntryLeft(name, icon, action){
    document.querySelector(".left-start").innerHTML += `<div class="start-option" onclick="${action}"><img src="${icon}"></img>${name}</div>`
}
let activewindow;
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('.');
}
function formatTime(date) {
    return [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(':');
}
function formatMonth(date){
    return ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"][[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(date.getMonth()+1)]
}
function changeTime(){
    const time = new Date()
    document.querySelector(".time").innerHTML = `${formatTime(time)}<br>${formatDate(time)}`
    document.querySelector(".datetime").innerHTML = `${time.getDate()} ${formatMonth(time)} ${time.getFullYear()} г.`
}
changeTime()
setInterval(changeTime, 1000)
createIcon(new Icon("Version 0.0.1", "./Resources/icon.jpg", "window.location.href = './versions/0.0.1/simulator.html'"))
createIcon(new Icon("Version 0.0.2", "./Resources/icon.jpg", "window.location.href = './versions/0.0.2/simulator.html'"))
createIcon(new Icon("Version 0.1.0", "./Resources/icon.jpg", "window.location.href = './versions/0.1.0/simulator.html'"))
createIcon(new Icon("Version 0.9.0", "./Resources/icon.jpg", "window.location.href = './versions/b0.9.0/simulator.html'"))
createIcon(new Icon("test window", "./Resources/icon.jpg", 'AddPopupWindow(new Window(Math.random()*window.innerWidth, Math.random()*window.innerHeight, 200, 300, "test window", "hihihi"))'))
addStartMenuEntryLeft("Welcome window", './Resources/icon.jpg', `AddPopupWindow(
    new Window((window.innerWidth/2)-150, (window.innerHeight/2)-150, 300, 300, 
    'Welcome', 
    'Welcome to Windows Beta!'))`)