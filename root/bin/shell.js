/// <reference path="../sys/windowManager.js"/>
async function main(args){
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
    shell.innerHTML = `
        <div class="taskbar"
            onmousedown="winda.shell.dragTaskbar()"
            oncontextmenu="if (!event.target.classList.contains('startbutton')) contextMenu(event, [
                ['', 'Task manager', () => loadApp('taskmgr')],
                ['', 'Properties', () => loadApp('taskbarproperties')]
            ], event.clientX, event.clientY)">
            <div class="wrapper startbutton" onmousedown="if(event.which === 1) startMenu(true)" ontouchstart="startMenu(true)" ontouchend="event.preventDefault()"
                oncontextmenu="contextMenu(event, [
                    ['', 'Properties', () => loadApp('taskbarproperties')],
                    ['', 'Open file explorer', () => loadApp('explorer-file-manager')]
                ], event.clientX, event.clientY)"></div>
            <div class="left-bar" id="leftBar"></div>
            <div class="right-bar">
                <div id="trayicons">
                    <div class="trayicon n2">
                        <div style="width: 24px;" onclick="showTray(getTray(2))">
                            <div class="icn-wrp"></div>
                        </div>
                    </div>
                    <div class="trayicon n1">
                        <div style="width: 75px;" onclick="showTray(getTray(1))">
                            <div class="w-cl-time">
                                <div class="ttime"></div>
                                <div class="tweekday"></div>
                                <div class="tdate"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="show-desktop" onclick="minimiseAll()"></div>
            </div>
        </div>
        <div class="start-menu aero">
            <div class="left-start">
                <div class="left-start-main">
                    <div class="allprogramsbutton" onclick="winda.shell.showAllPrograms()">All programs</div>
                </div>
                <div class="allprograms">
                    <div class="scrollable"></div>
                    <div class="allprogramsbutton" onclick="winda.shell.hideAllPrograms()">Back</div>
                </div>
            </div>
            <div class="right-start">
                <div class="rstop">
                    <div class="start-option-right">SYSTEM</div>
                    <div class="start-option-right" onclick="loadApp('control');startMenu(false, document.querySelector('.taskbar').querySelector('.wrapper'))">Control Panel</div>
                </div>
                <div class="start-menu-action">
                    <button class="action" onclick="shutdown()">Shutdown</button>
                    <button class="dropdown" onclick="event.stopPropagation();"onmousedown="event.stopPropagation();const coords = this.getBoundingClientRect();contextMenu(event, [
                        ['', 'Log off', () => logoff()]
                    ], coords.x + coords.width, coords.y, undefined, true)"><div></div></button>
                </div>
            </div>
        </div>`
    // winda.shell.addStartMenuEntryLeft = (name, icon, action) => {
    //     const e = document.querySelector(".left-start-main")
    //     e.innerHTML = `<div class="start-option blue" onclick="${action}"><img src="${icon}"></img>${name}</div>` + e.innerHTML
    // }
    // winda.shell.addStartMenuEntryProgramLeft = (icon) => {
    //     const e = document.querySelector(".allprograms").children[0]
    //     e.innerHTML = `<div class="start-option blue" onclick="${icon.action}"><img src="${icon.image}"></img>${icon.title}</div>` + e.innerHTML
    // }
    // winda.shell.addStartMenuEntryRight = (name, action) => {
    //     document.querySelector(".rstop").innerHTML += `<div class="start-option-right" onclick="${action}">${name}</div>`
    // }
    // winda.shell.padTo2Digits = (num) => {
    //     return num.toString().padStart(2, '0');
    // }
    // winda.shell.formatDate = (date) => {
    //     return [winda.shell.padTo2Digits(date.getDate()), winda.shell.padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('.');
    // }
    // winda.shell.formatTimeNoS = (date) => {
    //     return [date.getHours(), winda.shell.padTo2Digits(date.getMinutes())].join(':');
    // }
    // winda.shell.formatWeekday = (date) =>{
    //     return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]
    // }
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
    // setInterval(winda.shell.changeTime, 100)
    const shellContainer = document.createElement("div")
    let fileView = new ui.FileView()
    await fileView.showContents("/usr/" + currentUser + "/desktop")
    fileView.elem.className = "icons winda-shell"
    fileView.elem.style.height = "100%"
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
        //ignoreWorkingArea: true
    })
    iconsWnd.show()
    const taskbar = document.createElement("div")
    taskbar.className = "taskbar"
    taskbar.onmousedown = () => winda.shell.dragTaskbar()
    taskbar.oncontextmenu = (event) => {
        if (!event.target.classList.contains('startbutton')) {
            contextMenu(event, [
                ['', 'Task manager', () => loadApp('taskmgr')],
                ['', 'Properties', () => loadApp('taskbarproperties')]
            ], event.clientX, event.clientY)
        }
    }
    taskbar.innerHTML = `
<div class="wrapper startbutton" onmousedown="if(event.which === 1) startMenu(true)" ontouchstart="startMenu(true)" ontouchend="event.preventDefault()"
    oncontextmenu="contextMenu(event, [
        ['', 'Properties', () => loadApp('taskbarproperties')],
        ['', 'Open file explorer', () => loadApp('explorer-file-manager')]
    ], event.clientX, event.clientY)"></div>
<div class="left-bar"></div>
<div class="right-bar">
    <div id="trayicons">
        <div class="trayicon n2">
            <div style="width: 24px;" onclick="showTray(getTray(2))">
                <div class="icn-wrp"></div>
            </div>
        </div>
        <div class="trayicon n1">
            <div style="width: 75px;" onclick="showTray(getTray(1))">
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
    const leftBar = taskbar.querySelector(".left-bar")
    function removeItem(item){
        leftBar.querySelector(".n" + item.id).remove()
    }
    function addItem(item){
        leftBar.innerHTML += `
        <div class="n${item.id} window-tray" onclick="windowSelectHandler(getWnd(${item.id}))" onmousemove="hovereffect(event,this)">
            <img src="${item.icon}" onerror="this.src = './iframes/ExampleApp/icon.png'">
            <p>${item.title}</p>
        </div>`
        const leftBarElem = leftBar.querySelector(`.n${item.id}`)
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
        console.log(a)
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
    taskbar.querySelector(".startbutton").onclick = () => {
        const layout = document.createElement("div")
        JSON.parse(localStorage.appList).forEach((e) => {
            const el = document.createElement("div")
            el.innerText = e
            el.onclick = () => loadApp(e)
            layout.append(el)
            //addStartMenuEntryProgramLeft(new Icon(appListLocale[e], "./iframes/" + e + "/icon.png", "parent.loadApp('" + e + "')"))
        })
        const wnd = new Winda7Window({
            title: "Choose an app", 
            icon: "icon.png", 
            id: getId(), 
            layout: {
                titlebar: {
                    buttons: {
                        close: true
                    }
                },
                cont: layout
            },
            aero: true
        })
        wnd.show()
    }
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
        ignoreWorkingArea: true
    }, 0, 40)
    taskbarWnd.show()
}