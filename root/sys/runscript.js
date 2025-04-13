async function loadScript(file, args, excludesmain){
    if (!args) args = []
    try{
        let script = await fs.readFile(file, "utf-8")
        const result = await runScript(script, args, file, excludesmain)
        return result
    }
    catch(e){
        try{
            return await runScript(await (await fetch(file)).text(), args, file)
        }
        catch(e){
            msgbox(location, ` Load script failed. ${e}\n Location: ${file}`, undefined, "error")
            console.error(e)
        }
    }
}
let timeoutList = []
let intervalList = []
function clearAllIntervals(){
    intervalList.forEach((g) => {
        clearInterval(g)
    })
    intervalList = []
}
function clearAllTimeouts(){
    timeoutList.forEach((g) => {
        clearTimeout(g)
    })
    timeoutList = []
}
function loadScriptOnline(src){ 
    return new Promise(async (resolve, reject) => {
        let i = document.createElement('script')
        i.src = src
        document.body.append(i)
        i.onload = resolve
        i.onerror = reject
    })
}
async function runAppScript(type, script, args, location){
    eval(script)
    if (type){
        const procIndex = processList.push({filename: "conhost.js", location: "bin/conhost.js"}) - 1
        processList[procIndex].id = procIndex
        if (consoleWindow){
            const event = new Event("cmd")
            event.func = cMain
            consoleWindow.dispatchEvent(event)
        }
        result = await loadScript("bin/conhost.js", [main])
        processList.splice(procIndex, 1)
        return result
    }
    else{
        let fileName = location.split("/")
        fileName = fileName[fileName.length-1] 
        const procIndex = processList.push({filename: fileName, location}) - 1
        processList[procIndex].id = procIndex
        result = await main(args)
        processList.splice(procIndex, 1)
        return result
    }
}
async function runScript(script, args, location, excludesmain, consoleWindow){
    try{
        eval(script)
        if (excludesmain) return 0
        let isConsole = true
        let isGUI = true
        try{
            cMain
        }
        catch(e){
            isConsole = false
        }
        try{
            main
        }
        catch(e){
            isGUI = false
        }
        let result;
        if (isConsole){
            const procIndex = processList.push({filename: "conhost.js", location: "bin/conhost.js"}) - 1
            processList[procIndex].id = procIndex
            if (consoleWindow){
                const event = new Event("cmd")
                event.func = cMain
                consoleWindow.dispatchEvent(event)
            }
            result = await loadScript("bin/conhost.js", [cMain])
            processList.splice(procIndex, 1)
            return result
        }
        else if (isGUI){
            let fileName = location.split("/")
            fileName = fileName[fileName.length-1] 
            const procIndex = processList.push({filename: fileName, location}) - 1
            processList[procIndex].id = procIndex
            result = await main(args)
            processList.splice(procIndex, 1)
            return result
        }
        msgbox(location, "This is not a valid Winda application", undefined, "error")
        return -1
    }
    catch(e){
        msgbox(location, e, undefined, "error")
        console.error(e)
    }
}
async function loadExecutable(file, args){
    let script = await fs.readFile(file)
    const data = await JSZip.loadAsync(script)
    if (!data.files["manifest.json"]) {
        await msgbox(file, "Program manifest is missing", undefined, "error")
        return -1
    }
    const entries = Object.entries(data.files)
    let manifest
    try{
        manifest = JSON.parse(await data.files["manifest.json"].async("string"))
    }
    catch(e){
        await msgbox(file, "Program manifest is invalid", undefined, "error")
        console.error(e)
        return -1
    }
    return await runAppScript(manifest.type, await data.files[manifest.main].async("string"), args, file)
    // for (let [key, value] of entries){
    //     if (key !== "manifest.json") continue
    //     try{
    //         manifest = JSON.parse(await value.async("string"))
    //     }
    //     catch(e){
    //         await msgbox(file, "Program manifest is invalid", undefined, "error")
    //         console.error(e)
    //         return
    //     }
    // }
}
async function loadApp(packageName, path, args, id) {loadScript("bin/iframehost.js", [packageName, path, args, id, "winda7"])}
async function loadAppNoInfo(packageName, path, name, args) {loadScript("bin/iframehost.js", [packageName, path, name, args, ""])}
async function loadOkna8App(packageName, path, name, args) {loadScript("bin/iframehost.js", [packageName, path, name, args, "okna8"])}