$(document).ready(()=>{
    // Startscreen
    $('#startscreen_Start-label').html(LOCALE_startscreen[1])
    $('#startscreen_Apps-label').html(LOCALE_startscreen[7])
    $('#start_window_power_shutdown').html(LOCALE_startscreen[2])
    $('#start_window_power_restart').html(LOCALE_startscreen[3])
    $('#start_window_avatar_change').html(LOCALE_startscreen[4])
    $('#start_window_avatar_lock').html(LOCALE_startscreen[5])
    $('#start_window_avatar_exit').html(LOCALE_startscreen[6])

    // Charmsbar
    $('#charmsbar_drop_search_text').html(LOCALE_charmsbar[1])
    $('#charmsbar_drop_share_text').html(LOCALE_charmsbar[2])
    $('#charmsbar_drop_devices_text').html(LOCALE_charmsbar[4])
    $('#charmsbar_drop_settings_text').html(LOCALE_charmsbar[5])
    $('.cb_panel_content_settings_header').html(LOCALE_charmsbar[6])
    $('#cb_panel_settings_tile_start').html(LOCALE_startscreen[8])
    $('#cb_panel_settings_tile_personalizestart').html(LOCALE_startscreen[9])
    $('#cb_panel_settings_tile_tiles').html(LOCALE_startscreen[10])
    $('#cb_panel_settings_tile_helpstart').html(LOCALE_startscreen[11])
    $('#cb_panel_settings_tile_desktop').html(LOCALE_desktop[1])
    $('#cb_panel_settings_tile_personalizedesktop').html(LOCALE_desktop[3])
    $('#cb_panel_settings_tile_pcinfo').html(LOCALE_desktop[4])
    $('#cb_panel_settings_tile_helpdesktop').html(LOCALE_desktop[5])
    $('#cb_panel_settings_tile_control').html(LOCALE_desktop[2])
    $('.cb_panel_personalize p.backgroundcolor').html(LOCALE_charmsbar[20])
    $('.cb_panel_personalize p.foregroundcolor').html(LOCALE_charmsbar[21])
    $('.cb_panel_content_personalize_header').html(LOCALE_charmsbar[14])
    $('.cp_panel_settings_tile_changepcsettings').html(LOCALE_charmsbar[7])
    $('.cb_panel_settings_bigtile_notifications > h3').html(LOCALE_charmsbar[11])
    $('.cb_panel_settings_bigtile_shutdown > h3').html(LOCALE_charmsbar[12])
    $('.cb_panel_settings_bigtile_keyboard > h3').html(LOCALE_charmsbar[13])
    $('.cb_panel_settings_bigtile_net > h3').html(LOCALE_charmsbar[8])
    $('.cb_panel_settings_bigtile_sound > h3').html(LOCALE_charmsbar[9])
    $('.cb_panel_settings_bigtile_brightness > h3').html(LOCALE_charmsbar[10])
    $('.cb_panel_appinfo_header > h1').html(LOCALE_charmsbar[16])
    $('.cb_panel_settings_tile_appinfo').html(LOCALE_charmsbar[15])
    $('.cb_panel_content_search_header').html(LOCALE_charmsbar[17])
    document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('LocalizedLabel|' + LOCALE_charmsbar[3], '*')

    // Other
    if (VERSION.additionalFeatures.IsWebVersion) {
        $('.build').html(VERSION['ver'])
    } else {
        $('.build').html(VERSION['productName'] + ' ' + VERSION['ver'] + '<br>Build ' + VERSION['build'])
    }
    $('.desktop-taskbar-window-lang > h5').html(LOCALE_desktop[6])
    $('.desktop-taskbar-window-lang > p').html(LOCALE_desktop[7])
})