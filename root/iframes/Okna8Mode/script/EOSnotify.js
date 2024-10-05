var DisplayEOSNotify = ()=>{
    $('.EOSNotify .content').html(LOCALE_startscreen[15])
    $('.EOSNotify').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + currentUser + '_color_background') + ')')
    $('.EOSNotify').css('display', 'block')
}

var CloseEOSNotify = ()=>{
    $('.EOSNotify').css('display', 'none')
    localStorage.setItem('OKNA8_user_' + currentUser + '_eosnotify_skip', 'true')
}

if (localStorage.getItem('OKNA8_user_' + currentUser + '_eosnotify_skip') == null) {
    setTimeout(() => {
        DisplayEOSNotify()
    }, 1500)
} 