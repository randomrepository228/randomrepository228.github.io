//    Okna8Node, based on Okna8 build 104
//    Do not edit.

$('.build').html('Okna8Node ' + VERSION['ver'] + '<br>Build ' + VERSION['build'])

var { ipcRenderer } = require('electron')

$('.exportsavebtn').click(() => {
    ipcRenderer.send('export-data', JSON.stringify(localStorage))
})

ipcRenderer.on('import-data', (event, msg) => {
    if (msg.startsWith('OKNA8_LOCALSTORAGE_')) {
        if (msg.substring(19).startsWith('83')) {
            localStorage.clear()
            var data = JSON.parse(msg.substring(23))
            Object.keys(data).forEach(function (k) {
                localStorage.setItem(k, JSON.stringify(data[k]).replaceAll('\"', ''))
            })
            shutdown('l')
        }
    }
})