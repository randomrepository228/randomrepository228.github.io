const request = indexedDB.open("SystemDrive", 3);
fs = {}
let db;
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.checkSystemFolder = async function(){
    const transaction = db.transaction("rootfs", "readwrite")
    const initialfs = transaction.objectStore("rootfs");
    const request = initialfs.get("sys/.")
    request.onsuccess = (e) => {
        if(request.result) return;
        initialfs.clear()
        const systemFiles = [
            {path: "bin/.", data: ""}, 
            {path: "bin/bsod/.", data: ""}, 
            {path: "bin/bsod/index.html", data: ""},  
            {path: "bin/bsod/icon.png", data: ""},  
            {path: "bin/bsod/init.json", data: ""}, 
            {path: "bin/calc/.", data: ""}, 
            {path: "bin/calc/index.html", data: ""},  
            {path: "bin/calc/icon.png", data: ""},  
            {path: "bin/calc/init.json", data: ""}, 
            {path: "bin/changelog/.", data: ""}, 
            {path: "bin/changelog/index.html", data: ""},  
            {path: "bin/changelog/icon.png", data: ""},  
            {path: "bin/changelog/init.json", data: ""}, 
            {path: "bin/clock/.", data: ""}, 
            {path: "bin/clock/index.html", data: ""},  
            {path: "bin/clock/icon.png", data: ""},  
            {path: "bin/clock/init.json", data: ""}, 
            {path: "bin/control/.", data: ""}, 
            {path: "bin/control/index.html", data: ""},  
            {path: "bin/control/icon.png", data: ""},  
            {path: "bin/control/init.json", data: ""}, 
            {path: "bin/dvd/.", data: ""}, 
            {path: "bin/dvd/index.html", data: ""},  
            {path: "bin/dvd/icon.png", data: ""},  
            {path: "bin/dvd/init.json", data: ""}, 
            {path: "bin/ExampleApp/.", data: ""}, 
            {path: "bin/ExampleApp/index.html", data: ""},  
            {path: "bin/ExampleApp/icon.png", data: ""},  
            {path: "bin/ExampleApp/init.json", data: ""}, 
            {path: "bin/explorer/.", data: ""}, 
            {path: "bin/explorer/index.html", data: ""},  
            {path: "bin/explorer/icon.png", data: ""},  
            {path: "bin/explorer/init.json", data: ""}, 
            {path: "bin/iexplore/.", data: ""}, 
            {path: "bin/iexplore/index.html", data: ""},  
            {path: "bin/iexplore/icon.png", data: ""},  
            {path: "bin/iexplore/init.json", data: ""}, 
            {path: "bin/Okna8Mode/.", data: ""}, 
            {path: "bin/Okna8Mode/index.html", data: ""},  
            {path: "bin/Okna8Mode/icon.png", data: ""},  
            {path: "bin/Okna8Mode/init.json", data: ""}, 
            {path: "bin/regedit/.", data: ""}, 
            {path: "bin/regedit/index.html", data: ""},  
            {path: "bin/regedit/icon.png", data: ""},  
            {path: "bin/regedit/init.json", data: ""}, 
            {path: "bin/run/.", data: ""}, 
            {path: "bin/run/index.html", data: ""},  
            {path: "bin/run/icon.png", data: ""},  
            {path: "bin/run/init.json", data: ""}, 
            {path: "bin/sfc/.", data: ""}, 
            {path: "bin/sfc/index.html", data: ""},  
            {path: "bin/sfc/icon.png", data: ""},  
            {path: "bin/sfc/init.json", data: ""}, 
            {path: "bin/taskmgr/.", data: ""}, 
            {path: "bin/taskmgr/index.html", data: ""},  
            {path: "bin/taskmgr/icon.png", data: ""},  
            {path: "bin/taskmgr/init.json", data: ""}, 
            {path: "bin/update/.", data: ""}, 
            {path: "bin/update/index.html", data: ""},  
            {path: "bin/update/icon.png", data: ""},  
            {path: "bin/update/init.json", data: ""}, 
            {path: "bin/winver/.", data: ""}, 
            {path: "bin/winver/index.html", data: ""},  
            {path: "bin/winver/icon.png", data: ""},  
            {path: "bin/winver/init.json", data: ""}, 
            {path: "sys/.", data: ""}, 
            {path: "usr/.", data: ""}, 
            {path: "usr/SYSTEM/.", data: ""},
            {path: "usr/SYSTEM/desktop/.", data: ""},
            {path: "fonts/.", data: ""},
            {path: "img/.", data: ""},
            {path: "media/.", data: ""},
            {path: "Profileimgs/.", data: ""},
            {path: "res/.", data: ""},
            {path: "shell/.", data: ""},
            {path: "Winda.old/.", data: ""}
        ]
        systemFiles.forEach((file) => initialfs.add(file));
    };
}
fs.writeFile = async function(filePath, data){
    let fileName = filePath.match(/\/(?:.(?!\/))+$/g)
    const transaction = db.transaction("rootfs", "readwrite")
    const initialfs = transaction.objectStore("rootfs");
    const request = initialfs.get(filePath.replace(fileName, "/."))
    request.onsuccess = (e) => {
        initialfs.put({path: filePath, data: data})
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
        }
        request.onsuccess = (e) => {
            const keys = initialfs.getAllKeys()
            keys.onsuccess = (e) => {
                const allkeys = e.target.result
                let filteredkeys = [];
                for(a of allkeys){
                    if(a.startsWith(path)){
                        let foldername = a
                        if (path){
                            foldername = foldername.replace((path + "/"), "")
                        }
                        if(foldername.startsWith("/")){
                            foldername = foldername.replace("/", "")
                        }
                        if(foldername.match(/([^\/]*\/?\.?)/)[1] == foldername){
                            filteredkeys.push(foldername)
                        }
                    }
                }
                resolve(filteredkeys)
            }
        }
    })
}
fs.readFile = function(filePath){
    if (filePath.startsWith("/")){
        filePath = filePath.substring(1, filePath.length)
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(filePath)
        request.onerror = (e) => {
            resolve(undefined)
        }
        request.onsuccess = (e) => {
            resolve(e.target.result.data)
        }
    })
}
fs.exists = function(filePath){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("rootfs", "readwrite")
        const initialfs = transaction.objectStore("rootfs");
        const request = initialfs.get(filePath)
        request.onerror = (e) => {
            resolve(false)
        }
        request.onsuccess = (e) => {
            if (!e.target.result) resolve(false)
            resolve(true)
        }
    })
}
fs.deleteFile = function(filePath){
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
                for (a of filteredkeys){
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
request.onsuccess = (e) => {
    db = e.target.result;
    fs.checkSystemFolder()
};
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.length){
        const objstore = db.createObjectStore("rootfs", {keyPath: "path"});
        objstore.createIndex("data", "data", { unique: false})
        fs.checkSystemFolder()
    }
}