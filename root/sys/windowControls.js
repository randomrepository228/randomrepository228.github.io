
function windowMouseDown(event, elem, a, noResize){
    if(event.target != elem) return;
    if (event.type == "touchstart"){
        event.preventDefault();
    }
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
    activewindow.style.transform = ''
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
        if (!localStorage.noContentMove) return
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
        activewindow.style.bottom = ''
        activewindow.style.right = ''
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
    if (localStorage.noContentMove) return
    let activewindowcontent = activewindow.querySelector("text")
    let pheight = activewindowcontent.parentElement.style.minHeight;
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
            const height = e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 4 - 24
            activewindowcontent.style.height = height > +pheight.substring(0, pheight.length - 2) ? height + "px" : pheight
        }
        if(loop.top){
            activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
            const height = prevheight + origy - e.pageY - 20 + 20
            activewindowcontent.style.height = height > +pheight.substring(0, pheight.length - 2) ? height + "px" : pheight
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
            const height = 
            activewindowcontent.style.height = `${e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 4 - 24}px`
        }
        if(loop.top){
            activewindow.style.top = `${Math.trunc(e.clientY - prevy)}px`
            const height = prevheight + origy - e.pageY - 2 + 15
            activewindowcontent.style.height = height > +pheight.substring(0, pheight.length - 2) ? height + "px" : pheight
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
            const height = e.clientY - +activewindow.style.top.substring(0, activewindow.style.top.length - 2) - 1 - 24
            activewindowcontent.style.height = height > +pheight.substring(0, pheight.length - 2) ? height + "px" : pheight
        }
        if(loop.top){
            activewindow.style.top = `${e.clientY - prevy}px`
            const height = prevheight + origy - e.pageY + 2 - 24 + 20
            activewindowcontent.style.height = height > +pheight.substring(0, pheight.length - 2) ? height + "px" : pheight
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