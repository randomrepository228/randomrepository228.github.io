function openLogs () {
    $('.iframe-last').css('top',' -100vh')
    $('.iframe-log').css('top','0vh')
    $('.backbtn').css('transform','rotateZ(90deg)')
    $('.backbtn').attr('onclick','openLast()')
    $('.iframe-log').attr('src',$('.iframe-log').attr('src'))
}

function openLast () {
    $('.iframe-last').css('top','0vh')
    $('.iframe-log').css('top','100vh')
    $('.backbtn').css('transform','rotateZ(-90deg)')
    $('.backbtn').attr('onclick','openLogs()')
    $('.iframe-last').attr('src',$('.iframe-last').attr('src'))
}

if (localStorage.getItem('OKNA8_locale') != 'ru-ru') {
    window.top.postMessage('AppNotLocalized','*')
}