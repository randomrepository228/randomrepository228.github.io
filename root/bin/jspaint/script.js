const args = frameElement.getAttribute("args")
if(args) (async () => {
    canvas = document.querySelector(".main-canvas")
    let img = new Image()
    img.onload = function() {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.style.width = img.naturalWidth + "px"
        canvas.style.height = img.naturalHeight + "px"
        main_ctx.drawImage(img, 0, 0)
    };
    img.src = URL.createObjectURL(await parent.fs.readFile(args))
})()
systemHooks.showSaveFileDialog = async (a) => {
    a.getBlob("image/x-bmp-1bpp").then((a) => console.log(URL.createObjectURL(a)))
};
set_theme("aero.css")
// jspaint.systemHooks.showOpenFileDialog = async ({ formats }) => { ... };
// jspaint.systemHooks.writeBlobToHandle = async (save_file_handle, blob) => { ... };
// jspaint.systemHooks.readBlobFromHandle = async (file_handle) => { ... };
let thisWindow = frameElement.parentElement.parentElement.parentElement
parent.showWindow("./bin/jspaint/icon.png", thisWindow.getAttribute("windowid"));