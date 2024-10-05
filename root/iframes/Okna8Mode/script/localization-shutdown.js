$('body').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + currentUser + '_color_background') + ')')

$(document).ready(()=>{
    $('#pleasewait').html(LOCALE_shutdown[3])
    $('#restart').html(LOCALE_shutdown[2])
    $('#shutdown').html(LOCALE_shutdown[1])
    $('#logoff').html(LOCALE_shutdown[4])
})