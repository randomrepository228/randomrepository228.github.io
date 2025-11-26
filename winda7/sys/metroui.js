winda.metroApps = {
    DESKTOP: {
        liveTile(el){
            el.style.background = "url(beta.jpg)"
            el.style.backgroundSize = "100% auto"
        }
    },
    ImmersiveControlPanel: {
        main(wnd){
            wnd.append(winda.createMetroSidebar("PC Settings", ["PC and devices", "Accounts"]))
            const main = winda.createDiv("main")
            wnd.append(main)
        },
        color: "rgb(81,51,171)",
        name: "PC Settings"
    }
}
winda.metroWindows = [winda.windowsEl]
winda.shownMetroWindow = {full: winda.windowsEl}
winda.activeMetroWindow = winda.windowsEl
const isStartMenuAnimated = true
winda.addStyle("sys/metroui.css")
const metroContainer = winda.createDiv("metroui-container")
document.body.append(metroContainer)
const metroFlyouts = winda.createDiv("metroui-flyouts")
document.body.prepend(metroFlyouts)
const startMenu = winda.createDiv("metroui-start-menu")
startMenu.style.display = "none"
const startMenuTitle = winda.createDiv("title")
startMenu.append(startMenuTitle)
const tileContainer = winda.createDiv("tile-container")
startMenu.append(tileContainer)
const metroStartButton = winda.createDiv("start-button")
metroStartButton.append(winda.createDiv("accent-color"))
metroStartButton.append(winda.createDiv("shine"))
metroStartButton.append(winda.createDiv("mask"))
metroFlyouts.append(metroStartButton)
winda.createMetroSidebar = (title, options, hasBackButton) => {
    const main = winda.createDiv("metroui-sidebar")
    const top = winda.createDiv("top")
    main.append(top)
    const topTitle = winda.createDiv("title")
    topTitle.textContent = title
    top.append(topTitle)
    for (const a of options){
        const option = winda.createDiv("option")
        option.textContent = a
        main.append(option)
    }
    return main
}
function showMetroWindow(){
    if (winda.shownMetroWindow.left && !winda.shownMetroWindow.right) {
        winda.shownMetroWindow.right = this
        this.style.width = "calc(50% - 11px)"
        this.style.left = "calc(50% + 11px)"
        this.pos = "right"
    }
    else if (winda.shownMetroWindow.right && !winda.shownMetroWindow.left) {
        winda.shownMetroWindow.left = this
        this.style.width = "calc(50% - 11px)"
        this.pos = "left"
    }
    else {
        if (winda.shownMetroWindow.left) winda.shownMetroWindow.left.hide()
        if (winda.shownMetroWindow.right) winda.shownMetroWindow.right.hide()
        if (winda.shownMetroWindow.full) winda.shownMetroWindow.full.hide()
        winda.shownMetroWindow.full = this
        winda.shownMetroWindow[this.pos] = undefined
        this.pos = "full"
    }
    winda.activeMetroWindow = this
    this.classList.add("show")
}
function delistMetroWindow(wnd){
    winda.shownMetroWindow[wnd.pos] = undefined
    if (!(winda.shownMetroWindow.left || winda.shownMetroWindow.right || winda.shownMetroWindow.full)) {
        windowSeparator.style.display = "none"
        winda.windowsEl.show()
    }
}
function hideMetroWindow(){
    delistMetroWindow(this)
    this.classList.remove("show")
}
function closeMetroWindow(){
    delistMetroWindow(this)
    for (const i in winda.metroWindows){
        if (winda.metroWindows[i] === this) {
            winda.metroWindows.splice(i, 1)
        }
    }
    this.remove()
}
winda.windowsEl.show = showMetroWindow
winda.windowsEl.hide = hideMetroWindow
winda.windowsEl.appName = "DESKTOP"
winda.windowsEl.pos = "full"
winda.windowsEl.classList.add("show")
winda.createMetroWindow = (appName) => {
    const window = winda.createDiv("metro-app")
    metroWindowContainer.append(window)
    const titleBarContainer = winda.createDiv("titlebar-container")
    window.append(titleBarContainer)
    const titleBarHoverHelper = winda.createDiv("titlebar-hover-helper")
    titleBarContainer.append(titleBarHoverHelper)
    const titleBar = winda.createDiv("titlebar hover")
    titleBarContainer.onpointerenter = () => {
        titleBar.classList.add("hover")
    }
    titleBarContainer.onpointerleave = () => {
        titleBar.classList.remove("hover")
    }
    titleBarContainer.append(titleBar)
    const titleBarIcon = document.createElement("img")
    titleBarIcon.src = `sys/metroapps/${appName}/headericon.png`
    titleBarIcon.className = "icon"
    titleBar.append(titleBarIcon)
    const title = winda.createDiv("title")
    title.textContent = winda.metroApps[appName].name
    titleBar.append(title)
    window.show = showMetroWindow
    window.hide = hideMetroWindow
    window.close = closeMetroWindow
    const closebtn = winda.createDiv("close")
    closebtn.onclick = () => window.close()
    titleBar.append(closebtn)
    const minimizebtn = winda.createDiv("minimize")
    minimizebtn.onclick = () => window.hide()
    titleBar.append(minimizebtn)
    let dim = window.getBoundingClientRect()
    function drag(e){
        window.classList.add("drag")
        window.style.setProperty("--pos", e.clientX - dim.x - (dim.width / 2) + "px")
        if (e.clientX < (innerWidth / 4) || e.clientX > (innerWidth / 4) * 3){
            windowSeparator.style.display = "block"
            windowSeparator.style.setProperty("--pos", "calc(50% - 11px)")
        }
        else{
            windowSeparator.style.display = "none"
        }
    }
    titleBar.onpointerdown = (e) => {
        winda.activeMetroWindow = window
        dim = window.getBoundingClientRect()
        if (e.target !== titleBar) return
        addEventListener("pointermove", drag)
        addEventListener("pointerup", (e) => {
            removeEventListener("pointermove", drag), {once: true}
            window.classList.remove("drag")
            if (e.clientX < (innerWidth / 4)){
                winda.activeMetroWindow.style.width = "calc(50% - 11px)"
                winda.activeMetroWindow.style.left = 0
                winda.activeMetroWindow.pos = "left"
                const s = winda.shownMetroWindow.left
                if (s) s.style.left = "calc(50% + 11px)"
                winda.shownMetroWindow.left = winda.activeMetroWindow
                winda.shownMetroWindow.right = s
            }
            else if (e.clientX > (innerWidth / 4) * 3){
                winda.activeMetroWindow.style.width = "calc(50% - 11px)"
                winda.activeMetroWindow.style.left = "calc(50% + 11px)"
                winda.activeMetroWindow.pos = "right"
                const s = winda.shownMetroWindow.right
                if (s) s.style.left = ""
                winda.shownMetroWindow.right = winda.activeMetroWindow
                winda.shownMetroWindow.left = s
            }
            else{
                winda.activeMetroWindow.style.width = ""
                winda.activeMetroWindow.style.left = ""
                windowSeparator.style.display = "none"
                winda.activeMetroWindow.pos = "full"
                winda.shownMetroWindow.full = winda.activeMetroWindow
                winda.shownMetroWindow.left = undefined
                winda.shownMetroWindow.right = undefined
            }
            if (winda.shownMetroWindow.left || winda.shownMetroWindow.right){
                const adj = winda.shownMetroWindow.left.getBoundingClientRect()
                if (winda.shownMetroWindow.left) winda.shownMetroWindow.left.style.left = ""
                if (winda.shownMetroWindow.right) winda.shownMetroWindow.right.style.left = (adj.w + 22) + "px"
            }
        }, {once: true})
    }
    const splash = winda.createDiv("splash")
    splash.style.setProperty("--image", `url(metroapps/${appName}/splash.png)`)
    splash.style.setProperty("--color", winda.metroApps[appName].color)
    window.append(splash)
    window.content = document.createElement("div")
    window.content.style.display = "none"
    window.content.hideSplash = function(){
        window.content.style.display = ""
        const anim = splash.animate([
            {opacity: 1},
            {opacity: 0},
        ], {duration: 200, iterations: 1})
        anim.onfinish = () => splash.style.display = "none"
    }
    window.content.className = "content"
    window.append(window.content)
    winda.metroWindows.push(window)
    window.appName = appName
    return window
}
const startScreenData = [
    [
        {
            "size": "wide",
            "title": "Desktop",
            "liveTile": true,
            "color1": "black",
            "color2": "black",
            "metroappname": "DESKTOP"
        },
    ],
    [
        {
            "size": "medium",
            "title": "PC Settings",
            "color1": "rgb(81,51,171)",
            "color2": "rgb(100,62,191)",
            "metroappname": "ImmersiveControlPanel",
        }
    ]
]
winda.execMetro = (appName) => {
    for (const a of winda.metroWindows){
        if (a.appName === appName) return a
    }
    const wnd = winda.createMetroWindow(appName)
    winda.metroApps[appName].main(wnd.content)
    return wnd
}
function createTile(tile){
    const tileEl = winda.createDiv("tile")
    tileEl.data = tile
    if (tile.size) tileEl.classList.add(tile.size)
    const tileTitle = winda.createDiv("title")
    tileTitle.textContent = tile.title
    tileEl.append(tileTitle)
    if (tile.liveTile) {
        const liveTile = winda.createDiv("livecontent")
        winda.metroApps[tile.metroappname].liveTile(liveTile)
        tileEl.append(liveTile)
    }
    else if (tile.metroappname) {
        const icon = document.createElement("img")
        icon.src = `./sys/metroapps/${tile.metroappname}/AppTile.png`
        tileEl.append(icon)
    }
    if (tile.metroappname){
        if (tile.metroappname === "DESKTOP"){
            tileEl.onclick = () => {
                winda.shell.startMenuClose()
                winda.windowsEl.show()
            }
        }
        else{
            tileEl.onclick = () => {
                if (!tileEl.parent){
                    if (tileEl.previousElementSibling) tileEl.prev = tileEl.previousElementSibling
                    else tileEl.first = true
                    tileEl.parent = tileEl.parentElement
                }
                const dim = tileEl.getBoundingClientRect()
                tileEl.style.left = dim.x + "px"
                tileEl.style.top = dim.y + "px"
                tileEl.classList.remove("tile")
                tileEl.classList.add("decoy-tile")
                metroContainer.append(tileEl)
                const screenRatio = {x: innerWidth / dim.width, y: innerHeight / dim.height}
                const tileTransform = `translate(${(-dim.x + (innerWidth / 2) - (dim.width / 2)) / 2}px, ${(-dim.y + (innerHeight / 2) - (dim.height / 2)) / 2}px) scale(${screenRatio.x / 2}, ${screenRatio.y / 2}) perspective(2000px) rotate3d(0,1,0,90deg)`
                const animation = tileEl.animate([
                    { transform: `translate(0) scale(1) perspective(2000px) rotate3d(0,1,0,0deg)` },
                    { transform: tileTransform},
                ], {duration: 250, iterations: 1, })
                const window = winda.execMetro(tile.metroappname)
                animation.onfinish = () => {
                    metroWindowContainer.style.display = ""
                    if (tileEl.first) tileEl.parent.prepend(tileEl)
                    else tileEl.prev.before(tileEl)
                    tileEl.classList.remove("decoy-tile")
                    tileEl.classList.add("tile")
                    tileEl.style.left = ""
                    tileEl.style.top = ""
                    window.show()
                    setTimeout(() => window.content.hideSplash(), 200)
                    const tileTransform2 = `translate(${dim.x - (innerWidth / 2) + (dim.width)}px, ${dim.y - (innerHeight / 2) + (dim.height)}px) scale(${1 / (screenRatio.x / 2)}, ${1 / (screenRatio.y / 2)}) perspective(2000px) rotate3d(0,1,0,-90deg)`
                    window.animate([
                        { transform: tileTransform2},
                        { transform: `translate(0) scale(1) perspective(2000px) rotate3d(0,1,0,0deg)` }
                    ], {duration: 250, iterations: 1})
                }
                winda.shell.startMenuClose(true)
            }
        }
    }
    tileEl.style.setProperty("--col-1", tile.color1)
    tileEl.style.setProperty("--col-2", tile.color2)
    return tileEl
}
for (const column of startScreenData){
    if (!column) continue
    const columnContainer = winda.createDiv("column")
    columnContainer.style.display = "none"
    for (const tile of column){
        const tileEl = createTile(tile)
        columnContainer.append(tileEl)
    }
    tileContainer.append(columnContainer)
}
metroContainer.append(startMenu)
const windowSeparator = winda.createDiv("window-separator")
windowSeparator.onpointerdown = (e) => {
    const o = (windowSeparator.getBoundingClientRect().x) - e.clientX
    function event(e){
        const sepPos = o + e.clientX
        windowSeparator.style.setProperty("--pos", sepPos + "px")
    }
    addEventListener("pointermove", event)
    addEventListener("pointerup", (e) => {
        if (e.clientX < 300){
            windowSeparator.style.display = "none"
            winda.shownMetroWindow.full = winda.shownMetroWindow.right
            winda.shownMetroWindow.full.style.left = ""
            winda.shownMetroWindow.full.style.width = ""
            winda.shownMetroWindow.full.pos = "full"
            winda.shownMetroWindow.left.hide()
            winda.shownMetroWindow.right = undefined
        }
        else if (e.clientX > (innerWidth - 300)){
            windowSeparator.style.display = "none"
            winda.shownMetroWindow.full = winda.shownMetroWindow.left
            winda.shownMetroWindow.full.style.left = ""
            winda.shownMetroWindow.full.style.width = ""
            winda.shownMetroWindow.full.pos = "full"
            winda.shownMetroWindow.right.hide()
            winda.shownMetroWindow.left = undefined
        }
        else{
            const sepPos = o + e.clientX
            if (winda.shownMetroWindow.left) winda.shownMetroWindow.left.style.width = sepPos + "px"
            if (winda.shownMetroWindow.right) {
                winda.shownMetroWindow.right.style.width = innerWidth - sepPos - 22 + "px"
                winda.shownMetroWindow.right.style.left = sepPos + 22 + "px"
            }
        }
        removeEventListener("pointermove", event)
    }, {once: true})
}
metroContainer.append(windowSeparator)
const metroWindowContainer = winda.createDiv("metroui-windows")
metroContainer.append(metroWindowContainer)
metroWindowContainer.append(winda.windowsEl)
winda.metroWindows.push({"name": "Desktop", "window": winda.windowsEl})
let columnInterval
winda.shell.startMenuOpen = () => {
    winda.shell.isStartMenuOpen = true
    const startButton = document.querySelector(".start-button-cont")
    startButton.classList.add("smo")
    function ssm(){startMenu.style.display = ""}
    if (isStartMenuAnimated) setTimeout(ssm, 150)
    else ssm()
    let counter = 0
    function columnAppear(){
        if (!tileContainer.children[counter]) {
            clearInterval(columnInterval)
            return
        }
        tileContainer.children[counter].style.display = ""
        counter++
    }
    columnInterval = setInterval(columnAppear, 100)
    metroWindowContainer.style.display = "none"
}
winda.shell.startMenuClose = (dontShowContainer) => {
    winda.shell.isStartMenuOpen = false
    const startButton = document.querySelector(".start-button-cont")
    function hsm(){
        startMenu.style.display = "none"
        startMenu.classList.remove("fade")
        clearInterval(columnInterval)
        for (const a of tileContainer.children){
            a.style.display = "none"
        }
        if (!dontShowContainer) metroWindowContainer.style.display = ""
        //if (isStartMenuAnimated) metroContainer.classList.add("fade")
    }
    function hsm2(){
        //metroContainer.style.display = "none"
        //metroContainer.classList.remove("fade")
    }
    if (isStartMenuAnimated){
        startMenu.classList.add("fade")
        setTimeout(hsm, 150)
    }
    else{
        startMenu.style.display = "none"
        //metroContainer.style.display = "none"
    }
    startButton.classList.remove("smo")
}
winda.shell.startMenuToggle = () => {
    console.log(winda.shell.isStartMenuOpen)
    if (winda.shell.isStartMenuOpen) winda.shell.startMenuClose()
    else winda.shell.startMenuOpen()
}
metroStartButton.onclick = winda.shell.startMenuToggle
const inactiveWindowList = winda.createDiv("windows-list")
inactiveWindowList.style.display = "none"
inactiveWindowList.onpointerleave = () => inactiveWindowList.style.display = "none"
metroContainer.append(inactiveWindowList)
const charmsBar = winda.createDiv("charms-bar")
charmsBar.style.display = "none"
charmsBar.onpointerleave = () => charmsBar.style.display = "none"
const itemList = ["search", "share", "start", "devices", "settings"]
winda.charmsbar = {
    search(){},
    share(){},
    start: winda.shell.startMenuToggle,
    devices(){},
    settings(){}
}
for (let i = 0; i < 5; i++){
    const item = Object.keys(winda.charmsbar)[i]
    const el = winda.createDiv("item")
    if (i == 2) el.classList.add("start")
    el.onclick = () => winda.charmsbar[item]()
    charmsBar.append(el)
    const image = winda.createDiv("image")
    image.style.setProperty("--url", `url(metroui/charmsbar-${item}.png)`)
    el.append(image)
    const text = winda.createDiv("text")
    text.textContent = item[0].toUpperCase() + item.slice(1)
    el.append(text)
}
metroFlyouts.append(charmsBar)
metroContainer.onpointermove = (e) => {
    if (e.clientY <= 5 || e.clientY >= innerHeight - 5){
        if (e.clientX <= 5){
            inactiveWindowList.style.display = ""

        }
        if (e.clientX >= innerWidth - 5){
            charmsBar.style.display = ""
        }
        console.log(e.clientX, innerWidth)
    }
}
//metroFlyouts.append(document.querySelector(".start-button-cont"))