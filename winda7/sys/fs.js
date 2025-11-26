const fs = {
    subsystems: {},
    mounts: {},
    mount(path, subsystem, params){
        if (mounts[path]) throw new Error("This drive is already assigned")
        mounts[path] = {subsystem, params}
    },
    async execFunc(func, ...args){
        let path = args[1]
        const mount = this.mounts[path.slice(0, path.indexOf("/"))]
        if (!mount) throw new Error("This drive is not mounted")
        path = path.slice(path.indexOf("/") + 1)
        return (await this.subsystems[mount.subsystem][func](mount.params, ...args))
    },
    async getFile(path, ...args){
       return await this.execFunc("getFile", path, ...args)
    },
    async getDir(path, ...args){
        return await this.execFunc("getDir", path, ...args)
    },
}