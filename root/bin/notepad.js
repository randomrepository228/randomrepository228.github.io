async function main(args){
    let filePath = args[0];
    let unsaved = false
    const el = document.createElement("div")
    el.style.display = "flex"
    el.style.flexDirection = "column"
    el.style.height = "100%"
    const textarea = document.createElement("textarea")
    textarea.style.flex = 1
    textarea.style.resize = "none"
    textarea.spellcheck = false
    textarea.style.whiteSpace = "pre"
    let title
    if (filePath){
        const f = filePath.split("/")
        title = f[f.length-1] + " - Notepad"
    }
    else{
        title = "Unnamed - Notepad"
    }
    const wnd = new Winda7Window({
        title: title, 
        icon: "./bin/notepad.png", 
        id: getId(),
        layout: {
            titlebar: {
                buttons: {
                    min: true,
                    max: true,
                    close: true
                }
            },
            cont: el
        },
        height: 300,
        width: 500,
        aero: true
    })
    textarea.onkeydown = () => {
        unsaved = true
    }
    textarea.ondrop = async (e) => {
        const file = e.dataTransfer.getData("winda-file")
        if (!file) return
        textarea.value = await fs.readFile(file, "utf8")
        unsaved = false
        const f = file.split("/")
        wnd.title = f[f.length-1] + " - Notepad"
        filePath = file
    }
    if (filePath) {
        textarea.value = await fs.readFile(filePath, "utf8")
        unsaved = false
    }
    //navigator.clipboard.writeText()
    async function savePrompt(){
        const response = await msgbox("Notepad", "Save changes to " + filePath + "?", ["Save", "Don't save", "Cancel"])
        if (response === "Cancel") return 1
        else if (response === "Save"){
            save()
            wnd.close()
        }
        else if (response === "Don't save"){
            wnd.close()
        }
    }
    wnd.onclose = async () => {
        if (!unsaved) return
        const response = await msgbox("Notepad", "Save changes to " + filePath + "?", ["Save", "Don't save", "Cancel"])
        if (response === "Cancel") return 1
        else if (response === "Save"){
            save()
        }
    }
    el.append(createMenuBar({
        "File": [
            ['', 'New', async () => {
                if (unsaved) await savePrompt()
                filePath = undefined
                wnd.title = "Unnamed - Notepad"
                textarea.value = ""
            }],
            ['', 'Open', async () => {
                // there should be file dialog
            }],
            ['', 'Save', async () => {
                if (!filePath) msgbox("Notepad", "no file")
                await fs.writeFile(filePath, textarea.value)
                unsaved = false
            }],
            ['', 'Save as', async () => {
                // there should be file dialog
                if (!filePath) msgbox("Notepad", "no file")
                await fs.writeFile(filePath, textarea.value)
                unsaved = false
            }],
            ['', 'Exit', async () => {
                if (unsaved) await savePrompt()
                else wnd.close()
            }]
        ],
        // "Edit": [
        //     ['', 'Undo', () => {}],
        //     ['', 'Cut', () => {}],
        //     ['', 'Copy', () => {}],
        //     ['', 'Paste', () => {}],
        //     ['', 'Delete', () => {}],
        //     ['', 'Find', () => {}],
        //     ['', 'Find next', () => {}],
        //     ['', 'Replace', () => {}],
        //     ['', 'Go to', () => {}],
        //     ['', 'Select all', () => {}],
        //     ['', 'Time and Date', () => {}],
        // ],
        "Format": [
            ['', "Word Wrap", () => {
                textarea.style.whiteSpace == 'pre-wrap' ? 
                textarea.style.whiteSpace = 'pre' : 
                textarea.style.whiteSpace = 'pre-wrap'
        }]
        ],
        "Help": [
            ['', 'About Notepad', () => msgbox("About Notepad", "Version: 2.0<br>Author: Kitaes<br>")]
        ]
    }))
    el.append(textarea)
    wnd.show()
}