function showAllPrograms(){
    const leftStart = document.querySelector(".left-start")
    leftStart.style.height = leftStart.getBoundingClientRect().height + "px"
    leftStart.querySelector(".left-start-main").style.display = "none"
    leftStart.querySelector(".allprograms").style.display = "block"
}
function hideAllPrograms(){
    const leftStart = document.querySelector(".left-start")
    leftStart.style.height = undefined
    leftStart.querySelector(".left-start-main").style.display = "block"
    leftStart.querySelector(".allprograms").style.display = "none"
}
const taskbar = document.querySelector(".taskbar");
function startMenu(open){
    if (open) contextMenuOff();
    let elem = document.querySelector(".wrapper")
    const SMAction1 = "startMenu(false)"
    const SMAction2 = "if(event.which === 1) startMenu(true)"
    if(open){
        document.querySelector(".start-menu").style.display = "flex";
        elem.setAttribute("onmousedown", SMAction1);
        elem.setAttribute("ontouchstart", SMAction1);
        elem.className += " focus"
    }
    else{
        document.querySelector(".start-menu").style.display = "none";
        elem.setAttribute("onmousedown", SMAction2);
        elem.setAttribute("ontouchstart", "startMenu(true)");
        elem.className = elem.className.replace(" focus", "")
    }
}
let fileList = new ui.FileView();
let icons = fileList.elem
icons.id = "icons";
icons.oncontextmenu = (e) => {
    if (e.target !== icons) return
    contextMenu(e, [
        ['', 'Refresh', () => reloadIcons()], 
        ['', 'Personalize', () => loadApp('control', '', 'personalize')], 
        ['', 'New text document', async() => {
            const input = await inputbox('New file', 'Enter a filename:'); 
            if (input) fs.writeFile('usr/' + currentUser + '/desktop/' + input, '', true)
        }]
    ], e.clientX, e.clientY)
}
shell.appendChild(icons)
async function reloadIcons(){ 
    fileList.showContents("usr/" + currentUser + "/desktop")
}
let iconReloadLoop = 0;
function initShellIcons(){
    reloadIcons()
    iconReloadLoop = setInterval(reloadIcons, 1000)
}
function stopShellIcons(){
    clearInterval(iconReloadLoop)
}
JSON.parse(localStorage.appList).forEach((e) => {
    addStartMenuEntryProgramLeft(new Icon(appListLocale[e], "./iframes/" + e + "/icon.png", "parent.loadApp('" + e + "')"))
})
explorerbottomrightinfo.innerHTML = "Version " + localStorage.ver
addStartMenuEntryLeft("Version 0.0.1", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
addStartMenuEntryLeft("Version 0.0.2", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
addStartMenuEntryLeft("Version 0.0.3", "./res/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
addStartMenuEntryLeft("Version 0.1.0", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
addStartMenuEntryLeft("Version 0.1.1", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
addStartMenuEntryLeft("Welcome window", './res/icon.jpg', "msgbox('Welcome', 'Welcome to Windows Beta!')")