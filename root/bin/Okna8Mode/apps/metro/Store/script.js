var currentUser = sessionStorage.getItem('OKNA8_sessionUser')

$(document).ready(() => {
    var iframeStore = document.createElement('iframe')
    iframeStore.src = VERSION.server + '/okna/store'
    iframeStore.frameBorder = '0'
    iframeStore.id = 'StoreFrame'
    iframeStore.onload = () => {
        var OknaType = 'Local'
        if (typeof require != "undefined") {
            OknaType = 'Node'
        } else if (location.protocol != "file:") {
            OknaType = 'Web'
        }
        $('iframe')[0].contentWindow.postMessage(
            'StoreConfig' +
                JSON.stringify({
                    OknaBuild: VERSION['build'],
                    OknaType: OknaType,
                    InstalledApps: JSON.parse(localStorage.getItem('OKNA8_ModsConfig'))
                }),
            '*'
        )
        window.addEventListener('message', (event) => {
            console.log(event)
            if (event.data == "HideSplash") {
                setTimeout(() => {
                    $('.metrosplash').addClass('metrosplashhideani')
                    setTimeout(function () {
                        $('.metrosplash').addClass('hidden')
                    }, 200)
                }, 200)
            } else if (event.data.startsWith('InstallApp')) {
                window.parent.postMessage('eval>InstallWebApp(' + event.data.substring(10) + ')')
            } else if (event.data.startsWith('RemoveApp')) {
                window.parent.postMessage('eval>RemoveWebApp(' + event.data.substring(9) + ')')
            } else if (event.data.startsWith('AppInstalled_') || event.data.startsWith('AppRemoved_')) {
                $('iframe')[0].contentWindow.postMessage(event.data)
            }
        })
    }
    document.body.append(iframeStore)
    $('.metrosplash .progress-ring').css('display', 'block')
})