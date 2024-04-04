const bcwd = {
    window: {
        open: async (window) => {
            const id = getId()
            const window2 = AddWindow(new Winda7Window(0,0,0,0,window.title, "", false), false, {noSelfOpen: true, width: window.width, height: window.height, window: true}, id, window.elem)
            return {
                waitForClose: async () => {while(document.querySelector(".window.n" + id)) {await sleep(1000); return}}, 
                id: id, 
                elem: window.elem, 
                close: () => closeWindow(id), 
                title: window2.title,
                isClosed: () => document.querySelector(".window.n" + id) ? true : false
            }
        }
    },
    fs: {
        file: {
            readObj: async (a) => JSON.parse(await (await fs.readFile(a)).text()),
            read: async (a) => await (await fs.readFile(a)).text(),
            writeObj: async (filename, a) => await fs.writeFile(filename, JSON.stringify(a)),
            write: fs.writeFile,
            delete: fs.delete
        }
    },
    shell: {
        inputBox: async (a) => await inputbox(a.title, a.text, a.defaultText),
        messageBox: async (a) => await msgbox(a.title, a.text, a.buttons),
        execCommand: async (a) => {
            if (a.fileName == "/apps/filemgr.ca"){
                return (await loadScript("bin/savedialog.js", a.args))
            }
            else{
                return (await loadScript(a.fileName, a.args))
            }
        }
    }
}
async function loadScript(file, args, excludesmain){
    if (!args) args = []
    let script = await (await fs.readFile(file)).text()
    const result = await runScript(script, args, file, excludesmain)
    return result
}
async function runScript(script, args, location, excludesmain){
    try{
        eval(script)
        if (excludesmain) return 0
        const result = await main(args)
        return result
    }
    catch(e){
        msgbox(location, e)
        return 1
    }
}