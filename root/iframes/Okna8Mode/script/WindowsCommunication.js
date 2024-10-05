function sendToTop(msg) {
    window.parent.postMessage(msg, '*')
}

function sendToWin(frameID, msg) {
    document.getElementById(frameID).contentWindow.postMessage(msg, '*')
}

document.addEventListener('click', () => {
    sendToTop('HideContextMenu')
})

function log(data) {
    console.log(data)
}

var addScript = (src, id) =>
    new Promise(async (resolve, reject) => {
        log('Loading script ' + src)
        let i = document.createElement('script')
        i.src = src
        if (id) i.id = id
        document.body.append(i)
        i.onload = resolve
        i.onerror = reject
    })
    
var addStyles = (src, id) =>
    new Promise(async (resolve, reject) => {
        log('Loading styles ' + src)
        let i = document.createElement('link')
        i.rel = 'stylesheet'
        i.href = src
        if (id) i.id = id
        document.body.append(i)
        i.onload = resolve
        i.onerror = reject
    })
