var charmsbar = /*html*/ `
    <div class="charmsbar">
        <div class="cb_dropbtn"></div>
        <div class="cb_dropbtn_bottom"></div>
        <div class="cb_dropdown2">
            <div class="cb_dropdown3">
                <div class="cb_dropdown-content">
                    <div>
                        <a class="c3" onclick="cb_search()">
                            <img src="img/charmsbar-search.png" alt="" />
                            <p id="charmsbar_drop_search_text"></p>
                        </a>
                        <a class="c2" onclick="FunctionNotRealize()">
                        <img src="img/charmsbar-share.png" alt="" />
                            <p id="charmsbar_drop_share_text"></p>
                        </a>
                        <a class="c1">
                            <iframe id="StartbuttonCharmsbar" style="width: 106px; height: 100px" src="apps/classic/desktop/startbuttonCharmsbar.html" frameborder="0"></iframe>
                        </a>
                        <a class="c2" onclick="FunctionNotRealize()">
                            <img src="img/charmsbar-devices.png" alt="" />
                            <p id="charmsbar_drop_devices_text"></p>
                        </a>
                        <a class="c3 charmsbarBtn_settings">
                            <img src="img/charmsbar-settings.png" alt="" />
                            <p id="charmsbar_drop_settings_text"></p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="cb_bgforpanel" onclick="charmsbar_hide()"></div>

    <div class="cb_panel_settings cb_panel">
        <h1 class="cb_panel_content_settings_header" style="position: absolute; top: 32px; left: 40px; color: white; font-size: 28px; font-weight: 100">Параметры</h1>
        <div class="content">
            <div class="charmsContent"></div>
            <div class="cb_panel_settings_line"></div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_notifications" style="bottom: 88px; left: 40px" onclick="window.location.href = 'pages/misc/bsod.html'">
                <img style="left: 30px; top: 22px" src="img/charmsbar-icons/notification.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_shutdown" style="bottom: 88px; left: 128px" onclick="CharmsShutdown()">
                <img style="left: 31px; top: 16px" src="img/charmsbar-icons/power.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_keyboard" style="bottom: 88px; left: 216px" onclick="window.location.href = 'pages/misc/bsod.html'">
                <img style="left: 30px; top: 27px" src="img/charmsbar-icons/keybrd_RUS.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_net" style="bottom: 176px; left: 40px" onclick="cb_network()">
                <img style="left: 29px; top: 19px" src="img/charmsbar-icons/ethernet.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_sound" style="bottom: 176px; left: 128px" onclick="window.location.href = 'pages/misc/bsod.html'">
                <img style="left: 30px; top: 17px" src="img/charmsbar-icons/sound.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_bigtile cb_panel_settings_bigtile_brightness" style="bottom: 176px; left: 216px" onclick="window.location.href = 'pages/misc/bsod.html'">
                <img style="left: 28px; top: 15px" src="img/charmsbar-icons/brightness.png" alt="" />
                <h3></h3>
            </div>
            <div class="cb_panel_settings_tile cp_panel_settings_tile_changepcsettings" style="position: absolute; padding-left: 0; text-align: right; bottom: 28px" onclick="metro_open('Settings','rgb(81,51,171)',LOCALE_appsnames[1],'../../metro/Settings');charmsbar_hide()"></div>
        </div>
    </div>

    <div class="cb_panel_search cb_panel">
        <h1 class="cb_panel_content_search_header"></h1>
        <div class="content">
            <div class="searchstartbtn" style="width: 28px; height: 28px; position: absolute; top: 22px; left: 275px; background-color: seagreen">
                <span></span>
            </div>
            <input type="text" id="charmsbar-search-input" style="margin-top: 20px; margin-left: 40px; width: 265px; padding-right: 42px" class="metroinput" />
            <div class="results"></div>
        </div>
    </div>

    <div class="cb_panel_personalize cb_panel">
            <span style="top: 35px; left: 40px" id="cb_panel_personalize_backbtn" class="backbtn" onclick="cb_settings()"><span class="s1"></span><span class="s2"></span></span>
            <h1 style="left: 80px" class="cb_panel_content_personalize_header"></h1>
            <div class="content" style="background-color: white; height: calc(100vh - 80px); top: 10px; padding: 35px 40px">
                <div class="ThemesContainer">
                    <div class="theme" onclick="SetStartTheme('22000', 15, 15)"><img src="img/StartScreenImages/preview/22000.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('22100', 16, 16)"><img src="img/StartScreenImages/preview/22100.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21900')"><img src="img/StartScreenImages/preview/21900.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21500')"><img src="img/StartScreenImages/preview/21500.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21700')"><img src="img/StartScreenImages/preview/21700.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21300', 18, 18)"><img src="img/StartScreenImages/preview/21300.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20700', 18, 18)"><img src="img/StartScreenImages/preview/20700.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21200', 6, 6)"><img src="img/StartScreenImages/preview/21200.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20500', 8, 8)"><img src="img/StartScreenImages/preview/20500.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21000', 9, 10)"><img src="img/StartScreenImages/preview/21000.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20800')"><img src="img/StartScreenImages/preview/20800.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20600', 12, 12)"><img src="img/StartScreenImages/preview/20600.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20400', 13, 13)"><img src="img/StartScreenImages/preview/20400.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21400', 13, 13)"><img src="img/StartScreenImages/preview/21400.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21100', 15, 15)"><img src="img/StartScreenImages/preview/21100.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20300')"><img src="img/StartScreenImages/preview/20300.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20200', 1, 12)"><img src="img/StartScreenImages/preview/20200.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('21800', 15, 15)"><img src="img/StartScreenImages/preview/21800.png" alt="" /></div>
                    <div class="theme" onclick="SetStartTheme('20000', 15, 15)"><img src="img/StartScreenImages/preview/20000.png" alt="" /></div>
                    <div class="theme desktop" onclick="SetStartTheme('desktop')"><img alt="" /></div>
                </div>
                <p class="backgroundcolor" style="font-weight: 400; margin: 15px 0px 0px 0px"></p>
                <div style="width: 270px; height: 135px; margin-top: 4px">
                    <table class="b">
                        <tr>
                            <td class="13"></td>
                            <td class="14"></td>
                            <td class="15"></td>
                            <td class="16"></td>
                            <td class="17"></td>
                            <td class="18"></td>
                        </tr>
                        <tr>
                            <td class="7"></td>
                            <td class="8"></td>
                            <td class="9"></td>
                            <td class="10"></td>
                            <td class="11"></td>
                            <td class="12"></td>
                        </tr>
                        <tr>
                            <td class="1"></td>
                            <td class="2"></td>
                            <td class="3"></td>
                            <td class="4"></td>
                            <td class="5"></td>
                            <td class="6"></td>
                        </tr>
                    </table>
                </div>
                <style class="personalize-input-b-style"></style>
                <input type="range" oninput="cb_personalize_b_oninput()" name="" min="1" max="18" value="1" id="cb_personalize_b_inputrange" />
                <p class="foregroundcolor" style="font-weight: 400; margin: 15px 0px 0px 0px"></p>
                <div style="width: 270px; height: 90px; margin-top: 4px">
                    <table class="f">
                        <tr>
                            <td class="7"></td>
                            <td class="8"></td>
                            <td class="9"></td>
                            <td class="10"></td>
                            <td class="11"></td>
                            <td class="12"></td>
                        </tr>
                        <tr>
                            <td class="1"></td>
                            <td class="2"></td>
                            <td class="3"></td>
                            <td class="4"></td>
                            <td class="5"></td>
                            <td class="6"></td>
                        </tr>
                    </table>
                </div>
                <style class="personalize-input-f-style"></style>
                <input type="range" oninput="cb_personalize_f_oninput()" name="" min="1" max="18" value="1" id="cb_personalize_f_inputrange" />
            </div>
        </div>

        <div class="cb_panel_demomode cb_panel">
        <span style="top: 35px; left: 40px" id="cb_panel_demomode_backbtn" class="backbtn" onclick="cb_settings()"><span class="s1"></span><span class="s2"></span></span>
        <h1 style="left: 80px" class="cb_panel_content_demomode_header">Демонстрация</h1>
        <div class="content" style="background-color: white; height: calc(100vh - 80px); top: 10px; padding: 35px 40px">
            <p>Параметры демонстрации</p>
            <input type="checkbox" name="" id="DemomodeDisableStartUI" />
            <label for="DemomodeDisableStartUI" style="vertical-align: 4px">Отключить интерфейс Пуска</label>
        </div>
    </div>

    <div class="cb_panel_tiles cb_panel">
        <span style="top: 35px; left: 40px" id="cb_panel_demomode_backbtn" class="backbtn" onclick="cb_settings()"><span class="s1"></span><span class="s2"></span></span>
        <h1 style="left: 80px" class="cb_panel_content_demomode_header">Плитки</h1>
        <div class="content" style="background-color: white; height: calc(100vh - 80px); top: 10px; padding: 35px 40px">
            <input type="checkbox" name="" id="CB_AppsScreenSmall" />
            <label for="CB_AppsScreenSmall" style="vertical-align: -6px; width: calc(100% - 30px); margin-left: 5px">Показывать больше приложений в представлении "Приложения"</label>
        </div>
    </div>

    <div class="cb_panel_network cb_panel">
        <h1 class="cb_panel_content_network_header" style="position: absolute; top: 32px; left: 40px; color: white; font-size: 28px; font-weight: 100"></h1>
    </div>
`

$('body').append(charmsbar)

var ActivedCharmsbar = null

function cb_settings() {
    charmsbar_hide()
    ActivedCharmsbar = 'settings'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
}

$('.charmsbarBtn_settings').click(cb_settings)

function charmsbar_hide() {
    var prevCharmsbar = ActivedCharmsbar
    $('.cb_panel_' + prevCharmsbar).css('animation', 'cbPanelClose 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.cb_bgforpanel').css('display', 'none')
}

function cb_search() {
    charmsbar_hide()
    ActivedCharmsbar = 'search'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    $('#charmsbar-search-input').val('')
    $('.cb_panel_search .results').html('')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
}

function cb_network() {
    charmsbar_hide()
    ActivedCharmsbar = 'network'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
}

function cb_demomode() {
    charmsbar_hide()
    ActivedCharmsbar = 'demomode'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
}

function cb_tiles() {
    charmsbar_hide()
    ActivedCharmsbar = 'tiles'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
}

var cb_personalize_currentpaletteB
var cb_personalize_currentpaletteF

function cb_personalize_paletteselectB(palette) {
    cb_personalize_currentpaletteB = palette
    for (let i = 1; i < MetroColorPaletteB2[palette].length; i++) {
        let q = i
        $('.cb_panel_personalize table.b td.' + q).css('background-color', 'rgb(' + MetroColorPaletteB2[palette][i] + ')')
    }
}

function cb_personalize_paletteselectF(palette) {
    cb_personalize_currentpaletteF = palette
    for (let i = 1; i < MetroColorPaletteF2[palette].length; i++) {
        let q = i
        $('.cb_panel_personalize table.f td.' + q).css('background-color', 'rgb(' + MetroColorPaletteF2[palette][i] + ')')
    }
}

function cb_personalize() {
    displayStartTiles()
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_background_paletteid') == null) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_color_background_paletteid', '15')
    }
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid') == null) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid', '15')
    }
    charmsbar_hide()
    ActivedCharmsbar = 'personalize'
    $('.cb_panel_' + ActivedCharmsbar).css('display', 'none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation', 'cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display', 'block')
        $('.cb_bgforpanel').css('display', 'block')
    }, 1)
    $('#cb_personalize_b_inputrange').val(localStorage.getItem('OKNA8_user_' + currentUser + '_color_background_paletteid'))
    $('#cb_personalize_f_inputrange').val(localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid'))
    cb_personalize_currentpaletteB = localStorage.getItem('OKNA8_user_' + currentUser + '_color_background_paletteid')
    cb_personalize_currentpaletteF = localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid')
    cb_personalize_paletteselectB(cb_personalize_currentpaletteB)
    cb_personalize_paletteselectF(cb_personalize_currentpaletteF)
    $('.personalize-input-b-style').html('#cb_personalize_b_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteB2[$('#cb_personalize_b_inputrange').val()][0] + ')}')
    $('.personalize-input-f-style').html('#cb_personalize_f_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteB2[$('#cb_personalize_f_inputrange').val()][0] + ')}')
}

$('.cb_panel_personalize table.b td').click((event) => {
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background_paletteid', cb_personalize_currentpaletteB)
    $('.cb_panel_personalize table.b td').removeClass('selected')
    $(event['currentTarget']).addClass('selected')
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background', MetroColorPaletteB2[cb_personalize_currentpaletteB][event['originalEvent']['srcElement']['classList'][0]])
    ColorPaletteApply()
})

$('.cb_panel_personalize table.f td').click((event) => {
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid', cb_personalize_currentpaletteF)
    $('.cb_panel_personalize table.f td').removeClass('selected')
    $(event['currentTarget']).addClass('selected')
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground', MetroColorPaletteF2[cb_personalize_currentpaletteF][event['originalEvent']['srcElement']['classList'][0]])
    ColorPaletteApply()
})

function cb_personalize_b_oninput() {
    $('.personalize-input-b-style').html('#cb_personalize_b_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteB2[$('#cb_personalize_b_inputrange').val()][0] + ')}')
    cb_personalize_paletteselectB($('#cb_personalize_b_inputrange').val())
}

function cb_personalize_f_oninput() {
    $('.personalize-input-f-style').html('#cb_personalize_f_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteF2[$('#cb_personalize_f_inputrange').val()][0] + ')}')
    cb_personalize_paletteselectF($('#cb_personalize_f_inputrange').val())
}

document.getElementById('charmsbar-search-input').oninput = () => {
    $('.cb_panel_search > div > div.results').html('')
    if ($('#charmsbar-search-input').attr('value') != '') {
        for (let i = 0; i < LOCALE_appsnames.length; i++) {
            if (LOCALE_appsnames[i].toLowerCase().indexOf($('#charmsbar-search-input').attr('value').toLowerCase()) != '-1') {
                console.log(LOCALE_searchdata[i][0])
                if (LOCALE_searchdata[i][0] == 'DESKTOP') {
                    $('.cb_panel_search > div > div.results').html($('.cb_panel_search > div > div.results').html() + '<div class="result" id="searchResult_1desktop" onclick="charmsbar_hide();closeStart()"><img id="searchResult_2desktop" src="AppLogo.png"><span id="searchResult_3desktop" style="margin-left:10px;position:absolute;top:6px">' + LOCALE_appsnames[i] + '</span></div>')
                } else if (LOCALE_searchdata[i][0].startsWith('desktop:')) {
                    $('.cb_panel_search > div > div.results').html($('.cb_panel_search > div > div.results').html() + '<div class="result DesktopApp" id="searchResult_1' + LOCALE_searchdata[i][0].replace('desktop:', 'desktop_') + '" onclick="charmsbar_hide();closeStart();Exec(\'' + LOCALE_searchdata[i][0].replace('desktop:', '') + '\')"><div class="iconbackground" style="background-color:' + tilesInfo[LOCALE_searchdata[i][0]][2] + ';"></div><img id="searchResult_2' + LOCALE_searchdata[i][0] + '" src="' + LOCALE_searchdata[i][3] + '"><span id="searchResult_3' + LOCALE_searchdata[i][0] + '" style="margin-left:10px;position:absolute;top:6px">' + LOCALE_appsnames[i] + '</span></div>')
                } else {
                    $('.cb_panel_search > div > div.results').html($('.cb_panel_search > div > div.results').html() + '<div class="result" id="searchResult_1' + LOCALE_searchdata[i][0] + '" onclick="charmsbar_hide();metro_open(\'' + LOCALE_searchdata[i][0] + "','" + LOCALE_searchdata[i][2] + "','" + LOCALE_appsnames[i] + "','" + LOCALE_searchdata[i][3] + '\')"><img id="searchResult_2' + LOCALE_searchdata[i][0] + '" src="' + LOCALE_searchdata[i][3] + '/AppLogo.png"><span id="searchResult_3' + LOCALE_searchdata[i][0] + '" style="margin-left:10px;position:absolute;top:6px">' + LOCALE_appsnames[i] + '</span></div>')
                }
            }
        }
    }
}

if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_background') == null) {
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background', '24,0,82')
}

$('.cb_dropbtn').hover(() => {
    if (window.innerHeight > 1000) {
        $('.cb_dropdown-content > div').css('top', '410px')
    } else {
        $('.cb_dropdown-content > div').css('top', 'calc(50%)')
    }
})

$('.cb_dropbtn_bottom').hover(() => {
    if (window.innerHeight > 1000) {
        $('.cb_dropdown-content > div').css('top', 'calc(100vh - 410px)')
    } else {
        $('.cb_dropdown-content > div').css('top', 'calc(50%)')
    }
})

$('.cb_dropdown3').hover(() => {
    document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('updAnim', '*')
})

if (localStorage.getItem('OKNA8_user_' + currentUser + '_StartScreen_SmallApps') == 'true') {
    $('#CB_AppsScreenSmall').prop('checked', true)
    $('.startScreen > .apps').addClass('SmallApps')
}

$('#CB_AppsScreenSmall').click(function () {
    if ($(this).is(':checked')) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_StartScreen_SmallApps', 'true')
        $('.startScreen > .apps').addClass('SmallApps')
    } else {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_StartScreen_SmallApps')
        $('.startScreen > .apps').removeClass('SmallApps')
    }
})

var charmsbarContent = {
    desktop: [
        ['controlpanel', "Exec('control');charmsbar_hide()"],
        ['personalize', "Exec('control Personalize');charmsbar_hide()"],
        ['pcinfo', "Exec('control SystemInfo');charmsbar_hide()"],
        ['help', ''],
    ],
    start: [
        ['personalize', 'cb_personalize();charmsbar_hide()'],
        ['tiles', 'cb_tiles();charmsbar_hide()'],
        ['help', ''],
    ],
}

function DisplayCharmsContent(id) {
    $('.charmsContent').html('<div class="cb_panel_settings_tile_notactive">' + LOCALE_charmsbar[34][id][0] + '</div>')
    for (let i = 0; i < charmsbarContent[id].length; i++) {
        $('.charmsContent').append('<div class="cb_panel_settings_tile" onclick="' + charmsbarContent[id][i][1] + '">' + LOCALE_charmsbar[34][id][i + 1] + '</div>')
    }
}

// Touchscreen gesture

var CharmsbarOpenedFixed = false

function CharmsTouchMove(e) {
    if (e.targetTouches[0].pageX < innerWidth - 100) {
        CharmsbarOpenedFixed = true
        console.log('Charms Show!')
        $('.cb_dropdown2').css('display', 'block')
        $('.cb_dropdown3').css('display', 'block')
        setTimeout(() => {
            $('.cb_dropdown-content').css('transform', 'translateX(0px)')
        }, 10)
    }
}   

document.addEventListener('touchstart', (e) => {
    if (CharmsbarOpenedFixed) {
        CharmsbarOpenedFixed = false
        setTimeout(() => {
            $('.cb_dropdown-content').attr('style', '')
            setTimeout(() => {
                $('.cb_dropdown2, .cb_dropdown3, .cb_dropdown-content').attr('style', '')
            }, 500)
        }, 100);
    } else if (e.targetTouches[0].pageX > innerWidth - 20) {
        document.addEventListener('touchmove', CharmsTouchMove)
    }
})

document.addEventListener('touchend', (e) => {
    document.removeEventListener('touchmove', CharmsTouchMove)
})
