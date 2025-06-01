const channel = new BroadcastChannel('sw-communication');
let location = ""
fs = {}
let db;
fs.idb = {}
fs.idb.request = indexedDB.open("C_drive", 1);
fs.idb.readFile = function(filePath){
    filePath = fs.toPath(filePath)
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const t = transaction.objectStore("rootfs");
        const request = t.get(filePath)
        request.onerror = (e) => {
            resolve(undefined)
        }
        request.onsuccess = (e) => {
            if(e.target.result) resolve(e.target.result.data)
            else resolve(undefined)
        }
    })
}
fs.idb.exists = function(filePath){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const t = transaction.objectStore("rootfs");
        try{
            const request = t.get(filePath)
            request.onerror = (e) => {
                resolve(false)
            }
            request.onsuccess = (e) => {
                if (!e.target.result) resolve(false)
                resolve(true)
            }
        } catch (e) {resolve(false)}
    })
}
fs.idb.request.onsuccess = async (e) => {
    db = e.target.result;
    fs.isLoaded = true
    dispatchEvent(new CustomEvent("fsloaded"))
};
fs.opfs = {}
fs.opfs.exists = async function(path){
    let folder = db
    path = fs.toPath(path)
    path = path.split("/")
    console.log(path)
    try{
        console.log(path[0])
        for (let i = 0; i < path.length - 1; i++){
            folder = await folder.getDirectoryHandle(path[i], {create: false})
        }
        console.log(await folder.getFileHandle(path[path.length-1], {create: false}))
        return true
    }
    catch(e){console.error(e);return false}
}
fs.opfs.readFile = async function(path){
    let folder = db
    path = fs.toPath(path)
    console.log(path)
    let isdir = false
    if (path.endsWith("/.")) isdir = true
    path = path.split("/")
    for (let i = 0; i < path.length - 1; i++){
        folder = await folder.getDirectoryHandle(path[i])
    }
    if (isdir) return
    return await (await folder.getFileHandle(path[path.length - 1])).getFile()
}
fs.opfs.waitUntilInit = (e) => new Promise(async (res, rej) => {
    if (!db) db = await navigator.storage.getDirectory()
    res()
})
fs = fs.idb
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.cache = {}
fs.isLoaded = false;
fs.waitUntilInit = (e) => new Promise((res, rej) => {
    if (fs.isLoaded) res()
    addEventListener("fsloaded", res, {once: true})
})
self.addEventListener('fetch', async (event) => {
    if (event.request.method !== "GET") return;
    if (event.request.url.startsWith("file://")) return;
    async function d(){
        if (!fs.isLoaded) await fs.waitUntilInit()
        const url = event.request.url.replace(self.registration.scope, "")
        if (fs.cache[url]) return new Response(fs.cache[url])
        if (event.request.destination === "document" && fs.cache[url + "/index.html"]) return new Response(fs.cache[url + "/index.html"])
        if (event.request.destination === "document" && await fs.exists(url + "/index.html")) return new Response(await fs.readFile(url + "/index.html"))
        if (url === "ver" || !await fs.exists(url)) return fetch(event.request.url)
        const data = await fs.readFile(url)
        return new Response(data)
    }
    event.respondWith(d());
});
self.addEventListener("install", event => {
    channel.postMessage("Service worker installed\n")
    self.skipWaiting()
});
self.addEventListener("activate", event => {
    channel.postMessage("Service worker activated\n");
});
channel.onmessage = (e) => {
    if (e.data.type = "fsCache") {
        fs.cache[e.data.path] = e.data.data
    }
    else if (e.data.type = "fsCacheList") {
        for (let [filePath, data, options] of e.data.entries){
            fs.cache[filePath] = data
        }
    }
}