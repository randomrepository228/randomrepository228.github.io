async function main(args){
    
    const newVer = await (await fetch("./ver")).text()
    if (boot.ver === newVer) return 1
    const el = document.createElement("div")
    const text = document.createElement("div")
    text.style.whiteSpace = "pre"
    text.style.padding = "10px"
    text.innerText = 
`A new version of Winda7 is available

Old Version: ${boot.ver}
New Version: ${newVer}

In order to upgrade to a new version, press Upgrade
If you don't want to upgrade yet, press Remind me later`
    const wnd = new Winda7Window({
        title: "Winda Update", 
        icon: "./bin/update.png", 
        id: getId(),
        layout: {
            titlebar: {
                buttons: {
                    close: true
                }
            },
            cont: el
        },
        noResize: true,
        width: 330,
        aero: true
    })
    const updateProgress = document.createElement("div")
    updateProgress.style.padding = "10px"
    updateProgress.style.display = "none"
    updateProgress.append("Download progress: ")
    const loaded = document.createElement("span")
    loaded.innerText = "0"
    updateProgress.append(loaded)
    updateProgress.append("MB/")
    const total = document.createElement("span")
    total.innerText = "?"
    let totalDownload
    updateProgress.append(total)
    updateProgress.append("MB")
    const downloadProgress = new ui.ProgressBar(1)
    downloadProgress.elem.style.marginLeft = "0"
    updateProgress.append(downloadProgress.elem)
    updateProgress.append("Extracted files: ")
    const ef = document.createElement("span")
    ef.innerText = "0"
    updateProgress.append(ef)
    updateProgress.append("/")
    const tf = document.createElement("span")
    tf.innerText = "?"
    let totalFiles
    updateProgress.append(tf)
    const fileProgress = new ui.ProgressBar(1)
    fileProgress.elem.style.marginLeft = "0"
    updateProgress.append(fileProgress.elem)
    async function onprogress(e){
        if (e.type === "size") {
            total.innerText = Math.floor(e.data / 10000) / 100
            totalDownload = e.data
        }
        if (e.type === "fileAmount") {
            tf.innerText = e.data
            totalFiles = e.data
            console.log(tf, tf.innerText)
        }
        if (e.type === "download") {
            loaded.innerText = Math.floor(e.data / 10000) / 100
            if (totalDownload) downloadProgress.percent = e.data / totalDownload * 100
        }
        if (e.type === "file") {
            ef.innerText = e.data
            if (totalFiles) fileProgress.percent = e.data / totalFiles * 100
        }
        if (e.type === "end") {
            wnd.close()
            const ans = await msgbox("Winda Update", "The update was installed successfully. In order for changes to take effect, you need to restart", ["OK", "Restart later"])
            if (ans === "OK") {
                window.location.reload()
            }
        }
    }
    async function upgrade(){
        updateProgress.style.display = ""
        await boot.installImage(undefined, onprogress)
    }
    let footer = document.createElement("footer")
    const buttons = [["Upgrade", upgrade], ["Remind me later", () => wnd.close()]]
    for (btn of buttons){
        let button = document.createElement("button")
        button.innerText = btn[0]
        button.onclick = btn[1]
        footer.append(button)
    }
    el.append(text)
    el.append(updateProgress)
    el.append(footer)
    wnd.show()
    const dim = wnd.windowElem.getBoundingClientRect()
    wnd.x = (innerWidth / 2 ) - (dim.width) / 2
    wnd.y = (innerHeight / 2 ) - (dim.height) / 2
}