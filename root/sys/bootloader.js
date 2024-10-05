const boot = {
    log: function(msg){
        console.log(msg)
        verboseBoot.innerText += msg
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
    installImage: async function(imagePath){
        boot.logHTML("Downloading files: <span class=\"bootloader-download-progress\">0</span>%\n", true)
        let file = false;
        var req = new XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.onreadystatechange = async function() {
            if (this.readyState == 4 && this.status == 200) {
                file = req.response;
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
        };
        req.onprogress = function(e) {
            console.log(e.loaded, e.total)
            document.querySelector(".bootloader-download-progress").innerText = Math.floor((e.loaded / e.total) * 1000) / 10
        };
        if (boot.params.cachekiller){
            req.open("GET", "install.zip?" + Math.random().toString().replace(".", "e"), true);
        }
        else{
            req.open("GET", "install.zip");
        }
        req.send();
    },
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
        if(localStorage.verboseBoot == "false") bootloader.innerHTML = `
        <div style="text-align: center; font-family: sans-serif !important; position: absolute; height: calc(50% + 100px); top: calc(50% - 100px); width: 100%;">
            <video muted autoplay width="200px" height="200px" id="bootAnimation" preload="metadata">
                <source src="boot.webm" type="video/webm">
            </video>
            <p style="font-size: 20px; color: white; margin: 0; margin-top: 50px;">Loading Winda</p><br>
            <p style="font-size: 20px; color: gray; margin-left: 0; position: absolute; bottom: 20px; left: 50vw; transform: translateX(-50%);">By kitaes</p>
        </div>`
        boot.log("Loading Filesystem\n")
        await loadScriptOnline("sys/fs.js")
        await fs.waitUntilInit()
        let isSystemInstalled = await fs.exists("ver")
        if (isSystemInstalled) if ((await (await fs.readFile("ver")).text()) != "1.0") isSystemInstalled = false
        const bootFiles = ["sys/kernel.js", "sys/runscript.js", "sys/windowManager.js"]
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
        if (!isSystemInstalled){
            await boot.installImage()
        }
        for (const a of bootFiles){
            await boot.execFile(a)
        }
        dispatchEvent(new CustomEvent("sysloaded"))
    }
}
Object.freeze(boot)
boot.init()