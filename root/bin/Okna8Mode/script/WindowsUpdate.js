var iframe = document.createElement('iframe')
iframe.id = 'Okna8UpdateServerIframe'
iframe.style.width = '0px'
iframe.style.height = '0px'
iframe.style.display = 'none'
document.body.append(iframe)

var OknaUpdateServerURL = 'http://updateokna8.ertorik.fun'

function CheckUpdates() {
    document.getElementById('Okna8UpdateServerIframe').setAttribute('src', OknaUpdateServerURL)
}

function MetroDialogNodeUpdate(url, newver) {
    ModalMetroDialog(
        `<h1>${LOCALE_charmsbar[22]}</h1>
        <p>${LOCALE_charmsbar[23]}${VERSION['ver']}${LOCALE_charmsbar[24]}${newver}</p>
        <div class="buttons">
            <button onclick="CloseMetroDialog('__ID__');ipcRenderer.send('UpdateOkna8','${url}')">${LOCALE_charmsbar[31]}</button>
            <button onclick="CloseMetroDialog('__ID__')">${LOCALE_charmsbar[26]}</button>
        </div>`
    )
}

window.addEventListener('message', (event) => {
    if (event.data.startsWith('UpdateServer-')) {
        var LatestVersionInfo = event.data.substring(13)
        LatestVersionInfo = LatestVersionInfo.split('|')
        eval(LatestVersionInfo[3])
        if (VERSION['build'] < LatestVersionInfo[0]) {
            if (VERSION['type'] != 'node') {
                DisplayNotify(`<h1>${LOCALE_charmsbar[27]}</h1><p>${LOCALE_charmsbar[28]}</p>`, `window.open("${LatestVersionInfo[2]}")`)
            } else {
                DisplayNotify(`<h1>${LOCALE_charmsbar[27]}</h1><p>${LOCALE_charmsbar[29]}</p>`, `MetroDialogNodeUpdate('${LatestVersionInfo[4]}','${LatestVersionInfo[1]}')`)
            }
        }
    }
})

if (VERSION['type'] == 'node') {
    ipcRenderer.on('UpdateReady', () => {
        clearInterval(CheckUpdatesInterval)
        DisplayNotify(`<h1>${LOCALE_charmsbar[32]}</h1><p>${LOCALE_charmsbar[33]}</p>`, `shutdown('u')`)
        setInterval(() => {
            DisplayNotify(`<h1>${LOCALE_charmsbar[32]}</h1><p>${LOCALE_charmsbar[33]}</p>`, `shutdown('u')`)
        }, 60000)
    })
}

setTimeout(CheckUpdates, 2500)

var CheckUpdatesInterval = setInterval(() => {
    CheckUpdates()
}, 300000)