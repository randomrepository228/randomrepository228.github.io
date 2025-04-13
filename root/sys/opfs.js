boot.log("Filesystem type: OPFS\n")
fs.type = "opfs"
localStorage.fstype = fs.type
ramdisk = []
isFsLoaded = false
fs.toPath = function(path){
    path = path.replace("\\", "/")
    if(path.startsWith(".")) path = path.replace(".", "")
    if(path.endsWith("/")) path = path.substring(0, path.length - 1)
    if(path.startsWith("/")) path = path.replace("/", "")
    return path
}
fs.getStorage = async function(){
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    return {usedSpace: usedSpace, totalSpace: totalSpace}
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
fs.opfsCache = {files: {}, dirs: {}}
fs.getDirHandle = async function(path){
    if (fs.opfsCache.dirs[path]) return fs.opfsCache.dirs[path]
    else{
        path = fs.toPath(path)
        path = path.split("/")
        path.pop()
        let dir
        for (let a of path){
            dir = await db.getDirectoryHandle(path[0], {create: true})
        }
        fs.opfsCache.dirs[path[0]] = dir
    }
}
fs.writeFile = async function(path, data){
    let folder = db
    path = fs.toPath(path)
    let isdir = false
    if (path.endsWith("/.")) isdir = true
    path = path.split("/")
    for (let i = 0; i < path.length - 1; i++){
        folder = await folder.getDirectoryHandle(path[i], {create: true})
    }
    if (isdir) return
    const fileHandle = await folder.getFileHandle(path[path.length - 1], {create: true})
    const writeHandle = await fileHandle.createWritable()
    await writeHandle.write(data)
    await writeHandle.close()
    return 0;
}
fs.readFile = async function(path){
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
fs.readdir = async function(path){
    let folder = db
    path = fs.toPath(path)
    if (path){
        path = path.split("/")
        for (let i = 0; i < path.length; i++){
            folder = await folder.getDirectoryHandle(path[i])
        }
    }
    const files = []
    console.log(folder)
    for await (let [name, handle] of folder){
        if (handle.kind === "directory") files.push(name + "/.")
        else files.push(name)
    }
    return files
}
fs.exists = async function(path){
    let folder
    path = fs.toPath(path)
    path = path.split("/")
    try{
        if (path.length > 1) folder = await db.getDirectoryHandle(path[0], {create: false})
        else folder = db
        for (let i = 0; i < path.length - 1; i++){
            folder = await folder.getDirectoryHandle(path[i], {create: false})
        }
        await folder.getFileHandle(path[path.length-1], {create: false})
        return true
    }
    catch(e){return false}
}
fs.deleteFile = async function(path){
    let folder
    path = fs.toPath(path)
    path = path.split("/")
    if (path.length > 1) folder = await db.getDirectoryHandle(path[0], {create: false})
    else folder = db
    for (let i = 0; i < path.length - 1; i++){
        folder = await folder.getDirectoryHandle(path[i], {create: false})
    }
    return await folder.removeEntry(path[path.length-1])
}
fs.waitUntilInit = async function() {
    if (!isFsLoaded) {
        db = await navigator.storage.getDirectory()
        isFsLoaded = true
    }
}