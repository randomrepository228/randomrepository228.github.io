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
    element.contentWindow.postMessage("id|" + element.parentElement.parentElement.parentElement.getAttribute("windowid"), "*")
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
    content = `<div style="margin: 20px;">${content}</div>`
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
        leftBar.querySelector(`.n${activewindow.getAttribute("windowid")}`).className += " focus"
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
    if (leftBar.querySelector(`.n${num}`)) {
        windowSelectHandler(getWnd(num))
        return;
    }
    if (!doNotShowTray){
        try{
            leftBar.innerHTML += `
            <div class="n${num} window-tray" windowid="${num}" onclick="parent.windowSelectHandler(parent.document.querySelector('.n${num}'))">
                <img src="${icon}" onerror="this.src = '../ExampleApp/icon.png'">
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
    }
    let window = document.querySelector(`.n${num}.window`)
    setActive(window, true)
    for (window of document.querySelectorAll(`.n${num}.window`))
        window.style.display = ""
}
function windowMouseDown(event, elem, a, noResize){
    if(elem.children[1].matches(":hover")) return;
    let touch = false;
    let evName;
    if(!elem.parentElement.getAttribute("notray")) setActive(elem.parentElement);
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
        loop.drag = false; 
        iframeignore.innerHTML = "";
        if (!noResize){
            if (e.clientX < 1) {snapLeft(activewindow); return}
            if (e.clientX > innerWidth - 2) {snapRight(activewindow); return}
            if (e.clientY < 1) maximise(activewindow)
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
    let activewindowcontent = activewindow.querySelector("text")
    if (e.touches) e = e.touches[0]
    if(loop.drag){
        activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
        if(activewindow.classList.contains("maximised") || activewindow.classList.contains("snap-right") || activewindow.classList.contains("snap-left")) {
            activewindow.className = activewindow.className.replace("maximised ", "");
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
} 
function snapLeft(window){
    window.className = window.className.replace("", "snap-left ")
}
function snapRight(window){
    window.className = window.className.replace("", "snap-right ")
}
addEventListener("resize", resizeHandler)
onmessage = (e) => {
    const commands = e.data.split("|")
    console.log(commands)
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
        let frame = wnd.lastElementChild.children[1].children[0].contentWindow
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
        leftBar.querySelector(`.n${id}.window-tray`).remove()
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
        window.className = window.className.replace("", "maximised ")
        window.className = window.className.replace("snap-right ", "")
        window.className = window.className.replace("snap-left ", "")
    }
    else
        window.className = window.className.replace("maximised ", "")
}
maximise = maximiseWindow
// OKNA 8 COMPATIBILITY MODE
function closemetroapp(appName){
    getAllWindows().forEach(val => {
        if (val.title == appName || val.title == `Message from Metro app`)
            closeWindow(val.id)
    })
}
function CloseMetroDialog(a){}