const channel = new BroadcastChannel('sw-communication');
let location = ""
fs = {}
let db;
fs = {}
fs.request = indexedDB.open("Winda7Core", 1);
fs.readFile = function(filePath){
    filePath = fs.toPath(filePath)
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readonly")
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
fs.exists = function(filePath){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readonly")
        const t = transaction.objectStore("rootfs");
        const request = t.get(filePath)
        request.onerror = (e) => {
            resolve(false)
        }
        request.onsuccess = (e) => {
            if (!e.target.result) resolve(false)
            resolve(true)
        }
    })
}
fs.request.onsuccess = async (e) => {
    db = e.target.result;
    fs.isLoaded = true
    dispatchEvent(new CustomEvent("fsloaded"))
};
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
        console.log(url)
        if (fs.cache[url]) return new Response(fs.cache[url])
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