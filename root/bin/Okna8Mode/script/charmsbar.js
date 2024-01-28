var ActivedCharmsbar = null

function cb_settings () {
    charmsbar_hide()
    ActivedCharmsbar = 'settings'
    $('.cb_panel_' + ActivedCharmsbar).css('display','none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation','cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display','block')
        $('.cb_bgforpanel').css('display','block')
    }, 1)
}

$('.charmsbarBtn_settings').click(cb_settings)

function charmsbar_hide () {
    var prevCharmsbar = ActivedCharmsbar
    $('.cb_panel_' + prevCharmsbar).css('animation','cbPanelClose 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.cb_bgforpanel').css('display','none')
}

function cb_search () {
    charmsbar_hide()
    ActivedCharmsbar = 'search'
    $('.cb_panel_' + ActivedCharmsbar).css('display','none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation','cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display','block')
        $('.cb_bgforpanel').css('display','block')
    }, 1)
}

function cb_network () {
    charmsbar_hide()
    ActivedCharmsbar = 'network'
    $('.cb_panel_' + ActivedCharmsbar).css('display','none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation','cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display','block')
        $('.cb_bgforpanel').css('display','block')
    }, 1)
}

function cb_demomode () {
    charmsbar_hide()
    ActivedCharmsbar = 'demomode'
    $('.cb_panel_' + ActivedCharmsbar).css('display','none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation','cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display','block')
        $('.cb_bgforpanel').css('display','block')
    }, 1)
}

var cb_personalize_currentpaletteB
var cb_personalize_currentpaletteF

function cb_personalize_paletteselectB (palette) {
    cb_personalize_currentpaletteB = palette
    for (let i = 1; i < MetroColorPaletteB2[palette].length; i++) {
        let q = i
        $('.cb_panel_personalize table.b td.' + q).css('background-color','rgb(' + MetroColorPaletteB2[palette][i] + ')')
    }
}

function cb_personalize_paletteselectF (palette) {
    cb_personalize_currentpaletteF = palette
    for (let i = 1; i < MetroColorPaletteF2[palette].length; i++) {
        let q = i
        $('.cb_panel_personalize table.f td.' + q).css('background-color','rgb(' + MetroColorPaletteF2[palette][i] + ')')
    }
}

function cb_personalize () {
    displayStartTiles()
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_background_paletteid') == null) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_color_background_paletteid','15')
    }
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid') == null) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid','15')
    }
    charmsbar_hide()
    ActivedCharmsbar = 'personalize'
    $('.cb_panel_' + ActivedCharmsbar).css('display','none')
    setTimeout(() => {
        $('.cb_panel_' + ActivedCharmsbar).css('animation','cbPanelAni 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.cb_panel_' + ActivedCharmsbar).css('display','block')
        $('.cb_bgforpanel').css('display','block')
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

$('.cb_panel_personalize table.b td').click((event)=>{
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background_paletteid', cb_personalize_currentpaletteB)
    $('.cb_panel_personalize table.b td').removeClass('selected')
    $(event['currentTarget']).addClass('selected')
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background',MetroColorPaletteB2[cb_personalize_currentpaletteB][event['originalEvent']['srcElement']['classList'][0]])
    ColorPaletteApply()
})

$('.cb_panel_personalize table.f td').click((event)=>{
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground_paletteid', cb_personalize_currentpaletteF)
    $('.cb_panel_personalize table.f td').removeClass('selected')
    $(event['currentTarget']).addClass('selected')
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_foreground',MetroColorPaletteF2[cb_personalize_currentpaletteF][event['originalEvent']['srcElement']['classList'][0]])
    ColorPaletteApply()
})

function cb_personalize_b_oninput () {
    $('.personalize-input-b-style').html('#cb_personalize_b_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteB2[$('#cb_personalize_b_inputrange').val()][0] + ')}')
    cb_personalize_paletteselectB($('#cb_personalize_b_inputrange').val())
}

function cb_personalize_f_oninput () {
    $('.personalize-input-f-style').html('#cb_personalize_f_inputrange::-webkit-slider-thumb { background-color:rgb(' + MetroColorPaletteF2[$('#cb_personalize_f_inputrange').val()][0] + ')}')
    cb_personalize_paletteselectF($('#cb_personalize_f_inputrange').val())
}

document.getElementById('charmsbar-search-input').oninput = ()=>{
    var tested = 1
    $('.cb_panel_search > div > div.results').html('')
    function search () {
        if (LOCALE_appsnames.length != tested) {
            if (LOCALE_appsnames[tested].toLowerCase().indexOf($('#charmsbar-search-input').attr('value').toLowerCase()) != '-1') {
                if (LOCALE_searchdata[tested][0] == 'DESKTOP') {
                    $('.cb_panel_search > div > div.results').html($('.cb_panel_search > div > div.results').html() + '<div class="result" id="searchResult_1desktop" onclick="charmsbar_hide();closeStart()"><img id="searchResult_2desktop" src="AppLogo.png"><span id="searchResult_3desktop" style="margin-left:10px;position:absolute;top:6px">' + LOCALE_appsnames[tested] + '</span></div>')
                } else {
                    $('.cb_panel_search > div > div.results').html($('.cb_panel_search > div > div.results').html() + '<div class="result" id="searchResult_1' + LOCALE_searchdata[tested][0] + '" onclick="charmsbar_hide();metro_open(\'' + LOCALE_searchdata[tested][0] + '\',\'' + LOCALE_searchdata[tested][2] + '\',\'' + LOCALE_appsnames[tested] + '\',\'' + LOCALE_searchdata[tested][3] + '\')"><img id="searchResult_2' + LOCALE_searchdata[tested][0] + '" src="' + LOCALE_searchdata[tested][3] + '/AppLogo.png"><span id="searchResult_3' + LOCALE_searchdata[tested][0] + '" style="margin-left:10px;position:absolute;top:6px">' + LOCALE_appsnames[tested] + '</span></div>')
                }
            }
            tested = tested + 1
            search()
        }
    }
    if ($('#charmsbar-search-input').attr('value') != '') {
        search()
    }
}

if (localStorage.getItem('OKNA8_user_' + currentUser + '_color_background') == null) {
    localStorage.setItem('OKNA8_user_' + currentUser + '_color_background', '24,0,82')
}

$('.cb_dropbtn').hover(()=>{
    if (window.innerHeight > 1000) {
        $('.cb_dropdown-content > div').css('top', '410px')
    } else {
        $('.cb_dropdown-content > div').css('top', 'calc(50%)')
    }
})

$('.cb_dropbtn_bottom').hover(()=>{
    if (window.innerHeight > 1000) {
        $('.cb_dropdown-content > div').css('top', 'calc(100vh - 410px)')
    } else {
        $('.cb_dropdown-content > div').css('top', 'calc(50%)')
    }
})

$('.cb_dropdown3').hover(()=>{    
    document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('updAnim', '*')
})