/// <reference path="../sys/windowManager.js"/>
async function cMain(print, input, consoleoutput, args){
    let cMain = undefined
    let currentPath = ""
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    print(`Winda7 [Build ${localStorage.ver}]`)
    print("(c) kitaes, 2024. All rights reserved")
    for(;;) {
        let tinp = (await input(currentPath + "/>")).split(" ");
        let inp = [];
        for (a of tinp){
            inp.push(a.replace("\\", "/"))
        }
        inp[0] = inp[0].toLowerCase()
        if (inp[0].toLowerCase() === "help"){
            print("Command Prompt Help")
            print("help - Show this")
            print("dir or ls - Display current directory")
            print("cls or clear - Clears screen")
            print("echo - Outputs text (to a file if specified)")
            print("type or cat - Outputs contents of a file")
            print("exit - Exit command prompt")
        }
        else if (inp[0] === "dir" || inp[0] === "ls"){
            let results = await fs.readdir(currentPath)
            let sizes = []
            let maxNumSize = 1
            for (a of results){
                sizes.push(numberWithSpaces((await fs.readFile(currentPath + "/" + a)).size))
            }
            for (a of sizes){
                if (a.length > maxNumSize) maxNumSize = a.length
            }
            print("(DIR)" + "".padStart(maxNumSize) + " .")
            print("(DIR)" + "".padStart(maxNumSize) + " ..")
            for(a in results){
                if (results[a].endsWith("/.")){
                    results[a] = "(DIR)" + "".padStart(maxNumSize) + " " + results[a].replace("/.", "")
                }
                else{
                    results[a] = "     " + sizes[a].padStart(maxNumSize) + " " + results[a].replace("/.", "")
                }
                print(results[a])
            }
        }
        else if (inp[0] === "cls" || inp[0] === "clear"){
            consoleoutput.innerHTML = ""
        }
        else if (inp[0] === "echo."){
            print()
        }
        else if (inp[0] === "echo"){
            if (inp[1] === undefined){
                print("Echo help")
                print("echo [TEXT]")
            }
            else{
                let writeLoc = inp.indexOf(">")
                let appendLoc
                if (writeLoc === -1) appendLoc = inp.indexOf(">>")
                if (writeLoc === -1 && appendLoc === -1) print(inp.slice(1).join(' '))
                else if (writeLoc !== -1){
                    let writeContent = inp.slice(1, writeLoc).join(" ")
                    let fPath = currentPath + "/" + inp.slice(writeLoc + 1).join(" ")
                    if (fPath.startsWith("/")) fPath = fPath.slice(1)
                    await fs.writeFile(fPath, writeContent)
                }
                else{
                    let writeContent = "\n" + inp.slice(1, appendLoc).join(" ")
                    let fPath = currentPath + "/" + inp.slice(appendLoc + 1).join(" ")
                    if (fPath.startsWith("/")) fPath = fPath.slice(1)
                    await fs.appendFile(fPath, writeContent)
                }
            }
        }
        else if (inp[0] === "type" || inp[0] === "cat"){
            fPath = currentPath + "/" + inp[1]
            if (fPath.startsWith("/")) fPath = fPath.slice(1)
            if (!(await fs.exists(fPath))) {
                print("ERROR: file does not exist")
                continue
            }
            const text = await (await fs.readFile(fPath)).text()
            const eof = text.indexOf('\x1A')
            if (eof === -1) print(text)
            else print(text.slice(0, eof))
        }
        else if (inp[0] === "cd.."){
            if (currentPath && !currentPath.includes("/")){
                currentPath = ""
                continue
            }
            const match = currentPath.match(/(.*)\//)
            if (match){
                currentPath = match[1]
            }
        }
        else if (!inp[0] || inp[0] == "cd."){}
        else if (inp[0] == "cd/"){currentPath = ""}
        else if (inp[0] === "cd"){
            if (inp[1] === "."){
                continue
            }
            if (inp[1] === ".."){
                if (currentPath && !currentPath.includes("/")){
                    currentPath = ""
                    continue
                }
                const match = currentPath.match(/(.*)\//)
                if (match){
                    currentPath = match[1]
                }
            }
            if (inp[1] === undefined) {
                print("ERROR: folder is not specified")
                continue
            }
            const newPath = currentPath ? currentPath + "/" + inp.slice(1).join(' ') : inp.slice(1).join(' ')
            if (await parent.fs.exists(newPath + "/.")){
                currentPath = newPath
            }
            else{
                print("ERROR: that folder does not exist." + newPath)
            }
        }
        else if (inp[0] === "exit"){
            return
        }
        else {
            const path = currentPath + "/" + inp[0]
            let results = await fs.exists(path)
            if (!results) {
                print("Command is not found. type \"help\" for help")
                continue
            }
            eval(await (await fs.readFile(path)).text())
            try{
                await cMain(print, input, consoleoutput, [...inp.slice(1)])
            }
            catch(e){
                await loadScript(path, inp.slice(1))
            }
        }
    }
}