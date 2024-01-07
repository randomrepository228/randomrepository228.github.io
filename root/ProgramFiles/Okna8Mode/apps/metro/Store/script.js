var currentUser = sessionStorage.getItem('OKNA8_sessionUser')

$(document).ready(() => {
    /*if (typeof require != 'undefined') {
        var iframeStore = document.createElement('iframe')
        iframeStore.src = OKNASERVERS['store']
        iframeStore.frameBorder = '0'
        iframeStore.onload = () => {
            setTimeout(() => {
                $('.metrosplash').addClass('metrosplashhideani')
                setTimeout(function () {
                    $('.metrosplash').addClass('hidden')
                }, 200)
            }, 200)
        }
        document.body.append(iframeStore)
    } else {
        var iframeStore = document.createElement('iframe')
        iframeStore.src = OKNASERVERS['store']
        iframeStore.frameBorder = '0'
        iframeStore.onload = () => {
            $('iframe')[0].contentWindow.postMessage('StoreConfig|95|' + localStorage.getItem('OKNA8_user_' + currentUser + '_color_background') + '|' + localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground') + '|' + localStorage.getItem('OKNA8_locale'), '*')
            setTimeout(() => {
                $('.metrosplash').addClass('metrosplashhideani')
                setTimeout(function () {
                    $('.metrosplash').addClass('hidden')
                }, 200)
            }, 200)
        }
        document.body.append(iframeStore)
        //
    }*/
    window.parent.postMessage('ModalMetroDialog|<h1>Приложение не доступно</h1><p></p><div class="buttons"><button onclick="closemetroapp(\'Store\');CloseMetroDialog(\'__ID__\')">Выход</button></div>', '*')
})