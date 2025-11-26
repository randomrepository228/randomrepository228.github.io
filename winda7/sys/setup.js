(async function(){
boot.log("Starting Setup...\n")
boot.firstBoot = true
imagePath = "install.zip"
boot.log("Downloading FFlate...\n")
await boot.execFile("sys/fflate.js")
const fileQueue = {}
const dirList = []
const unzip = new fflate.Unzip();
unzip.register(fflate.AsyncUnzipInflate);
const decompFiles = document.createElement("span")
decompFiles.append("0")
dFiles = 0
const totalFiles = document.createElement("span")
totalFiles.append("0")
tFiles = 0
let tfk = false
boot.log("Decompressed files: ", decompFiles, "/", totalFiles, "\n")
unzip.onfile = (file) => {
    const pDir = file.name.substring(0, file.name.lastIndexOf("/") + 1) + "."
    if (!dirList.includes(pDir)){
        dirList.push(pDir)
    }
    if (file.name.endsWith("/empty")) return
    if (!file.name) return
    const fileData = []
    file.ondata = (err, data, end) => {
        fileData.push(data)
        if (end){
            if (file.name === "fileAmount"){
                const amount = +(new TextDecoder().decode(data))
                tFiles = amount
                tfk = true
                return
            }
            fileQueue[file.name] = new Blob(fileData)
            dFiles++
            decompFiles.innerText = dFiles
        }
    }
    console.log(fileData)
    totalFiles.innerText = tFiles
    if (!tfk) tFiles++
    file.start()
}
const fileStream = await fetch(imagePath + (boot.params.cachekiller ? "?" + Math.random() : ""));
const fileSize = +fileStream.headers.get("Content-Length")
const progress = {total: fileSize, loaded: 0}
const loaded = document.createElement("span")
boot.log("Downloading system image: ", loaded, "/" + Math.floor(progress.total / 10000) / 100 + "MB\n")
const reader = fileStream.body.getReader();
while (true) {
    const { done, value } = await reader.read();
    unzip.push(value ? value : new Uint8Array(), done)
    progress.loaded += done ? 0 : value.length
    if (onprogress) onprogress({"type": "download", "data": progress.loaded})
    loaded.innerText = Math.floor(progress.loaded / 10000) / 100
    if (done) break
}
for (const a of dirList){
    fileQueue[a] = ""
}
await fs.batchWrite(Object.entries(fileQueue))
if (onprogress) onprogress({"type": "end"})
const ver = await fs.readFile("ver", "utf-8")
boot.ver = ver
await boot.execFile("sys/krnl.js")
})()