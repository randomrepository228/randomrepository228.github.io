fs = {}
let db;
ramdisk = []
isFsLoaded = false
function sleep(milliseconds){
    return new Promise(res => setTimeout(res, milliseconds))
}
boot.log("Filesystem type: IndexedDB\n")
if (window.indexedDB){
const request = indexedDB.open("C_drive", 1);
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
fs.downloadFile = async (path) => {
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
fs.checkSystemFolder = async function(){
    const transaction = db.transaction("rootfs", "readwrite")
    const initialfs = transaction.objectStore("rootfs");
    const request = initialfs.get("bin/savedialog.js")
    request.onsuccess = (e) => {
        if(request.result) return true;
        return false
    };
}
fs.getStorage = async function(){
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    return {usedSpace: usedSpace, totalSpace: totalSpace}
}
fs.readdir = function(path){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(path + "/.")
        request.onerror = (e) => {
            resolve(undefined)
            console.error(e)
        }
        request.onsuccess = (e) => {
            const keys = initialfs.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                let filteredfolders = [];
                for(a of allkeys){
                    if(a.startsWith(path)){
                        let foldername = a
                        if (path){
                            foldername = foldername.replace((path + "/"), "")
                        }
                        if(foldername.startsWith("/")){
                            foldername = foldername.replace("/", "")
                        }
                        if (foldername.match(/([^\/]*\/?\.?)/)[1] == foldername){
                            if (foldername.endsWith("/")){}
                            else if (foldername.endsWith("/.")){
                                filteredfolders.push(foldername)
                            }
                            else{
                                filteredkeys.push(foldername)
                            }
                        }
                    }
                }
                resolve(filteredfolders.concat(filteredkeys))
            }
        }
    })
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
fs.moveFile = function(initialFilePath, filePath){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const query = store.get(initialFilePath)
        
        query.onsuccess = (e) => {
            const result = e.target.result
            result.path = filePath
            const query = initialfs.put(result, initialFilePath)
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
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const query = store.get(initialFilePath)
        
        query.onsuccess = (e) => {
            const result = e.target.result
            result.path = filePath
            const query = initialfs.put(result)
            query.onerror = (e) => resolve(2)
            query.onsuccess = (e) => {
                resolve(0)
                dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
            }
        }
        query.onerror = (e) => resolve(1)
    })
}
fs.writeFile = function(filePath, data, newFile){ return new Promise(async (resolve, reject) => {
    if (!filePath) return 0
    if(typeof data != "object") data = new Blob([data])
    filePath = fs.toPath(filePath)
    let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
    if (!(!newFile || (newFile && !await fs.exists(filePath)))) {
        let i = 2;
        while (true){
            const newFileName = `${filePath} (${i})`
            if (!await fs.exists(newFileName)){
                filePath = newFileName
                break
            }
            i++
        }
    }
    const transaction = db.transaction("rootfs", "readwrite")
    const initialfs = transaction.objectStore("rootfs");
    const request = initialfs.get(filePath.replace(fileName, "/."))
    request.onsuccess = async (e) => {
        initialfs.put({path: filePath, data: data})
        dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
        resolve(0)
    };
    request.onerror = (e) => {resolve(1)}
})}
fs.appendFile = function(filePath, data){ return new Promise(async (resolve, reject) => {
    if (!filePath) return 0
    if(typeof data != "object") data = new Blob([data])
    filePath = fs.toPath(filePath)
    let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
    if (!await fs.exists(filePath)) {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(filePath.replace(fileName, "/."))
        request.onsuccess = async (e) => {
            initialfs.put({path: filePath, data: data})
            dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
            resolve(0)
        };
        request.onerror = (e) => {resolve(1)}
    }
    else{
        const newFileContents = await fs.readFile(filePath)
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(filePath.replace(fileName, "/."))
        request.onsuccess = async (e) => {
            initialfs.put({path: filePath, data: new Blob([newFileContents, data])})
            dispatchEvent(new CustomEvent("filechange", {detail: {filename: filePath}}))
            resolve(0)
        };
        request.onerror = (e) => {resolve(1)}
    }
})}
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
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.delete(filePath)
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
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = initialfs.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                for(a of allkeys){
                    if(a.startsWith(path)){
                        filteredkeys.push(a)
                    }
                }
                for (const a of filteredkeys){
                    initialfs.delete(a)
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
fs.search = async function(path, searchString){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = initialfs.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                for(a of allkeys){
                    if(a.includes(searchString)){
                        filteredkeys.push(a)
                    }
                }
                resolve(filteredkeys)
            }
        }
    })
}
fs.searchHTML = async function(path, searchString){
    return new Promise((resolve, reject) => {
        path = fs.toPath(path)
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(path + "/.")
        request.onerror = (e) => {
            resolve(1)
        }
        request.onsuccess = (e) => {
            const keys = initialfs.getAllKeys()
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
request.onsuccess = async (e) => {
    db = e.target.result;
    isFsLoaded = true
    dispatchEvent(new CustomEvent("fsloaded"))
    await fs.writeFile("usr/.", "")
    await fs.writeFile("usr/SYSTEM/.", "")
    await fs.writeFile("usr/SYSTEM/desktop/.", "")
};
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.length){
        const objstore = db.createObjectStore("rootfs", {keyPath: "path"});
        objstore.createIndex("data", "data", { unique: false})
        fs.checkSystemFolder()
    }
}
fs.waitUntilInit = (e) => new Promise((res, rej) => {
    if (isFsLoaded) res()
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
isFsLoaded = true
dispatchEvent(new CustomEvent("fsloaded"))
}