async function main(args){
    if(!args[0]) return
    if(typeof args[0] !== "string") return
    if (!await fs.exists(args[0])) {
        await msgbox("Error", "File is not found", undefined, "error")
        return
    }
    AddWindow(new Winda7Window(0,0,"MD Viewer",""), false, {
        "title": "MD Viewer",
        "icon": "icon.png",
        "window": true,
        "noSelfOpen": true
    }, getId(), md)
}