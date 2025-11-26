window.winda = {
    branding: "Winda7Core",
    versionOverride: "v0.0.1",
    processes: [],
    // constants
    TITLEBAR: 1,
    FRAME:    2,
    MINBTN:   4,
    MAXBTN:   8,
    CLOSEBTN: 16,
    ALLBTN:   28,
    NOTRAY:   32,
    //
    windowsEl: document.createElement("div"),
    windows: [],
    activeWindow: undefined,
    wmActivity: 0,
    wmData: {},
    clickEvent(e){
        if (e.target.className === "titlebar"){
            winda.activeWindow = e.target.window
            winda.wmActivity = 1
            const dim = winda.activeWindow.elem.getBoundingClientRect()
            winda.wmData.offsetX = e.pageX - dim.x
            winda.wmData.offsetY = e.pageY - dim.y
        }
    },
    moveEvent(e){
        if (winda.wmActivity === 1){
            winda.activeWindow.setX(e.pageX - winda.wmData.offsetX)
            winda.activeWindow.setY(e.pageY - winda.wmData.offsetY)
            winda.activeWindow.elem.style.bottom = ""
            winda.activeWindow.elem.style.right = ""
        }
    },
    releaseEvent(e){
        winda.wmActivity = 0
    },
    dispatchEvent(type, dict){
        const event = new Event(type)
        Object.assign(event, dict)
        dispatchEvent(event)
    },
    createDiv(className){
        const el = document.createElement("div")
        el.className = className
        return el
    },
    Application: class{

    },
    WindowClass: class{
        constructor(title, options){
            this.elem = winda.createDiv("winda-window unminimized")
            this.elem.style.visibility = "collapse"
            this.options = options
            this.eventListeners = []
            winda.windowsEl.append(this.elem)
            if (options & winda.TITLEBAR){
                this.elem.classList.add("has-titlebar")
                this.titlebar = winda.createDiv("titlebar")
                this.titlebar.innerText = title
                this.titlebar.window = this
                this.elem.append(this.titlebar)
            }
            this.title = title
            if (options & winda.ALLBTN){
                this.actionButtons = winda.createDiv("buttons")
                const buttons = [[winda.MINBTN, "min", () => {}], [winda.MAXBTN, "max", () => {}], [winda.CLOSEBTN, "close", () => this.close()]]
                for (const a of buttons){
                    if (!(options & a[0])) continue
                    const button = winda.createDiv(a[1])
                    button.onclick = a[2]
                    this.actionButtons.append(button)
                }
                this.titlebar.append(this.actionButtons)
            }
            if (options & winda.FRAME){
                this.elem.classList.add("thickframe")
            }
            this.content = winda.createDiv("content")
            this.elem.append(this.content)
            winda.windows.push(this)
            this.id = winda.windows[winda.windows.length-1]
        }
        show(){
            this.elem.style.visibility = ""
            winda.activeWindow = this
            winda.dispatchEvent("windowevent", {eventType: "show", window: this})
        }
        hide(){
            this.elem.style.visibility = "collapse"
            winda.activeWindow = undefined
            winda.dispatchEvent("windowevent", {eventType: "close", window: this})
        }
        close(){
            this.elem.remove()
            winda.windows.splice(winda.windows.indexOf(this), 1)
            for (const a of this.eventListeners){
                window.removeEventListener(...a)
            }
            winda.dispatchEvent("windowevent", {eventType: "close", window: this})
        }
        setTitle(title){
            this.title = title
            if (this.titlebar) this.titlebar.innerText = title
            winda.dispatchEvent("windowevent", {eventType: "titleChange", window: this})
        }
        setX(x){
            this.x = x
            this.elem.style.left = x + "px"
        }
        setY(y){
            this.y = y
            this.elem.style.top = y + "px"
        }
        setWidth(width){
            this.width = width
            this.content.style.width = width + "px"
        }
        setHeight(height){
            this.height = height
            this.content.style.height = height + "px"
        }
        addEventListener(...args){
            window.addEventListener(...args)
            this.eventListeners.push(args)
        }
    },
    loadedStyles: [],
    addStyle(href){
        for (const a of this.loadedStyles) {
            if (a.href === href) return
        }
        const s = document.createElement("link")
        s.rel = "stylesheet"
        s.href = href
        s.ohref = href
        document.head.append(s)
        this.loadedStyles.push(s)
        boot.log(`${href} Loaded\n`)
    },
    clearStyle(href){
        for (const a of this.loadedStyles) {
            if (a.ohref === href) {
                a.remove()
                this.loadedStyles.splice(w.loadedStyles.indexOf(a), 1)
                return
            }
        }
    },
    locale: {
        
    },
    shell: {

    },
    async exec(file, args){
        if (this.apps[file]) {
            await this.apps[file](args)
            return
        }
        return 1
    },
    async shellExec(file){
        const args = file.split(" ")
        await this.exec(file, args)
    },
    msgbox(title, content){ return new Promise((res, rej) => {
        const wnd = new winda.WindowClass(title, winda.TITLEBAR | winda.FRAME)
        wnd.content.classList.add("winda-msgbox")
        const text = document.createElement("text")
        text.innerText = content
        wnd.content.append(text)
        const okButton = document.createElement("button")
        okButton.innerText = "OK"
        okButton.onclick = () => {
            wnd.close()
            res()
        }
        const footer = document.createElement("footer")
        footer.append(okButton)
        wnd.content.append(footer)
        wnd.show()
        const contentDim = wnd.content.getBoundingClientRect()
        const windowDim = wnd.elem.getBoundingClientRect()
        wnd.width = contentDim.width
        wnd.x = (innerWidth / 2) - (windowDim.width / 2)
        wnd.y = (innerHeight / 2) - (windowDim.height / 2)
    })},
    apps: {
        async run(){
            const wnd = new winda.WindowClass("Run", winda.TITLEBAR | winda.FRAME | winda.ALLBTN)
            wnd.elem.style.bottom = "5px"
            wnd.x = 5
            wnd.setWidth(227)
            wnd.setHeight(95)
            wnd.content.classList.add("winda-run")
            const main = wnd.content
            const input = document.createElement("input")
            Object.assign(input.style, {left: "42px", top: "11px", width: "182px", height: "18px",})
            main.append(input)
            const okButton = document.createElement("button")
            okButton.innerText = "OK"
            okButton.onclick = async () => {
                if (!input.value){return}
                wnd.hide()
                if (await winda.exec(input.value)) {
                    await winda.msgbox("Error", "This program is not a part of " + winda.branding + "\nAvailable programs: " + Object.keys(this).join(", "))
                    wnd.show()
                    return
                }
                wnd.close()
            }
            main.append(okButton)
            wnd.show()
        },
        async shell(){
            if (winda.windowsEl.querySelector(".winda-taskbar")) {
                await winda.msgbox("Error", "The shell is already running")
                return
            }
            const wnd = new winda.WindowClass("Winda Core Shell", winda.NOTRAY)
            wnd.content.remove()
            wnd.elem.className = "content winda-taskbar bottom"
            const startButton = winda.createDiv("start-button-cont")
            startButton.append(winda.createDiv("start-button"))
            const startButtonText = winda.createDiv("start-button-text")
            startButtonText.textContent = "Start"
            startButton.append(startButtonText)
            winda.shell.startMenuOpen = () => this.run
            winda.shell.startMenuClose = () => {}
            startButton.onclick = () => winda.shell.startMenuOpen()
            const trays = []
            wnd.elem.append(startButton)
            addEventListener("windowevent", (e) => {
                if (e.window.options & winda.NOTRAY) return
                if (e.eventType === "show"){
                    const tray = winda.createDiv("left-tray")
                    console.log(e.window)
                    tray.innerText = e.window.title
                    trays.push({tray, id: e.window.id})
                    wnd.elem.append(tray)
                }
                else if (e.eventType === "close"){
                    for (const tray of trays){
                        if (tray.id === e.window.id){
                            tray.tray.remove()
                            trays.splice(trays.indexOf(tray.tray))
                        }
                    }
                }
                else if (e.eventType === "titleChange"){
                    for (const tray of trays){
                        if (tray.id === e.window.id){
                            tray.tray.innerText = e.window.title
                        }
                    }
                }
            })
            wnd.show()
            boot.log("Shell was loaded\n")
        },
        async wallpaper(){
            const wnd = new winda.WindowClass("Winda Core Wallpaper Host", winda.NOTRAY)
            wnd.content.remove()
            wnd.elem.style.background = "url(beta.jpg)"
            wnd.elem.style.position = "absolute"
            wnd.elem.style.inset = "0"
            wnd.elem.style.bottom = "calc(var(--taskbar-height-horizontal) * -1)"
            wnd.show()
        }
    },
    async init(){
        this.apps.exec = this.exec
        boot.log(`Starting ${this.branding} ${boot.ver ? boot.ver : this.versionOverride}\n`)
        onpointerdown = this.clickEvent
        onpointermove = this.moveEvent
        onpointerup = this.releaseEvent
        this.addStyle("sys/wm.css")
        this.addStyle("sys/sysapps.css")
        this.addStyle("sys/aero.css")
        this.windowsEl.className = "winda-windows"
        document.body.append(this.windowsEl)
        bootloader.style.display = "none"
        await this.apps.wallpaper()
        await this.apps.shell()
        dispatchEvent(new Event("sysloaded"))
        boot.log("Starting Metro UI\n")
        await boot.execFile("sys/metroui.js")
        this.sysloaded = true
    }
}
boot.log("Kernel was loaded\n")
winda.init()