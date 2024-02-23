//     Список настроек

var settingList = {
    mainpage: [
        ['PcAndDevices', 2],
        ['Accounts', 3],
        ['OneDrive', 4],
        ['SearchNApps', 5],
        ['Privacy', 6],
        ['Network', 7],
        ['TimeNLang', 8],
        ['EaseOfAccess', 9],
        ['UpdateNRecovery', 10],
    ],
    WinActivation: [, []],
    PcAndDevices: [
        'PcInfo',
        [
            ['LockScreen', 1],
            ['PcInfo', 2],
        ],
    ],
    Accounts: [
        'YourAccount',
        [
            ['YourAccount', 1],
            ['LoginMethods', 2],
            ['OtherUsers', 3],
        ],
    ],
    OneDrive: [, []],
    SearchNApps: [, []],
    Privacy: [, []],
    Network: [, []],
    TimeNLang: ['LangNRegion', [['LangNRegion', 1]]],
    EaseOfAccess: [, []],
    UpdateNRecovery: [
        'Recovery',
        [
            //['WindowsUpdate',1],
            ['Recovery', 2],
        ],
    ],
}

//     Код. Не редактировать.

var displayMainPage
var openPage
var openRightPage
var isPageOpened = false

$(document).ready(() => {
    if (typeof require != 'undefined') {
        settingList['UpdateNRecovery'][1].push(['DataExport', 3])
        //settingList['SearchNApps'][1].push(['OknaMods', 1])
        //settingList['SearchNApps'][0] = 'OknaMods'
    }

    openRightPage = (pageID, auto) => {
        if (innerWidth <= 1000 && !auto) {
            $('.leftpanel').css('display', 'none')
            $('.rightpanel').css('display', 'block')
        }
        $('.rightpanel > .cont').css('display', 'none')
        $('.rightpanel > .cont').html(Settings[pageID])
        setTimeout(() => {
            $('.rightpanel > .cont').css('display', 'block')
        }, 1)
        isPageOpened = true
    }
    displayMainPage = () => {
        $('.leftpanel > .cont').html('')
        $('.leftpanel > .cont').css('display', 'none')
        $('.leftpanel > .backbtn').css('display', 'none')
        $('.leftpanel > h1').css('display', 'none')
        $('.leftpanel > h1').html(LOCALE_app_settings[2])
        for (let q = 0; q < settingList['mainpage'].length; q++) {
            $('.leftpanel > .cont').html($('.leftpanel > .cont').html() + '\n<div class="setting" onclick="openPage(\'' + settingList['mainpage'][q][0] + '\')"><h5>' + LOCALE_app_settings[4][settingList['mainpage'][q][1]] + '</h5></div>')
        }
        setTimeout(() => {
            $('.leftpanel > .cont').css('display', 'block')
            $('.leftpanel > h1').css('display', 'block')
        }, 1)
        openRightPage('MainPage', true)
        isPageOpened = false
    }
    openPage = (pagename) => {
        $('.leftpanel > .cont').html('')
        $('.rightpanel > iframe').css('display', 'none')
        $('.leftpanel > .cont').css('display', 'none')
        $('.leftpanel > .backbtn').css('display', 'block')
        $('.leftpanel > h1').css('display', 'none')
        $('.leftpanel > h1').html(LOCALE_app_settings[5][pagename][0])
        for (let q = 0; q < settingList[pagename][1].length; q++) {
            $('.leftpanel > .cont').html($('.leftpanel > .cont').html() + '\n<div class="setting" onclick="openRightPage(\'' + settingList[pagename][1][q][0] + '\')"><h5>' + LOCALE_app_settings[5][pagename][settingList[pagename][1][q][1]] + '</h5></div>')
        }
        setTimeout(() => {
            $('.leftpanel > .cont').css('display', 'block')
            $('.leftpanel > h1').css('display', 'block')
        }, 1)
        openRightPage(settingList[pagename][0], true)
        $('.topbar > .backbtn').attr('onclick', 'openPage("' + pagename + '")')
        isPageOpened = false
        if (innerWidth < 1000) {
            $('.rightpanel').css('display', 'none')
            $('.leftpanel').css('display', 'block')
        }
    }

    setTimeout(() => {
        $('.metrosplash').addClass('metrosplashhideani')
        setTimeout(() => {
            $('.metrosplash').addClass('hidden')
        }, 200)
        if (sessionStorage.getItem('OKNA8_Settings_OpenPage') != null) {
            openRightPage(sessionStorage.getItem('OKNA8_Settings_OpenPage').split('|')[1])
            openPage(sessionStorage.getItem('OKNA8_Settings_OpenPage').split('|')[0])
            sessionStorage.removeItem('OKNA8_Settings_OpenPage')
        } else {
            displayMainPage()
        }
    }, 2000)

    $('body').append(`
        <style>
            a {
                color: rgb(${localStorage.getItem('OKNA8_user_' + currentUser + '_color_foreground')})
            }

            a:hover {
                opacity: 0.9
            }

            a:active {
                opacity: 0.7
            }
        </style>
    `)

    if (innerWidth < 1000) {
        $('.rightpanel').css('display', 'none')
    } else {
        $('.rightpanel').css('display', 'block')
    }
    
    window.addEventListener('resize', () => {
        if (innerWidth < 1000) {
            if (isPageOpened) {
                $('.rightpanel').css('display', 'block')
                $('.leftpanel').css('display', 'none')
            } else {
                $('.rightpanel').css('display', 'none')
                $('.leftpanel').css('display', 'block')
            }
        } else {
            $('.rightpanel').css('display', 'block')
            $('.leftpanel').css('display', 'block')
        }
    })
})
