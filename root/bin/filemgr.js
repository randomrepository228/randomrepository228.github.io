//winda
function main(args){ return new Promise((res, rej) => {
    let el = document.createElement("div")
    el.style.height = "100%"
    el.style.overflow = "hidden"
    el.className = "control explorer-file-manager"
    el.innerHTML = `<link rel="stylesheet" href="./iframes/explorer-file-manager/style.css">
        <link rel="stylesheet" href="./iframes/control/aero/style.css" id="explorerTheme">
        <div class="navbar topbar-ext">
            <div class="nav"><div class="backnext"><button class="back"></button><button disabled class="next"></button></div></div>
            <div class="adressbar"></div>
            <input type="text" id="searchbox" placeholder="Search in file explorer" onchange="fs.searchHTML(currentPath, this.value).then(renderDir);">
        </div>
        <div class="main">
            <div class="content" style="display: flex; flex-direction: column">
                <div class="menubar">
                    <div class="element">View</div>
                </div>
            </div>
        </div>`
    el.querySelector("button.back").onclick = () => back()
    const fileView = new ui.FileView()
    fileView.elem.style.flex = "1"
    let currentPath = ""
    const adressbar = el.querySelector('.adressbar')
    function createBreadcrumb(name, onclick){
        const breadcrumb = document.createElement("div")
        breadcrumb.innerText = name
        breadcrumb.onclick = onclick
        adressbar.append(breadcrumb)
    }
    function changeNav(folderPath){
        currentPath = folderPath
        adressbar.innerHTML = ""
        createBreadcrumb("/", () => fileView.showContents(''))
        let path = ""
        for (const a of folderPath.split("/")){
            if(!a) continue
            path += "/" + a
            createBreadcrumb(a, () => fileView.showContents(path))
        }
    }
    function back(){
        fileView.showContents("")
    }
    fileView.onDirChange = (dir) => changeNav(dir)
    fileView.showContents("")
    el.querySelector(".content").append(fileView.elem)
    const wnd = new Winda7Window({
        title: "Winda Explorer", 
        id: getId(),
        icon: "./bin/filemgr.png",
        layout: {
            titlebar: {
                buttons: {
                    close: true,
                    min: true,
                    max: true
                }
            },
            cont: el,
            hideTitle: true
        },
        height: 300,
        width: 500,
        aero: true,
        noFrame: true,
    })
    //wnd.onclose = onClose
    wnd.show()
})}