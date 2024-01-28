//     Список настроек

var settingList = {
    'mainpage': [
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
    'WinActivation': [, [
    ]],
    'PcAndDevices': ['PcInfo', [
        ['LockScreen', 1],
        ['PcInfo', 2],
    ]],
    'Accounts': ['YourAccount', [
        ['YourAccount', 1],
        ['LoginMethods', 2],
        ['OtherUsers', 3],
    ]],
    'OneDrive': [, [
    ]],
    'SearchNApps': [, [
        
    ]],
    'Privacy': [, [
    ]],
    'Network': [, [
    ]],
    'TimeNLang': ['LangNRegion', [
        ['LangNRegion', 1]
    ]],
    'EaseOfAccess': [, [
    ]],
    'UpdateNRecovery': ['Recovery', [
        //['WindowsUpdate',1],
        ['Recovery', 2],
    ]]
}


//     Код. Не редактировать.


var displayMainPage
var openPage
var openRightPage

$(document).ready(() => {
    if (typeof require != 'undefined') {
        settingList['UpdateNRecovery'][1].push(['DataExport', 3])
        //settingList['SearchNApps'][1].push(['OknaMods', 1])
        //settingList['SearchNApps'][0] = 'OknaMods'
    }

    openRightPage = (pageID) => {
        $('.rightpanel > .cont').css('display', 'none')
        $('.rightpanel > .cont').html(Settings[pageID])
        setTimeout(() => {
            $('.rightpanel > .cont').css('display', 'block')
        }, 1)
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
        openRightPage('MainPage')
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
        openRightPage(settingList[pagename][0])
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
})        