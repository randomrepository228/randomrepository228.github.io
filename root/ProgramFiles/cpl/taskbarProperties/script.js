var WindowID
var LOCALE_cpl_taskbarProperties = []

function killWindow () {
    sendToTop('KillWindow_' + WindowID)
}

ConnectScript('../../../../localization/' + localStorage.getItem('OKNA8_locale') + '/cpl/taskbarProperties.js')
ConnectScript('localization.js')

var currentUser = sessionStorage.getItem('OKNA8_sessionUser')

$('#GroupTaskIconsSelect option[value="' + localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_GroupTaskIcons') + '"]').prop('selected', true)
$('#TaskbarLocationSelect option[value="' + localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_TaskbarLocation') + '"]').prop('selected', true)
if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_ShowDesktopWhenIHoverMouseToRightBottomCorner') == 'true') {
    $('#ShowDesktopWhenIHoverMouseToRightBottomCornerCheckbox').prop('checked', true)
}
if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_SmallTaskbar') == 'true') {
    $('#SmallTaskbarCheckbox').prop('checked', true)
}
if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_AutoHideTaskbar') == 'true') {
    $('#AutoHideTaskbarCheckbox').prop('checked', true)
}
if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_ShowStoreAppsOnTaskbar') == 'false') {
    $('#ShowStoreAppsOnTaskbarCheckbox').prop('checked', false)
}
if (localStorage.getItem('OKNA8_user_' + currentUser + '_taskbar_PinTaskbar') == 'false') {
    $('#PinTaskbarCheckbox').prop('checked', false)
}
/*if (localStorage.getItem('OKNA8_user_' + currentUser + '_GoToDesktopInsteadOfStartscreen') == 'true') {
    $('#').prop('checked', true)
}
*/
function Apply() {
    localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_GroupTaskIcons', $('#GroupTaskIconsSelect').val())
    localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_TaskbarLocation', $('#TaskbarLocationSelect').val())
    if ($('#ShowDesktopWhenIHoverMouseToRightBottomCornerCheckbox').prop('checked')) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_ShowDesktopWhenIHoverMouseToRightBottomCorner', 'true')
    } else {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_taskbar_ShowDesktopWhenIHoverMouseToRightBottomCorner')
    }
    if ($('#ShowStoreAppsOnTaskbarCheckbox').prop('checked')) {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_taskbar_ShowStoreAppsOnTaskbar')
    } else {
        localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_ShowStoreAppsOnTaskbar', 'false')
    }
    if ($('#SmallTaskbarCheckbox').prop('checked')) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_SmallTaskbar', 'true')
    } else {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_taskbar_SmallTaskbar')
    }
    if ($('#AutoHideTaskbarCheckbox').prop('checked')) {
        localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_AutoHideTaskbar', 'true')
    } else {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_taskbar_AutoHideTaskbar')
    }
    if ($('#PinTaskbarCheckbox').prop('checked')) {
        localStorage.removeItem('OKNA8_user_' + currentUser + '_taskbar_PinTaskbar')
    } else {
        localStorage.setItem('OKNA8_user_' + currentUser + '_taskbar_PinTaskbar', 'false')
    }
    setTimeout(() => {
        sendToTop('UpdateTaskbar')
    }, 100)
}