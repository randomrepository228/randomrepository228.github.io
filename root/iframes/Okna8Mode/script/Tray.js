$('.desktop-taskbar-tray-clock').click(() => {
    $('.desktop-taskbar-window-clock').css('display', 'block')
    $('.desktop-taskbar-window-back').css('display', 'block')
})

$('.desktop-taskbar-tray-lang').click(() => {
    $('.desktop-taskbar-window-lang').css('display', 'block')
    $('.desktop-taskbar-window-back').css('display', 'block')
})

$('.desktop-taskbar-tray-sound').click(() => {
    $('.desktop-taskbar-window-sound').css('display', 'block')
    $('.desktop-taskbar-window-back').css('display', 'block')
})

$('.desktop-taskbar-window-back').click(() => {
    $('.desktop-taskbar-window-back').css('display', 'none')
    $('.desktop-taskbar-window-lang').css('display', 'none')
    $('.desktop-taskbar-window-clock').css('display', 'none')
    $('.desktop-taskbar-window-sound').css('display', 'none')
})

$('.desktop-taskbar-window-sound-cont-range').val(localStorage.getItem("OKNA8_soundlevel"))

setInterval(() => {
    localStorage.setItem("OKNA8_soundlevel", $('.desktop-taskbar-window-sound-cont-range').val())
}, 1000)

function SetInputLang(lang) {
    $('.desktop-taskbar-window-lang-lang-selected').removeClass('desktop-taskbar-window-lang-lang-selected')
    $('.desktop-taskbar-window-lang-lang_' + lang).addClass('desktop-taskbar-window-lang-lang-selected')
    $('.desktop-taskbar-tray-lang > div').html(LOCALE_desktop[8][lang][0])
}

function UpdateInputLanguages() {
    $('.desktop-taskbar-window-lang-list').html('')
    for (let i = 0; i < LOCALE_desktop[9].length; i++) {
        $('.desktop-taskbar-window-lang-list').append(`
            <div onclick="SetInputLang('${LOCALE_desktop[9][i]}')" class="desktop-taskbar-window-lang-lang desktop-taskbar-window-lang-lang_${LOCALE_desktop[9][i]}">
                <div>${LOCALE_desktop[8][LOCALE_desktop[9][i]][0]}</div>
                <p>${LOCALE_desktop[8][LOCALE_desktop[9][i]][1]}<br>${LOCALE_desktop[8][LOCALE_desktop[9][i]][2]}</p>
            </div>
        `)
    }
    $('.desktop-taskbar-window-lang-lang_' + LOCALE_desktop[9][0]).addClass('desktop-taskbar-window-lang-lang-selected')
}

UpdateInputLanguages()

SetInputLang(LOCALE_desktop[9][0])