var fullDate = new Date()
setInterval(function () {
    date = new Date()
    $('.desktop-taskbar-tray-clock-date').html(String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear())
    var minute; var hour
    if (date.getMinutes() < 10) {
        minute = '0' + date.getMinutes()
    } else {
        minute = date.getMinutes()
    }
    if (date.getHours() < 10) {
        hour = '0' + date.getHours()
    } else {
        hour = date.getHours()
    }
    $('.desktop-taskbar-tray-clock-time').html(hour + ':' + minute)
}, 100)

$('.tray_sound').click(function () {
    $('.soundwindow').toggleClass('hidden')
})

var startIsOpened = 1
$('.cb_panel_content_start').removeClass('hidden')

function UpdateTaskbar() {
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_TaskbarLocation') == 'top') {
        $('.desktop-taskbar').css('transition', 'none')
        $('.desktop-taskbar').addClass('top')
        $('.desktop-taskbar').removeClass('left')
        $('.desktop-taskbar').removeClass('right')
        $('.desktop-taskbar-tray > div').css('transition', 'none')
        $('.desktop-taskbar').css('background-position-x', '0px')
        $('.desktop-taskbar').css('bottom', 'calc(100vh - 40px)')
        $('.desktop-taskbar').css('left', '0')
        $('#startButtonOnDesktop').css('bottom', 'calc(100vh - 40px)')
        $('#startButtonOnDesktop').css('left', '0')
        $('.desktop-taskbar').css('width', '100vw')
        $('.desktop-taskbar').css('height', '40px')
        $('#startButtonOnDesktop').css('width', '50px')
        $('.desktop-taskbar').css('box-shadow', 'inset 0px -1px 0px 0px rgba(0,0,0, 0.05)')
        $('.desktop-taskbar-tray > div').css('bottom', 'calc(100vh - 40px)')
        $('.build').attr('style', 'bottom:0;right:0;')
        setTimeout(() => {
            $('.desktop-taskbar').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
            $('.desktop-taskbar-tray > div').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
        }, 500)
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_TaskbarLocation') == 'left') {
        $('.desktop-taskbar').removeClass('top')
        $('.desktop-taskbar').addClass('left')
        $('.desktop-taskbar').removeClass('right')
        $('.desktop-taskbar').css('transition', 'none')
        $('.desktop-taskbar-tray > div').css('transition', 'none')
        $('.desktop-taskbar').css('background-position-x', '6px')
        $('.desktop-taskbar').css('bottom', '0')
        $('.desktop-taskbar').css('left', '0')
        $('#startButtonOnDesktop').css('bottom', 'calc(100vh - 40px)')
        $('#startButtonOnDesktop').css('left', '0')
        $('.desktop-taskbar').css('width', '62px')
        $('.desktop-taskbar').css('height', '100vh')
        $('#startButtonOnDesktop').css('width', '62px')
        $('.desktop-taskbar').css('box-shadow', 'inset -1px 0px 0px 0px rgba(0,0,0, 0.05)')
        $('.desktop-taskbar-tray > div').css('bottom', 'calc(100vh - 40px)')
        $('.build').attr('style', 'bottom:0;right:0;')
        setTimeout(() => {
            $('.desktop-taskbar').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
            $('.desktop-taskbar-tray > div').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
        }, 500)
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_TaskbarLocation') == 'right') {
        $('.desktop-taskbar').removeClass('top')
        $('.desktop-taskbar').removeClass('left')
        $('.desktop-taskbar').addClass('right')
        $('.desktop-taskbar').css('transition', 'none')
        $('.desktop-taskbar-tray > div').css('transition', 'none')
        $('.desktop-taskbar').css('background-position-x', '6px')
        $('.desktop-taskbar').css('bottom', '0')
        $('.desktop-taskbar').css('left', 'calc(100vw - 62px)')
        $('#startButtonOnDesktop').css('bottom', 'calc(100vh - 40px)')
        $('#startButtonOnDesktop').css('left', 'calc(100vw - 62px)')
        $('.desktop-taskbar').css('width', '62px')
        $('.desktop-taskbar').css('height', '100vh')
        $('#startButtonOnDesktop').css('width', '62px')
        $('.desktop-taskbar').css('box-shadow', 'inset 1px 0px 0px 0px rgba(0,0,0, 0.05)')
        $('.desktop-taskbar-tray > div').css('bottom', 'calc(100vh - 40px)')
        $('.build').attr('style', 'bottom:0;right:66px;')
        setTimeout(() => {
            $('.desktop-taskbar').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
            $('.desktop-taskbar-tray > div').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
        }, 500)
    } else {
        $('.desktop-taskbar').removeClass('top')
        $('.desktop-taskbar').removeClass('left')
        $('.desktop-taskbar').removeClass('right')
        $('.desktop-taskbar').css('transition', 'none')
        $('.desktop-taskbar-tray > div').css('transition', 'none')
        $('.desktop-taskbar').css('background-position-x', '0px')
        $('.desktop-taskbar').css('bottom', '0')
        $('.desktop-taskbar').css('left', '0')
        $('#startButtonOnDesktop').css('bottom', '0')
        $('#startButtonOnDesktop').css('left', '0')
        $('.desktop-taskbar').css('width', '100vw')
        $('.desktop-taskbar').css('height', '40px')
        $('#startButtonOnDesktop').css('width', '50px')
        $('.desktop-taskbar').css('box-shadow', 'inset 0px 1px 0px 0px rgba(0,0,0, 0.05)')
        $('.desktop-taskbar-tray > div').css('bottom', '0')
        $('.build').attr('style', 'bottom:40px;right:0;')
        setTimeout(() => {
            $('.desktop-taskbar').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
            $('.desktop-taskbar-tray > div').css('transition', '0.3s cubic-bezier(0.1, 0.9, 0.2, 1)')
        }, 500)
    }
}

window.addEventListener('message', (event) => {
    if (event.data == 'UpdateTaskbar') {
        UpdateTaskbar()
    }
})

document.getElementById('DesktopIcons').addEventListener('contextmenu', (e) => {
    e.preventDefault()
    $('.contextmenu').html(`
    <div class="element">Вид</div>
    <div class="element">Сортировка</div>
    <div class="element">Обновить</div>
    <div class="separator"></div>
    <div class="element">Вставить</div>
    <div class="element">Вставить ярлык</div>
    <div class="separator"></div>
    <div class="element">Создать</div>
    <div class="separator"></div>
    <div class="element"><img src="img/desktop/contextmenu/display.png">Разрешение экрана</div>
    <div class="element" onclick="Exec('control Personalize')"><img src="img/desktop/contextmenu/personalize.png">Персонализация</div>
    `)
    $('.contextmenu').append('<div class="verticalSeparator"></div>')
    var contextmenutop
    if (window.innerHeight < $('.contextmenu').outerHeight() + 100 + e.clientY) {
        contextmenutop = e.clientY - $('.contextmenu').outerHeight()
    } else {
        contextmenutop = e.clientY
    }
    var contextmenuleft
    if (window.innerWidth < $('.contextmenu').outerWidth() + 100 + e.clientX) {
        contextmenuleft = e.clientX - $('.contextmenu').outerWidth()
    } else {
        contextmenuleft = e.clientX
    }
    $('.contextmenu').attr('style', 'top: ' + contextmenutop + 'px; left:' + contextmenuleft + 'px')
    $('.contextmenu').css('display', 'block')
})

UpdateTaskbar()