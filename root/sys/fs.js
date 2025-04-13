fs.cache = {}
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