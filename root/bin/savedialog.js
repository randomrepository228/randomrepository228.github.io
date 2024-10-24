//winda
function main(args){ return new Promise((res, rej) => {
    let el = document.createElement("div")
    el.style.height = "100%"
    el.style.overflow = "hidden"
    el.className = "control explorer-file-manager"
    let currentPath = ""
    let currentFolder = ""
    async function onClose(){
        res("")
    }
    function saveFile(){
        let path;
        if (currentPath.startsWith("/")) path = currentPath.slice(1)
        else path = currentPath
        res(path + "/" + el.querySelector(".fileinput").value)
    }
    async function renderDir(files, fpath){
        currentFolder = fpath
        el.querySelector(".files").innerHTML = ""
        for (const a of files){
            if (a == ".") continue
            htmlPath = a
            a = a.replace("<marked>", "").replace("</marked>", "")
            let file = document.createElement("div")
            file.className = "file"
            let isfile = true
            if (a.startsWith("/")) {
                a = a.replace("/", "")
                htmlPath = htmlPath.replace("/", "")
            }
            if (!a.endsWith("./")){
                function xd(a){
                    file.onclick = () => el.querySelector(".fileinput").value = a
                }
                xd(a)
            }
            if (a.endsWith("/.")){
                a = a.replace("/.", "")
                htmlPath = htmlPath.replace("/.", "")
                isfile = false
                file.innerHTML += `<img src="./iframes/explorer-file-manager/folder.png">`
                a = currentPath + "/" + a
                function xd(a){
                file.ondblclick = () => openFolder(a)
                }
                xd(a)
            }
            else if (a.toLowerCase().endsWith(".png") || a.toLowerCase().endsWith(".jpg") || a.toLowerCase().endsWith(".gif") || a.toLowerCase().endsWith(".bmp") || a.toLowerCase().endsWith(".webp")){
                let length = 3;
                if (a.toLowerCase().endsWith(".webp")) length = 4
                a = currentPath + "/" + a
                let b;
                if(a.startsWith("/")) b = a.replace("/", "")
                const contents = await parent.fs.readFile(b)
                const url = URL.createObjectURL(new Blob([contents], {type: "image/" + a.substring(a.length - length, a.length)}))
                file.innerHTML += `<img src="${url}">`
                file.setAttribute("ondblclick", `parent.loadApp('paint', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".flac") || a.toLowerCase().endsWith(".wav") || a.toLowerCase().endsWith(".mp3") || a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".avi") || a.toLowerCase().endsWith(".ogg") || a.toLowerCase().endsWith(".webm")){
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./iframes/explorer-file-manager/media.png">`
                file.setAttribute("ondblclick", `parent.loadApp('wmplayer', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".html")){
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./iframes/explorer-file-manager/file.png">`
                file.setAttribute("ondblclick", `parent.loadApp('iexplore', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            else if (a.toLowerCase().endsWith(".ca") || a.toLowerCase().endsWith(".js")){
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./iframes/explorer-file-manager/file.png">`
                file.setAttribute("ondblclick", `parent.loadScript('${a.replace("\'", "\\\'")}')`)
            }
            else {
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./iframes/explorer-file-manager/file.png">`
                file.setAttribute("ondblclick", `parent.loadApp('notepad', undefined, '${a.replace("\'", "\\\'")}')`)
            }
            const newfpath = (' ' + a).substring(1)
            file.oncontextmenu = (e) => {
                e.stopPropagation(); 
                const elemoffset = frameElement.getBoundingClientRect();
                parent.contextMenu(e, [
                    ['', 'Delete', () => parent.fs.deleteFile(newfpath).then(openFolder(currentPath))],
                    ['./iframes/notepad/icon.png', 'Open with Notepad', () => parent.loadApp("notepad", "", newfpath)]
                ], e.clientX + elemoffset.x, e.clientY + elemoffset.y)
            }
            file.innerHTML += htmlPath
            el.querySelector(".files").append(file)
        }
    }
    async function openFolder(folderPath){
        currentPath = folderPath
        let folderNames = folderPath.split("/")
        el.querySelector('.adressbar').innerHTML = ""
        const root = document.createElement("div")
        root.onclick = () => openFolder("")
        root.innerHTML = "/"
        el.querySelector('.adressbar').append(root)
        let path = ""
        for (const a of folderPath.split("/")){
            function xd(a){
                if(!a) return
                path += "/" + a
                const root = document.createElement("div")
                root.onclick = () => openFolder(path)
                root.innerHTML = a + "/"
                el.querySelector('.adressbar').append(root)
            }
            xd(a)
        }
        let files = await parent.fs.readdir(folderPath)
        renderDir(files, folderPath)
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
                <div class="files"></div>
                <footer>
                    <div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 54px">Filename:&nbsp;</div>
                            <input type="text" name="" class="fileinput" style="flex-grow: 1">
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 54px">File type:&nbsp;</div>
                            <div class="select" style="flex-grow: 1">
                                <select name="" id="">
                                    <option value="">
                                        All files (*.*)
                                    </option>
                                </select>
                                <selecticon></selecticon>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end">
                        <button class="savebutton">
                            Save
                        </button>
                        <button class="cancelbutton">
                            Cancel
                        </button>
                    </div>
                </footer>
            </div>
        </div>`
    el.querySelector("button.back").onclick = () => back()
    let fileinputelement = el.querySelector(".fileinput")
    fileinputelement.oninput = () => {
        if(fileinputelement.value.includes('/')) {
            fileinputelement.value = fileinputelement.value.replace(/\//g, '')
        }
    }
    const fileView = el.querySelector(".files")
    fileView.oncontextmenu = (e) => {
        if (e.target !== fileView) return
        contextMenu(e, [
            ['', 'Refresh', () => openFolder(currentFolder)]
        ], e.clientX, e.clientY)
    }
    openFolder("")
    const wnd = new Winda7Window({
        title: "Save dialog", 
        icon: "",
        id: getId(), 
        layout: {
            titlebar: {
                buttons: {
                    close: true
                }
            },
            cont: el,
            hideTitle: true
        },
        aero: true,
        noFrame: true
    }, 500, 500)
    wnd.show()
    el.querySelector("button.savebutton").onclick = () => {
        wnd.onclose = saveFile
        wnd.close()
    }
    el.querySelector("button.cancelbutton").onclick = () => {
        wnd.onclose = onClose
        wnd.close()
    }
})}