// const bcwd = {
//     window: {
//         open: async (window) => {
//             const id = getId()
//             //const window2 = AddWindow(new Winda7Window(0,0,window.title, "", false), false, {noSelfOpen: true, width: window.width, height: window.height, window: true}, id, window.elem)
//             return {
//                 waitForClose: async () => {while(findWindow(".n" + id)) {await sleep(1000); return}}, 
//                 id: id, 
//                 elem: window.elem, 
//                 close: () => closeWindow(id), 
//                 title: window2.title,
//                 isClosed: () => findWindow(id) ? true : false
//             }
//         }
//     },
//     fs: {
//         file: {
//             readObj: async (a) => JSON.parse(await (await fs.readFile(a)).text()),
//             read: async (a) => await (await fs.readFile(a)).text(),
//             writeObj: async (filename, a) => await fs.writeFile(filename, JSON.stringify(a)),
//             write: fs.writeFile,
//             delete: fs.delete
//         }
//     },
//     shell: {
//         inputBox: async (a) => await inputbox(a.title, a.text, a.defaultText),
//         messageBox: async (a) => await msgbox(a.title, a.text, a.buttons),
//         execCommand: async (a) => {
//             if (a.fileName == "/apps/filemgr.ca"){
//                 return (await loadScript("bin/savedialog.js", a.args))
//             }
//             else{
//                 return (await loadScript(a.fileName, a.args))
//             }
//         }
//     }
// }
async function loadScript(file, args, excludesmain){
    if (!args) args = []
    try{
        let script = await (await fs.readFile(file)).text()
        const result = await runScript(script, args, file, excludesmain)
        return result
    }
    catch(e){
        try{
            await loadScriptOnline(file + "?" + Math.random().toString().replace(".", "e"))
            try{
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
                    result = await loadScript("bin/conhost.js", [cMain])
                    processList.push({filename: "conhost.js", location: "bin/conhost.js"})
                    return result
                }
                else if (isGUI){
                    result = await main(args)
                    let fileName = file.split("/")
                    fileName = fileName[fileName.length-1] 
                    processList.push({filename: fileName, file})
                    return result
                }
                msgbox(file, "This is not a valid Winda application", undefined, "error")
                return -1
            }
            catch(e){
                msgbox(file, e, undefined, "error")
                console.error(e)
            }
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
async function loadApp(packageName, path, args, id) {loadScript("bin/iframehost.js", [packageName, path, args, id, "winda7"])}
async function loadAppNoInfo(packageName, path, name, args) {loadScript("bin/iframehost.js", [packageName, path, name, args, ""])}
async function loadOkna8App(packageName, path, name, args) {loadScript("bin/iframehost.js", [packageName, path, name, args, "okna8"])}