window.addEventListener('message', function (event) {
    if (event.data.startsWith('YourID-')) {
        WindowID = Number(event.data.replace('YourID-', ''))

        $('#properties_tab_taskbar').prepend(LOCALE_cpl_taskbarProperties[2])
        $('#properties_tab_nav').prepend(LOCALE_cpl_taskbarProperties[3])
        $('#properties_tab_jumplists').prepend(LOCALE_cpl_taskbarProperties[4])
        $('#properties_tab_toolboxes').prepend(LOCALE_cpl_taskbarProperties[5])

        $('label[for="PinTaskbarCheckbox"]').html(LOCALE_cpl_taskbarProperties[6])
        $('label[for="AutoHideTaskbarCheckbox"]').html(LOCALE_cpl_taskbarProperties[7])
        $('label[for="SmallTaskbarCheckbox"]').html(LOCALE_cpl_taskbarProperties[8])
        $('#TaskbarLocationSelect option[value="bottom"]').html(LOCALE_cpl_taskbarProperties[9])
        $('#TaskbarLocationSelect option[value="left"]').html(LOCALE_cpl_taskbarProperties[10])
        $('#TaskbarLocationSelect option[value="right"]').html(LOCALE_cpl_taskbarProperties[11])
        $('#TaskbarLocationSelect option[value="top"]').html(LOCALE_cpl_taskbarProperties[12])
        $('label[for="TaskbarLocationSelect"]').html(LOCALE_cpl_taskbarProperties[13])
        $('#GroupTaskIconsSelect option[value="1"]').html(LOCALE_cpl_taskbarProperties[14])
        $('#GroupTaskIconsSelect option[value="2"]').html(LOCALE_cpl_taskbarProperties[15])
        $('#GroupTaskIconsSelect option[value="3"]').html(LOCALE_cpl_taskbarProperties[16])
        $('label[for="GroupTaskIconsSelect"]').html(LOCALE_cpl_taskbarProperties[17])
        $('#NotificationSetupButton').html(LOCALE_cpl_taskbarProperties[18])
        $('label[for="NotificationSetupButton"]').html(LOCALE_cpl_taskbarProperties[19])
        $('label[for="ShowStoreAppsOnTaskbarCheckbox"]').html(LOCALE_cpl_taskbarProperties[20])
        $('label[for="ShowDesktopWhenIHoverMouseToRightBottomCorner"]').html(LOCALE_cpl_taskbarProperties[21])
        $('#HowToSettingTaskbarLink').html(LOCALE_cpl_taskbarProperties[22])
        
        sendToTop('SetWindowHeader' + WindowID + '|' + LOCALE_cpl_taskbarProperties[1])
    }
})