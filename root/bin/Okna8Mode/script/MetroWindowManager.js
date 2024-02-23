var openedApps = []

var closeStart, openStart

setTimeout(() => {
    closeStart = () => {
        DisplayCharmsContent('desktop')
        $('.tilesContainer').removeClass('min')
        $('.metrowindow').css('display', 'none')
        document.getElementById('startbutton').contentWindow.postMessage('desktop-opened', '*')
        document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('desktop-opened', '*')
        $('.cb_panel_content_desktop').removeClass('hidden')
        $('.cb_panel_content_start').addClass('hidden')
        $('#startButtonOnDesktop').removeClass('startButtonOnStart')
        $('#startButtonOnDesktop').addClass('startButtonOnDesktop')
        $('.tilesContainer').css('animation', 'hideallopendesktop cubic-bezier(0.1, 0.9, 0.2, 1) 0.2s forwards')
        $('.startScreen').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.2s forwards')
        startIsOpened = 0
        setTimeout(() => {
            if (startIsOpened != 1) {
                $('.startScreen').css('display', 'none')
            }
        }, 200)
    }

    openStart = () => {
        DisplayCharmsContent('start')
        $('.tilesContainer').css('animation', '')
        document.getElementById('startbutton').contentWindow.postMessage('start-opened', '*')
        document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('start-opened', '*')
        startIsOpened = 1
        updtilescontainer()
        $('.cb_panel_content_desktop').addClass('hidden')
        $('.cb_panel_content_start').removeClass('hidden')
        $('#startButtonOnDesktop').addClass('startButtonOnStart')
        $('#startButtonOnDesktop').removeClass('startButtonOnDesktop')
        StartScreenAnimation()
        $('.startScreen').css('animation', 'fadeani 0.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.startScreen').css('display', 'block')
        $('.tiles').css('animation', 'none')
        $('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('opacity', '0')
        $('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('animation', 'fadeani 2s 0.1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    }

    function startButtonOnDesktopPress() {
        if (startIsOpened == 1) {
            closeStart()
        } else {
            openStart()
        }
    }

    if (localStorage.getItem('OKNA8_user_' + currentUser + '_GoToDesktopInsteadOfStartscreen') == 'true') {
        closeStart()
    } else {
        openStart()
    }
}, 1000)

function metro_open_fromstartscreen(appname, color, position, tiletype, headername, path) {
    $('.tilesContainer').removeClass('min')
    RemoveFocusFromWindows()
    if (openedApps.indexOf(appname) >= 0) {
        $('.metrowindow').css('display', 'none')
        $('#metrowindow_' + appname).css('display', 'block')
        document.getElementById('startbutton').contentWindow.postMessage('app-opened', '*')
        document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('app-opened', '*')
        startIsOpened = 0
        $('.cb_panel_content_desktop').removeClass('hidden')
        $('.cb_panel_content_start').addClass('hidden')
        $('#startButtonOnDesktop').removeClass('startButtonOnStart')
        $('#startButtonOnDesktop').addClass('startButtonOnDesktop')
        $('.tilesContainer').css('animation', 'hideallopendesktop cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        $('.startScreen').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
        $('.startScreen .tiles').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        $('.startScreen .apps').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        setTimeout(function () {
            $('.tilesContainer').css('animation', '')
            $('.startScreen').css('animation', '')
            $('.startScreen .tiles').css('animation', '')
            $('.startScreen .apps').css('animation', '')
            $('.startScreen').css('display', 'none')
        }, 500)
    } else {
        openedApps.push(appname)
        $('#startscreen_Start-label, .tilesContainer > div, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('animation', 'none')
        $('#startscreen_Start-label, .tilesContainer > div, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('transition', 'cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s')
        $('#startscreen_Start-label, .tilesContainer > div, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('opacity', '0')
        $('.tilesContainer > div').css('transform', 'translateX(100px)')
        $('.AppSplashContainer').css('top', position['top'])
        $('.AppSplashContainer').css('left', position['left'])
        $('#tile_1_' + appname).css('transition', 'none')
        $('#tile_1_' + appname).css('opacity', '0')
        if (tiletype == 'standart') {
            $('.AppSplashContainer').css('scale', 120 / window.innerWidth + ' ' + 120 / window.innerHeight)
        }
        if (tiletype == 'wide') {
            $('.AppSplashContainer').css('scale', 248 / window.innerWidth + ' ' + 120 / window.innerHeight)
        }
        if (tiletype == 'large') {
            $('.AppSplashContainer').css('scale', 248 / window.innerWidth + ' ' + 248 / window.innerHeight)
        }
        $('.AppSplashContainer > .Splash').css('background-color', color)
        $('.AppSplashContainer').css('display', 'block')
        $('.AppSplashContainer > .Splash').css('display', 'block')
        setTimeout(() => {
            $('.AppSplashContainer > .Splash > img').attr('src', 'apps/classic/desktop/' + path + '/AppSplash.png')
        }, 160)
        setTimeout(function () {
            $('<div class="metrowindow" id="metrowindow_' + appname + '"><div class="metroAppHeader_container"><div class="metroAppHeader_dropbtn"></div><div class="metroAppHeader" id="MetroAppHeader_' + appname + '"><img class="metroIcon" src="apps/classic/desktop/' + path + '/headericon.png" alt=""><h6 id="MetroAppHeaderText_' + appname + '">' + headername + '</h6><div onclick=" closemetroapp(\'' + appname + '\')" class="METRO_close"></div><div onclick=" minimizemetroapp(\'' + appname + '\')" class="METRO_minimize"></div></div></div><iframe src="apps/classic/desktop/' + path + '/index.html" frameborder="0"></iframe></div>').appendTo('.metrowindows-container')
            $('#metrowindow_' + appname + ' iframe')[0].addEventListener('load', function () {
                log('Документ внутри фрейма загружен полностью.')
                $('.AppSplashContainer').attr('style', '')
                $('.AppSplashContainer > .Splash').attr('style', '')
                $('.AppSplashContainer > .Splash > img').attr('src', '')
            })
        }, 900)
        setTimeout(function () {
            document.getElementById('startbutton').contentWindow.postMessage('app-opened', '*')
            document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('app-opened', '*')
            startIsOpened = 0
            $('.startScreen').css('display', 'none')
            $('.cb_panel_content_desktop').removeClass('hidden')
            $('.cb_panel_content_start').addClass('hidden')
            $('#startscreen_Start-label, .tilesContainer > div, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('transition', 'none')
            $('#startscreen_Start-label, .tilesContainer > div, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('opacity', '1')
            $('.tilesContainer > .tile').css('transform', 'translateX(0px)')
            $('#metrowindow_' + appname + ' .metroAppHeader').attr('id', 'metrowindow_' + appname + '_header')
        }, 1000)
        $('.desktop-taskbar .openedWindows').append('<div id="TaskbarOpenedWindow_Metro_' + appname + '" onclick="metro_open(\'' + appname + '\')"><div></div><img draggable="false" src="apps/classic/desktop/' + path + '/headericon.png" alt=""></div>')
    }
}

function metro_open(appname, color, headername, path) {
    RemoveFocusFromWindows()
    $('.tilesContainer').removeClass('min')
    if (openedApps.indexOf(appname) >= 0) {
        $('.metrowindow').css('display', 'none')
        $('#metrowindow_' + appname).css('display', 'block')
        document.getElementById('startbutton').contentWindow.postMessage('app-opened', '*')
        document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('app-opened', '*')
        startIsOpened = 0
        $('.cb_panel_content_desktop').removeClass('hidden')
        $('.cb_panel_content_start').addClass('hidden')
        $('#startButtonOnDesktop').removeClass('startButtonOnStart')
        $('#startButtonOnDesktop').addClass('startButtonOnDesktop')
        $('.tilesContainer').css('animation', 'hideallopendesktop cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        $('.startScreen').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
        $('.startScreen .tiles').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        $('.startScreen .apps').css('animation', 'fadeani2 cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s forwards')
        setTimeout(function () {
            $('.startScreen').css('display', 'none')
        }, 500)
    } else {
        $('.metrowindow').css('display', 'none')
        openedApps.push(appname)
        $('.AppSplashContainerV2 .SplashV2').css('background', color)
        $('.AppSplashContainerV2').css('display', 'block')
        $('.AppSplashContainerV2 .SplashV2').css('display', 'block')
        $('.AppSplashContainerV2 .SplashV2 img').attr('src', 'apps/classic/desktop/' + path + '/AppSplash.png')
        setTimeout(function () {
            $('<div class="metrowindow" id="metrowindow_' + appname + '"><div class="metroAppHeader_container"><div class="metroAppHeader_dropbtn"></div><div class="metroAppHeader" id="MetroAppHeader_' + appname + '"><img class="metroIcon" src="apps/classic/desktop/' + path + '/headericon.png" alt=""><h6 id="MetroAppHeaderText_' + appname + '">' + headername + '</h6><div onclick=" closemetroapp(\'' + appname + '\')" class="METRO_close"></div><div onclick=" minimizemetroapp(\'' + appname + '\')" class="METRO_minimize"></div></div></div><iframe src="apps/classic/desktop/' + path + '/index.html" frameborder="0"></iframe></div>').appendTo('.metrowindows-container')
        }, 600)
        setTimeout(function () {
            displayStartTiles()
            document.getElementById('startbutton').contentWindow.postMessage('app-opened', '*')
            document.getElementById('StartbuttonCharmsbar').contentWindow.postMessage('app-opened', '*')
            startIsOpened = 0
            $('.cb_panel_content_desktop').removeClass('hidden')
            $('.cb_panel_content_start').addClass('hidden')
            $('.AppSplashContainerV2').css('display', 'none')
            $('.AppSplashContainerV2 .SplashV2').attr('style', '')
            $('.AppSplashContainerV2 .SplashV2 img').attr('src', '')
            $('.startScreen').css('display', 'none')
            displayStartTiles()
        }, 750)
        $('.desktop-taskbar .openedWindows').append('<div id="TaskbarOpenedWindow_Metro_' + appname + '" onclick="metro_open(\'' + appname + '\')"><div></div><img draggable="false" src="apps/classic/desktop/' + path + '/AppLogo.png" alt=""></div>')
    }
}

function closemetroapp(app, fromdesktop) {
    displayStartTiles()
    $('.startScreen .tiles, .startScreen .apps').css('animation', 'none')
    openedApps.splice(openedApps.indexOf(app), 1)
    updtilescontainer()
    $('.metrowindow').css('display', 'none')
    $('#metrowindow_' + app).css('display', 'block')
    $('#TaskbarOpenedWindow_Metro_' + app).css('animation', 'fadeani2 0.2s ease forwards')
    setTimeout(() => {
        $('#TaskbarOpenedWindow_Metro_' + app).remove()
    }, 200)
    if (!fromdesktop) {
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_GoToDesktopInsteadOfStartscreen') == 'true') {
            $('.bgforapp').remove()
            setTimeout(() => {
                $('#metrowindow_' + app).css('animation', 'appclose 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
                setTimeout(() => {
                    closeStart()
                    $('#metrowindow_' + app).remove()
                }, 300)
            }, 100)
        } else {
            openStart()
            setTimeout(() => {
                $('#metrowindow_' + app).css('animation', 'appclose 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
                setTimeout(() => {
                    $('#metrowindow_' + app).remove()
                }, 300)
            }, 500)
        }
    } else {
        $('#metrowindow_' + app).remove()
    }
}

function minimizemetroapp(app) {
    $('.metrowindow').css('display', 'none')
    $('#metrowindow_' + app).css('display', 'block')
    $('#metrowindow_' + app).css('animation', 'appclose 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_GoToDesktopInsteadOfStartscreen') == 'true') {
        $('.bgforapp').remove()
        setTimeout(() => {
            $('#metrowindow_' + app).css('animation', 'appclose 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
            setTimeout(() => {
                closeStart()
                $('.metrowindow').css('display', 'none')
                $('#metrowindow_' + app).css('animation', 'none')
            }, 300)
        }, 100)
    } else {
        openStart()
        setTimeout(() => {
            $('#metrowindow_' + app).css('animation', 'appclose 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
            setTimeout(() => {
                $('.metrowindow').css('display', 'none')
                $('#metrowindow_' + app).css('animation', 'none')
            }, 300)
        }, 500)
    }
}
