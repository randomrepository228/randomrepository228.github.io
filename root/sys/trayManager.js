function addTray(id, trayicon, tray, options){
    let newTray = document.createElement("div")
    newTray.className = `dock-br winapi_transparent winapi_shadow n${id} tray`
    newTray.setAttribute("windowid", id)
    newTray.style.width = tray.width + "px"
    newTray.style.height = tray.height + "px"
    newTray.style.display = "none"
    newTray.setAttribute("name", tray.title)
    newTray.innerHTML =
    `
    <div class="content">
        ${tray.innerhtml}
    </div>
    `
    trays.append(newTray)
    newTray = document.createElement("div")
    newTray.className = `trayicon n${id}`
    newTray.style.width = trayicon.width + "px"
    newTray.innerHTML =
    `
    <div style="width: 79px; margin-bottom: -40px; height: 40px;" onclick="parent.showTray(parent.getTray(${id}))"></div>
    ${trayicon.innerhtml}
    `
    trayicons.append(newTray)
    broadcast("newprocess|" + id)
}
function showTray(tray){
    if (tray == activetray){
        tray.style.display = "none"
        activetray = undefined
        return
    }
    try{
        activetray.style.display = "none"
    } catch (e) {}
    activetray = tray
    activetray.style.display = "block"
}