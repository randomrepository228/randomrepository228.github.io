$(document).ready(() => {
    setTimeout(() => {
        //$('.metrosplash').addClass('metrosplashhideani')
        setTimeout(function () {
            //$('.metrosplash').addClass('hidden')
            window.top.postMessage('ModalMetroDialog|<h1>Приложение не доступно</h1><p></p><div class="buttons"><button onclick="closemetroapp(\'Calendar\');CloseMetroDialog(\'__ID__\')">Выход</button></div>', '*')
        }, 200)
    }, 200)
})