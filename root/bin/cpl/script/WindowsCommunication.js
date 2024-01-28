function sendToTop (msg) {
    window.parent.postMessage(msg, "*")
}

function sendToWin (frameID, msg) {
    document.getElementById(frameID).contentWindow.postMessage(msg, "*")
}

document.addEventListener('click', ()=>{
    sendToTop('HideContextMenu')
})