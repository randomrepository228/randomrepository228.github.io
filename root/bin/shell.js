/// <reference path="../sys/windowManager.js"/>
async function main(args){
    for (let a of wm.windows) {
        if (a.title === "Winda Shell Taskbar") {
            a.focus()
            return
        }
    }
    let shell = document.createElement("div")
    shell.className = "explorer taskbar-bottom"
    shell.id = "shell"
    winda.shell = {
        changeTaskbarDir: (dir) => {
            if (!dir) return
            shell.className = shell.className.replace("taskbar-bottom", "taskbar-" + dir)
            shell.className = shell.className.replace("taskbar-up", "taskbar-" + dir)
            shell.className = shell.className.replace("taskbar-left", "taskbar-" + dir)
            shell.className = shell.className.replace("taskbar-right", "taskbar-" + dir)
            windows.className = windows.className.replace("taskbar-bottom", "taskbar-" + dir)
            windows.className = windows.className.replace("taskbar-up", "taskbar-" + dir)
            windows.className = windows.className.replace("taskbar-left", "taskbar-" + dir)
            windows.className = windows.className.replace("taskbar-right", "taskbar-" + dir)
            localStorage.taskbarDir = dir
            dispatchEvent(new CustomEvent("changetaskbardir", {detail: dir}))
        },
        dragTaskbar: () => {
            function mouseMoveEvent(e){
                if (e.clientY <= 50){
                    winda.shell.changeTaskbarDir("up")
                }
                else if (e.clientY >= innerHeight - 50){
                    winda.shell.changeTaskbarDir("bottom")
                }
                else if (e.clientX <= 50) {
                    winda.shell.changeTaskbarDir("left")
                }
                else if (e.clientX >= innerWidth - 50){
                    winda.shell.changeTaskbarDir("right")
                }
            }
            addEventListener("mousemove", mouseMoveEvent)
            addEventListener("touchmove", mouseMoveEvent)
            addEventListener("mouseup", (e) => removeEventListener("mousemove", mouseMoveEvent), {once: true})
            addEventListener("touchend", (e) => removeEventListener("touchmove", mouseMoveEvent), {once: true})
        }
    }
    winda.shell.changeTaskbarDir(localStorage.taskbarDir)
    window.trays = document.createElement("div")
    trays.id = "trays"
    trays.innerHTML = `
    <div class="dock-br aero shadow n2 tray" windowid="2" name="Sound" style="display: none; width: fit-content; height: fit-content; right: 55px">
        <div class="content">
            <div class="w-snd">
                <div class="audiodevice"></div>
                <div class="volume"></div>
                <input type="range" onchange="localStorage.volume = this.value;playSound('media/Windows Ding.flac')" class="range" min="0" max="100" step="1" value="2" />
            </div>
        </div>
    </div>
    <div class="dock-br aero shadow n1 tray" windowid="1" name="Clock" style="display: none; width: 322px; height: 280px;">
        <div class="content">
            <div class="winda-c-tc">
                <div class="dt"></div>
                <div class="bottom-time">
                    <div class="month-calendar">
                        <ul class="month">
                            <li class="prev"><div></div></li>
                            <div>
                                <span class="month-name"></span>
                                <span class="year-name"></span>
                            </div>
                            <li class="next"><div></div></li>
                        </ul>
                        <ul class="weekdays">
                            <li>Mo</li>
                            <li>Tu</li>
                            <li>We</li>
                            <li>Th</li>
                            <li>Fr</li>
                            <li>Sa</li>
                            <li>Su</li>
                        </ul>
                        <ul class="days"></ul>
                    </div>
                    <div>
                        <div class="clockcontainer">
                            <img src="shell/shellres.png" style="object-position: -134px 0;">
                            <time class="clock">
                                <span class="h"></span>
                                <span class="m"></span>
                                <span class="s"></span>
                            </time>
                        </div>
                        <div class="et"></div>
                        <div class="wd"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    // document.body.appendChild(trays)
    // winda.shell.changeTime = () => {
    //     const time = new Date()
    //     const tTime = winda.shell.formatTimeNoS(time)
    //     const tWeekday = winda.shell.formatWeekday(time)
    //     const tDate = winda.shell.formatDate(time)
    //     let timeElem = shell.querySelector(".w-cl-time")
    //     if (timeElem.querySelector(".ttime").innerText != tTime)
    //         timeElem.querySelector(".ttime").innerText = tTime
    //     if (timeElem.querySelector(".tweekday").innerText != tWeekday)
    //         timeElem.querySelector(".tweekday").innerText = tWeekday
    //     if (timeElem.querySelector(".tdate").innerText != tDate)
    //         timeElem.querySelector(".tdate").innerText = tDate
    // }
    // winda.shell.changeTime()
    setInterval(winda.shell.changeTime, 100)
    const shellContainer = document.createElement("div")
    let fileView = new ui.FileView()
    await fileView.showContents("/usr/" + currentUser + "/desktop")
    fileView.elem.className = "icons winda-shell"
    fileView.elem.style.height = "100%"
    fileView.elem.oncontextmenu = (e) => {
        if (e.target !== fileView.elem) return
        contextMenu(e, [
            ['', 'Refresh', () => reloadIcons()], 
            ['', 'Personalize', () => loadApp('control', '', 'personalize')], 
            ['', 'New text document', async() => {
                const input = await inputbox('New file', 'Enter a filename:'); 
                if (input) fs.writeFile('usr/' + currentUser + '/desktop/' + input, '', true)
            }]
        ], e.clientX, e.clientY)
    }
    shellContainer.append(fileView.elem)
    shellContainer.innerHTML += '<link rel="stylesheet" href="./shell/shell.css">'
    shellContainer.innerHTML += `<bottomright>Winda7<br>Version ${localStorage.ver}</bottomright>`
    const iconsWnd = new Winda7Window({
        inset: "0", 
        title: "Winda Shell Icons", 
        icon: "icon.png", 
        id: getId(), 
        layout: shellContainer,
        alwaysbehind: true,
        noResize: true,
        noMinimise: true,
    })
    iconsWnd.show()
    const taskbar = document.createElement("div")
    taskbar.className = "taskbar"
    // taskbar.onmousedown = () => winda.shell.dragTaskbar()
    taskbar.oncontextmenu = (event) => {
        if (!event.target.classList.contains('startbutton')) {
            contextMenu(event, [
                ['', 'Task manager', () => loadApp('taskmgr')],
                ['', 'Properties', () => loadApp('taskbarproperties')]
            ], event.clientX, event.clientY)
        }
    }
    taskbar.innerHTML = `
<div class="wrapper startbutton" ontouchend="event.preventDefault()"
    oncontextmenu="contextMenu(event, [
        ['', 'Properties', () => loadApp('taskbarproperties')],
        ['', 'Open file explorer', () => loadApp('explorer-file-manager')]
    ], event.clientX, event.clientY)"></div>
<div class="left-bar"></div>
<div class="right-bar">
    <div id="trayicons">
        <div class="trayicon n2">
            <div style="width: 24px;" onclick="// showTray(getTray(2))">
                <div class="icn-wrp"></div>
            </div>
        </div>
        <div class="trayicon n1">
            <div style="width: 75px;" onclick="// showTray(getTray(1))">
                <div class="w-cl-time">
                    <div class="ttime"></div>
                    <div class="tweekday"></div>
                    <div class="tdate"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="show-desktop" onclick="minimiseAll()"></div>
</div>`
    winda.shell.hovereffect = (e, elem) => {
        const pos = elem.getBoundingClientRect()
        elem.style.setProperty('--tray-hover-left', (e.clientX - pos.x) + "px")
        elem.style.setProperty('--tray-hover-top', (e.clientY - pos.y) + "px")
    }
    const leftBar = taskbar.querySelector(".left-bar")
    function removeItem(item){
        leftBar.querySelector(".n" + item.id).remove()
    }
    function addItem(item){
        const leftBarElem = document.createElement("div")
        leftBarElem.className = `window-tray n${item.id}`
        leftBarElem.onclick = () => findWindowBy("id", item.id).focus();
        leftBarElem.onmousemove = (event) => winda.shell.hovereffect(event,leftBarElem)
        leftBarElem.innerHTML += `<img src="${item.icon}" onerror="this.src = './iframes/ExampleApp/icon.png'"><p>${item.title}</p>`
        leftBarElem.id = item.id
        leftBar.appendChild(leftBarElem)
        const imgEl = leftBarElem.querySelector("img")
        let blockSize = 1,
        defaultRGB = {r:0,g:0,b:0},
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        if (!context) {
            return defaultRGB;
        }
        imgEl.onload = () => {
        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
        context.drawImage(imgEl, 0, 0);
        try {
            data = context.getImageData(0, 0, width, height);
        } catch(e) {
            return defaultRGB;
        }
        length = data.data.length;
        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);
        canvas.remove()
        let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
        rabs = rgb.r / 255;
        gabs = rgb.g / 255;
        babs = rgb.b / 255;
        v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
        diffc = c => (v - c) / 6 / diff + 1 / 2;
        percentRoundFn = num => Math.round(num * 100) / 100;
        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(rabs);
            gg = diffc(gabs);
            bb = diffc(babs);

            if (rabs === v) {
                h = bb - gg;
            } else if (gabs === v) {
                h = (1 / 3) + rr - bb;
            } else if (babs === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        leftBarElem.style.setProperty("--hue", Math.round(h * 360))
        }
        if(localStorage.theme == "aero"){
            leftBarElem.animate(
                [{opacity: 0}, {opacity: 1}],
                {
                    duration: 300,
                    iterations: 1,
                    easing: "ease-in-out"
                }
            )
        }
    }
    for (let a of wm.windows) {
        if (a.title.startsWith("Winda Shell")) continue
        addItem(a)
    }
    addEventListener("windowchange", (e) => {
        if (e.window.title.startsWith("Winda Shell")) return
        if (e.remove){
            removeItem(e.window)
        }
        else{
            addItem(e.window)
        }
    })
    const taskbarWnd = new Winda7Window({
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        title: "Winda Shell Taskbar", 
        icon: "icon.png", 
        id: getId(), 
        layout: taskbar,
        alwaysontop: true,
        noResize: true,
        ignoreWorkingArea: true,
        noMinimise: true,
    }, 0, 40)
    taskbarWnd.show()
    function showAllPrograms(){
        const leftStart = startMenuEl.querySelector(".left-start")
        leftStart.style.height = leftStart.getBoundingClientRect().height + "px"
        leftStart.querySelector(".left-start-main").style.display = "none"
        leftStart.querySelector(".allprograms").style.display = "block"
    }
    function hideAllPrograms(){
        const leftStart = startMenuEl.querySelector(".left-start")
        leftStart.style.height = "unset"
        leftStart.querySelector(".left-start-main").style.display = "block"
        leftStart.querySelector(".allprograms").style.display = "none"
    }
    function addStartMenuEntryLeft(name, icon, action){
        const e = startMenuEl.querySelector(".left-start-main")
        const el = document.createElement("div")
        el.className = "start-option blue"
        function a(){
            eval(action)
            winda.shell.startMenu(false)
        }
        el.onclick = a
        el.innerHTML = `<img src="${icon}"></img>${name}`
        e.prepend(el)
    }
    function addStartMenuEntryProgramLeft(icon){
        const e = startMenuEl.querySelector(".allprograms").children[0]
        const el = document.createElement("div")
        el.className = "start-option blue"
        function a(){
            eval(icon.action)
            winda.shell.startMenu(false)
        }
        el.onclick = a
        el.innerHTML = `<img src="${icon.image}"></img>${icon.title}`
        e.prepend(el)
    }
    function addStartMenuEntryRight(name, action){
        startMenuEl.querySelector(".rstop").innerHTML += `<div class="start-option-right" onclick="${action}">${name}</div>`
    }
    let isStartMenuOpen = false
    const startMenuEl = document.createElement("div")
    startMenuEl.className = "start-menu aero"
    startMenuEl.innerHTML = `
        <div class="left-start">
            <div class="left-start-main">
                <div class="allprogramsbutton">All programs</div>
            </div>
            <div class="allprograms">
                <div class="scrollable"></div>
                <div class="allprogramsbutton">Back</div>
            </div>
        </div>
        <div class="right-start">
            <div class="rstop">
                <div class="start-option-right">SYSTEM</div>
                <div class="start-option-right">Control Panel</div>
            </div>
            <div class="start-menu-action">
                <button class="action">Shutdown</button>
                <button class="dropdown"><div></div></button>
            </div>
        </div>`
    const allProgramsButton = startMenuEl.querySelector(".left-start-main").querySelector(".allprogramsbutton")
    allProgramsButton.onclick = () => showAllPrograms()
    startMenuEl.querySelectorAll(".allprogramsbutton")[1].onclick = () => hideAllPrograms()
    startMenuEl.querySelector(".action").onclick = () => shutdown()
    const e = startMenuEl.querySelector(".dropdown")
    e.addEventListener("onclick", (event) => event.stopPropagation())
    e.addEventListener("onmousedown", (event) => {
        event.stopPropagation();
        const coords = this.getBoundingClientRect();contextMenu(event, [
            ['', 'Log off', () => logoff()]
        ], coords.x + coords.width, coords.y, undefined, true)
    })
    const startWnd = new Winda7Window({
        bottom: 0,
        left: 0,
        title: "Winda Shell Start Menu", 
        icon: "icon.png", 
        id: getId(), 
        layout: startMenuEl,
        alwaysontop: true,
        noResize: true
    })
    const startButton = taskbar.querySelector(".wrapper")
    winda.shell.startMenu = function(open){
        if (open) contextMenuOff();
        let elem = taskbar.querySelector(".wrapper")
        const SMAction1 = "winda.shell.startMenu(false)"
        const SMAction2 = "if(event.which === 1) winda.shell.startMenu(true)"
        if(open){
            startWnd.show()
            elem.setAttribute("onmousedown", SMAction1);
            elem.setAttribute("ontouchstart", SMAction1);
            elem.className += " focus"
        }
        else{
            startWnd.hide()
            elem.setAttribute("onmousedown", SMAction2);
            elem.setAttribute("ontouchstart", "winda.shell.startMenu(true)");
            elem.className = elem.className.replace(" focus", "")
        }
        isStartMenuOpen = open
    }
    startMenuEl.querySelectorAll(".start-option-right")[1].onclick = () => {
        loadApp('control');
        winda.shell.startMenu(false)
    }
    startButton.onmousedown = (e) => {
        if(e.which === 1) winda.shell.startMenu(true)
    }
    startButton.addEventListener("ontouchstart", () => winda.shell.startMenu(true))
    function startMenuToggle(){
        if (startWnd.shown) startWnd.hide()
        else startWnd.show()
    }
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
    addEventListener("windowfocus", (e) => {
        if (e.window.title !== "Winda Shell Start Menu" && e.window.title !== "Winda Shell Taskbar"){
            if (isStartMenuOpen) winda.shell.startMenu(false)
        }
    })
    localStorage.appList = JSON.stringify(["calc", "changelog", "control", "ExampleApp", "Okna8Mode", "regedit", "run", "sfc", "taskmgr", "dvd", "bsod", "iexplore", "winver", "notepad", "wmplayer", "paint", "explorer-file-manager"])
    const appListLocale = {"calc": "Calculator", "wmplayer": "Winda Media player", "changelog": "Changelog", "control": "Control Panel", "ExampleApp": "Example app", "Okna8Mode": "Okna 8 Mode", "regedit": "Registry Editor", "run": "Run", "sfc": "System file checker", "taskmgr": "Task manager", "dvd": "DVD Logo", "bsod": "Blue screen of death", "iexplore": "Internet Explorer", "winver": "winver", "paint": "Paint", "explorer-file-manager": "Winda Explorer", "notepad": "Notepad"}
    JSON.parse(localStorage.appList).forEach((e) => {
        addStartMenuEntryProgramLeft({title: appListLocale[e], image: "./iframes/" + e + "/icon.png", action: "parent.loadApp('" + e + "')"})
    })
    addStartMenuEntryLeft("Version 0.0.1", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.1/simulator.html'")
    addStartMenuEntryLeft("Version 0.0.2", "./res/icon.jpg", "window.location.href = '../Winda.old/0.0.2/simulator.html'")
    addStartMenuEntryLeft("Version 0.0.3", "./res/icon.jpg", "window.location.href = '../Winda.old/0.1.0/simulator.html'")
    addStartMenuEntryLeft("Version 0.1.0", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.0/simulator.html'")
    addStartMenuEntryLeft("Version 0.1.1", "./res/icon.jpg", "window.location.href = '../Winda.old/b0.9.2/simulator.html'")
    addStartMenuEntryLeft("Welcome window", './res/icon.jpg', "msgbox('Welcome', 'Welcome to Windows Beta!')")
}