if (localStorage.getItem('OKNA8_ModsConfig') == null) {
    localStorage.setItem(
        'OKNA8_ModsConfig',
        JSON.stringify({
            Apps: [],
            Mods: [],
        })
    )
}

async function ConnectAppsFromLocalStorage() {
    console.log(JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))['Apps'])
    var Apps = JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))['Apps']
    for (let i = 0; i < Apps.length; i++) {
        ConnectApp(Apps[i].Package)
    }
}

async function ConnectApp(PackageName) {
    await addScript("../mods/apps/" + PackageName + "/AppInit.js")
    await updateAppsContainer()
}

async function InstallWebApp(AppInfo) {
    if (AppInfo.Type == 'MetroApp') {
        var CurrentModsConfig = JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))
        CurrentModsConfig.Apps.push(AppInfo)
        localStorage.setItem('OKNA8_ModsConfig', JSON.stringify(CurrentModsConfig))
        await ConnectApp(AppInfo.Package)
        $('#metrowindow_Store > iframe')[0].contentWindow.postMessage('AppInstalled_' + AppInfo.Package)
        DisplayNotify(`<h1>${AppInfo.DisplayName}</h1><p>Приложение установлено</p>`, `metro_open('${AppInfo.Package}','${tilesInfo[AppInfo.Package][1]}','${AppInfo.DisplayName}','${tilesInfo[AppInfo.Package][3]}')`)
    } else if (AppInfo.Type == 'DesktopApp') {
        var CurrentModsConfig = JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))
        CurrentModsConfig.Apps.push(AppInfo)
        localStorage.setItem('OKNA8_ModsConfig', JSON.stringify(CurrentModsConfig))
        await ConnectApp(AppInfo.Package)
        $('#metrowindow_Store > iframe')[0].contentWindow.postMessage('AppInstalled_' + AppInfo.Package)
        DisplayNotify(`<h1>${AppInfo.DisplayName}</h1><p>Приложение установлено</p>`, `openStart()`)
    }
}

async function RemoveWebApp(AppInfo) {
    if (AppInfo.Type == 'MetroApp') {
        var CurrentModsConfig = JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))
        for (let i = 0; i < CurrentModsConfig.Apps.length; i++) {
            if (CurrentModsConfig.Apps[i].Package == AppInfo.Package) {
                CurrentModsConfig.Apps.splice(i, 1)
            }
        }
        LOCALE_appsnames[tilesInfo[AppInfo.Package][2]] = null
        LOCALE_searchdata[tilesInfo[AppInfo.Package][2]] = null
        localStorage.setItem('OKNA8_ModsConfig', JSON.stringify(CurrentModsConfig))
        $('#metrowindow_Store > iframe')[0].contentWindow.postMessage('AppRemoved_' + AppInfo.Package)
        updateAppsContainer()
    } else {
        var CurrentModsConfig = JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))
        for (let i = 0; i < CurrentModsConfig.Apps.length; i++) {
            console.log(CurrentModsConfig.Apps[i].Package)
            console.log(AppInfo.Package)
            if (CurrentModsConfig.Apps[i].Package == AppInfo.Package) {
                CurrentModsConfig.Apps.splice(i, 1)
            }
        }
        console.log(localStorage.getItem('OKNA8_ModsConfig'))
        console.log(CurrentModsConfig)
        localStorage.setItem('OKNA8_ModsConfig', JSON.stringify(CurrentModsConfig))
        $('#metrowindow_Store > iframe')[0].contentWindow.postMessage('AppRemoveRebootRequired_' + AppInfo.Package)
        ModalMetroDialog(`<h1>Требуется перезагрузка</h1><p>Для удаления "${AppInfo.DisplayName}" требуется перезагрузка Okna8. Выполнить перезагрузку сейчас?</p><div class="buttons"><button onclick="CloseMetroDialog(__ID__);shutdown('r')">Перезагрузить</button><button onclick="CloseMetroDialog(__ID__)">Отмена</button></div>`)
    }
}

ConnectAppsFromLocalStorage()