async function boot(){
    let isSystemInstalled = await fs.exists("ver")
    if (isSystemInstalled) if ((await (await fs.readFile("ver")).text()) != "0.9.0.2") isSystemInstalled = false
    bootloader.style.width = "100%";
    bootloader.style.height = "100%";
    bootloader.style.overflow = "hidden";
    bootloader.style.backgroundColor = "black";
    bootloader.style.position = "relative";
    if(localStorage.verboseBoot == "true" || !isSystemInstalled) bootloader.innerHTML = `
    <div style="height: 100%;">
        <cntr style="color: black">${isSystemInstalled ? 'Loading Winda files' : 'Installing Winda'}</cntr><br>
        <div id="verboseBoot"></div>
        <cntr class="bottom"  style="color: black">
            <left>Please wait...</left>
            <right></right>
        </cntr>
    </div>`
    else bootloader.innerHTML = `
    <div style="text-align: center; font-family: sans-serif !important; position: absolute; height: calc(50% + 100px); top: calc(50% - 100px); width: 100%;">
        <video muted autoplay width="200px" height="200px" id="bootAnimation" preload="metadata">
            <source src="boot.webm" type="video/webm">
        </video>
        <p style="font-size: 20px; color: white; margin: 0; margin-top: 50px;">Loading Winda</p><br>
        <p style="font-size: 20px; color: gray; margin-left: 0; position: absolute; bottom: 20px; left: 50vw; transform: translateX(-50%);">By kitaes</p>
    </div>`
    if(!(localStorage.verboseBoot != "true" && !isSystemInstalled)) bootloader.style.padding = "0"
    async function log(path, noText){
        if(localStorage.verboseBoot == "true" || !isSystemInstalled) if(verboseBoot){
            if (noText){
                console.log(path + "<br>")
                verboseBoot.innerHTML += path + "<br>"
            }
            else{
                console.log("Loaded: " + path + "<br>")
                verboseBoot.innerHTML += "Loaded: " + path + "<br>"
            }
            verboseBoot.scrollTo(0, verboseBoot.scrollHeight);
        }
    }
    const bootFiles = ["sys/kernel.js", "sys/runscript.js", "sys/windowManager.js", "sys/windowControls.js", "shell/shell.js", "sys/trayManager.js", "sys/bcrypt.js"]
    let bootFileContents = {}
    async function execScript(file, a){
        if (!a) a = ""
        if (!file) console.log(a + " is not found")
        const evalCode = await file.text()
        console.log(evalCode)
        try{
            (1,eval)(evalCode)
            log(a)
        }
        catch(e){
            log(`${a} Failed to load`, true)
            console.log(e)
        }
    }
    if (!isSystemInstalled){
        log("Downloading files: <span class=\"bootloader-download-progress\">0</span>%", true)
        let file = false;
        var req = new XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.onreadystatechange = async function() {
            if (this.readyState == 4 && this.status == 200) {
                file = req.response;
                log("Loading JSZip...", true)
                let jszip = await fs.exists("sys/jszip.js")
                if (!jszip){
                    log("JSZip is not found, downloading JSZip...", true)
                    jszip = await (await fetch("sys/jszip.js")).text()
                    // await fs.writeFile("sys/jszip.js", jszip)
                }
                else{
                    jszip = await (await fs.readFile("sys/jszip.js")).text()
                }
                eval(jszip)
                const data = await JSZip.loadAsync(file)
                const entries = Object.entries(data.files)
                log(`Extracting files: <span class="nfiles-extracted">0</span>/${entries.length}`, true)
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
                    if (bootFiles.includes(key)){
                        bootFileContents[key] = fileContents
                    }
                    await fs.writeFile(key, fileContents)
                    n++
                    document.querySelector(".nfiles-extracted").innerText = n
                }
                for (let a of folders){
                    await fs.writeFile(a, "")
                }
                window.location.reload()
            }
        };
        req.onprogress = function(e) {
            console.log(e.loaded, e.total)
            document.querySelector(".bootloader-download-progress").innerText = Math.floor((e.loaded / e.total) * 1000) / 10
        };
        req.open("GET", "install.zip", true);
        req.send();
    }
    else{
        for (const a of bootFiles){
            const file = await fs.readFile(a)
            execScript(file, a)
        }
        dispatchEvent(new CustomEvent("sysloaded"))
    }
}
addEventListener("fsloaded", () => boot())