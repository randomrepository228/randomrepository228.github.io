addEventListener("message", (e) => {
    const args = e.data.split("|")
    if (args[0].startsWith("get") && args.length > 1){
        win[args[0].slice(3, args[0].length)] = args[1]
    }
})
async function waitForOutput(action){
    parent.postMessage(action + "|" + win.id, "*")
    let returnVal;
    await new Promise(resolve => {
        const messageHandler = (e) => {
            const args = e.data.split("|")
            if (args[0] == action){
                removeEventListener("message", messageHandler)
                returnVal = args[1]
                resolve();
            }
        }
        addEventListener("message", messageHandler)
    })
    return returnVal
}
async function exec(fn, ...options){
    if (/^[a-zA-Z_0-9]+$/g.test(fn))
        parent.postMessage(`eval|${fn}(${options.join(",")})`, "*")
}
async function getAllWindows(){
    parent.postMessage("|" + win.id)
    let returnVal;
    await new Promise(resolve => {
        const messageHandler = (e) => {
            const args = e.data.split("|")
            if (args[0] == action){
                removeEventListener("message", messageHandler)
                returnVal = args[1]
                resolve();
            }
        }
        addEventListener("message", messageHandler)
    })
    return returnVal
}
let win = {
    close: () => parent.postMessage("close|" + win.id, "*"),
    max: () => parent.postMessage("max|" + win.id, "*"),
    min: () => parent.postMessage("min|" + win.id, "*"),
    show: (icon) => parent.postMessage("show|" + win.id + "|" + icon, "*"),
    getTitle: async () => await waitForOutput("title"),
    getWidth: async () => await waitForOutput("width"),
    getHeight: async () => await waitForOutput("height"),
    getTop: async () => await waitForOutput("top"),
    getLeft: async () => await waitForOutput("left"),
    title: "0",
    width: "0",
    height: "0",
    top: "0",
    left: "0",
    scrwidth: "0",
    scrheight: "0",
    setTitle: (a) => parent.postMessage("settitle|" + win.id + "|" + a, "*"),
    setWidth: (a) => parent.postMessage("setwidth|" + win.id + "|" + a, "*"),
    setHeight: (a) => parent.postMessage("setheight|" + win.id + "|" + a, "*"),
    setTop: (a) => parent.postMessage("settop|" + win.id + "|" + a, "*"),
    setLeft: (a) => parent.postMessage("setleft|" + win.id + "|" + a, "*"),
    setPos: (a, b) => parent.postMessage("setpos|" + win.id + "|" + a + "|" + b, "*"),
    id: -1
}
function openFileDialog(windowtitle, windowicon, a){}