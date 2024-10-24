const channel = new BroadcastChannel('sw-log');
//const fs = new BroadcastChannel('sw-fs');
let location = ""
fs = {}
let db;
if (indexedDB){
const request = indexedDB.open("C_drive", 1);
self.isFsLoaded = false;
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.readFile = function(filePath){
    filePath = fs.toPath(filePath)
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(filePath)
        request.onerror = (e) => {
            resolve(undefined)
        }
        request.onsuccess = (e) => {
            if(e.target.result) resolve(e.target.result.data)
            else resolve(undefined)
        }
    })
}
fs.exists = function(filePath){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        try{
            const request = initialfs.get(filePath)
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
request.onsuccess = async (e) => {
    db = e.target.result;
    self.isFsLoaded = true
    dispatchEvent(new CustomEvent("fsloaded"))
};
fs.waitUntilInit = (e) => new Promise((res, rej) => {
    if (self.isFsLoaded) res()
    addEventListener("fsloaded", res, {once: true})
})
}
// use localStorage
else{
if (!window.localStorage) {
    alert("Local Storage permission rejected.")
    document.body.innerHTML = "<h1>Local Storage permission rejected.</h1>"
}
localStorage.fs_systemdrv = '[{path: "usr/.", data: ""}, {path: "usr/SYSTEM/.", data: ""}, {path: "usr/SYSTEM/desktop/.", data: ""}'
fs.waitUntilInit = async() => {}
self.isFsLoaded = true
dispatchEvent(new CustomEvent("fsloaded"))
}
// channel.addEventListener("message", (e) => {
//     if (e.data === "hi!") isFsLoaded = true
//     else if (e.data === "bye!") isFsLoaded = false
// })
self.addEventListener('fetch', async (event) => {
    if (event.request.method !== "GET") return;
    //if ("iframes" in url.pathname) return
    console.log(self.scope)
    async function d(){
        if (!self.isFsLoaded) await fs.waitUntilInit()
        const url = new URL(event.request.url)
        if (!await fs.exists(url.pathname.slice(1))) return fetch(event.request.url)
        const data = await fs.readFile(url.pathname.slice(1))
        console.log(data)
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