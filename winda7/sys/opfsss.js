class OPFSDirectoryHandle{
    constructor(handle){
        this.handle = handle
        this.name = this.handle.name
        this.type = this.handle.kind === "directory" ? "dir" : this.handle.kind
    }
    listDir(){
        return this.handle.values()
    }
    async listDirPromise(){
        const entryList = []
        for await (const a of this.handle.values()){
            entryList.push({name: a.name, type: a.kind})
        }
        return entryList
    }
}

class OPFSFilesystem{
    constructor(session){
        if (!navigator.storage.getDirectory) throw new Error
        this.cache = {}
        this.session = session
    }
    async getDir(path, opts) {
        let handle = await navigator.storage.getDirectory();
        for (const part of path.split("/")) {
            if (part === "")
                continue;
            handle = await handle.getDirectoryHandle(part, opts)
        }
        return handle;
    }
    async getFile(path, opts) {
        const parts = path.split("/");
        const file = parts.pop();
        const parentFolder = parts.join("/");
        return new OPFSDirectoryHandle((await getFolder(parentFolder)).getFileHandle(file, opts))
    }
    async getFileOrDir(path, opts) {
        try{
            handle = await this.getDir(part, opts)
        }
        catch(e){
            handle = await this.getFile(part, opts)
        }
    }
}