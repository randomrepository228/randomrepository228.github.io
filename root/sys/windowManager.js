window.wm = {}
windows = document.createElement("div")
windows.id = "windows"
windows.className = "taskbar-bottom"
snapOutline = document.createElement('div')
snapOutline.id = "snapOutline"
windows.appendChild(snapOutline)
snapEffect = document.createElement('div')
snapEffect.id = "snapEffect"
windows.appendChild(snapEffect)
document.body.appendChild(windows)
windows.style.setProperty("--iframe-ignore", "none")
function snapLeft(window){}
function snapRight(window){}
function maximiseWindow(window){}
maximise = maximiseWindow
wm.last = {x: 0, y: 0, windowX: 0, windowY: 0, windowWidth: 0, windowHeight: 0}
wm.dragType = 0
wm.windows = []
window.Winda7Window = class{
    constructor(options, width, height) {
        this.height = height;
        this.width = width;
        this.options = options;
        this.id = options.id;
        this.icon = options.icon;
        let newWindow = document.createElement("div")
        newWindow.id = options.id
        if (!options.layout) throw new Error("can't create a window without window info")
        newWindow.classList.toggle("window")
        if (options.aero) {
            newWindow.classList.toggle("aero")
        }
        if (options.aero || options.shadow) {
            newWindow.classList.toggle("shadow")
        }
        if (localStorage.maximiseWindows == "true" && !options.noResize) newWindow.classList.toggle("maximised")
        if (options.ispopup){
            newWindow.style.left = (innerWidth / 2 ) - (options.width) / 2 + "px"
            newWindow.style.top = (innerHeight / 2 ) - (options.height) / 2 + "px"
            this.show
        }
        else{
            if (typeof options.top === "number") newWindow.style.top = options.top += "px"
            if (typeof options.left === "number") newWindow.style.left = options.left += "px"
            if (typeof options.right === "number") newWindow.style.right = options.right += "px"
            if (typeof options.bottom === "number") newWindow.style.bottom = options.bottom += "px"
            if (typeof options.inset === "number") newWindow.style.inset = options.inset
            if (options.noTray) newWindow.notray = true
        }
        const openedwindows = getAllWindows().length
        if (!(options.right || options.left))
            newWindow.style.left = (openedwindows * 25 + 50) % (innerWidth - options.width) + "px"
        if (!(options.bottom || options.top))
            newWindow.style.top = (openedwindows * 25 + 50) % (innerHeight - options.height) + "px"
        if (newWindow.style.left.startsWith("-")) newWindow.style.setProperty("--aero-left", newWindow.style.left.slice(1))
        else if (newWindow.style.left) newWindow.style.setProperty("--aero-left", "-" + newWindow.style.left)
        if (newWindow.style.top.startsWith("-")) newWindow.style.setProperty("--aero-top", newWindow.style.top.slice(1))
        else if (newWindow.style.top) newWindow.style.setProperty("--aero-top", "-" + newWindow.style.top)
        if(options.alwaysontop) newWindow.className += " alwaysontop"
        if(options.alwaysbehind) newWindow.className += " alwaysbehind"
        if(!options.noResize) newWindow.className += " resize"
        if(options.ignoreWorkingArea) newWindow.style.position = "fixed"
        newWindow.onmousedown = () => setActive(newWindow)
        newWindow.ontouchstart = () => setActive(newWindow)
        let cont = document.createElement("div")
        let text = document.createElement("text")
        if (options.layout instanceof HTMLElement) {
            newWindow.classList.toggle("nogui")
            text.append(options.layout)
        }
        else if (typeof options.layout === String) {
            text.innerHTML = options.layout
        }
        else{
            if (options.layout.titlebar) {
                let titleBar = document.createElement("div")
                titleBar.className = "topbar"
                const mouseDown = "windowMouseDown(event, this, this.parentElement, 1)"
                titleBar.setAttribute("onmousedown", mouseDown)
                titleBar.setAttribute("ontouchstart", mouseDown)
                console.log(options.layout)
                if (!options.layout.hideTitle){
                    const titlebarLeft = document.createElement("left")
                    async function setIcon(){
                        if (options.icon){
                            const icon = document.createElement("img")
                            titlebarLeft.appendChild(icon)
                            const iconFS = await fs.exists(options.icon)
                            if (!iconFS) icon.src = options.icon
                            else{
                                const iconContents = await fs.readFile(options.icon)
                                try{
                                    icon.src = URL.createObjectURL(iconContents)
                                }
                                catch(e){}
                            }
                            icon.src = options.icon
                        }
                    }
                    setIcon()
                    const title = document.createElement("p")
                    this.titleElem = title
                    title.innerText = options.title
                    titlebarLeft.appendChild(title)
                    titleBar.appendChild(titlebarLeft)
                }
                else titleBar.appendChild(document.createElement("left"))
                if (options.layout.titlebar.buttons){
                    const buttons = document.createElement("div")
                    buttons.className = "buttons"
                    const btns = options.layout.titlebar.buttons
                    if (btns.min || btns.max) {
                        const min = document.createElement("div")
                        min.className = "dash"
                        if (!btns.min) min.style.setAttribute("disabled", "")
                        else min.onclick = () => minimiseWindow(newWindow)
                        buttons.appendChild(min)
                        const max = document.createElement("div")
                        max.className = "square"
                        if (!btns.max) max.style.setAttribute("disabled", "")
                        else max.onclick = () => maximiseWindow(newWindow)
                        buttons.appendChild(max)
                    }
                    if (btns.close || btns.min || btns.max) {
                        const close = document.createElement("div")
                        close.className = "x"
                        if (!btns.close) close.style.setAttribute("disabled", "")
                        else close.onclick = () => this.close()
                        buttons.appendChild(close)
                    }
                    for (a of buttons.children){
                        let el = document.createElement("div")
                        el.className = "cbutton-glyph"
                        a.appendChild(el)
                    }
                    titleBar.append(buttons)
                }
                newWindow.append(titleBar)
            }
            if (options.layout.cont instanceof HTMLElement){
                let cont = options.layout.cont
                if (cont.tagName === "TOPLEVEL"){
                    while(cont.children.length > 0){
                        text.append(cont.children[0])
                    }
                }
                else{
                    text.append(cont)
                }
            }
            else{
                text.append(options.layout.cont)
            }
            // text.innerHTML = window.content
            // if (options.ispopup) text.innerHTML += `<footer><button onclick="closeWindow(${id})">OK</div></button>`
        }
        if (!options.noResize){
            const directions = [
                "bottom", "left", "top", "right", 
                "topleft", "bottomleft", "topright", "bottomright"
            ]
            let i = 2;
            for (let a of directions){
                (function(i){
                let el = document.createElement("div")
                const action = (e) => {
                    e.preventDefault();
                    windowMouseDown(e, el, newWindow, i)
                }
                el.ontouchstart = el.onmousedown = action
                el.className = a
                newWindow.appendChild(el)
                })(i)
                i++
            }
        }
        cont.className = options.aero && !options.noFrame ? 'content' : 'contentnostyle'
        if (options.minWidth) text.style.minWidth = options.minWidth + 'px'
        if (options.minHeight) text.style.minHeight = options.minHeight + `px`
        if (options.maxWidth) text.style.maxWidth = options.maxWidth + 'px'
        if (options.maxHeight) text.style.maxHeight = options.maxHeight + `px`
        if (options.inset) newWindow.style.inset = options.inset
        if (!width) width = options.width
        if (!height) height = options.height
        text.style.width = width + "px"
        text.style.height = height + "px"
        cont.appendChild(text)
        newWindow.appendChild(cont)
        windows.append(newWindow)
        broadcast("newprocess|" + options.id)
        this.windowElem = newWindow
        this.windowElem.context = this
        this.frame = text
        this.windowElem.frame = text
        this.title = options.title;
    }
    async close(){
        let window = this.windowElem
        if (this.onclose) await this.onclose()
        async function timeout(){
            console.log("ok")
            if (this.closeCallback) await this.closeCallback()
            window.remove()
            broadcast("processdied|" + this.id)
        }
        if (!window.classList.contains("window")){
            console.log("ok")
            await timeout()
            return
        }
        window.className += " closing"
        if (!window.notray){
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
        setTimeout(timeout, 300)
        if (this.windowElem.classList.contains("show")){
            wm.windows.filter((a) => a === this)
            const ev = new Event("windowchange")
            ev.window = this
            ev.remove = true
            dispatchEvent(ev)
        }
    }
    minimise(){

    }
    unminimise(){

    }
    maximise(){
    
    }
    restore(){

    }
    show(){
        if (!this.windowElem.classList.contains("show")){
            this.windowElem.classList.toggle("show")
        }
        wm.windows.push(this)
        const ev = new Event("windowchange")
        ev.window = this
        ev.remove = false   
        dispatchEvent(ev)
    }
    hide(){
        if (this.windowElem.classList.contains("show")){
            this.windowElem.classList.toggle("show")
            wm.windows.splice(wm.windows.indexOf(this), 1)
            const ev = new Event("windowchange")
            ev.window = this
            ev.remove = true
            dispatchEvent(ev)
        }
    }
    set title(t){
        try{this.titleElem.innerText = t} catch(e){}
        this.windowElem.title = t
        this._title = t
        const titleChangeEvent = new Event("winda-title-change")
        titleChangeEvent.id = this.id
        titleChangeEvent.title = t
    }
    get title(){
        return this._title
    }
}
function getId(){
    window.winda.pidCounter++
    return window.winda.pidCounter
}
function findWindow(id){
    for(let i = 0; i < windows.children.length; i++) {
        if (windows.children[i].id === id.toString()) return windows.children[i]
    }
}
function findWindowBy(type, val){
    for(let i = 0; i < windows.children.length; i++) {
        if (windows.children[i][type] === val) return windows.children[i]
    }
}
// if (!(localStorage.dontGroupIcons == "true"))
//     groupicons.href = ""
// else
//     groupicons.href = './shell/dont_group_icons.css'
// if (localStorage.useSmallTaskbar == "true")
//     smalltaskbar.href = "./shell/small_taskbar_icons.css"
// else
//     smalltaskbar.href = ''
windows.style.backgroundSize = "100% 100%"
function AddWindow(window, ispopup, options, id, elem, onclose){
    console.log(id)
    let newWindow = document.createElement("div")
    newWindow.id = id
    newWindow.className = `window shadow aero`
    if (typeof options.top == "number") options.top += "px"
    if (typeof options.left == "number") options.left += "px"
    if (typeof options.right == "number") options.right += "px"
    if (typeof options.bottom == "number" && !options.overrideTaskbar) options.bottom = `calc(var(--taskbar-height) + ${options.bottom}px)`
    else if (typeof options.bottom == "number") options.bottom += "px"
    if (options.okna8) window.icon = "./iframes/Okna8Mode/apps/metro/" + options.title + "/AppLogo.png"
    if (options.NoGUI) newWindow.className += " nogui"
    if (!this.move) newWindow.className += " maximised"
    if (localStorage.maximiseWindows == "true" && !options.noResize) newWindow.className += " maximised"
    if (options.noTray) newWindow.notray = true
    if (options.left) newWindow.style.left = options.left
    if (options.top) newWindow.style.top = options.top
    if (options.right) newWindow.style.right = options.right
    if (options.bottom) newWindow.style.bottom = options.bottom
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
    if (!newWindow.style.left && !options.right) newWindow.style.left = "0px";
    if (!newWindow.style.top && !options.bottom) newWindow.style.top = "0px";
    if (newWindow.style.left.startsWith("-")) newWindow.style.setProperty("--aero-left", newWindow.style.left.slice(1))
    else if (newWindow.style.left) newWindow.style.setProperty("--aero-left", "-" + newWindow.style.left)
    if (newWindow.style.top.startsWith("-")) newWindow.style.setProperty("--aero-top", newWindow.style.top.slice(1))
    else if (newWindow.style.top) newWindow.style.setProperty("--aero-top", "-" + newWindow.style.top)
    newWindow.style.display = "none"
    if(options.alwaysontop) newWindow.className += " alwaysontop"
    if(options.alwaysbehind) newWindow.className += " alwaysbehind"
    if(!options.noResize) newWindow.className += " resize"
    newWindow.innerHTML =
    `
    <div style="${options.fullscreen ? 'display: none;' : ''}--titlebar-ext-height: ${options.titleBarHeight ? options.titleBarHeight : 0}px"class="topbar ${options.noGUI ? 'noncont' : ''}" ${options.noResize ? '' : 'ondblclick="maximise(this.parentElement)"'} onmousedown="windowMouseDown(event, this, 'drag', ${options.noResize})" ontouchstart="windowMouseDown(event, this, 'drag', ${options.noResize})">
        <left>
            <img src="${window.icon}" onerror="this.remove()" ${options.noGUI ? 'style="display: none;"' : ''}>
            <p ${options.noGUI ? 'style="display: none;"' : ''}>${window.title ? window.title : options.title}</p>
        </left>
        <div class="buttons">
            ${options.xOnly ? `` : `<div class="dash"></div>
            <div class="square"></div>`}
            ${options.noX ? `` : `<div class="x"></div>`}
        </div>
    </div>
    `
    if (!options.noResize){
        const directions = [
            ["bottom"], ["left"], ["top"], ["right"], 
            ["top", "left"], ["bottom", "left"], ["top", "right"], ["bottom", "right"]
        ]
        for (let a of directions){
            let el = document.createElement("div")
            const action = (e) => {
                e.preventDefault();
                windowResize(e, el, a[0], a[1])
            }
            el.ontouchstart = el.onmousedown = action
            el.className = a.join("")
            newWindow.appendChild(el)
        }
    }
    if (!options.noX) newWindow.querySelector(".x").onclick = () => closeWindow(id, onclose)
    if (!options.xOnly){
        if (!options.noResize) newWindow.querySelector(".square").onclick = () => maximiseWindow(newWindow)
        else newWindow.querySelector(".square").setAttribute('disabled', '')
        if (!options.noTray) newWindow.querySelector(".dash").onclick = () => minimiseWindow(newWindow)
        else newWindow.querySelector(".dash").setAttribute('disabled', '')
    }
    for (a of newWindow.querySelector(".buttons").children){
        let el = document.createElement("div")
        el.className = "cbutton-glyph"
        a.appendChild(el)
    }
    newWindow.onmousedown = () => setActive(newWindow)
    newWindow.ontouchstart = () => setActive(newWindow)
    let content = document.createElement("div")
    let text = document.createElement("text")
    content.className = "content" + (options.noGUI || options.noBorder ? 'nostyle' : '')
    if (options.minWidth) text.style.minWidth = options.minWidth + 'px'
    if (options.minHeight) text.style.minHeight = options.minHeight + `px`
    if (options.maxWidth) text.style.maxWidth = options.maxWidth + 'px'
    if (options.maxHeight) text.style.maxHeight = options.maxHeight + `px`
    if (options.iframeignore) content.appendChild(document.createElement("ignore"))
    text.style.width = options.width + "px"
    text.style.height = options.height + "px"
    if (typeof elem == "object") text.appendChild(elem)
    else{
        text.innerHTML = window.content
        if (ispopup) text.innerHTML += `<footer><button onclick="closeWindow(${id})">OK</div></button>`
    }
    newWindow.title = options.title
    content.appendChild(text)
    newWindow.appendChild(content)
    windows.append(newWindow)
    if(ispopup || options.noSelfOpen || options.okna8){
        showWindow(options.okna8 ? "../" + window.icon : window.icon, id, options.noTray)
    }
    broadcast("newprocess|" + id)
    return {id: id, elem: text, title: newWindow.querySelector("left").lastElementChild, window: newWindow}
}
function broadcast(message){
    for (a of windows.children){
        try{
            a.querySelector("iframe").contentWindow.postMessage(message, "*")
        }
        catch (e) {}
    }
}
function sendMsg(id, message){
    for (a of windows.children){
        if (a.id != id) return
        try{
            a.querySelector("iframe").contentWindow.postMessage(message)
        }
        catch (e) {}
    }
}
function sendInfo(element){
    const id = element.parentElement.parentElement.parentElement.id
    if (element.parentElement.parentElement.parentElement.className.includes("okna8")){
        element.contentWindow.postMessage("YourID-" + id, "*");
        return
    }
    element.contentWindow.postMessage("id|" + id, "*")
}
function getTray(id){
    return document.querySelector(".tray.n" + id)
}
window.idToWindow = findWindow
window.getWnd = findWindow
async function msgbox(title, content, buttons, type){
    if (!buttons) buttons = ['OK']
    return new Promise((resolve, reject) => {
        let msgboxContent = document.createElement("div")
        msgboxContent.style.minWidth = "93px"
        msgboxContent.style.minHeight = "93px"
        let msgboxElem = document.createElement("div")
        msgboxElem.setAttribute("style", "padding: 10px; height: calc(100% - 40px); display: flex; white-space: pre")
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
        let wnd = new Winda7Window({
            title: title, 
            icon: "icon.png", 
            id: getId(), 
            layout: {
                titlebar: true,
                cont: msgboxContent
            },
            aero: true,
            ispopup: true
        })
        wnd.show()
        for (btn of buttons){
            let button = document.createElement("button")
            button.innerText = btn
            const str = (' ' + btn)
            button.onclick = () => {resolve(str.slice(1)); wnd.close()}
            footer.appendChild(button)
        }
        msgboxContent.appendChild(msgboxElem)
        msgboxContent.appendChild(footer)
        msgboxContent.style.height = "100%"
        const dimensions = wnd.windowElem.getBoundingClientRect()
        const half = {width: dimensions.width / 2, height: dimensions.height / 2}
        wnd.windowElem.style.left = (window.innerWidth/2)-half.width + "px"
        wnd.windowElem.style.top = (window.innerHeight/2)-half.height + "px"
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
        let wnd = AddWindow(new Winda7Window(0, 0, title, undefined, ""), false, {left: (window.innerWidth/2)-50, top: (window.innerHeight/2)-50, noSelfOpen: true, xOnly: true, noResize: true}, id, msgboxContent, () => resolve("")).window
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
    if (!window) return
    if (activewindow) {
        activewindow.className = activewindow.className.replace(" focus", "")
        activewindow.style.zIndex = 0;
    }
    for (let a of windows.children){
        if (!a.id) continue
        a.style.zIndex = 0;
    }
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
    let e = leftBar.querySelector(`.n${activewindow.id}`)
    e.className = e.className + " focus"
    } catch(e){}
}
function setInactive(){
    for(element of document.querySelectorAll(".window"))
        element.style.zIndex = 0;
    activewindow = undefined;
    for(element of leftBar.children)
        element.className = element.className.replace(" focus", "")
}
function hovereffect(e, elem){
    const pos = elem.getBoundingClientRect()
    elem.style.setProperty('--tray-hover-left', (e.clientX - pos.x) + "px")
    elem.style.setProperty('--tray-hover-top', (e.clientY - pos.y) + "px")
}
function showWindow(icon, num, doNotShowTray){
    num = +num
    if (shownBefore.includes(num)) return
    let wnd = getWnd(num)
    wnd.style.display = ""
    if (doNotShowTray) try{
        setActive(wnd, true)
        startMenu(false)
        return;
    }
    catch(e){}
    const event = new Event("newWindow")
    event.tray = !doNotShowTray
    event.window = wnd
    event.icon = icon
    setActive(wnd)
    wnd.style.display = ""
    startMenu(false)
    shownBefore.push(num)
}
onmessage = (e) => {
    console.log(e.data)
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
                    for(const a of windows.children)
                        if(a.id === i)
                            idCollision = true
                    if (!idCollision)
                        id = i
                        break
                }
                AddWindow(new Winda7Window(0, 0, `Message from Metro app`, "<div class=\"metro-dialog\">" + commands[1] + "</div>", '', true), undefined, {"window": true, "noSelfOpen": true, "title": "Message from Metro app", "left": (window.innerWidth / 2) - 300, "top": (window.innerHeight / 2) - 150, "width": 600, "height": 300}, false, id)
            }
            return
        }
        let frame;
        if (wnd){
            frame = wnd.lastElementChild.children[1].children[0].contentWindow
        }
        console.log(commands[0])
        if (commands[0] == "close")
            closeWindow(commands[1])
        else if (commands[0] == "max")
            maximise(commands[1])
        else if (commands[0] == "min")
            minimizeWindow(commands[1])
        else if (commands[0] == "eval"){
            eval(commands.slice(2).join("|"))
        }
        else if (commands[0] == "show")
            showWindow(commands[2], commands[1])
        else if (commands[0] == "setwidth" || commands[0] == "setheight" || commands[0] == "settop" || commands[0] == "setleft")
            wnd.style[commands[0].slice(3, commands[0].length)] = commands[2]
        else if (commands[0] == "setpos"){
            wnd.style.top = commands[2];
            wnd.style.left = commands[3]
        }
        else if (commands[0] == "settitle")
            wnd.title = commands[2]
        else if (commands[0] == "width" || commands[0] == "height" || commands[0] == "top" || commands[0] == "left")
            frame.postMessage("get" + commands[0] + "|" + wnd.style[commands[0]], "*")
        else if (commands[0] == "title")
            frame.postMessage("get" + commands[0] + "|" + wnd.title, "*")
        else if (commands[0] == "scrwidth")
            frame.postMessage("getscrwidth|" + innerWidth, "*")
        else if (commands[0] == "scrheight")
            frame.postMessage("getscrheight|" + innerHeight, "*")
        else if (commands[0] == "theme")
            changeTheme(commands[1])
    }
}
function getAllWindows(){
    return wm.windows
}
async function closeWindow(id){
    let window = getWnd(id)
    if (window.onclose) await window.onclose()
    console.log(window)
    if (!window) window = getTray(id)
    function timeout(){
        window.remove()
        broadcast("processdied|" + id)
    }
    if (!window.className.includes("window")){
        timeout()
        return
    }
    window.className += " closing"
    // if (!window.notray){
    //     try{
    //         leftBar.querySelector(`.n${id}.window-tray`).style.opacity = 0
    //         leftBar.querySelector(`.n${id}.window-tray`).animate(
    //             [{opacity: 1}, {opacity: 0}],
    //             {
    //                 duration: 300,
    //                 iterations: 1,
    //                 easing: "ease-in-out"
    //             }
    //         )
    //     }
    //     catch(e){}
    // }
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
        console.log(window.classList[0])
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
        setActive(window, window.notray)
        restoreWindow(window)
        return
    }
    minimizeWindow(window)
}
function minimiseAll(){
    setInactive()
    for (const id of getAllWindows()){
        if (id.id == 0) continue
        for (const wnd of windows.querySelector(".n" + id.id)){
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
function snapLeft(window){
    if (localStorage.aerosnap == "true") return
    window.className = window.className.replace("", "snap-left ")
}
function snapRight(window){
    if (localStorage.aerosnap == "true") return
    window.className = window.className.replace("", "snap-right ")
}
function windowMouseDown(event, elem, windowelem, type){
    setActive(windowelem)
    {
        const windowFrameDim = activewindow.frame.getBoundingClientRect()
        wm.last.windowWidth = windowFrameDim.width
        wm.last.windowHeight = windowFrameDim.height
        const windowDim = activewindow.getBoundingClientRect()
        wm.last.windowX = windowDim.x
        wm.last.windowY = windowDim.y
    }
    let touch = false;
    if (event.touches) {
        event = event.touches[0];
        touch = true;
    }
    wm.last.x = event.clientX
    wm.last.y = event.clientY
    if(event.target != elem) return;
    if (event.type == "touchstart" || event.target.tagName == "IFRAME"){
        event.preventDefault();
    }
    wm.dragType = type
    windows.style.setProperty("--iframe-ignore", "block")
}
function windowMouseUp(){
    wm.dragType = 0
    windows.style.setProperty("--iframe-ignore", "none")
}
addEventListener("touchend", windowMouseUp)
addEventListener("mouseup", windowMouseUp)
function move(e){
    windowsDim = windows.getBoundingClientRect()
    if (!activewindow) return
    if (localStorage.noContentMove) return
    if (!wm.dragType) return
    else if (wm.dragType === 1){
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
    }
    else if (wm.dragType === 2){
        activewindow.frame.style.height = wm.last.windowHeight - wm.last.y + e.clientY + "px"
    }
    else if (wm.dragType === 3){
        activewindow.frame.style.width = wm.last.windowWidth + wm.last.x - e.clientX + "px"
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
    }
    else if (wm.dragType === 4){
        activewindow.frame.style.height = wm.last.windowHeight + wm.last.y - e.clientY + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
    }
    else if (wm.dragType === 5){
        activewindow.frame.style.width = wm.last.windowWidth - wm.last.x + e.clientX + "px"
    }
    else if (wm.dragType === 6){
        activewindow.frame.style.height = wm.last.windowHeight + wm.last.y - e.clientY + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
        activewindow.frame.style.width = wm.last.windowWidth + wm.last.x - e.clientX + "px"
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
    }
    else if (wm.dragType === 7){
        activewindow.frame.style.width = wm.last.windowWidth + wm.last.x - e.clientX + "px"
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
        activewindow.frame.style.height = wm.last.windowHeight - wm.last.y + e.clientY + "px"
    }
    else if (wm.dragType === 8){
        activewindow.frame.style.height = wm.last.windowHeight + wm.last.y - e.clientY + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
        activewindow.frame.style.width = wm.last.windowWidth - wm.last.x + e.clientX + "px"
    }
    else if (wm.dragType === 9){
        activewindow.frame.style.height = wm.last.windowHeight - wm.last.y + e.clientY + "px"
        activewindow.frame.style.width = wm.last.windowWidth - wm.last.x + e.clientX + "px"
    }
    // let top = +(activewindow.style.top.slice(0, activewindow.style.top.length - 2))
    // let left = +(activewindow.style.left.slice(0, activewindow.style.left.length - 2))
    // if (activewindow.style.left.startsWith("-")) activewindow.style.setProperty("--aero-left", -left + "px")
    // else activewindow.style.setProperty("--aero-left", "-" + left + "px")
    // if (activewindow.style.top.startsWith("-")) activewindow.style.setProperty("--aero-top", -top + "px")
    // else activewindow.style.setProperty("--aero-top", "-" + top + "px")
}
addEventListener("resize", resizeHandler)
function maximiseWindow(window){
    if (window.className.search("maximised") == -1){
        window.className += " maximised"
        try{
            window.querySelector("iframe").contentWindow.maximise()
        } catch(e){console.error(e)}
        window.className = window.className.replace("snap-right ", "")
        window.className = window.className.replace("snap-left ", "")
    }
    else{
        try{
            window.querySelector("iframe").contentWindow.minimise()
        } catch(e){console.error(e)}
        window.className = window.className.replace(" maximised", "")
    }
}
maximise = maximiseWindow
window.ui = {}
ui.SelectMenu = class{
    constructor(name, ...choices){
        this.name = name
        let selection = document.createElement("div")
        selection.className = "select"
        let selectOptions = document.createElement("select")
        selectOptions.name = name
        let isOptionSelected
        choices.forEach((a) => {
            if (typeof a === "string") a = {text: a, val: a}
            if (typeof a !== "object") throw new Error("Invalid value of an object")
            let selectOption = document.createElement("option")
            if (a.selected) {
                if (isOptionSelected) throw new Error("There cannot be more than 1 selected option")
                selectOption.selected = true
                isOptionSelected = true
                this.value = a.val
            }
            if (a.disabled) selectOption.disabled = true
            selectOption.value = a.val ? a.val : a.text
            this.options = a.val ? a.val : a.text
            selectOptions.appendChild()
        })
        selectOptions.onchange = () => {
            this.value = selectOptions.value
        }
        this.selectEl = selectOptions
        selection.appendChild(document.createElement("selecticon"))
        this.el = selection
    }
    set value(val){
        this.value = val
        if (this.selectEl.value !== val){
            this.selectEl.value = val
        }
    }
}
ui.icons = {}
// memory allocation
{
    async function a(){
        ui.icons.file = URL.createObjectURL(await fs.readFile("res/icons/file.png"))
        ui.icons.media = URL.createObjectURL(await fs.readFile("res/icons/media.png"))
        ui.icons.folder = URL.createObjectURL(await fs.readFile("res/icons/folder.png"))
    }
    a()
}
async function assocFile(filepath){
    const data = (await fs.readFile("config/associations").json())
    if (filepath.includes(".")){
        filepath = /\/([^/]*)$/.exec(filepath)[1]
    }
    else{
        return {icon: ui.icons.file, filename: filepath}
    }
}
ui.FileView = class{
    constructor(options){
        if (options) if (options.search) {

        }
        let elem = document.createElement("div")
        elem.className = "files"
        this.elem = elem
        this.currentFolder = ""
        this.innerHTML = ""
    }
    clear(){
        this.elem.innerHTML = ""
    }
    async showContents(fpath){
        let files = await fs.readdir(fpath)
        this.currentFolder = fpath
        let that = this
        if (!this.elem.ondrop) this.elem.ondrop = (e) => {
            function transferFile(file){
                const reader = new FileReader()
                reader.onload = () => fs.writeFile(that.currentFolder + "/" + file.name, new Blob([reader.result]))
                reader.readAsArrayBuffer(file)
            }
            e.preventDefault()
            if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item) => {
                    item.getAsString((e) => console.log(e))
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
        if (!this.elem.ondragover) this.elem.ondragover = (e) => e.preventDefault()
        let tempElement = document.createElement("div")
        for (let a of files){
            if (a == ".") continue
            let htmlPath = a
            a = a.replace("<marked>", "").replace("</marked>", "")
            let file = document.createElement("div")
            file.className = "file"
            let isfile = true
            if (a.startsWith("/")) {
                a = a.replace("/", "")
                htmlPath = htmlPath.replace("/", "")
            }
            if (a.endsWith("/.")){
                a = a.replace("/.", "")
                htmlPath = htmlPath.replace("/.", "")
                isfile = false
                file.innerHTML += `<img src="${ui.icons.folder}">`
                a = this.currentFolder + "/" + a
                file.onclick = function(){this.showContents(a)}
                console.log(file, file.onclick)
            }
            else if (a.toLowerCase().endsWith(".png") || a.toLowerCase().endsWith(".jpg") || a.toLowerCase().endsWith(".gif") || a.toLowerCase().endsWith(".bmp") || a.toLowerCase().endsWith(".webp")){
                let length = 3;
                if (a.toLowerCase().endsWith(".webp")) length = 4
                a = v + "/" + a
                let b;
                if(a.startsWith("/")) b = a.replace("/", "")
                const contents = await parent.fs.readFile(b)
                const url = URL.createObjectURL(new Blob([contents], {type: "image/" + a.substring(a.length - length, a.length)}))
                console.log(url)
                file.innerHTML += `<img src="${url}">`
                file.setAttribute("ondblclick", `loadApp('paint', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".flac") || a.toLowerCase().endsWith(".wav") || a.toLowerCase().endsWith(".mp3") || a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".avi") || a.toLowerCase().endsWith(".ogg") || a.toLowerCase().endsWith(".webm")){
                a = this.currentFolder + "/" + a
                file.innerHTML += `<img src="${ui.icons.media}">`
                file.setAttribute("ondblclick", `loadApp('wmplayer', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".html")){
                a = this.currentFolder + "/" + a
                file.innerHTML += `<img src="${ui.icons.file}">`
                file.setAttribute("ondblclick", `loadApp('iexplore', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".ca") || a.toLowerCase().endsWith(".js")){
                a = this.currentFolder + "/" + a
                file.innerHTML += `<img src="${ui.icons.file}">`
                file.setAttribute("ondblclick", `loadScript('${a.replace("\'", "\\\'")}')`)
            }
            else {
                a = this.currentFolder + "/" + a
                file.innerHTML += `<img src="${ui.icons.file}">`
                file.setAttribute("ondblclick", `loadApp('notepad', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            const newfpath = (' ' + a).substring(1)
            file.setAttribute("oncontextmenu", `
                contextMenu(event, [
                    ['', 'Delete', () => fs.deleteFile('${newfpath}')],
                    ['./iframes/notepad/icon.png', 'Open with Notepad', () => loadApp("notepad", "", '${newfpath}')]
                ], event.clientX, event.clientY)`)
            file.innerHTML += htmlPath
            tempElement.append(file)
        }
        if (tempElement.innerHTML !== this.elem.innerHTML) {
            this.clear()
            this.elem.append(...tempElement.children)
        }
    }
    get items(){
        let arr = []
        for (let a of this.elem.children){
            arr.push(a.children[1].innerText)
        }
        return arr
    }
}
function createMenuBar(elem, items){
    if (!typeof elem === "object") return 1
    if (!elem.innerHTML) return 1
    let menuBar = document.createElement("div")
    menuBar.className = "menubar"
    for (let a of Object.keys(items)){
        let menuBarElem = document.createElement("div")
        menuBarElem.className = "element"
        menuBarElem.innerText = a
        menuBarElem.onmousedown = (event) => {
            isMouseDown = true;
            fileTabContextMenu(event, this)
        }
        menuBarElem.ontouchstart = (event) => {
            event.preventDefault()
            isMouseDown = true;
            fileTabContextMenu(event, this)
        }
        menuBarElem.onmouseover = (event) => {
            if (isMouseDown) fileTabContextMenu(event, this)
        }
    }
    return menuBar
}
{/* <div class="menubar">
    <div class="element" onmousedown="isMouseDown = true;fileTabContextMenu(event, this)"
                         onmouseover="if (isMouseDown)   fileTabContextMenu(event, this)">File</div>
    <div class="element" onmousedown="isMouseDown = true;formatTabContextMenu(event, this)"
                         onmouseover="if (isMouseDown)   formatTabContextMenu(event, this)">Format</div>
</div> */}