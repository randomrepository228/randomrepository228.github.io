window.fs = {}
fs.cache = {}
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.downloadFiles = async (files) => {
    files.forEach(async path => {
        if (!(await fs.exists(path))) {
            const response = await (await fetch("./" + path)).blob()
            const match = path.match(/(.+\/).+/)
            if (match) if (match.length == 2) if(!await fs.exists(match[1] + ".")) await fs.writeFile(match[1] + ".", "")
            await fs.writeFile(path, response)
        }
    })
}
fs.downloadFile = async (path, encoding) => {
    if (!(await fs.exists(path))) {
        const response = await (await fetch("./" + path)).blob()
        const match = path.match(/(.+\/).+/)
        if (match) if (match.length == 2) if(!await fs.exists(match[1] + ".")) await fs.writeFile(match[1] + ".", "")
        fs.writeFile(path, response)
        if (encoding === "utf8")
            return await response.text()
        else if (encoding === "blob")
            return response
        else
            return await response.arrayBuffer()
    }
    const file = await fs.readFile(path, encoding)
    return file
}
fs.extractZip = async (path) => {
    if (!(await fs.exists(path))) {
        const response = await (await fetch("./" + path)).blob()
        const match = path.match(/(.+\/).+/)
        if (match) if (match.length == 2) if(!await fs.exists(match[1] + ".")) await fs.writeFile(match[1] + ".", "")
        await fs.writeFile(path, response)
        return response
    }
    const file = await fs.readFile(path)
    return file
}
fs.readFileZip = async (zipPath, relativePath) => {
    
}
boot.log("Filesystem type: IndexedDB\n")
fs.type = "idb"
localStorage.fstype = fs.type
const request = indexedDB.open("Winda7Core", 1);
fs.req = function(mode){
    const transaction = db.transaction("rootfs", mode)
    return transaction.objectStore("rootfs");
}
fs.readdir = function(path){
    if (path.startsWith("/")) path = path.slice(1)
    if (path && !path.endsWith("/")) path += "/"
    const pathLevel = path.split("/").length
    function parseDir(allkeys){
        const list = []
        const files = []
        for(a of allkeys){
            if (!a.startsWith(path)) continue
            let isFolder = false
            const split = a.split("/")
            if (a.endsWith("/.")) {
                isFolder = true
                split.length--
            }
            if (split.length === pathLevel){
                const finalPath = split[split.length - 1]
                if (isFolder) list.push({name: finalPath, dir: true})
                else files.push({name: finalPath})
            }
        }
        list.push(...files)
        return list
    }
    return new Promise((res, rej) => {
        path = fs.toPath(path)
        const fromCache = parseDir(Object.keys(fs.cache))
        if (fromCache.length) res(fromCache)
        const t = fs.req("readwrite")
        const request = t.get(path + "/.")
        request.onerror = (e) => {
            res(undefined)
            console.error(e)
        }
        request.onsuccess = (e) => {
            const keys = t.getAllKeys()
            keys.onsuccess = (e) => {
                res(parseDir(e.target.result))
            }
        }
    })
}
fs.readFile = async function(filePath, encoding){
    filePath = fs.toPath(filePath)
    if (fs.cache[filePath]){
        if (!encoding) return await fs.cache[filePath].arrayBuffer()
        else if (encoding === "blob") return fs.cache[filePath]
        else return await fs.cache[filePath].text()
    }
    return new Promise((resolve, reject) => {
        const t = fs.req("readonly")
        const request = t.get(filePath)
        request.onerror = (e) => {
            resolve(undefined)
        }
        request.onsuccess = async (e) => {
            if(e.target.result) {
                if (!encoding) {
                    const a = await e.target.result.data.arrayBuffer()
                    resolve(a)
                }
                else if (encoding === "blob"){
                    resolve(e.target.result.data)
                }
                else {
                    if (!(e.target.result.data instanceof Blob)) {
                        resolve(JSON.stringify(e.target.result.data))
                        return
                    }
                    const a = await e.target.result.data.text()
                    resolve(a)
                }
            }
            else resolve(undefined)
        }
    })
}
fs.readFileRaw = async function(filePath, encoding){
    filePath = fs.toPath(filePath)
    if (fs.cache[filePath]) return fs.cache[filePath]
    return new Promise((resolve, reject) => {
        const t = fs.req("readonly")
        const request = t.get(filePath)
        request.onerror = (e) => {
            resolve(undefined)
        }
        request.onsuccess = async (e) => {
            if(e.target.result) {
                resolve(e.target.result.data)
            }
            else resolve(undefined)
        }
    })
}
fs.exists = function(filePath){
    return new Promise((resolve, reject) => {
        if (fs.cache[filePath]) resolve(true)
        if (boot.firstBoot) resolve(false)
        const t = fs.req("readonly")
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
fs.moveFile = function(initialFilePath, filePath){
    return new Promise((resolve, reject) => {
        const t = fs.req("readwrite")
        const query = store.get(initialFilePath)
        
        query.onsuccess = (e) => {
            const result = e.target.result
            result.path = filePath
            const query = t.put(result, initialFilePath)
            query.onerror = (e) => resolve(2)
            query.onsuccess = (e) => {
                resolve(0)
                dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
            }
        }
        query.onerror = (e) => resolve(1)
    })
}
fs.copyFile = function(initialFilePath, filePath){
    return new Promise((resolve, reject) => {
        const t = fs.req("readwrite")
        const query = store.get(initialFilePath)
        
        query.onsuccess = (e) => {
            const result = e.target.result
            result.path = filePath
            const query = t.put(result)
            query.onerror = (e) => resolve(2)
            query.onsuccess = (e) => {
                resolve(0)
                dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
            }
        }
        query.onerror = (e) => resolve(1)
    })
}
fs.writeFile = function(filePath, data, options){ return new Promise(async (resolve, reject) => {
    if (!filePath) return 0
    if (options && options.noOverwrite){
        if (await fs.exists(filePath)){
            resolve(1)
        }
    }
    if(!(data instanceof Blob)){
        data = new Blob([data])
    }
    filePath = fs.toPath(filePath)
    let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
    let modifiedAt
    if (options && options.modifiedAt){
        if (typeof options.modifiedAt === "string") modifiedAt = +options.modifiedAt
        else if (typeof options.modifiedAt === "number") modifiedAt = options.modifiedAt
        else if (typeof options.modifiedAt === "object") {
            if (options.modifiedAt instanceof Date) {
                modifiedAt = options.modifiedAt.getTime()
            }
        }
    }
    else{
        modifiedAt = Date.now()
    }
    const t = fs.req("readwrite")
    t.put({path: filePath, data: data, modifiedAt: modifiedAt})
    fs.cache[filePath] = data
    if (fs.serviceWorker) fs.serviceWorker.postMessage({type: "fsCache", path: filePath, data: data})
    dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
    resolve(0)
    request.onerror = (e) => {resolve(3)}
})}
fs.mkdir = function(filePath){ return new Promise(async (resolve, reject) => {
    if (!filePath) return 0
    if (options && options.noOverwrite){
        if (await fs.exists(filePath)){
            resolve(1)
        }
    }
    const t = fs.req("readwrite")
    function putTable(data){
        t.put({path: "folderTable", data: data, modifiedAt: new Date().now()})
        fs.cache[filePath] = true
        dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
        resolve(0)
        request.onerror = (e) => {resolve(3)}
    }
    const request = t.get(filePath)
    request.onerror = (e) => {
        putTable([filePath])
    }
    request.onsuccess = (e) => {
        if (!e.target.result) resolve(false)
        resolve(true)
    }
})}
fs.batchWrite = function(entries){ return new Promise(async (resolve, reject) => {
    const t = fs.req("readwrite")
    for (let [filePath, data, options] of entries){
        if(!(data instanceof Blob)){
            data = new Blob([data])
        }
        filePath = fs.toPath(filePath)
        let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
        let modifiedAt
        if (options && options.modifiedAt){
            if (typeof options.modifiedAt === "string") modifiedAt = +options.modifiedAt
            else if (typeof options.modifiedAt === "number") modifiedAt = options.modifiedAt
            else if (typeof options.modifiedAt === "object") {
                if (options.modifiedAt instanceof Date) {
                    modifiedAt = options.modifiedAt.getTime()
                }
            }
        }
        else{
            modifiedAt = Date.now()
        }
        if (!filePath) continue
        t.put({path: filePath, data: data, modifiedAt: modifiedAt})
        fs.cache[filePath] = data
        console.log(filePath)
        dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
    }
    fs.serviceWorker.postMessage({type: "fsCacheList", entries: entries})
    resolve(0)
})}
// fs.appendFile = function(filePath, data){ return new Promise(async (resolve, reject) => {
//     if (!filePath) return 0
//     if(typeof data != "object") data = new Blob([data])
//     filePath = fs.toPath(filePath)
//     let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
//     if (!await fs.exists(filePath)) {
//         const transaction = db.transaction("rootfs", "readwrite")
//         const t = transaction.objectStore("rootfs");
//         const request = t.get(filePath.replace(fileName, "/."))
//         request.onsuccess = async (e) => {
//             t.put({path: filePath, data: data})
//             dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
//             resolve(0)
//         };
//         request.onerror = (e) => {resolve(1)}
//     }
//     else{
//         const newFileContents = await fs.readFile(filePath)
//         const transaction = db.transaction("rootfs", "readwrite")
//         const t = transaction.objectStore("rootfs");
//         const request = t.get(filePath.replace(fileName, "/."))
//         request.onsuccess = async (e) => {
//             t.put({path: filePath, data: new Blob([newFileContents, data])})
//             dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
//             resolve(0)
//         };
//         request.onerror = (e) => {resolve(1)}
//     }
// })}
fs.watchFile = function(filePath){
    return new Promise((resolve, reject) => {
        addEventListener("filechange", (e) => {
            if (e.detail.filename == filePath) resolve()
        }, {once: true})
    })
}
fs.watchDir = function(filePath){
    return new Promise((resolve, reject) => {
        addEventListener("filechange", (e) => {
            if (e.detail.filename.startsWith(filePath)) resolve()
        }, {once: true})
    })
}
fs.deleteFile = function(filePath){
    if (filePath.startsWith("/")) filePath = filePath.substring(1)
    return new Promise((resolve, reject) => {
        const t = fs.req("readwrite")
        const request = t.delete(filePath)
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            resolve(0)
        }
    })
}
fs.deleteDir = function(path){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const t = fs.req("readwrite")
        const request = t.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = t.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                for(a of allkeys){
                    if(a.startsWith(path)){
                        filteredkeys.push(a)
                    }
                }
                for (const a of filteredkeys){
                    t.delete(a)
                }
                resolve(0)
            }
        }
    })
}
fs.delete = async function(path){
    if(path.endsWith("/") || path.endsWith("\\")) {
        return await fs.deleteDir(path);
    } else {
        return await fs.deleteFile(path);
    }
}
fs.unlink = fs.delete
fs.search = async function(path, search){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const t = fs.req("readwrite")
        const request = t.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = t.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filter = [];
                for(a of allkeys){
                    if(a.includes(search)){
                        filter.push(a)
                    }
                }
                resolve(filter)
            }
        }
    })
}
fs.searchHTML = async function(path, searchString){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const transaction = db.transaction("rootfs", "readwrite")
        const t = transaction.objectStore("rootfs");
        const request = t.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = t.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                for(a of allkeys){
                    if(a.includes(searchString)){
                        filteredkeys.push(a.replace(searchString, "<marked>" + searchString + "</marked>"))
                    }
                }
                resolve(filteredkeys)
            }
        }
    })
}
fs.createFSvar = async (filePath, origVar, updateDelay) => {
    if (!await fs.exists(filePath)) {
        await fs.writeFile(filePath, "{}")
        var fsVar = {}
    }
    else{
        var fsVar = JSON.parse(await fs.readFile(filePath, "utf8"))
    }
    let isVarUpdated = false
    function updateVar(c){
        if (updateDelay && !c) {
            isVarUpdated = true
            return
        }
        else {
            if (!isVarUpdated) {
                fs.writeFile("config/localStorage", JSON.stringify(fs.localStorage))
                fs.localStorageSync = true
            }
        }
    }
    const fsVarHandler = {
        get(target, prop, receiver) {
            return fsVar[prop]
        },
        set(obj, prop, value) {
            if (typeof value === "object") value = JSON.parse(value)
            else if (typeof value !== "string") value = value + ""
            fsVar[prop] = value
            updateVar()
        },
        getItem(key) {
            return fsVar[key]
        },
        setItem(key, value) {
            if (typeof value === "object") value = JSON.parse(value)
            else if (typeof value !== "string") value = value + ""
            fsVar[key] = value
            updateVar()
        },
        removeItem(key) {
            if (!key) throw new Error("0 arguments passed, 1 required")
            delete fsVar[key]
        },
        clear() {
            fsVar = {}
            updateVar()
        }
    }
    if (updateDelay) setInterval(updatevar, updateDelay)
    return new Proxy(origVar, fsVarHandler)
}
request.onsuccess = async (e) => {
    db = e.target.result;
    fs.isLoaded = true
    // if (!await fs.exists("folderTable")) {
    //     await fs.writeFile("folderTable", {})
    // }
    if (!await fs.exists("config/localStorage")) {
        await fs.writeFile("config/localStorage", "{}")
        fs.localStorage = {}
    }
    else{
        try{
            fs.localStorage = JSON.parse(await fs.readFile("config/localStorage", "utf8"))
        }
        catch(e){
            fs.localStorage = {}
        }
    }
    if ('serviceWorker' in navigator && !boot.params.debug) {
        let swUrl = "./serviceWorker.js"
        let reg;
        for (const a of await navigator.serviceWorker.getRegistrations()){
            if (a.scope === location.origin + location.pathname) {
                reg = a
                boot.log("Service worker found: " + reg.scope + "\n")
            }
        }
        if (!reg) {
            reg = await navigator.serviceWorker.register(swUrl);
            boot.log("Service worker registered: " + reg.scope + "\n")
        }
        reg = await navigator.serviceWorker.ready;
        fs.serviceWorker = new BroadcastChannel('sw-communication');
        fs.serviceWorker.postMessage({type: "fsType", data: fs.type})
        fs.serviceWorker.onmessage = (e) => {
            console.log("Message from service worker: ", e.data)
        }
        addEventListener("beforeunload", (e) => fs.serviceWorker.postMessage("bye!"))
    }
    dispatchEvent(new CustomEvent("fsloaded"))
};
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.length){
        const objstore = db.createObjectStore("rootfs", {keyPath: "path"});
        objstore.createIndex("data", "data", { unique: false})
        //fs.checkSystemFolder()
    }
}
fs.waitUntilInit = (e) => new Promise((res, rej) => {
    if (fs.isLoaded) res()
    addEventListener("fsloaded", res, {once: true})
})