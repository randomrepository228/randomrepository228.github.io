fs = {}
let db;
isFsLoaded = false
function sleep(milliseconds){
    return new Promise(res => setTimeout(res, milliseconds))
}
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.getStorage = async function(){
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    return {usedSpace: usedSpace, totalSpace: totalSpace}
}
const boot = {
    firstBoot: false,
    log: function(...msg){
        console.log(...msg)
        verboseBoot.append(...msg)
        bootloader.scrollTo(0, verboseBoot.scrollHeight);
    },
    exec: async function(file, a){
        if (!a) a = ""
        if (!file) console.log(a + " is not found")
        const evalCode = file
        try{
            (1,eval)(evalCode)
        }
        catch(e){
            boot.log(`${a} Failed to load\n`)
            boot.log(e)
            boot.log("\n")
            throw e
        }
        boot.log(a + " Loaded\n")
    },
    execFile: async function(a){
        const file = await fs.readFile(a, "utf-8")
        if (await boot.exec(file, a)){
            hasSystemError = true
        }
    },
    bootFiles: {"sys/kernel.js": undefined, "sys/runscript.js": undefined, "sys/windowManager.js": undefined, "sys/jszip.js": undefined},
    installImage: async function(imagePath, onprogress){
        boot.firstBoot = true
        if (!imagePath) imagePath = "install.zip" + (boot.params.cachekiller ? "?" + Math.random() : "")
        let file = false;
        const slf = this
        boot.log("Downloading FFlate...\n")
        eval(await (await fetch("sys/fflate.js")).text())
        const fileQueue = {}
        const dirList = []
        const unzip = new fflate.Unzip();
        unzip.register(fflate.AsyncUnzipInflate);
        const decompFiles = document.createElement("span")
        decompFiles.append("0")
        dFiles = 0
        const totalFiles = document.createElement("span")
        totalFiles.append("0")
        tFiles = 0
        boot.log("Decompressed files: ", decompFiles, "/", totalFiles, "\n")
        unzip.onfile = (file) => {
            if (onprogress) onprogress({"type": "file", "data": dFiles})
            const pDir = file.name.substring(0, file.name.lastIndexOf("/") + 1) + "."
            if (!dirList.includes(pDir)){
                dirList.push(pDir)
            }
            if (file.name.endsWith("/empty")) return
            const fileData = []
            file.ondata = (err, data, end) => {
                fileData.push(data)
                if (end){
                    if (file.name === "fileAmount"){
                        const amount = +(new TextDecoder().decode(data))
                        if (onprogress) onprogress({"type": "fileAmount", "data": amount})
                        tFiles = amount
                        return
                    }
                    fileQueue[file.name] = new Blob(fileData)
                    dFiles++
                    decompFiles.innerText = dFiles
                }
            }
            totalFiles.innerText = tFiles
            tFiles++
            file.start()
        }
        const fileStream = await fetch(imagePath);
        const fileSize = +fileStream.headers.get("Content-Length")
        if (onprogress) onprogress({"type": "size", "data": fileSize})
        const progress = {total: fileSize, loaded: 0}
        const loaded = document.createElement("span")
        boot.log("Downloading system image: ", loaded, "/" + Math.floor(progress.total / 10000) / 100 + "MB\n")
        const reader = fileStream.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            unzip.push(value ? value : new Uint8Array(), done)
            progress.loaded += done ? 0 : value.length
            if (onprogress) onprogress({"type": "download", "data": progress.loaded})
            loaded.innerText = Math.floor(progress.loaded / 10000) / 100
            if (done) break
        }
        for (const a of dirList){
            fileQueue[a] = ""
        }
        await fs.batchWrite(Object.entries(fileQueue))
        if (onprogress) onprogress({"type": "end"})
        const ver = await fs.readFile("ver", "utf-8")
        boot.ver = ver
    },
    params: Object.fromEntries(new URLSearchParams(location.search)),
    init: async function(){
        NodeList.prototype.indexOf = Array.prototype.indexOf
        function loadScriptOnline(src){ 
            return new Promise(async (resolve, reject) => {
                let i = document.createElement('script')
                i.src = src
                document.body.append(i)
                i.onload = resolve
                i.onerror = (e) => {
                    boot.log(`${src} Failed to load`)
                    boot.log(e)
                    console.error(e)
                    reject()
                }
            })
        }
        // if(localStorage.verboseBoot == "false") bootloader.innerHTML = `
        // <div style="text-align: center; font-family: sans-serif !important; position: absolute; height: calc(50% + 100px); top: calc(50% - 100px); width: 100%;">
        //     <video muted autoplay width="200px" height="200px" id="bootAnimation" preload="metadata">
        //         <source src="boot.webm" type="video/webm">
        //     </video>
        //     <p style="font-size: 20px; color: white; margin: 0; margin-top: 50px;">Loading Winda</p><br>
        //     <p style="font-size: 20px; color: gray; margin-left: 0; position: absolute; bottom: 20px; left: 50vw; transform: translateX(-50%);">By kitaes</p>
        // </div>`
        boot.log("Loading Filesystem\n")
        await loadScriptOnline("sys/fs.js")
        const ua = navigator.userAgent.toLowerCase()
        if ((ua.includes("firefox") || (ua.includes("gecko") && !ua.includes("like gecko")) || !navigator.storage.getDirectory) || true){
            await loadScriptOnline("sys/idbfs.js")
        }
        else{
            await loadScriptOnline("sys/opfs.js")
        }
        await fs.waitUntilInit()
        let isSystemInstalled = await fs.exists("ver")
        if (isSystemInstalled) {
            const ver = await fs.readFile("ver", "utf-8")
            if (ver.startsWith("v")) boot.ver = ver
            else isSystemInstalled = false
        }
        if (!isSystemInstalled){
            await boot.installImage()
        }
        if (boot.params.debug) {
            boot.log("Debug mode is on, using online files\n")
            for (const a of Object.keys(boot.bootFiles)){
                let src;
                if (boot.params.cachekiller){
                    await loadScriptOnline(a + "?" + Math.random().toString().replace(".", "e"))
                }
                else{
                    await loadScriptOnline(a)
                }
            }
            dispatchEvent(new CustomEvent("sysloaded"))
            return
        }
        for (const a of Object.keys(this.bootFiles)){
            if (this.bootFiles[a]) await boot.exec(this.bootFiles[a], a)
            else await boot.execFile(a)
        }
        dispatchEvent(new CustomEvent("sysloaded"))
    }
}
boot.init()