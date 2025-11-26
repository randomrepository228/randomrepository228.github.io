const boot = {
    firstBoot: false,
    sysloaded: false,
    hasSystemError: false,
    log(...msg){
        console.log(...msg)
        verboseBoot.append(...msg)
        verboseBoot.normalize()
        bootloader.scrollTo(0, verboseBoot.scrollHeight);
    },
    async exec(file, a){
        const evalCode = file
        try{(1,eval)(evalCode)}
        catch(e){
            this.log(`${a} Failed to load: `, e, "\nStack Trace:\n", e.stack, "\n")
            throw e
        }
    },
    async execFile(a){
        const file = await (await fetch(a)).text()
        return (await this.exec(file, a))
    },
    params: Object.fromEntries(new URLSearchParams(location.search)),
    async init(){
        if (this.params.debug) this.log("Debug mode is on, using online files\n")
        this.log("Loading Filesystem\n")
        await this.execFile("sys/fslegacy.js")
        await fs.waitUntilInit()
        let isSystemInstalled = await fs.exists("ver")
        if (isSystemInstalled) {
            this.ver = await fs.readFile("ver", "utf-8")
            await this.execFile("sys/krnl.js")
        }
        else await this.execFile("sys/setup.js")
    }
}
boot.init()