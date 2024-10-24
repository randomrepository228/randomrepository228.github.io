//winda
function main(args){ return new Promise((res, rej) => {
    let el = document.createElement("div")
    el.style.height = "100%"
    el.style.overflow = "hidden"
    el.className = "control explorer-file-manager"
    let currentPath = ""
    let currentFolder = ""
    let fileView = new ui.FileView()
    async function onClose(){
        res("")
    }
    function saveFile(){
        let path;
        if (currentPath.startsWith("/")) path = currentPath.slice(1)
        else path = currentPath
        res(path + "/" + el.querySelector(".fileinput").value)
    }
    async function openFolder(folderPath){
        currentPath = folderPath
        let folderNames = folderPath.split("/")
        el.querySelector('.adressbar').innerHTML = ""
        let breadcrumb = document.createElement("div")
        breadcrumb.onclick = () => openFolder('')
        breadcrumb.innerText = "/"
        el.querySelector('.adressbar').appendChild(breadcrumb)
        breadcrumb = undefined
        let path = ""
        for (const a of folderPath.split("/")){
            if(!a) continue
            path += "/" + a
            breadcrumb = document.createElement("div")
            breadcrumb.onclick = () => openFolder(path)
            breadcrumb.innerText = a + "/"
            el.querySelector('.adressbar').appendChild(breadcrumb)
        }
        fileView.showContents(folderPath)
    }
    function back(){
        currentPath = ""
        openFolder("")
    }
    el.innerHTML = `<link rel="stylesheet" href="./iframes/explorer-file-manager/style.css">
        <link rel="stylesheet" href="./iframes/control/aero/style.css" id="explorerTheme">
        <div class="navbar topbar-ext">
            <div class="nav"><div class="backnext"><button class="back"></button><button disabled class="next"></button></div></div>
            <div class="adressbar"></div>
            <input type="text" id="searchbox" placeholder="Search in file explorer" onchange="fs.searchHTML(currentPath, this.value).then(renderDir);">
        </div>
        <div class="main" style="height: 100%">
            <div class="content">
                <div class="menubar">
                    <div class="element">View</div>
                </div>
            </div>
        </div>`
    el.querySelector("button.back").onclick = () => back()
    openFolder("")
    el.querySelector(".content").appendChild(fileView.elem)
    let win = AddWindow(new Winda7Window(0,0,"Save as", "", false), false, {noSelfOpen: true, width: 500, height: 500, window: true, noBorder: true, xOnly: true}, getId(), el, onClose)
})}