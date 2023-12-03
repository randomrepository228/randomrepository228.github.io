addEventListener("message", (e) => {
    const args = e.data.split("|")
    if (args[0].startsWith("get") && args.length > 1){
        win[args[0].slice(3, args[0].length)] = args[1]
    }
})
async function waitForOutput(action){
    top.postMessage(action + "|" + win.id)
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
        top.postMessage(`eval|${fn}(${options.join(",")})`)
}
async function getAllWindows(){
    top.postMessage("|" + win.id)
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
    close: () => top.postMessage("close|" + win.id),
    max: () => top.postMessage("max|" + win.id),
    min: () => top.postMessage("min|" + win.id),
    show: (icon) => top.postMessage("show|" + win.id + "|" + icon),
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
    setTitle: (a) => top.postMessage("settitle|" + win.id + "|" + a),
    setWidth: (a) => top.postMessage("setwidth|" + win.id + "|" + a),
    setHeight: (a) => top.postMessage("setheight|" + win.id + "|" + a),
    setTop: (a) => top.postMessage("settop|" + win.id + "|" + a),
    setLeft: (a) => top.postMessage("setleft|" + win.id + "|" + a),
    setPos: (a, b) => top.postMessage("setpos|" + win.id + "|" + a + "|" + b),
    id: -1
}