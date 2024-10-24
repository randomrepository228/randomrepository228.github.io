const boot = {
    log: function(msg){
        console.log(msg)
        verboseBoot.innerHTML += msg
        verboseBoot.scrollTo(0, verboseBoot.scrollHeight);
    },
    logHTML: function(msg){
        console.log(msg)
        verboseBoot.innerHTML += msg
        verboseBoot.scrollTo(0, verboseBoot.scrollHeight);
    },
    exec: async function(file, a){
        if (!a) a = ""
        if (!file) console.log(a + " is not found")
        const evalCode = await file.text()
        try{
            (1,eval)(evalCode)
        }
        catch(e){
            boot.log(`${a} Failed to load`)
            boot.log(e)
            console.error(e)
            return 1
        }
    },
    execFile: async function(a){
        const file = await fs.readFile(a)
        if (await boot.exec(file, a)){
            hasSystemError = true
        }
    },
    installImage: function(imagePath){ return new Promise(async(res, rej) => {
        if (!imagePath) imagePath = "install.zip"
        boot.logHTML("Downloading files: <span class=\"bootloader-download-progress\"></span>\n", true)
        let file = false;
        var req = new XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.onreadystatechange = async function() {
            if (this.readyState == 4 && this.status == 200) {
                file = req.response;
                if (boot.params.decompress === "jszip" || true) {
                    boot.log("Loading JSZip...\n", true)
                    let jszip = await fs.exists("sys/jszip.js")
                    if (!jszip){
                        boot.log("JSZip is not found, downloading JSZip...\n", true)
                        jszip = await (await fetch("sys/jszip.js")).text()
                        // await fs.writeFile("sys/jszip.js", jszip)
                    }
                    else{
                        jszip = await (await fs.readFile("sys/jszip.js")).text()
                    }
                    eval(jszip)
                    const data = await JSZip.loadAsync(file)
                    const entries = Object.entries(data.files)
                    boot.logHTML(`Extracting files: <span class="nfiles-extracted">0</span>/${entries.length}\n`, true)
                    let n = 0
                    let folders = []
                    for (let [key, value] of entries){
                        let match = key.match(/(.+\/).*$/)
                        if (match) if (match.length > 1) match = match[1] + "."
                        if (!folders.includes(match)){
                            if (match)
                                folders.push(match)
                        }
                        const fileContents = new Blob([await value.async("arraybuffer")])
                        await fs.writeFile(key, fileContents)
                        n++
                        document.querySelector(".nfiles-extracted").innerText = n
                    }
                    for (let a of folders){
                        await fs.writeFile(a, "")
                    }
                }
                else{
                    // i have no clue how to use this shit
                    boot.log("Loading FFlate...\n", true)
                    let jszip = await fs.exists("sys/fflate.js")
                    if (!jszip){
                        boot.log("FFlate is not found, downloading FFlate...\n", true)
                        jszip = await (await fetch("sys/fflate.js")).text()
                        // await fs.writeFile("sys/jszip.js", jszip)
                    }
                    else{
                        jszip = await (await fs.readFile("sys/fflate.js")).text()
                    }
                    eval(jszip)
                    const data = await JSZip.loadAsync(file)
                    const entries = Object.entries(data.files)
                    boot.logHTML(`Extracting files: <span class="nfiles-extracted">0</span>/${entries.length}\n`, true)
                    let n = 0
                    let folders = []
                    for (let [key, value] of entries){
                        let match = key.match(/(.+\/).*$/)
                        if (match) if (match.length > 1) match = match[1] + "."
                        if (!folders.includes(match)){
                            if (match)
                                folders.push(match)
                        }
                        const fileContents = new Blob([await value.async("arraybuffer")])
                        await fs.writeFile(key, fileContents)
                        n++
                        document.querySelector(".nfiles-extracted").innerText = n
                    }
                    for (let a of folders){
                        await fs.writeFile(a, "")
                    }
                }
                res()
            }
        };
        req.onprogress = function(e) {
            const loaded = Math.floor(e.loaded / 10000) / 100 + "MB"
            const total = Math.floor(e.total / 10000) / 100 + "MB"
            document.querySelector(".bootloader-download-progress").innerText = loaded + "/" + total
        };
        if (boot.params.cachekiller){
            req.open("GET", imagePath + "?" + Math.random().toString().replace(".", "e"), true);
        }
        else{
            req.open("GET", imagePath);
        }
        req.send();
    })},
    params: Object.fromEntries(new URLSearchParams(location.search)),
    init: async function(){
        function loadScriptOnline(src){ 
            return new Promise(async (resolve, reject) => {
                let i = document.createElement('script')
                i.src = src
                document.body.append(i)
                i.onload = resolve
                i.onerror = () => {
                    boot.log(`${src} Failed to load`, true)
                    boot.log(e, true)
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
        await fs.waitUntilInit()
        let isSystemInstalled = await fs.exists("ver")
        if (isSystemInstalled) if ((await (await fs.readFile("ver")).text()) != await (await fetch("./ver")).text()) isSystemInstalled = false
        const bootFiles = ["sys/kernel.js", "sys/runscript.js", "sys/windowManager.js"]
        if (!isSystemInstalled){
            await boot.installImage()
        }
        if ('serviceWorker' in navigator && !boot.params.debug) {
            let swUrl = "./serviceWorker.js"
            // if (await fs.exists("sys/serviceWorker.js")) {
            //     swUrl = URL.createObjectURL(await fs.readFile("sys/serviceWorker.js"))
            // }
            let reg;
            for (const a of await navigator.serviceWorker.getRegistrations()){
                if (a.scope === location.origin + location.pathname) {
                    reg = a
                    boot.log("Service worker found: " + reg.scope + "\n")
                }
            }
            if (!reg) {
                reg = await navigator.serviceWorker.register(swUrl);
                boot.log("Service worker registered: " + reg.scope + "\n")
            }
            reg = await navigator.serviceWorker.ready;
            console.log(reg)
            const sw = reg.active
            const channel = new BroadcastChannel('sw-log');
            const fsRequests = new BroadcastChannel('sw-fs')
            navigator.serviceWorker.onmessage = async(e) => {
                const fullPath = e.data + ""
                let path = fullPath.replace(reg.scope, "")
                if (!path) path = "index.html"
                if (await fs.exists(path)) {
                    console.log(fullPath)
                    sw.postMessage({url: fullPath, data: await fs.readFile(path)})
                }
                else{
                    console.log(fullPath)
                    sw.postMessage({url: fullPath, data: false})
                }
            }
            channel.postMessage("hi!")
            channel.onmessage = (e) => {
                console.log("Message from service worker: ", e.data)
            }
            addEventListener("beforeunload", (e) => channel.postMessage("bye!"))
        }
        if (boot.params.debug) {
            boot.log("Debug mode is on, using online files\n")
            for (const a of bootFiles){
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
        for (const a of bootFiles){
            await boot.execFile(a)
        }
        dispatchEvent(new CustomEvent("sysloaded"))
    }
}
Object.freeze(boot)
boot.init()