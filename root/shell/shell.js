class Icon {
    constructor(title, image, action) {
        this.action = action;
        this.image = image;
        this.title = title;
    }
}
function transferFile(file){
    const reader = new FileReader()
    reader.onload = () => fs.writeFile("usr/SYSTEM/desktop/" + file.name, new Blob([reader.result]))
    reader.readAsArrayBuffer(file)
}
function dropHandler(e){
    e.preventDefault()
    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item) => {
            if (item.kind !== "file") return
            const file = item.getAsFile();
            transferFile(file)
        });
    } else {
      [...e.dataTransfer.files].forEach((file) => {
        transferFile(file)
      });
    }
}
shell.innerHTML = `
<div class="icons" id="icons" 
    oncontextmenu="contextMenu(event, [
        ['', 'Refresh', () => reloadIcons()], 
        ['', 'Personalize', () => loadApp('control', '', 'personalize')], 
        ['', 'New text document', () => fs.writeFile('usr/SYSTEM/desktop/New Text Document.txt', '', true)]
    ], event.clientX, event.clientY)" 
    ondrop="dropHandler(event);" ondragover="event.preventDefault()"></div>
<bottomright>Winda7<br><div id="explorerbottomrightinfo">Build VERSION</div></bottomright>
<div class="taskbar"
    oncontextmenu="contextMenu(event, [
        ['', 'Taskbar properties', () => loadApp('control', '', 'main')], 
        ['', 'Task manager', () => loadApp('taskmgr')]
    ], event.clientX, event.clientY)">
    <div class="wrapper" onmousedown="startMenu(true)" ontouchstart="startMenu(true)">
        <img class="taskbar-btn" src="./res/taskbar-btn.png"></img>
        <div class="taskbar-btn-orb"></div>
    </div>
    <div class="left-bar" id="leftBar"></div>
    <div class="right-bar">
        <div id="trayicons">
            <div class="trayicon n2">
                <div style="width: 24px; margin-bottom: -40px; height: 40px;" onclick="showTray(getTray(2))"></div>
                <iframe src="./bin/update/tray.html" windowid="2" name="Winda Update" frameborder="0" style="width: 24px"></iframe>
            </div>
            <div class="trayicon n1">
                <div style="width: 79px; margin-bottom: -40px; height: 40px;" onclick="showTray(getTray(1))"></div>
                <iframe src="./bin/clock/tray.html" class="monochrome" windowid="1" name="Clock" frameborder="0" style="width: 79px"></iframe>
            </div>
        </div>
        <div class="show-desktop" onclick="minimiseAll()"></div>
    </div>
</div>
<div class="start-menu winapi_transparent">
    <div class="left-start">
        <div class="left-start-main">
            <div class="allprogramsbutton" onclick="showAllPrograms()">All programs</div>
        </div>
        <div class="allprograms">
            <div class="scrollable"></div>
            <div class="allprogramsbutton" onclick="hideAllPrograms()">Back</div>
        </div>
    </div>
    <div class="right-start">
        <div class="rstop">
            <div class="start-option-right">SYSTEM</div>
            <div class="start-option-right" onclick="loadApp('control');startMenu(false, document.querySelector('.taskbar').querySelector('.wrapper'))">Control Panel</div>
        </div>
        <div class="select">
            <select name="startMenuSessionActionSelect" onchange="if(this.value == 'shutdown') shutdown(); if(this.value == 'logoff') logoff(); this.value = 'none'">
                <option value="none" disabled selected hidden>Shutdown</option>
                <option value="shutdown">Shutdown</option>
                <option value="logoff">Log off</option>
            </select>
            <selecticon></selecticon>
        </div>
    </div>
</div>`
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
function createIcon(icon, iconloc){
    let a = document.createElement("div")
    a.className = "icon"
    a.innerHTML = `<img src="${icon.image}" onerror="this.style.opacity = '0'">${icon.title}`
    a.setAttribute("ondblclick", icon.action)
    a.oncontextmenu = (e) => {
        e.stopPropagation(); 
        contextMenu(e, [
            ['', 'Delete', () => fs.deleteFile(iconloc)]
        ], e.clientX, e.clientY)
    }
    icons.appendChild(a)
}
function startMenu(open){
    contextMenuOff();
    let elem = document.querySelector(".wrapper")
    const SMAction1 = "startMenu(false, this)"
    const SMAction2 = "startMenu(true, this)"
    if(open){
        document.querySelector(".start-menu").style.display = "flex";
        elem.setAttribute("ontouchstart", SMAction1);
        elem.setAttribute("onmousedown", SMAction1);
        elem.children[0].className += " focus"
    }
    else{
        document.querySelector(".start-menu").style.display = "none";
        elem.setAttribute("ontouchstart", SMAction2);
        elem.setAttribute("onmousedown", SMAction2);
        elem.children[0].className = elem.children[0].className.replace(" focus", "")
    }
}
function addStartMenuEntryLeft(name, icon, action){
    const e = document.querySelector(".left-start-main")
    e.innerHTML = `<div class="start-option blue" onclick="${action}"><img src="${icon}"></img>${name}</div>` + e.innerHTML
}
function addStartMenuEntryProgramLeft(icon){
    const e = document.querySelector(".allprograms").children[0]
    e.innerHTML = `<div class="start-option blue" onclick="${icon.action}"><img src="${icon.image}"></img>${icon.title}</div>` + e.innerHTML
}
function addStartMenuEntryRight(name, action){
    document.querySelector(".rstop").innerHTML += `<div class="start-option-right" onclick="${action}">${name}</div>`
}
let fileList;
async function reloadIcons(){
    const newFileList = await fs.readdir("usr/SYSTEM/desktop/")
    if (fileList) if (newFileList.toString() == fileList.toString()) return
    fileList = newFileList
    icons.innerHTML = "";
    fileList.forEach(async (e) => {
        if (e == ".") return
        let app = ""
        let fileURL;
        const f = e.toLowerCase()
        if (f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".gif") || f.endsWith(".bmp") || f.endsWith(".webp")){
            app = "paint"
        }
        else if (f.endsWith(".html")){
            app = "iexplore"
            fileURL = "bin/explorer-file-manager/file.png"
        }
        else if (a.toLowerCase().endsWith(".flac") || a.toLowerCase().endsWith(".wav") || a.toLowerCase().endsWith(".mp3") || a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".avi") || a.toLowerCase().endsWith(".ogg") || a.toLowerCase().endsWith(".webm")){
            app = "wmplayer"
            fileURL = "bin/explorer-file-manager/media.png"
        }
        else {
            app = "notepad"
            fileURL = "bin/explorer-file-manager/file.png"
        }
        if (!fileURL) fileURL = URL.createObjectURL(await fs.readFile("usr/SYSTEM/desktop/" + e))
        createIcon(new Icon(e, fileURL, `parent.loadApp('${app}', undefined, 'usr/SYSTEM/desktop/${e}')`), `usr/SYSTEM/desktop/${e}`)
    })
}
addEventListener("fsloaded", () => {
    reloadIcons()
    setInterval(reloadIcons, 1000)
})
JSON.parse(localStorage.appList).forEach((e) => {
    addStartMenuEntryProgramLeft(new Icon(appListLocale[e], "./bin/" + e + "/icon.png", "parent.loadApp('" + e + "')"))
})
explorerbottomrightinfo.innerHTML = "Build " + localStorage.ver
addStartMenuEntryLeft("Version 0.0.1", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
addStartMenuEntryLeft("Version 0.0.2", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
addStartMenuEntryLeft("Version 0.0.3", "./res/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
addStartMenuEntryLeft("Version 0.1.0", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
addStartMenuEntryLeft("Version 0.1.1", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
addStartMenuEntryLeft("Welcome window", './res/icon.jpg', "msgbox('Welcome', 'Welcome to Windows Beta!')")