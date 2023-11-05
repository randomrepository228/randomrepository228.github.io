function OpenPersonalizePage() {
    $('.themesContainer').html('')

    if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_theme') == 'custom') {
        $('.themesContainer').append('<div class="category"><p>Мои темы&nbsp;</p></div>')
        var colorPreview = ''
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') == 'auto') {
            colorPreview = `
                <div class="colorpreview auto"></div>
            `
        } else {
            colorPreview = `
                <div class="colorpreview">
                    <div><div style="background-color: rgba(${localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color')},0.8)"></div></div>
                </div>
            `
        }
        var wallpPreview = ''
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|').length > 1) {
            wallpPreview = `
                <div class="slideshowpreview">
                    <img src="../../../img/wallpaper/${localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[0]}" alt="">
                    <img src="../../../img/wallpaper/${localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[1]}" alt="">
                    <img src="../../../img/wallpaper/${localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[2]}" alt="">
                    <img src="imageres/1018.ico" alt="">
                </div>
            `
        } else {
            wallpPreview = `
                <div class="wallpaperpreview">
                    <img src="../../../img/wallpaper/${localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[0]}" alt="">
                </div>
            `
        }
        var activeTheme = 'activeTheme'
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(1)').html(wallpPreview)
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|').length > 1) {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html('Слайд-шоу')
        } else {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html(localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper'))
        }
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2)').html('<div><div></div></div>')
        $('.themesContainer').append(`
            <div class="theme ${activeTheme}" id="ThemeIDcustom" onclick="Personalize_SetTheme('custom')">
                <p>Несохранённая тема</p>
                ${wallpPreview}
                ${colorPreview}
            </div>
        `)
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') != 'auto') {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') + ')')
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html(localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color'))
        } else {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div').css('background-image', 'url(img/WindowColors_AutoColor.png)')
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html('Автоматически')
        }
    }

    $('.themesContainer').append('<div class="category"><p>Темы по умолчанию&nbsp;</p></div>')
    for (let i = 0; i < AppearanceThemes.length; i++) {
        var colorPreview = ''
        if (AppearanceThemes[i]['color'] == 'auto') {
            colorPreview = `
                <div class="colorpreview auto"></div>
            `
        }
        var wallpPreview = ''
        if (AppearanceThemes[i]['wallpaper'].length > 1) {
            wallpPreview = `
                <div class="slideshowpreview">
                    <img src="../../../img/wallpaper/${AppearanceThemes[i]['wallpaper'][0]}" alt="">
                    <img src="../../../img/wallpaper/${AppearanceThemes[i]['wallpaper'][1]}" alt="">
                    <img src="../../../img/wallpaper/${AppearanceThemes[i]['wallpaper'][2]}" alt="">
                    <img src="imageres/1018.ico" alt="">
                </div>
            `
        } else {
            wallpPreview = `
                <div class="wallpaperpreview">
                    <img src="../../../img/wallpaper/${AppearanceThemes[i]['wallpaper'][0]}" alt="">
                </div>
            `
        }
        var activeTheme = ''
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_theme') == AppearanceThemes[i]['id']) {
            activeTheme = 'activeTheme'
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(1)').html(wallpPreview)
            if (AppearanceThemes[i]['wallpaper'].length > 1) {
                $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html('Слайд-шоу')
            } else {
                $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html(AppearanceThemes[i]['wallpaper'])
            }
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2)').html('<div><div></div></div>')
        }
        $('.themesContainer').append(`
            <div class="theme ${activeTheme}" id="ThemeID${AppearanceThemes[i]['id']}" onclick="Personalize_SetTheme('${AppearanceThemes[i]['id']}')">
                <p>${AppearanceThemes[i]['name']}</p>
                ${wallpPreview}
                ${colorPreview}
            </div>
        `)
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') != 'auto') {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') + ')')
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html(localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color'))
        } else {
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div').css('background-image', 'url(img/WindowColors_AutoColor.png)')
            $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html('Автоматически')
        }
    }
}

function Personalize_SetTheme(themeid) {
    var themePos;
    for (let i = 0; i < AppearanceThemes.length; i++) {
        if (AppearanceThemes[i]['id'] == themeid) {
            themePos = i
        }
    }
    $('.controlContent#ControlContentPersonalize > .cont > .themesContainer > .theme.activeTheme').removeClass('activeTheme')
    $('.controlContent#ControlContentPersonalize > .cont > .themesContainer > .theme#ThemeID' + themeid).addClass('activeTheme')
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_theme', themeid)
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_wallpaper', AppearanceThemes[themePos]['wallpaper'].join('|'))
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_color', AppearanceThemes[themePos]['color'])
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle', AppearanceThemes[themePos]['wallpaperstyle'])
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_visualstyle', AppearanceThemes[themePos]['visualstyle'])
    if (AppearanceThemes[themePos]['wallpaper'].length > 1) {
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(1)').html(`
            <div class="slideshowpreview">
                <img src="../../../img/wallpaper/${AppearanceThemes[themePos]['wallpaper'][0]}" alt="">
                <img src="../../../img/wallpaper/${AppearanceThemes[themePos]['wallpaper'][1]}" alt="">
                <img src="../../../img/wallpaper/${AppearanceThemes[themePos]['wallpaper'][2]}" alt="">
                <img src="imageres/1018.ico" alt="">
            </div>
        `)
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html('Слайд-шоу')
    } else {
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(1)').html(`
            <div class="wallpaperpreview">
                <img src="../../../img/wallpaper/${AppearanceThemes[themePos]['wallpaper'][0]}" alt="">
            </div>
        `)
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(1) > p').html(AppearanceThemes[themePos]['wallpaper'])
    }
    $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2)').html('<div><div></div></div>')
    if (AppearanceThemes[themePos]['color'] != 'auto') {
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div').css('background-color', 'rgb(' + AppearanceThemes[themePos]['color'] + ')')
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html(AppearanceThemes[themePos]['color'])
    } else {
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(1) > td:nth-child(2) > div').css('background-image', 'url(img/WindowColors_AutoColor.png)')
        $('#ControlContentPersonalization_Table > tbody > tr:nth-child(3) > td:nth-child(2) > p').html('Автоматически')
    }
    setTimeout(() => {
        sendToTop('eval>UpdateTheme()')
    }, 100)
    OpenPersonalizePage()
}

function WindowColors_SetColor(color) {
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_color', color)
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_theme', 'custom')
    setTimeout(() => {
        sendToTop('eval>UpdateTheme()')
    }, 100)
}