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
wm.activeMenuBar = undefined
window.Winda7Window = class{
    constructor(options, width, height) {
        this.options = options
        this.id = options.id
        this.icon = options.icon
        this.shown = false
        this.minimised = false
        this.maximised = false
        let newWindow = document.createElement("div")
        this.windowElem = newWindow
        if (typeof width === "number") this.width = width
        if (typeof height === "number") this.height = height
        newWindow.id = options.id
        if (!options.layout) throw new Error("can't create a window without window info")
        if (localStorage.maximiseWindows == "true" && !options.noResize) newWindow.classList.add("maximised")
        if (options.ispopup){
            this.x = (innerWidth / 2 ) - (options.width) / 2
            this.y = (innerHeight / 2 ) - (options.height) / 2
        }
        else{
            if (typeof options.top === "number") this.y = options.top
            if (typeof options.left === "number") this.x = options.left
            if (typeof options.right === "number") newWindow.style.right = options.right += "px"
            if (typeof options.bottom === "number") newWindow.style.bottom = options.bottom += "px"
            if (typeof options.inset === "number") newWindow.style.inset = options.inset
            if (options.noTray) newWindow.notray = true
        }
        const openedwindows = wm.windows.length
        if (!(options.right || options.left))
            this.x = (openedwindows * 25 + 50) % (innerWidth - options.width ? options.width : 0)
        if (!(options.bottom || options.top))
            this.y = (openedwindows * 25 + 50) % (innerHeight - options.height ? options.height : 0)
        if (newWindow.style.left.startsWith("-")) newWindow.style.setProperty("--aero-left", newWindow.style.left.slice(1))
        else if (newWindow.style.left) newWindow.style.setProperty("--aero-left", "-" + newWindow.style.left)
        if (newWindow.style.top.startsWith("-")) newWindow.style.setProperty("--aero-top", newWindow.style.top.slice(1))
        else if (newWindow.style.top) newWindow.style.setProperty("--aero-top", "-" + newWindow.style.top)
        if(options.alwaysontop) newWindow.className += " alwaysontop"
        if(options.alwaysbehind) newWindow.className += " alwaysbehind"
        if(!options.noResize) newWindow.className += " resize"
        if(options.ignoreWorkingArea) newWindow.style.position = "fixed"
        newWindow.onmousedown = () => this.focus()
        newWindow.ontouchstart = () => this.focus()
        let cont = document.createElement("div")
        let text = document.createElement("text")
        if (options.layout instanceof HTMLElement) {
            newWindow.classList.add("nogui")
            text.append(options.layout)
        }
        else if (typeof options.layout === String) {
            text.innerHTML = options.layout
        }
        else{
            if (options.layout.titlebar) {
                let titleBar = document.createElement("div")
                titleBar.className = "topbar"
                const mouseDown = "windowMouseDown(event, this, this.parentElement, 16)"
                titleBar.setAttribute("onmousedown", mouseDown)
                titleBar.setAttribute("ontouchstart", mouseDown)
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
                        else min.onclick = () => this.minimiseToggle()
                        buttons.appendChild(min)
                        const max = document.createElement("div")
                        max.className = "square"
                        if (!btns.max) max.style.setAttribute("disabled", "")
                        else max.onclick = () => this.maximiseToggle()
                        buttons.appendChild(max)
                    }
                    if (btns.close || btns.min || btns.max) {
                        const close = document.createElement("div")
                        close.className = "x"
                        if (!btns.close) close.style.setAttribute("disabled", "")
                        else close.onclick = () => this.close()
                        buttons.appendChild(close)
                    }
                    for (const a of buttons.children){
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
                "top", "left", "right", "bottom", 
                "topleft", "bottomleft", "topright", "bottomright"
            ]
            const ids = [
                1,2,4,8,3,10,5,12
            ]
            for (let i = 0; i < directions.length; i++){((i) => {
                let el = document.createElement("div")
                const action = (e) => {
                    windowMouseDown(e, el, newWindow, ids[i])
                }
                el.ontouchstart = el.onmousedown = action
                el.className = directions[i]
                newWindow.appendChild(el)
            })(i)}
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
        newWindow.classList.add("window")
        if (options.aero) {
            newWindow.classList.add("aero")
        }
        if (options.aero || options.shadow) {
            newWindow.classList.add("shadow")
        }
        cont.appendChild(text)
        newWindow.appendChild(cont)
        windows.append(newWindow)
        broadcast("newprocess|" + options.id)
        this.windowElem.context = this
        this.frame = text
        this.windowElem.frame = text
        this.title = options.title;
        this.focus()
    }
    async close(){
        if (this.closed) return
        let window = this.windowElem
        if (this.onclose) if (await this.onclose()) return
        async function timeout(){
            if (this.closeCallback) await this.closeCallback()
            window.remove()
            broadcast("processdied|" + this.id)
        }
        if (!window.classList.contains("window")){
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
            wm.windows.splice(wm.windows.indexOf(this), 1) 
            const ev = new Event("windowchange")
            ev.window = this
            ev.remove = true
            dispatchEvent(ev)
        }
        this.closed = true
    }
    minimise(){
        this.windowElem.style.display = "none"
        this.minimised = true
        activewindow = 0
    }
    unminimise(){
        this.windowElem.style.display = ""
        this.minimised = false
        this.focus()
    }
    minimiseToggle(){
        if (!this.minimised){
            this.minimise()
        }
        else{
            this.unminimise()
        }
    }
    maximise(){
        this.windowElem.className += " maximised"
        this.windowElem.className = this.windowElem.className.replace("snap-right ", "")
        this.windowElem.className = this.windowElem.className.replace("snap-left ", "")
        this.maximised = true
    }
    restore(){
        this.windowElem.className = this.windowElem.className.replace(" maximised", "")
        this.maximised = false
    }
    maximiseToggle(){
        if (!this.maximised){
            this.maximise()
        }
        else{
            this.restore()
        }
    }
    show(){
        if (!this.windowElem.classList.contains("show")){
            this.windowElem.classList.toggle("show")
        }
        wm.windows.push(this)
        const ev = new Event("windowchange")
        ev.window = this
        this.shown = true
        ev.remove = false   
        dispatchEvent(ev)
    }
    hide(){
        if (this.windowElem.classList.contains("show")){
            this.windowElem.classList.toggle("show")
            wm.windows.splice(wm.windows.indexOf(this), 1)
            const ev = new Event("windowchange")
            ev.window = this
            this.shown = false
            ev.remove = true
            dispatchEvent(ev)
        }
    }
    focus(){
        if (activewindow) {
            activewindow.className = activewindow.className.replace(" focus", "")
            activewindow.style.zIndex = 0;
        }
        activewindow = this.windowElem;
        if (!activewindow.classList.contains("focus")) activewindow.className += " focus"
        activewindow.style.zIndex = 1;
        // for(element of leftBar.children)
        //     element.className = element.className.replace(" focus", "")
        // let e = leftBar.querySelector(`.n${activewindow.id}`)
        // e.className = e.className + " focus"
        const ev = new Event("windowfocus")
        ev.window = this
        dispatchEvent(ev)
    }
    unfocus(){
        if (activewindow.classList.contains("focus")) activewindow.classList.toggle("focus")
        activewindow.style.zIndex = 0
        activewindow = undefined
    }
    set title(t){
        try{this.titleElem.innerText = t} catch(e){}
        this._title = t
        const titleChangeEvent = new Event("winda-title-change")
        titleChangeEvent.id = this.id
        titleChangeEvent.title = t
    }
    get title(){
        return this._title
    }
    set x(a){
        this._x = a
        this.windowElem.style.left = a + "px"
    }
    set y(a){
        this._y = a
        this.windowElem.style.top = a + "px"
    }
    get x(){
        return this._x
    }
    get y(){
        return this._y
    }
    set width(a){
        this._width = a
        this.windowElem.style.width = a + "px"
    }
    set height(a){
        this._height = a
        this.windowElem.style.height = a + "px"
    }
    get width(){
        return this._width
    }
    get width(){
        return this._height
    }
}
function getId(){
    window.winda.pidCounter++
    return window.winda.pidCounter
}
function findWindowBy(type, val){
    for(let i = 0; i < wm.windows.length; i++) {
        if (wm.windows[i][type] === val) return wm.windows[i]
    }
}
// if (!(localStorage.dontGroupIcons == "true"))
//     groupicons.href = ""
// else
//     groupicons.href = './bin/shell/dont_group_icons.css'
// if (localStorage.useSmallTaskbar == "true")
//     smalltaskbar.href = "./bin/shell/small_taskbar_icons.css"
// else
//     smalltaskbar.href = ''
windows.style.backgroundSize = "100% 100%"
function broadcast(message){
    for (const a of windows.children){
        try{
            a.querySelector("iframe").contentWindow.postMessage(message, "*")
        }
        catch (e) {}
    }
}
async function msgbox(title, content, buttons, type, p){
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
                new Audio("./res/media/Windows Critical Stop.flac").play()
            }
            if (type == "info"){
                new Audio("./res/media/Windows Error.flac").play()
            }
            if (type == "warning"){
                new Audio("./res/media/Windows Exclamation.flac").play()
            }
        }
        const text = document.createElement("div")
        text.innerHTML = content
        text.style.margin = "8px"
        text.style.marginBottom = "8px"
        msgboxElem.appendChild(text)
        let wnd = new Winda7Window({
            title: title, 
            id: getId(), 
            layout: {
                titlebar: true,
                cont: msgboxContent
            },
            aero: true,
            ispopup: true,
            noResize: true
        })
        let footer = document.createElement("footer")
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
        wnd.show()
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
        const dimensions = wnd.windowElem.getBoundingClientRect()
        const half = {width: dimensions.width / 2, height: dimensions.height / 2}
        wnd.windowElem.style.left = (window.innerWidth/2)-half.width + "px"
        wnd.windowElem.style.top = (window.innerHeight/2)-half.height + "px"
        new Audio(sounds.msgbox).play()
    })
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
            frame = wnd.lastElementChild.children[0].children[0].contentWindow
        }
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
function minimiseWindow(window){
    if (window.context.options.noMinimise) return
    const animtime = {
        duration: 300,
        iterations: 1
    };
    if (window.className.includes("minimised")){
        window.context.focus()
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
        window.context.focus()
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
        window.context.focus()
        restoreWindow(window)
        return
    }
    minimizeWindow(window)
}
function minimiseAll(){
    for (const wnd of wm.windows){
        if (!wnd.options.layout.titlebar.buttons.min) continue
        wnd.minimise()
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
    windowelem.context.focus()
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
function windowMouseUp(e){
    wm.dragType = 0
    windows.style.setProperty("--iframe-ignore", "none")
    if (e.touches) e = e.touches[0]
    if(!activewindow.context.options.noResize){
        if(e.clientX > innerWidth - 25){
            activewindow.classList.add("snap-right")
        }
        if(e.clientX < 25){
            activewindow.classList.add("snap-left")
        }
        if(e.clientY < 25){
            activewindow.context.maximise()
        }
    }
    snapOutline.classList.remove("full")
    snapOutline.classList.remove("right")
    snapOutline.classList.remove("left")
    if (!wm.activeMenuBar) return
    if (e.target.parentElement && e.target.parentElement === wm.activeMenuBar) return
    wm.activeMenuBar.mouseDown = false;
    const el = wm.activeMenuBar.querySelector(".active")
    if (el) el.classList.remove("active")
    wm.activeMenuBar = undefined
    contextMenuOff()
}
addEventListener("touchend", windowMouseUp)
addEventListener("mouseup", windowMouseUp)
function move(e){
    if (e.touches) e = e.touches[0]
    windowsDim = windows.getBoundingClientRect()
    if (!activewindow) return
    if (localStorage.noContentMove) return
    if (!wm.dragType) return
    if (activewindow.classList.contains("snap-left")) activewindow.classList.remove("snap-left")
    if (activewindow.classList.contains("snap-right")) activewindow.classList.remove("snap-right")
    if (activewindow.context.maximised) {
        activewindow.context.restore()
        const coords = activewindow.getBoundingClientRect()
        wm.last.windowX = Math.round(e.clientX - (coords.width / 2))
    }
    if (wm.dragType & 1){
        activewindow.frame.style.height = wm.last.windowHeight + wm.last.y - e.clientY + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
    }
    if (wm.dragType & 2){
        activewindow.frame.style.width = wm.last.windowWidth + wm.last.x - e.clientX + "px"
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
    }
    if (wm.dragType & 4){
        activewindow.frame.style.width = wm.last.windowWidth - wm.last.x + e.clientX + "px"
    }
    if (wm.dragType & 8){
        activewindow.frame.style.height = wm.last.windowHeight - wm.last.y + e.clientY + "px"
    }
    if (wm.dragType & 16){
        activewindow.style.left = wm.last.windowX - wm.last.x + e.clientX - windowsDim.x + "px"
        activewindow.style.top = wm.last.windowY - wm.last.y + e.clientY - windowsDim.y + "px"
        activewindow.style.bottom = "unset"
        activewindow.style.right = "unset"
    }
    let top = activewindow.x
    let left = activewindow.y
    // activewindow.style.setProperty("--aero-left", -left + "px")
    // activewindow.style.setProperty("--aero-top", -top + "px")
    if(!activewindow.context.options.noResize){
        if(e.clientX > innerWidth - 25){
            snapOutline.classList.add("right")
        }
        else{
            snapOutline.classList.remove("right")
        }
        if(e.clientX < 25){
            snapOutline.classList.add("left")
        }
        else{
            snapOutline.classList.remove("left")
        }
        if(e.clientY < 25){
            snapOutline.classList.add("full")
        }
        else{
            snapOutline.classList.remove("full")
        }
    }
}
document.body.style.height = innerHeight + "px"
addEventListener("resize", () => document.body.style.height = innerHeight + "px")
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
ui.icons = {
    file: "res/icons/file.png",
    media: "res/icons/media.png",
    folder: "res/icons/folder.png"
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
        this.selected = []
        let elem = document.createElement("div")
        elem.className = "files"
        // elem.onmousedown = (e) => {
        //     const selection = document.createElement("div")
        //     selection.className = "selection"
        //     selection.style.left = e.clientX + "px"
        //     selection.style.right = e.clientY + "px"
        //     selection.x = e.clientX
        //     selection.y = e.clientY
        //     this.selection = selection
        // }
        this.elem = elem
        this.currentFolder = ""
        this.innerHTML = ""
        this.type = "grid"
        this.showContents = this.showContents.bind(this);
        this.onDirChange = () => {}
        this.allowNavigation = true
        this.showParentDir = false
    }
    clear(){
        this.elem.innerHTML = ""
    }
    set type(a){
        this.elem.setAttribute("type", a)
    }
    get type(){
        return this.elem.getAttribute("type")
    }
    async showContents(fpath, s){
        let files = await fs.readdir(fpath)
        this.currentFolder = fpath
        if (!s) s = this
        if (!this.elem.ondrop) this.elem.ondrop = (e) => {
            function transferFile(file){
                const reader = new FileReader()
                reader.onload = () => fs.writeFile(s.currentFolder + "/" + file.name, new Blob([reader.result]))
                reader.readAsArrayBuffer(file)
            }
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
        if (!this.elem.ondragover) this.elem.ondragover = (e) => e.preventDefault()
        let tempElement = document.createElement("div")
        if (this.showParentDir){
            let file = document.createElement("div")
            file.className = "file"
            file.innerHTML += `<img src="${ui.icons.folder}">..`
            const path = this.currentFolder.split("/")
            path.pop()
            const newPath = path.join("/")
            file.ondblclick = () => s.showContents(newPath)
            tempElement.append(file)
        }
        for (let a of files){
            if (a == ".") continue
            let fileName = a
            a = a.replace("<marked>", "").replace("</marked>", "")
            let file = document.createElement("div")
            file.className = "file"
            let isfile = true
            function endsWithAny(a, string) {
                for (let d of a) {
                    if(string.endsWith(d))
                        return true;
                }
                return false;
            }
            const imgContainer = document.createElement("div")
            imgContainer.className = "cont"
            const img = document.createElement("img")
            imgContainer.append(img)
            const path = s.currentFolder + "/" + a
            if (a.endsWith("/.")){
                a = a.replace("/.", "")
                fileName = fileName.replace("/.", "")
                isfile = false
                img.src = ui.icons.folder
                file.ondblclick = () => s.showContents(path.substring(0, path.length - 2))
            }
            else if (a.toLowerCase().endsWith(".png") || a.toLowerCase().endsWith(".jpg") || a.toLowerCase().endsWith(".gif") || a.toLowerCase().endsWith(".bmp") || a.toLowerCase().endsWith(".webp")){
                img.src = path
                file.ondblclick = () => {loadApp('paint', undefined, path)}
            }
            else if (a.toLowerCase().endsWith(".flac") || a.toLowerCase().endsWith(".wav") || a.toLowerCase().endsWith(".mp3") || a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".avi") || a.toLowerCase().endsWith(".ogg") || a.toLowerCase().endsWith(".webm")){
                img.src = ui.icons.media
                file.ondblclick = () => {loadApp('wmplayer', undefined, path)}
            }
            else if (a.toLowerCase().endsWith(".html")){
                img.src = ui.icons.file
                file.ondblclick = () => {loadApp('iexplore', undefined, path)}
            }
            else if (a.toLowerCase().endsWith(".md")){
                img.src = ui.icons.file
                file.ondblclick = () => {loadScript("bin/mdviewer.js", [path])}
            }
            else if (a.toLowerCase().endsWith(".ca") || a.toLowerCase().endsWith(".js")){
                img.src = ui.icons.file
                file.ondblclick = () => {loadScript(path)}
            }
            else if (a.toLowerCase().endsWith(".wdl")){
                if (this.type === "grid"){
                    const shortcut = document.createElement("img")
                    shortcut.src = "./res/shortcut.png"
                    imgContainer.append(shortcut)
                }
                img.src = ui.icons.file
                const f = await fs.readFile(path, "utf8")
                let data
                try{data = JSON.parse(f)}
                catch(e){}
                if (data) if (data.type === "file"){
                    if (data.path.toLowerCase().endsWith(".js")){
                        file.ondblclick = () => {loadScript(data.path)}
                    }
                    if (data.icon){
                        img.src = data.icon
                    }
                }
                fileName = fileName.substring(0, fileName.lastIndexOf("."))
            }
            else {
                img.src = ui.icons.file
                file.ondblclick = () => {loadScript("bin/notepad.js", [path])}
            }
            file.append(imgContainer)
            const newfpath = (' ' + a).substring(1)
            file.ondragstart = async (e) => {
                e.dataTransfer.setData('winda-file', path)
            }
            file.oncontextmenu = (e) =>
                contextMenu(e, [
                    ['', 'Delete', () => fs.deleteFile(newfpath)],
                    ['./iframes/notepad/icon.png', 'Open with Notepad', () => loadScript("bin/notepad.js", [path])]
                ], e.clientX, e.clientY)
            file.onclick = (e) => {
                // selected.push(e.target)
                e.target.classList.add("selected")
            }
            file.innerHTML += fileName
            tempElement.append(file)
        }
        if (tempElement.innerHTML !== this.elem.innerHTML) {
            this.clear()
            this.elem.append(...tempElement.children)
        }
        this.onDirChange(this.currentFolder)
    }
    get items(){
        let arr = []
        for (let a of this.elem.children){
            arr.push(a.children[1].innerText)
        }
        return arr
    }
}
ui.ProgressBar = class{
    constructor(type){
        this.type = type
        const container = document.createElement("div")
        this.elem = container
        container.className = "progress-bar-container"
        container.style.width = "300px"
        container.style.margin = "10px"
        container.style.height = "20px"
        if (type) {
            const progress = document.createElement("div")
            progress.className = "progress-bar"
            const filledCont = document.createElement("div")
            filledCont.className = "progress-bar-filled-container"
            const filled = document.createElement("div")
            this.filled = filledCont
            filled.className = "progress-bar-filled"
            filledCont.append(filled)
            progress.append(filledCont)
            container.append(progress)
            this.percent = 0
        }
        else{
            const marquee = document.createElement("div")
            marquee.className = "progress-bar progress-bar-marquee"
            container.append(marquee)
        }
    }
    get percent(){
        return this._p
    }
    set percent(val){
        if (typeof val !== "number") throw new TypeError("Cannot assign a non-number value to a number parameter")
        this.filled.style.width = `calc(${val}% + ${Math.round(val / 100 * 17)}px)`
        this._p = val
    }
}
function createMenuBar(items){
    let menuBar = document.createElement("div")
    menuBar.className = "menubar"
    for (let a of Object.keys(items)){
        let menuBarElem = document.createElement("div")
        menuBarElem.className = "element"
        menuBarElem.menu = items[a]
        menuBarElem.innerText = a
        menuBar.append(menuBarElem)
        function menuBarAction(e){
            e.preventDefault()
            e.stopPropagation()
            menuBar.mouseDown = true;
            wm.activeMenuBar = menuBar
            menuBar.activeEl = e.target
            const dim = e.target.getBoundingClientRect()
            const el = menuBar.querySelector(".active")
            if (el) el.classList.remove("active")
            e.target.classList.add("active")
            contextMenu(e, e.target.menu, dim.x, dim.y + dim.height)
        }
        menuBarElem.onmousedown = menuBarElem.ontouchstart = menuBarAction
        menuBarElem.onmouseover = (e) => {
            const dim = e.target.getBoundingClientRect()
            if (menuBar.mouseDown) {
                contextMenuOff()
                menuBarAction(e)
            }
        }
    }
    return menuBar
}
function createElement(tagName, className, parentElem){
    const el = document.createElement(tagName)
    if (className) el.className = className
    if (parentElem) parentElem.append(el)
    return el
}