var userAppsData = []

function ConnectMetroApp(UserApp) {
    if (VERSION["build"] >= UserApp[5]) {
        userAppsData.push({
            'packageName': UserApp[0],
            'appName': UserApp[1],
            'locale': UserApp[2],
            'color': UserApp[3],
            'minVer': UserApp[5],
            'targetVer': UserApp[6],
        })
    
        LOCALE_appsnames.push(UserApp[1])
        LOCALE_searchdata.push([UserApp[0], UserApp[7], UserApp[3], '../../../../mods/apps/' + UserApp[0], UserApp[1]])
        tilesInfo[UserApp[0]] = [UserApp[7], UserApp[3], LOCALE_appsnames.length - 1, '../../../../mods/apps/' + UserApp[0], UserApp[1], UserApp[3], UserApp[4], UserApp[9]]

        updateAppsContainer()
    } else {
        ModalMetroDialog(`
            <h1>Приложение не поддерживается</h1>
            <p>Приложение "${UserApp[1]}" не поддерживается вашей версией Okna8.<br>Требуется Okna8 build ${UserApp[5]}</p>
            <div class="buttons">
                <button onclick="CloseMetroDialog('__ID__')">Закрыть</button>
            </div>
        `)
    }
}

if (typeof require == 'undefined') {
    for (let i = 0; i < userapps.length; i++) {
        addScript('../mods/apps/' + userapps[i] + '/AppInit.js')
    }
    for (let i = 0; i < desktopmods.length; i++) {
        addScript('../mods/desktop/' + desktopmods[i] + '/desktop.js')
    }
} else {
    ipcRenderer.send('GetOknaMods')
}

function NodeMods (type, path) {
    if (type == 'mods') {
        for (let i = 0; i < path.split('|').length; i++) {
            addScript('../mods/desktop/' + path.split('|')[i] + '/desktop.js')
        }
    } else if (type == 'apps') {
        for (let i = 0; i < path.split('|').length; i++) {
            addScript('../mods/apps/' + path.split('|')[i] + '/AppInit.js')
        }
    }
}

function AddApp(appid) {
    addScript('../../../../mods/apps/' + appid + '/AppInit.js')
    setTimeout(() => {
        updateAppsContainer()
    }, 100)
}