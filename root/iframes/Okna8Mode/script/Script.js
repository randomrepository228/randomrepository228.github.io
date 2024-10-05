if (localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount') != null) {
    var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount'))
    $('#start_avatar > h1').html(AccountInfo.FirstName)
    $('#start_avatar > h2').html(AccountInfo.LastName)
    $('#start_avatar').addClass('twolines')
} else {
    $('#start_avatar > h1').html(localStorage.getItem('OKNA8_user_' + currentUser + '_username'))
}

if (localStorage.getItem('OKNA8_user_' + currentUser + '_avatar') != null) {
    $("#start_avatar > img").attr('src', localStorage.getItem('OKNA8_user_' + currentUser + '_avatar'))
}

function displayStartApps() {
    $('.tilesContainer').removeClass('min')
    $('.startScreen > .tiles').css('top', '-100vh')
    $('.startScreen > .apps').css('top', '0')
    $('.StartScreenBackground').css('top', StartScreenBackgrounds[localStorage.getItem('OKNA8_user_' + currentUser + '_StartScreenBackground')][4])
}

function displayStartTiles() {
    $('.startScreen > .tiles').css('top', '0')
    $('.startScreen > .apps').css('top', '100vh')
    $('.StartScreenBackground').css('top', '0vh')
    DisplayBackground()
}

window.onmessage = function (event) {
    if (event.data == 'opendesktop') {                                                                                  // Start button
        closeStart()
    } else if (event.data == 'openstart') {
        openStart()
    } else if (event.data.startsWith('ModalMetroDialog|')) {                                                            // Modal Metro dialogs
        ModalMetroDialog(event.data.slice(17))
    } else if (event.data == 'unavailablefunction') {
        FunctionNotRealize()
    } else if (event.data == 'AppNotLocalized') {
        AppNotLocalized()
    } else if (event.data == 'RestartToRecovery') {                                                                     // Reboot
        shutdown('w')
    } else if (event.data.startsWith('export-data')) {                                                                  // Import-Export
        ipcRenderer.send('export-data', 'OKNA8_LOCALSTORAGE_' + VERSION['build'] + '__' + event.data.substring(11))
    } else if (event.data == 'import-data') {
        ipcRenderer.send('import-data')
    } else if (event.data.startsWith('removeUser_')) {                                                                   // Users 
        var user = event.data.substring(11)
        RemoveUser(user)
    } else if (event.data == 'UserCreateDialog') {
        ModalMetroDialog(LOCALE_charmsbar[30])
    }
}

function RemoveUser(user) {
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith('OKNA8_user_' + user)) {
            localStorage.removeItem(localStorage.key(i))
        }
    }
    var Users = localStorage.getItem('OKNA8_users').split('|')
    localStorage.setItem('OKNA8_users', Users.filter(function (f) { return f !== user }).join('|'))
}

function CreateUser(username, userID) {
    var penisID
    if (userID == null) {
        penisID = 'user' + Math.floor(Math.random() * 999999999)
    } else {
        penisID = user
    }
    localStorage.setItem('OKNA8_users', localStorage.getItem('OKNA8_users') + '|' + penisID)
    localStorage.setItem('OKNA8_user_' + penisID + '_username', username)
}

$(document).ready(() => {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        var id = e.target.id
        function ContextmenuAppsContainerNSearch(id, menuselector) {
            if (id == 'desktop') {
                if (localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').indexOf(id) == -1) {
                    $(menuselector).html('<div class="element" onclick="addTile(\'DESKTOP\');displayStartTiles()">' + LOCALE_startscreen[13] + '</div>')
                } else {
                    $(menuselector).html('<div class="element" onclick="removeTile(\'DESKTOP\');displayStartTiles()">' + LOCALE_startscreen[14] + '</div>')
                }
            } else if (!id.startsWith('desktop_')) {
                if (localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').indexOf(id) == -1) {
                    var livetile = '0'
                    if (typeof tilesInfo[id][7] != 'undefined' && tilesInfo[id][7].length != 0) {
                        livetile = '2'
                    }
                    $(menuselector).html('<div class="element" onclick="addTile(\'Metro\',\'' +
                        tilesInfo[id][0][0] + '\',\'' +
                        tilesInfo[id][1] + '\',\'' +
                        tilesInfo[id][2] + '\',\'' +
                        tilesInfo[id][3] + '\',\'' +
                        tilesInfo[id][4] + '\',\'' +
                        tilesInfo[id][5] + '\',\'' +
                        tilesInfo[id][6] + '\',\'' +
                        id + '\',\'' +
                        livetile + 
                        '\');displayStartTiles()">' + LOCALE_startscreen[13] + '</div>')
                } else {
                    $(menuselector).html('<div class="element" onclick="removeTile(\'' + id + '\');displayStartTiles()">' + LOCALE_startscreen[14] + '</div>')
                }
            } else {
                if (localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').indexOf(id) == -1) {
                    $(menuselector).html('<div class="element" onclick="addTile(\'DesktopApp\', \'\', \'\', ' + tilesInfo['desktop:' + id.substring(8)][1] + ',\'' + tilesInfo['desktop:' + id.substring(8)][5] + '\',\'' + tilesInfo['desktop:' + id.substring(8)][4] + '\',\'' + tilesInfo['desktop:' + id.substring(8)][2] + '\',\'' + tilesInfo['desktop:' + id.substring(8)][3] + '\',\'' + id + '\');displayStartTiles()">' + LOCALE_startscreen[13] + '</div>')
                } else {
                    $(menuselector).html('<div class="element" onclick="removeTile(\'' + id + '\');displayStartTiles()">' + LOCALE_startscreen[14] + '</div>')
                }
            }
            var contextmenutop
            if (window.innerHeight < $(menuselector).outerHeight() + 100 + e.clientY) {
                contextmenutop = e.clientY - $(menuselector).outerHeight()
            } else {
                contextmenutop = e.clientY
            }
            var contextmenuleft
            if (window.innerWidth < $(menuselector).outerWidth() + 100 + e.clientX) {
                contextmenuleft = e.clientX - $(menuselector).outerWidth()
            } else {
                contextmenuleft = e.clientX
            }
            $(menuselector).attr('style', 'top: ' + contextmenutop + 'px; left:' + contextmenuleft + 'px')
            $(menuselector).css('display', 'block')
        }
        if (id.startsWith('searchResult')) {
            id = id.slice(14)
            ContextmenuAppsContainerNSearch(id, '.metrocontextmenu')
        } else if (id.startsWith('appInAppsContainer')) {
            id = id.slice(20)
            ContextmenuAppsContainerNSearch(id, '.metrocontextmenucompact')
        } else if (id.startsWith('tile_')) {
            id = id.slice(7)
            $('.metrocontextmenucompact').css('display', 'none')
            $('.metrocontextmenucompact').attr('style', 'top: ' + e.clientY + 'px; left:' + e.clientX + 'px')
            $('.metrocontextmenucompact').html('')
            if (id != 'DESKTOP' && !id.startsWith('desktop_')) {
                $('.metrocontextmenucompact').append('<div class="element">' + LOCALE_startscreen[16] + '<div class="childmenu menusize"></div></div>')
                if (tilesInfo[id][0].indexOf('large') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id + '\', \'large\')">' + LOCALE_startscreen[17] + '</div>')}
                if (tilesInfo[id][0].indexOf('wide') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id + '\', \'wide\')">' + LOCALE_startscreen[18] + '</div>')}
                if (tilesInfo[id][0].indexOf('standart') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id + '\', \'standart\')">' + LOCALE_startscreen[19] + '</div>')}
                $('.metrocontextmenucompact').append('<div class="element" onclick="removeTile(\'' + id + '\')">' + LOCALE_startscreen[14] + '</div>')
                if (typeof tilesInfo[id][7] != 'undefined' && tilesInfo[id][7].length > 0) {
                    if (LiveTiles.indexOf(id) != -1) {
                        $('.metrocontextmenucompact').append('<div class="element" onclick="disableLiveTile(\'' + id + '\')">' + LOCALE_startscreen[21] + '</div>')
                    } else {
                        $('.metrocontextmenucompact').append('<div class="element" onclick="enableLiveTile(\'' + id + '\')">' + LOCALE_startscreen[22] + '</div>')
                    }
                }
            } else if (id != 'DESKTOP' && id.startsWith('desktop_')) {
                if (tilesInfo['desktop:' + id.substring(8)][0].indexOf('large') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id.substring(8) + '\', \'large\')">' + LOCALE_startscreen[17] + '</div>')}
                if (tilesInfo['desktop:' + id.substring(8)][0].indexOf('wide') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id.substring(8) + '\', \'wide\')">' + LOCALE_startscreen[18] + '</div>')}
                if (tilesInfo['desktop:' + id.substring(8)][0].indexOf('standart') != -1) {$('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'' + id.substring(8) + '\', \'standart\')">' + LOCALE_startscreen[19] + '</div>')}
                $('.metrocontextmenucompact').append('<div class="element" onclick="removeTile(\'' + id + '\')">' + LOCALE_startscreen[14] + '</div>')
            } else {
                $('.metrocontextmenucompact').append('<div class="element">' + LOCALE_startscreen[16] + '<div class="childmenu menusize"></div></div>')
                $('.metrocontextmenucompact .childmenu.menusize').append('<div class="element" onclick="ResizeTile(\'desktop\', \'large\')">' + LOCALE_startscreen[17] + '</div><div class="element" onclick="ResizeTile(\'desktop\', \'wide\')">' + LOCALE_startscreen[18] + '</div><div class="element" onclick="ResizeTile(\'desktop\', \'standart\')">' + LOCALE_startscreen[19] + '</div>')
                $('.metrocontextmenucompact').append('<div class="element" onclick="removeTile(\'DESKTOP\')">' + LOCALE_startscreen[14] + '</div>')
            }
            $('.metrocontextmenucompact').css('display', 'block')
        } else if (id == 'desktop-taskbar' || id == 'DesktopTaskbarOpenedWindows') {
            $('.contextmenu').html('<div class="element" onclick="MinimizeWindows()">' + LOCALE_desktop[10] + '</div><div class="separator"></div><div class="element" onclick="Exec(\'taskmgr\')">' + LOCALE_desktop[11] + '</div><div class="separator"></div><div class="element" onclick="Exec(\'cpl:taskbarproperties\')">' + LOCALE_desktop[12] + '</div>')
            $('.contextmenu').append('<div class="verticalSeparator"></div>')
            var contextmenutop
            if (window.innerHeight < $('.contextmenu').outerHeight() + 100 + e.clientY) {
                contextmenutop = e.clientY - $('.contextmenu').outerHeight()
            } else {
                contextmenutop = e.clientY
            }
            var contextmenuleft
            if (window.innerWidth < $('.contextmenu').outerWidth() + 100 + e.clientX) {
                contextmenuleft = e.clientX - $('.contextmenu').outerWidth()
            } else {
                contextmenuleft = e.clientX
            }
            $('.contextmenu').attr('style', 'top: ' + contextmenutop + 'px; left:' + contextmenuleft + 'px')
            $('.contextmenu').css('display', 'block')
        }
    })

    setTimeout(() => {
        updateAppsContainer()
    }, 1000)
})

document.addEventListener('click', () => {
    $('.metrocontextmenu').attr('style', '')
    $('.metrocontextmenucompact').attr('style', '')
    $('.contextmenu').attr('style', '')
})

function CharmsShutdown() {
    $('.metrocontextmenu').html(`
    <div class="element" onclick="shutdown('s')">${LOCALE_startscreen[2]}</div>
    <div class="element" onclick="shutdown('r')">${LOCALE_startscreen[3]}</div>`)
    setTimeout(() => {
        $('.metrocontextmenu').attr('style', 'bottom: 178px; right:110px;display:block')
    }, 1)
}

function DisplayPowerMenuOnStart() {
    $('.metrocontextmenu').html(`
    <div class="element" onclick="shutdown('s')">${LOCALE_startscreen[2]}</div>
    <div class="element" onclick="shutdown('r')">${LOCALE_startscreen[3]}</div>`)
    setTimeout(() => {
        $('.metrocontextmenu').attr('style', 'top: 110px; right:52px;display:block')
    }, 1)
}

function DisplayAvatarMenuOnStart() {
    $('.metrocontextmenu').html(`
    <div class="element" onclick="sessionStorage.setItem('OKNA8_Settings_OpenPage', 'Accounts|YourAccount');metro_open('Settings','rgb(81,51,171)','${LOCALE_appsnames[1]}','../../metro/Settings')">${LOCALE_startscreen[4]}</div>
    <div class="element" onclick="lock()">${LOCALE_startscreen[5]}</div>
    <div class="element" onclick="shutdown('l')">${LOCALE_startscreen[6]}</div>`)
    setTimeout(() => {
        $('.metrocontextmenu').attr('style', 'top: 110px; right:162px;display:block')
    }, 1)
}

if (VERSION['prerelease'] == true && localStorage.getItem('OKNA8_remove-watermark') == null) {
    $('.build').html('Okna8 pre-release<br>' + VERSION['ver'])
    $('.watermark').html('Okna8 pre-release ' + VERSION['ver'] + '<br><span style="font-size:16px;font-family:\'segoeui\'">If You found bag, please contact me</a></span>')
}

if (localStorage.getItem('OKNA8_scale150') == 'true') {
    $('body').addClass('scale150')
}

function MinimizeTiles() {
    $('.tilesContainer').toggleClass('min')
}

function CloseNotify() {
    $('.MetroNotification').css('animation', 'MetroNotifyCloseAnim 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    setTimeout(() => {
        $('.MetroNotification').css('display', 'none')
        $('.MetroNotifyContainer').css('display', 'none')
    }, 300)
}

function DisplayNotify(content, onclick) {
    PlaySound('Windows Notify System Generic.wav')
    $('.MetroNotifyContainer').css('display', 'block')
    $('.MetroNotification').css('animation', 'MetroNotifyAnim 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)')
    $('.MetroNotification').html(content + '<div class="Close" onclick="CloseNotify()"><p></p></div>')
    $('.MetroNotification').attr('onclick', 'CloseNotify();' + onclick)
    $('.MetroNotification').css('display', 'block')
    setTimeout(() => {
        CloseNotify()
    }, 10000)
}