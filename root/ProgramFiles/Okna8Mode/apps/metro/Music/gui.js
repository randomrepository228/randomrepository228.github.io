$(document).ready(() => {
    setTimeout(() => {
        //$('.metrosplash').addClass('metrosplashhideani')
        setTimeout(function () {
            //$('.metrosplash').addClass('hidden')
            $('.ViewCollection').css('display', 'block')
            window.parent.postMessage('ModalMetroDialog|<h1>Приложение не доступно</h1><p></p><div class="buttons"><button onclick="closemetroapp(\'Music\');CloseMetroDialog(\'__ID__\')">Выход</button></div>', '*')
        }, 200)
    }, 200)
    setTimeout(() => {
        if (localStorage.getItem('OKNA8_Music_Library') == null) {
            //window.parent.postMessage('eval>ipcRenderer.send(\'UpdateMusicLibrary\', \'D:/Users/Igor/Music\')')
        } else {

        }
    }, 500)
})

function SelectView(view) {
    $('.SelectView .item').removeClass('active')
    $('.View').css('display', 'none')
    $('.SelectView .item#SelectViewItem' + view).addClass('active')
    $('.View' + view).css('display', 'block')
}