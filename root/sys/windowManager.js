function AddWindow(window, ispopup, options, id){
    newWindow = document.createElement("div")
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    if (typeof options.top == "number") options.top += "px"
    if (typeof options.left == "number") options.left += "px"
    if (typeof options.right == "number") options.right += "px"
    if (typeof options.bottom == "number") options.bottom += "px"
    if (options.okna8) window.icon = "./bin/Okna8Mode/apps/metro/" + options.title + "/AppLogo.png"
    if (options.NoGUI) newWindow.className += " nogui"
    if (localStorage.maximiseWindows == "true" && !options.noResize) newWindow.className += " maximised"
    newWindow.setAttribute("windowid", id)
    if (options.noTray) newWindow.setAttribute("notray", "true")
    if (options.left) newWindow.style.left = options.left
    if (options.top) newWindow.style.top = options.top
    if (ispopup){
        newWindow.style.left = (innerWidth / 2 ) - (options.width) / 2 + "px"
        newWindow.style.top = (innerHeight / 2 ) - (options.height) / 2 + "px"
    }
    else{
        const openedwindows = getAllWindows().length
        if (!(options.right || options.left))
            newWindow.style.left = (openedwindows * 25 + 50) % (innerWidth - options.width) + "px"
        if (!(options.bottom || options.top))
            newWindow.style.top = (openedwindows * 25 + 50) % (innerHeight - options.height) + "px"
    }
    if (options.bottom)
        newWindow.style.bottom = options.bottom
    if (options.right)
        newWindow.style.right = options.right
    newWindow.style.display = "none"
    if(options.alwaysontop) newWindow.className += " alwaysontop"
    if(options.alwaysbehind) newWindow.className += " alwaysbehind"
    if(options.classes) newWindow.className += options.classes
    newWindow.innerHTML =
    `
    <div ${options.fullscreen ? 'style="display: none;"' : ''}class="topbar" ${options.noResize ? '' : 'ondblclick="maximise(this.parentElement)"'} onmousedown="windowMouseDown(event, this, 'drag', ${options.noResize})" ontouchstart="windowMouseDown(event, this, 'drag', ${options.noResize})">
        <left>
            <img src="${window.icon}" onerror="this.remove()" ${options.noGUI ? 'style="display: none;"' : ''}>
            <p ${options.noGUI ? 'style="display: none;"' : ''}>${window.title}</p>
        </left>
        <div class="buttons">
            ${options.xOnly ? `` : `<div class="dash" ${options.noTray ? 'disabled' : 'onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"'}><img src="./res/aero/buttons/min/icon.png"></div>
            <div class="square" ${options.noResize ? 'disabled' : 'onclick="maximise(this.parentElement.parentElement.parentElement)"'}><img src="./res/aero/buttons/max/icon.png"></div>`}
            <div class="x" onclick="closeWindow(${id})"><img src="./res/aero/buttons/close/icon.png"></div>
        </div>
    </div>
    ${options.noResize ? `` : `<div onmousedown="windowResize(event, this, 'left', 'top')" class="topleft"></div>
    <div ontouchdown="windowResize(event, this, 'right', 'top')" onmousedown="windowResize(event, this, 'right', 'top')" class="topright"></div>
    <div ontouchdown="windowResize(event, this, 'left', 'bottom')" onmousedown="windowResize(event, this, 'left', 'bottom')" class="bottomleft"></div>
    <div ontouchdown="windowResize(event, this, 'right', 'bottom')" onmousedown="windowResize(event, this, 'right', 'bottom')" class="bottomright"></div>
    <div ontouchdown="windowResize(event, this, 'top')" onmousedown="windowResize(event, this, 'top')" class="top"></div>
    <div ontouchdown="windowResize(event, this, 'left')" onmousedown="windowResize(event, this, 'left')" class="left"></div>
    <div ontouchdown="windowResize(event, this, 'right')" onmousedown="windowResize(event, this, 'right')" class="right"></div>
    <div ontouchdown="windowResize(event, this, 'bottom')" onmousedown="windowResize(event, this, 'bottom')" class="bottom"></div>`}
    <div class="content${options.noGUI ? 'nostyle' : ''}" style="${options.minWidth ? `min-width: ` + options.minWidth + `px;` : ``} ${options.minHeight ? `min-height: ` + options.minHeight + `px` : ``}">
        <ignore></ignore>
        <text style="width: ${options.width}px; height: ${options.height}px;">
            ${window.innerhtml}
            ${ispopup ? `<footer><button onclick="closeWindow(${id})">OK</button></div>` : ''}
        </text>
    </div>
    `
    windows.append(newWindow)
    if(ispopup || options.noSelfOpen || options.okna8){
        showWindow(options.okna8 ? "../" + window.icon : window.icon, id)
    }
    broadcast("newprocess|" + id)
}
function broadcast(message){
    for (a of windows.children){
        try{
            a.lastElementChild.children[1].children[0].contentWindow.postMessage(message)
        }
        catch (e) {}
    }
}
function sendMsg(windowid, message){
    for (a of windows.children){
        if (a.getAttribute("windowid") != windowid)
        try{
            a.lastElementChild.children[1].children[0].contentWindow.postMessage(message)
        }
        catch (e) {}
    }
}
function sendInfo(element){
    const windowid = element.parentElement.parentElement.parentElement.getAttribute("windowid")
    if (element.parentElement.parentElement.parentElement.className.includes("okna8")){
        element.contentWindow.postMessage("YourID-" + windowid, "*");
        return
    }
    element.contentWindow.postMessage("id|" + windowid, "*")
}
function getWnd(id){
    return document.querySelector(".window.n" + id)
}
function getTray(id){
    return document.querySelector(".tray.n" + id)
}
function idToWindow(id){
    return document.querySelectorAll(`.n${id}`)[1]
}
function msgbox(title, content){
    content = `<div style="padding: 20px; height: calc(100% - 80px); overflow-y: auto;">${content}</div>`
    AddWindow(new Window((window.innerWidth/2)-250, (window.innerHeight/2)-150, 500, 200, title, content, ""), true, {width: 500, height: 200, noSelfOpen: true}, getId())
    new Audio(sounds.msgbox).play()
}
function resizeHandler(e){
    broadcast("getscrwidth|" + innerWidth, "*")
    broadcast("getscrheight|" + innerHeight, "*")
}
function setActive(window, noTray){
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = window;
    activewindow.style.zIndex = 1;
    if (noTray) return
    try{
        for(element of leftBar.children)
            element.className = element.className.replace(" focus", "")
        let e = leftBar.querySelector(`.n${activewindow.getAttribute("windowid")}`)
        console.log(e.className)
        e.className = e.className + " focus"
    }
    catch(e){console.log(e)}
}
function setInactive(){
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = undefined;
    for(element of leftBar.children)
        element.className = element.className.replace(" focus", "")
}
function showWindow(icon, num, doNotShowTray){
    let wnd = getWnd(num)
    if (doNotShowTray) try{
        setActive(wnd)
        return;
    }
    catch(e){}
    try{
        leftBar.innerHTML += `
        <div class="n${num} window-tray" windowid="${num}" onclick="windowSelectHandler(document.querySelector('.n${num}.window'))">
            <img src="${icon}" onerror="this.src = './bin/ExampleApp/icon.png'">
            <p>${wnd.firstElementChild.firstElementChild.lastElementChild.innerHTML}</p>
        </div>`
        if(localStorage.theme == "aero"){
            leftBar.querySelector(`.n${num}`).animate(
                [{opacity: 0}, {opacity: 1}],
                {
                    duration: 300,
                    iterations: 1,
                    easing: "ease-in-out"
                }
            )
        }
    }
    catch(e){}
    setActive(wnd)
    for (windoww of document.querySelectorAll(`.n${num}.window`))
        windoww.style.display = ""
    startMenu(false)
}
onmessage = (e) => {
    const commands = e.data.split("|")
    if (commands.length > 1){
        let wnd;
        try{
            wnd = getWnd(commands[1])
        }
        catch(e){
            if (commands[0] == "ModalMetroDialog"){
                const randNum = Math.round(Math.random() * 99999)
                let id;
                for(let i = randNum;;i++){
                    let idCollision = false
                    for(const a of document.querySelectorAll("*[windowid]"))
                        if(a.getAttribute("windowid") == i.toString())
                            idCollision = true
                    if (!idCollision)
                        id = i
                        break
                }
                AddWindow(new Window(0, 0, 0, 0, `Message from Metro app`, "<div class=\"metro-dialog\">" + commands[1] + "</div>", '', true), undefined, {"window": true, "noSelfOpen": true, "title": "Message from Metro app", "left": (window.innerWidth / 2) - 300, "top": (window.innerHeight / 2) - 150, "width": 600, "height": 300}, false, id)
            }
            return
        }
        let frame;
        if (wnd){
            frame = wnd.lastElementChild.children[1].children[0].contentWindow
        }
        if (commands[0] == "close")
            closeWindow(commands[1])
        else if (commands[0] == "max")
            maximise(commands[1])
        else if (commands[0] == "min")
            minimizeWindow(commands[1])
        else if (commands[0] == "show")
            showWindow(commands[2], commands[1])
        else if (commands[0] == "setwidth" || commands[0] == "setheight" || commands[0] == "settop" || commands[0] == "setleft")
            wnd.style[commands[0].slice(3, commands[0].length)] = commands[2]
        else if (commands[0] == "setpos"){
            wnd.style.top = commands[2];
            wnd.style.left = commands[3]
        }
        else if (commands[0] == "settitle")
            wnd.firstElementChild.firstElementChild.lastElementChild.innerText = commands[2]
        else if (commands[0] == "width" || commands[0] == "height" || commands[0] == "top" || commands[0] == "left")
            frame.postMessage("get" + commands[0] + "|" + wnd.style[commands[0]], "*")
        else if (commands[0] == "title")
            frame.postMessage("get" + commands[0] + "|" + wnd.firstElementChild.firstElementChild.lastElementChild.innerText, "*")
        else if (commands[0] == "scrwidth")
            frame.postMessage("getscrwidth|" + innerWidth, "*")
        else if (commands[0] == "scrheight")
            frame.postMessage("getscrheight|" + innerHeight, "*")
        else if (commands[0] == "theme")
            changeTheme(commands[1])
        else if (commands[0] == "dontgroupicons"){
            console.log("e")
            localStorage.dontGroupIcons = commands[1]
            if (commands[1] != "true"){
                groupicons.href = ""
            }
            else{
                groupicons.href = './shell/dont_group_icons.css'
            }
        }
        else if (commands[0] == "usesmalltaskbar"){
            console.log("e")
            localStorage.useSmallTaskbar = commands[1]
            if (commands[1] == "true"){
                smalltaskbar.href = "./shell/small_taskbar_icons.css"
            }
            else{
                smalltaskbar.href = ''
            }
        }
    }
}
function getAllWindows(){
    let openedwindows = [];
    let userids = []
    for (a of document.querySelectorAll("*[windowid]")){
        if (a.className.includes("window ")){
            if (!userids.includes(a.getAttribute("windowid"))){
                openedwindows.push({id: a.getAttribute("windowid"), title: a.children[0].children[0].children[a.children[0].children[0].children.length-1].innerText})
                userids.push(a.getAttribute("windowid"))
            }
        }
        else if (!a.className.includes("window-tray")){
            if (!userids.includes(a.getAttribute("windowid"))){
                openedwindows.push({id: a.getAttribute("windowid"), title: a.getAttribute("name") + " (Tray element)"})
                userids.push(a.getAttribute("windowid"))
            }
        }
    }
    return openedwindows
}
function closeWindow(id){
    let window = getWnd(id)
    if (!window) window = getTray(id)
    function timeout(){
        for (a of document.querySelectorAll(".n" + id)) a.remove()
        broadcast("processdied|" + id)
    }
    if (!window.className.includes("window")){
        timeout()
        return
    }
    window.className += " closing"
    if (!window.getAttribute("notray")){
        try{
            leftBar.querySelector(`.n${id}.window-tray`).style.opacity = 0
            leftBar.querySelector(`.n${id}.window-tray`).animate(
                [{opacity: 1}, {opacity: 0}],
                {
                    duration: 300,
                    iterations: 1,
                    easing: "ease-in-out"
                }
            )
        }
        catch(e){}
    }
    setTimeout(timeout, 300);
}
function minimiseWindow(window){
    const animtime = {
        duration: 300,
        iterations: 1
    };
    if (window.className.includes("minimised")){
        setActive(window)
        if (localStorage.theme == "aero") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: leftBar.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${leftBar.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().y - 100}px`
            },
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }
        ], animtime)
    } else {
        setInactive()
        window.className += " minimised"
        if (localStorage.theme == "aero") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }, 
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: leftBar.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${leftBar.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().y - 100}px`
            }
        ], animtime)
    }
}
minimizeWindow = minimiseWindow
function restoreWindow(window){
    const animtime = {
        duration: 300,
        iterations: 1,
    };
    if (window.className.includes("minimised")){
        setActive(window)
        window.className = window.className.replace(" minimised", "")
        if (localStorage.theme == "aero") window.animate([
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(2deg)",
                opacity: 0,
                scale: 0.2,
                left: leftBar.querySelector("." + window.classList[0] + ".window-tray").getBoundingClientRect().x - (window.getBoundingClientRect().width / 2) + "px",
                top: `${innerHeight - (window.getBoundingClientRect().height / 2)}px`
            },
            {
                transform: "perspective(400px) rotateY(2deg) rotateX(0deg)", 
                opacity: 1,
                scale: 1
            }
        ], animtime)
    }
}
function windowSelectHandler(window){
    if(activewindow !== window){
        setActive(window, window.getAttribute("notray"))
        restoreWindow(window)
        return
    }
    minimizeWindow(window)
}
function minimiseAll(){
    setInactive()
    for (const id of getAllWindows()){
        if (id.id == 0) continue
        for (const wnd of document.querySelectorAll(".window.n" + id.id)){
            wnd.className += " minimised"
        }
    }
    setInactive()
}
// OKNA 8 COMPATIBILITY MODE
function closemetroapp(appName){
    getAllWindows().forEach(val => {
        if (val.title == appName || val.title == `Message from Metro app`)
            closeWindow(val.id)
    })
}
function CloseMetroDialog(a){}