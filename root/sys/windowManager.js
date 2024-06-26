function windowMouseDown(event, elem, a, noResize){}
function windowResize(event, elem, ...actions){}
function snapLeft(window){}
function snapRight(window){}
function maximiseWindow(window){}
maximise = maximiseWindow
function AddWindow(window, ispopup, options, id, elem, onclose){
    newWindow = document.createElement("div")
    newWindow.className = `n${id} window winapi_shadow winapi_transparent`
    if (typeof options.top == "number") options.top += "px"
    if (typeof options.left == "number") options.left += "px"
    if (typeof options.right == "number") options.right += "px"
    if (typeof options.bottom == "number") options.bottom += "px"
    if (options.okna8) window.icon = "./bin/Okna8Mode/apps/metro/" + options.title + "/AppLogo.png"
    if (options.NoGUI) newWindow.className += " nogui"
    if (!this.move) newWindow.className += " maximised"
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
    if (!newWindow.style.left) newWindow.style.left = "0px";
    if (!newWindow.style.top) newWindow.style.top = "0px";
    if (newWindow.style.left.startsWith("-")) newWindow.style.setProperty("--aero-reflections-left", newWindow.style.left.slice(1))
    else newWindow.style.setProperty("--aero-reflections-left", "-" + newWindow.style.left)
    if (newWindow.style.top.startsWith("-")) newWindow.style.setProperty("--aero-reflections-top", newWindow.style.top.slice(1))
    else newWindow.style.setProperty("--aero-reflections-top", "-" + newWindow.style.top)
    newWindow.style.display = "none"
    if(options.alwaysontop) newWindow.className += " alwaysontop"
    if(options.alwaysbehind) newWindow.className += " alwaysbehind"
    if(options.classes) newWindow.className += options.classes
    newWindow.innerHTML =
    `
    <div style="${options.fullscreen ? 'display: none;' : ''}--titlebar-ext-height: ${options.titleBarHeight ? options.titleBarHeight : 0}px"class="topbar ${options.noGUI ? 'noncont' : ''}" ${options.noResize ? '' : 'ondblclick="maximise(this.parentElement)"'} onmousedown="windowMouseDown(event, this, 'drag', ${options.noResize})" ontouchstart="windowMouseDown(event, this, 'drag', ${options.noResize})">
        <left>
            <img src="${window.icon}" onerror="this.remove()" ${options.noGUI ? 'style="display: none;"' : ''}>
            <p ${options.noGUI ? 'style="display: none;"' : ''}>${window.title}</p>
        </left>
        <div class="buttons">
            ${options.xOnly ? `` : `<div class="dash" ${options.noTray ? 'disabled' : 'onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"'}><div class="cbutton-glyph"></div></div>
            <div class="square" ${options.noResize ? 'disabled' : 'onclick="maximise(this.parentElement.parentElement.parentElement)"'}><div class="cbutton-glyph"></div></div>`}
            ${options.noX ? `` : `<div class="x"><div class="cbutton-glyph"></div></div>`}
        </div>
    </div>
    ${options.noResize ? `` : `<div ontouchstart="event.preventDefault();windowResize(event, this, 'right', 'top')" onmousedown="windowResize(event, this, 'left', 'top')" class="resizer topleft"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'right', 'top')" onmousedown="windowResize(event, this, 'right', 'top')" class="resizer topright"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'left', 'bottom')" onmousedown="windowResize(event, this, 'left', 'bottom')" class="resizer bottomleft"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'right', 'bottom')" onmousedown="windowResize(event, this, 'right', 'bottom')" class="resizer bottomright"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'top')" onmousedown="windowResize(event, this, 'top')" class="resizer top"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'left')" onmousedown="windowResize(event, this, 'left')" class="resizer left"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'right')" onmousedown="windowResize(event, this, 'right')" class="resizer right"></div>
    <div ontouchstart="event.preventDefault();windowResize(event, this, 'bottom')" onmousedown="windowResize(event, this, 'bottom')" class="resizer bottom"></div>`}
    `
    newWindow.querySelector(".x").onclick = () => closeWindow(id, onclose)
    newWindow.setAttribute("onmousedown", "setActive(this)")
    newWindow.setAttribute("ontouchstart", "setActive(this)")
    let content = document.createElement("div")
    content.className = "content" + (options.noGUI || options.noBorder ? 'nostyle' : '')
    if (options.minWidth) content.style.minWidth = options.minWidth + 'px'
    if (options.minHeight) content.style.minHeight = options.minHeight + `px`
    content.appendChild(document.createElement("ignore"))
    let text = document.createElement("text")
    text.style.width = options.width + "px"
    text.style.height = options.height + "px"
    if (typeof elem == "object") text.appendChild(elem)
    else{
        text.innerHTML = window.innerhtml
        if (ispopup) text.innerHTML += `<footer><button onclick="closeWindow(${id})">OK</div></button>`
    }
    content.appendChild(text)
    newWindow.appendChild(content)
    windows.append(newWindow)
    if(ispopup || options.noSelfOpen || options.okna8){
        showWindow(options.okna8 ? "../" + window.icon : window.icon, id)
    }
    broadcast("newprocess|" + id)
    return {id: id, elem: text, title: newWindow.querySelector("left").lastElementChild, window: newWindow}
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
async function msgbox(title, content, buttons, type){
    if (!buttons) buttons = ['OK']
    return new Promise((resolve, reject) => {
        const id = getId()
        let msgboxContent = document.createElement("div")
        msgboxContent.style.minWidth = "93px"
        msgboxContent.style.minHeight = "93px"
        let msgboxElem = document.createElement("div")
        msgboxElem.setAttribute("style", "padding: 10px; height: calc(100% - 40px); display: flex;")
        if (type){
            const msgboxImage = document.createElement("img")
            msgboxImage.src = "./res/icons/" + type.slice(0, 3) + ".png"
            msgboxImage.style.height = "32px"
            msgboxElem.appendChild(msgboxImage)
            if (type == "error"){
                new Audio("./media/Windows Critical Stop.flac").play()
            }
            if (type == "info"){
                new Audio("./media/Windows Error.flac").play()
            }
            if (type == "warning"){
                new Audio("./media/Windows Exclamation.flac").play()
            }
        }
        const text = document.createElement("div")
        text.innerHTML = content
        text.style.margin = "8px"
        text.style.marginBottom = "8px"
        msgboxElem.appendChild(text)
        let footer = document.createElement("footer")
        for (btn of buttons){
            let button = document.createElement("button")
            button.innerText = btn
            const str = (' ' + btn)
            button.onclick = () => {resolve(str.slice(1)); closeWindow(id)}
            footer.appendChild(button)
        }
        msgboxContent.appendChild(msgboxElem)
        msgboxContent.appendChild(footer)
        msgboxContent.style.height = "100%"
        let wnd = AddWindow(new Winda7Window(0, 0, 0, 0, title, undefined, ""), false, {left: (window.innerWidth/2)-50, top: (window.innerHeight/2)-50, noSelfOpen: true, xOnly: true, noResize: true}, id, msgboxContent, () => resolve("")).window
        const dimensions = wnd.getBoundingClientRect()
        const half = {width: dimensions.width / 2, height: dimensions.height / 2}
        wnd.style.left = (window.innerWidth/2)-half.width + "px"
        wnd.style.top = (window.innerHeight/2)-half.height + "px"
    })
}
async function inputbox(title, content, defaultValue){
    return new Promise((resolve, reject) => {
        const id = getId()
        let msgboxContent = document.createElement("div")
        msgboxContent.style.minWidth = "93px"
        msgboxContent.style.minHeight = "93px"
        let msgboxElem = document.createElement("div")
        msgboxElem.setAttribute("style", "padding: 20px; height: calc(100% - 80px)")
        msgboxElem.innerHTML = content + "<br><br>"
        let inputBox = document.createElement("input")
        inputBox.type = "text"
        inputBox.value = defaultValue ? defaultValue : ''
        msgboxElem.appendChild(inputBox)
        let footer = document.createElement("footer")
        let okbutton = document.createElement("button")
        okbutton.innerHTML = "OK"
        okbutton.onclick = () => {resolve(inputBox.value); closeWindow(id)}
        footer.appendChild(okbutton)
        msgboxContent.appendChild(msgboxElem)
        msgboxContent.appendChild(footer)
        let wnd = AddWindow(new Winda7Window(0, 0, 0, 0, title, undefined, ""), false, {left: (window.innerWidth/2)-50, top: (window.innerHeight/2)-50, noSelfOpen: true, xOnly: true, noResize: true}, id, msgboxContent, () => resolve("")).window
        const dimensions = wnd.getBoundingClientRect()
        const half = {width: dimensions.width / 2, height: dimensions.height / 2}
        wnd.style.left = (window.innerWidth/2)-half.width + "px"
        wnd.style.top = (window.innerHeight/2)-half.height + "px"
        new Audio(sounds.msgbox).play()
    })
}
function resizeHandler(e){
    broadcast("getscrwidth|" + innerWidth, "*")
    broadcast("getscrheight|" + innerHeight, "*")
}
function setActive(window, noTray){
    if (activewindow) {
        activewindow.className = activewindow.className.replace(" focus", "")
        try{
            if (activewindow.querySelector("iframe")) activewindow.querySelector("iframe").contentWindow.unfocus()
        }
        catch(e){console.error(e)}
    }
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = window;
    if (!activewindow.classList.contains("focus")) activewindow.className += " focus"
    try{
        if (activewindow.querySelector("iframe")) activewindow.querySelector("iframe").contentWindow.focus()
    }
    catch(e){console.error(e)}
    activewindow.style.zIndex = 1;
    if (noTray) return
    try{
        for(element of leftBar.children)
            element.className = element.className.replace(" focus", "")
        let e = leftBar.querySelector(`.n${activewindow.getAttribute("windowid")}`)
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
    for (let windoww of document.querySelectorAll(`.n${num}.window`))
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
                AddWindow(new Winda7Window(0, 0, 0, 0, `Message from Metro app`, "<div class=\"metro-dialog\">" + commands[1] + "</div>", '', true), undefined, {"window": true, "noSelfOpen": true, "title": "Message from Metro app", "left": (window.innerWidth / 2) - 300, "top": (window.innerHeight / 2) - 150, "width": 600, "height": 300}, false, id)
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
            localStorage.dontGroupIcons = commands[1]
            if (commands[1] != "true"){
                groupicons.href = ""
            }
            else{
                groupicons.href = './shell/dont_group_icons.css'
            }
        }
        else if (commands[0] == "usesmalltaskbar"){
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
async function closeWindow(id, callback){
    if (callback) await callback()
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
                display: "block",
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