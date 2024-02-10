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
}
function windowMouseDown(event, elem, a, noResize){
    if(event.target != elem) return;
    let touch = false;
    let evName;
    if(!elem.getAttribute("notray")) setActive(elem.parentElement);
    loop.drag = true;
    iframeignore.innerHTML = "ignore{display:block !important}"
    if (event.touches) {
        event = event.touches[0];
        touch = true;
    }
    prevx=event.clientX-elem.getBoundingClientRect().x + 8
    prevy=event.clientY-elem.getBoundingClientRect().y
    prevheight=activewindow.getBoundingClientRect().height
    prevwidth=activewindow.getBoundingClientRect().width - 7
    if (!touch) evName = "mouseup"
    else evName = "touchend"
    document.addEventListener(evName, e => {
        let minsnap = 10
        let minsnapx = 0
        loop.drag = false; 
        iframeignore.innerHTML = "none"
        if (e.clientX){
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else{
            clientX = +activewindow.style.left.substring(0, activewindow.style.left.length - 2);
            let wndwidth = activewindow.getBoundingClientRect().width
            if (clientX + wndwidth > innerWidth) clientX += wndwidth
            clientY = +activewindow.style.top.substring(0, activewindow.style.top.length - 2);
            minsnap = 1
            minsnapx = wndwidth / -4
        }
        if (!noResize){
            if (clientX < minsnap + minsnapx) {snapLeft(activewindow); return}
            if (clientX > innerWidth - minsnap - minsnapx) {snapRight(activewindow); return}
            if (clientY < minsnap) maximise(activewindow)
        }
    }, {once: true});
}
function windowResize(event, elem, ...actions){
    let touch = false;
    activewindow = elem.parentElement
    let activewindowcontent = elem.parentElement.querySelector("text")
    loop = {drag: false, top: false, left: false, right: false, bottom: false}
    for (a of actions) loop[a] = true
    iframeignore.innerHTML = "ignore{display:block !important}"
    if (event.touches) {
        event = event.touches[0];
        touch = true;
    }
    prevx=event.clientX-elem.getBoundingClientRect().x
    prevy=event.clientY-elem.getBoundingClientRect().y
    origx=event.clientX-elem.getBoundingClientRect().width - 6
    origy=event.clientY-elem.getBoundingClientRect().height - 1
    prevheight=activewindowcontent.getBoundingClientRect().height
    prevwidth=activewindowcontent.getBoundingClientRect().width
    if (activewindow.classList.contains("snap-left") || activewindow.classList.contains("snap-right")){
        activewindowcontent.style.height = prevheight + "px"
        activewindowcontent.style.width = prevwidth + "px"
        activewindow.style.top = activewindow.getBoundingClientRect().y + "px"
        activewindow.style.left = activewindow.getBoundingClientRect().x + "px"
        activewindow.className = activewindow.className.replace("snap-right ", "")
        activewindow.className = activewindow.className.replace("snap-left ", "")
    }
    if (!touch)
        document.addEventListener("mouseup", () => {resized = 0; for (a of actions) loop[a] = false; iframeignore.innerHTML = ""}, {once: true});
    else
        document.addEventListener("touchend", () => {resized = 0; for (a of actions) loop[a] = false; iframeignore.innerHTML = ""}, {once: true});
}
function move(e){
    if (!activewindow) return
    let activewindowcontent = activewindow.querySelector("text")
    if (e.touches) e = e.touches[0]
    if(loop.drag){
        activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
        if(activewindow.classList.contains("maximised") || activewindow.classList.contains("snap-right") || activewindow.classList.contains("snap-left")) {
            activewindow.className = activewindow.className.replace(" maximised", "");
            activewindow.className = activewindow.className.replace("snap-right ", "")
            activewindow.className = activewindow.className.replace("snap-left ", "")
            activewindow.style.top = "-10px";
            prevx = activewindow.getBoundingClientRect().width / 2;
            prevy += 10
            return
        }
        activewindow.style.left = `${Math.trunc(e.clientX - prevx)}px`
    }
    if(localStorage.theme == "aero"){
        if(loop.right){
            activewindowcontent.style.width = `${e.clientX - +activewindow.style.left.substring(0, activewindow.style.left.length - 2) - 7}px`
        }
        if(loop.bottom){
            activewindowcontent.style.height = `${e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 4 - 24}px`
        }
        if(loop.top){
            activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
            activewindowcontent.style.height = `${prevheight + origy - e.pageY - 20 + 20}px`
        }
        if(loop.left){
            activewindow.style.left = `${Math.trunc(e.clientX - prevx)}px`
            activewindowcontent.style.width = `${prevwidth + origx - e.pageX + 20}px`
        }
    }
    else if (localStorage.theme == "basic"){
        if(loop.right){
            activewindowcontent.style.width = `${e.clientX - +activewindow.style.left.substring(0, activewindow.style.left.length - 2) - 11}px`
        }
        if(loop.bottom){
            activewindowcontent.style.height = `${e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 4 - 24}px`
        }
        if(loop.top){
            activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
            activewindowcontent.style.height = `${prevheight + origy - e.pageY - 2 + 15}px`
        }
        if(loop.left){
            activewindow.style.left = `${Math.trunc(e.clientX - prevx)}px`
            activewindowcontent.style.width = `${prevwidth + origx - e.pageX - 4 + 20}px`
        }
    }
    else{
        if(loop.right){
            activewindowcontent.style.width = `${e.clientX - +activewindow.style.left.substring(0, activewindow.style.left.length - 2) - 3}px`
        }
        if(loop.bottom){
            activewindowcontent.style.height = `${e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 1 - 24}px`
        }
        if(loop.top){
            activewindow.style.top = `${e.clientY - prevy}px`
            activewindowcontent.style.height = `${prevheight + origy - e.pageY + 2 - 24 + 20}px`
        }
        if(loop.left){
            activewindow.style.left = `${e.clientX - prevx}px`
            activewindowcontent.style.width = `${prevwidth + origx - e.pageX + 7 + 20}px`
        }
    }
    if (loop.top || loop.left || loop.right || loop.bottom || loop.drag){
        activewindow.style.bottom = null;
        activewindow.style.right = null;
    }
}
function snapLeft(window){
    if (localStorage.aerosnap == "true") return
    window.className = window.className.replace("", "snap-left ")
}
function snapRight(window){
    if (localStorage.aerosnap == "true") return
    window.className = window.className.replace("", "snap-right ")
}
addEventListener("resize", resizeHandler)
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
            if (commands[1] == "true"){
                groupicons.href = ""
            }
            else{
                groupicons.href = './shell/group_icons.css'
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
function maximiseWindow(window){
    if (window.className.search("maximised") == -1){
        window.className += " maximised"
        window.className = window.className.replace("snap-right ", "")
        window.className = window.className.replace("snap-left ", "")
    }
    else
        window.className = window.className.replace(" maximised", "")
}
maximise = maximiseWindow
preload = ["res/dropdown.png", "res/hide_windows.png", "res/hide_windows_hover.png", "res/hide_windows_pressed.png", "res/icon.jpg", "res/login.jpg", 
"res/start_menu.png", "res/table-top.png", "res/taskbar-btn.png", "res/taskbar_btn.png", "res/taskbar_btn_focus.png", 
"res/aero/buttons/close/hover.png", "res/aero/buttons/close/normal.png", "res/aero/buttons/close/pressed.png", "res/aero/buttons/close/icon.png", 
"res/aero/buttons/close/glow.png", "res/aero/buttons/close/hover.png", "res/aero/buttons/min/normal.png", "res/aero/buttons/min/hover.png", 
"res/aero/buttons/min/pressed.png", "res/aero/buttons/min/icon.png", "res/aero/buttons/max/hover.png", "res/aero/buttons/max/normal.png", 
"res/aero/buttons/max/pressed.png", "res/aero/buttons/max/icon.png", "res/aero/buttons/glow.png", "res/aero/style.css", "res/aero/window_aura.png",
"res/aero/window_aura_mirror.png", "res/aero/window_side.png", "res/button/hover.png", "res/button/normal.png", "res/button/pressed.png", 
"res/button/disabled.png", "res/button/default.png", "res/checkbox/unchecked/hover.png", "res/checkbox/unchecked/normal.png", 
"res/checkbox/unchecked/pressed.png", "res/checkbox/checked/hover.png", "res/checkbox/checked/normal.png", "res/checkbox/checked/pressed.png", 
"res/aero/buttons/close/lonenormal.png", "res/aero/buttons/close/lonepressed.png", "res/aero/buttons/close/lonehover.png", 
"res/selectionBig/hover/left.png", "res/selectionBig/hover/center.png", "res/selectionBig/hover/right.png", "img/img0.jpg"]
// OKNA 8 COMPATIBILITY MODE
function closemetroapp(appName){
    getAllWindows().forEach(val => {
        if (val.title == appName || val.title == `Message from Metro app`)
            closeWindow(val.id)
    })
}
function CloseMetroDialog(a){}