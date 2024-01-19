async function runDatabase(){
    let db;
    const request = indexedDB.open("SystemDrive", 2);
    request.onerror = (e) => {
        alert("IndexedDB is not supported. Using legacy filesystem")
    };
    request.onsuccess = (e) => {
        db = request.result;
        db.onerror = (e) => {
            msgbox(`Filesystem error (${e.target.errorCode})`);
        };
    };
    request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.onerror = (e) => {
            msgbox(`Filesystem error (${e.target.errorCode})`)
        }
        const objstore = db.createObjectStore("rootfs", {keyPath: "path"});
        objstore.createIndex("data", "data", { unique: false})
        objstore.transaction.oncomplete = (e) => {
            const initialfs = db
              .transaction("rootfs", "readwrite")
              .objectStore("rootfs");
            const systemFiles = [{path: "Winda/.", data: ""}, {path: "ProgramFiles/.", data: ""}, {path: "Users/.", data: ""}, {path: "Users/SYSTEM/.", data: ""}]
            systemFiles.forEach((file) => {
              initialfs.add(file);
            });
        };
    }
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    console.log(Math.round(usedSpace / 1024 / 1024) + "MB" + "/" + Math.round(totalSpace / 1024 / 1024) + "MB")
}
runDatabase()