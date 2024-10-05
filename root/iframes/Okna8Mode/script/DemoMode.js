$(window).ready(()=>{
    if (localStorage.getItem('OKNA8_demo_enable') == 'true') {
        $('#cb_panel_settings_tile_demomode').css('display', 'block')
    }
    
    if (localStorage.getItem('OKNA8_demo_DisableStartScreenUI') == 'true') {
        $('#DemomodeDisableStartUI').prop('checked', true)
        $('.startScreen > .tiles > .content').css('opacity', '0')
    }

    $('#DemomodeDisableStartUI').click(function(){
        if ($(this).is(':checked')){
            localStorage.setItem('OKNA8_demo_DisableStartScreenUI', 'true')
            $('.startScreen > .tiles > .content').css('opacity', '0')
        } else {
            localStorage.removeItem('OKNA8_demo_DisableStartScreenUI')
            $('.startScreen > .tiles > .content').css('opacity', '1')
        }
    })
})