window.addEventListener('message', function (event) {
    if (event.data.startsWith('YourID-')) {
        WindowID = Number(event.data.replace('YourID-', ''))
        sendToTop('SetWindowIcon' + WindowID + '|' + 'img/shell/imageres/27.ico')
        sendToTop('SetWindowHeader' + WindowID + '|' + LOCALE_control[1])
    } else if (event.data.startsWith('Arguments-')) {
        if (event.data.substring(10).split(' ')[0] != '') {
            OpenControlContentPage(event.data.substring(10).split(' ')[0])
        }
    }
})

var CurrentPage = 'MainPage'

var ScriptsAfterPageLoad = {
    'SystemInfo': () => {
        if (ConfigPC['RAM'] < 1024) {
            $('#CONTROLPANEL_SystemInfo_RAM').html(ConfigPC['RAM'] + ' ' + LOCALE_control[2]['SystemInfo'][2])
        } else {
            $('#CONTROLPANEL_SystemInfo_RAM').html((ConfigPC['RAM'] / 1024).toFixed(2).replace('.', ',') + ' ' + LOCALE_control[2]['SystemInfo'][1])
        }
        $('#CONTROLPANEL_SystemInfo_CPU').html(ConfigPC['CPU'] + ' ' + (ConfigPC['CPUFreq'] / 1000).toFixed(2) + ' GHz')
        $('#CONTROLPANEL_SystemInfo_PcName').html(localStorage.getItem('OKNA8_pcname'))
        $('#CONTROLPANEL_SystemInfo_FullPcName').html(localStorage.getItem('OKNA8_pcname'))
    },
    'Personalize': () => {
        OpenPersonalizePage()
    }
}

var CplPaths = {
    'SystemInfo': ['SystemNSecurity'],
    'SystemNSecurity': [],
    'AppearanceNPersonalize': [],
    'Personalize': ['AppearanceNPersonalize'],
    'WindowColors': ['AppearanceNPersonalize', 'Personalize'],
}

function OpenControlContentPage(PageID) {
    CurrentPage = PageID
    $('.controlContent').css('display', 'none')
    $('#ControlContent' + PageID).css('display', 'block')
    $('.adressbar').html('<div onclick="OpenControlContentPage(\'MainPage\')">' + LOCALE_control[2]['MainPage'][0] + '</div>')
    if (PageID != 'MainPage') {
        for (let i = 0; i < CplPaths[PageID].length; i++) {
            $('.adressbar').append('<div onclick="OpenControlContentPage(\'' + CplPaths[PageID][i] + '\')">' + LOCALE_control[2][CplPaths[PageID][i]][0] + '</div>')
        }
        $('.adressbar').append('<div onclick="OpenControlContentPage(\'' + PageID + '\')">' + LOCALE_control[2][PageID][0] + '</div>')
    }
    sendToTop('SetWindowHeader' + WindowID + '|' + LOCALE_control[2][PageID][0])
    setTimeout(() => {
        if (ScriptsAfterPageLoad[PageID] != null) {
            ScriptsAfterPageLoad[PageID]()
        }
    }, 10)
}