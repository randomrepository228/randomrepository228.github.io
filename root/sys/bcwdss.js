const bcwd = {
    window: {
        open: async (window) => {
            const id = getId()
            console.log(id)
            const window2 = AddWindow(new Winda7Window(0,0,0,0,window.title, "", false), false, {noSelfOpen: true, width: window.width, height: window.height, window: true}, id, window.elem)
            console.log(window2)
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
            writeObj: async (filename, a) => await fs.writeFile(filename, new Blob([JSON.stringify(a)]))
        }
    },
    shell: {
        inputBox: async (a) => await inputbox(a.title, a.text, a.defaultText),
        messageBox: async (a) => await msgbox(a.title, a.text, a.buttons)
    }
}
async function loadbcwdApp(cafile, args){
    if (!args) args = []
    let bcwdApp = await (await fs.readFile(cafile)).text()
    console.log(bcwdApp)
    eval(bcwdApp)
    main(args)
}