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
        for (a of files){
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
            if (a.endsWith("/.")){
                a = a.replace("/.", "")
                htmlPath = htmlPath.replace("/.", "")
                isfile = false
                file.innerHTML += `<img src="./bin/explorer-file-manager/folder.png">`
                a = currentPath + "/" + a
                const str = (' ' + a).slice(1);
                file.ondblclick = () => openFolder(str)
            }
            else if (a.toLowerCase().endsWith(".png") || a.toLowerCase().endsWith(".jpg") || a.toLowerCase().endsWith(".gif") || a.toLowerCase().endsWith(".bmp") || a.toLowerCase().endsWith(".webp")){
                let length = 3;
                if (a.toLowerCase().endsWith(".webp")) length = 4
                a = currentPath + "/" + a
                let b;
                if(a.startsWith("/")) b = a.replace("/", "")
                const contents = await fs.readFile(b)
                const url = URL.createObjectURL(new Blob([contents], {type: "image/" + a.substring(a.length - length, a.length)}))
                console.log(url)
                file.innerHTML += `<img src="${url}">`
                file.setAttribute("ondblclick", `loadApp('paint', undefined, '${a.replace("\'", "\\\'")}')`)
                let str = (' ' + a).slice(1)
                str = str.split("/")
                str = str[str.length - 1]
                file.onmousedown = (event) => {el.querySelector(".fileinput").value = str}
                file.ontouchstart = (event) => {event.preventDefault();el.querySelector(".fileinput").value = str}
            }
            else if (a.toLowerCase().endsWith(".flac") || a.toLowerCase().endsWith(".wav") || a.toLowerCase().endsWith(".mp3") || a.toLowerCase().endsWith(".mp4") || a.toLowerCase().endsWith(".avi") || a.toLowerCase().endsWith(".ogg") || a.toLowerCase().endsWith(".webm")){
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./bin/explorer-file-manager/media.png">`
                file.setAttribute("ondblclick", `loadApp('wmplayer', undefined, '${a.replace("\'", "\\\'")}')`)
                let str = (' ' + a).slice(1)
                str = str.split("/")
                str = str[str.length - 1]
                file.onmousedown = (event) => {el.querySelector(".fileinput").value = str}
                file.ontouchstart = (event) => {event.preventDefault();el.querySelector(".fileinput").value = str}
            }
            else if (a.toLowerCase().endsWith(".html")){
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./bin/explorer-file-manager/file.png">`
                file.setAttribute("ondblclick", `loadApp('iexplore', undefined, '${a.replace("\'", "\\\'")}')`)
                let str = (' ' + a).slice(1)
                str = str.split("/")
                str = str[str.length - 1]
                file.onmousedown = (event) => {el.querySelector(".fileinput").value = str}
                file.ontouchstart = (event) => {event.preventDefault();el.querySelector(".fileinput").value = str}
            }
            else {
                a = currentPath + "/" + a
                file.innerHTML += `<img src="./bin/explorer-file-manager/file.png">`
                file.setAttribute("ondblclick", `loadApp('notepad', undefined, '${a.replace("\'", "\\\'")}')`)
                let str = (' ' + a).slice(1)
                str = str.split("/")
                str = str[str.length - 1]
                file.onmousedown = (event) => {el.querySelector(".fileinput").value = str}
                file.ontouchstart = (event) => {event.preventDefault();el.querySelector(".fileinput").value = str}
            }
            const newfpath = (' ' + a).substring(1)
            file.oncontextmenu = (e) => {
                e.stopPropagation(); 
                contextMenu(e, [
                    ['', 'Delete', () => fs.deleteFile(newfpath).then(openFolder(currentPath))]
                ], e.clientX, e.clientY)
            }
            file.innerHTML += "<p>" + htmlPath + "</p>"
            el.querySelector(".files").append(file)
        }
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
        for (a of folderPath.split("/")){
            if(!a) continue
            path += "/" + a
            breadcrumb = document.createElement("div")
            breadcrumb.onclick = () => openFolder(path)
            breadcrumb.innerText = a + "/"
            el.querySelector('.adressbar').appendChild(breadcrumb)
        }
        let files = await fs.readdir(folderPath)
        renderDir(files, folderPath)
    }
    function back(){
        currentPath = ""
        openFolder("")
    }
    el.innerHTML = `<link rel="stylesheet" href="./bin/explorer-file-manager/style.css">
        <link rel="stylesheet" href="./bin/control/aero/style.css" id="explorerTheme">
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
                <div class="files" oncontextmenu="(e) => { console.log('e')
                    e.stopPropagation(); 
                    contextMenu(e, [
                        ['', 'Refresh', () => openFolder(currentFolder)]
                    ], e.clientX, e.clientY)
                }"></div>
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
    openFolder("")
    let win = AddWindow(new Winda7Window(0,0,0,0,"Save as", "", false), false, {noSelfOpen: true, width: 500, height: 500, window: true, noBorder: true, xOnly: true}, getId(), el, onClose)
    el.querySelector("button.savebutton").onclick = () => {
        closeWindow(win.id, saveFile)
    }
    el.querySelector("button.cancelbutton").onclick = () => {
        closeWindow(win.id, onClose)
    }
})}