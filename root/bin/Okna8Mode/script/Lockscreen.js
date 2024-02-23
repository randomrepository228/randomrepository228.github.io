var systemIsLocked = true

function updLockscreen() {
    $('.lock').css('background-image', 'url(img/wallpaper/lock/' + localStorage.getItem('OKNA8_lockscreenWallpaper') + '.png)')
}

function lock() {
    $('.lock').css('display', 'block')
    systemIsLocked = true
    hide_all_start_windows()
}

var CheckPassword
var LoginUser
var ExitToSelectuser
var LogonAnim

function DisplayLockscreen() {
    $(".welcome").addClass("selectuser")
    $(".welcome").removeClass("nocursor")
    $(".welcome").removeClass("welcome")
    $(".selectuser").attr("style", "")
    $(".lock").attr("style", "")
    localStorage.removeItem('OKNA8_Crashes')
    sessionStorage.clear()
    updLockscreen()
    currentUser = 'system'
    $('.lock').click(() => {
        $('.lock').css('top', '-100vh')
    })
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Space' && systemIsLocked == true) {
            $('.lock').css('top', '-100vh')
        }
    })

    var Users = localStorage.getItem('OKNA8_users')
    if (Users == null || Users == undefined || Users == '') {
        window.location.href = '../../../pages/SETUP/OOBE/oobe.html'
    }
    Users = Users.split('|')

    for (let i = 0; i < Users.length; i++) {
        var UserName = localStorage.getItem('OKNA8_user_' + Users[i] + '_username')
        var Email = ''
        if (localStorage.getItem('OKNA8_user_' + Users[i] + '_OnlineAccount') != null) {
            var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + Users[i] + '_OnlineAccount'))
            UserName = AccountInfo.FirstName + ' ' + AccountInfo.LastName
            Email = AccountInfo.Email
        }
        var AvatarPath
        if (localStorage.getItem('OKNA8_user_' + Users[i] + '_avatar') != null) {
            AvatarPath = localStorage.getItem('OKNA8_user_' + Users[i] + '_avatar')
        } else {
            AvatarPath = 'img/avatar.png'
        }
        $('.selectuser .userslist').html('')
        $('.selectuser .userslist').append(`
            <div class="usercontainer" id="usercontainer_${Users[i]}" onclick="LoginUser('${Users[i]}')">
                <div class="useravatar" style="background-image: url(${AvatarPath})"></div>
                <div class="username_s">${UserName}</div>
                <div class="username_l">${UserName}</div>
                <div class='progress-ring welcomering' style="transform: scale(0.7,0.7); margin-left: -22px; margin-right: 16px ;">
                    ${Metro_ProgressRing}
                </div>
                <div class="email">${Email}</div>
                <div class="welcometext">${LOCALE_lockscreen[21]}</div>
                <input type="password" placeholder="${LOCALE_lockscreen[22]}">
                <div class="passwordEnterButton" onclick="CheckPassword()"><span></span></div>
                <div class="exitToSelectuser"><span style="scale:1.2" onclick="ExitToSelectuser()" class="backbtn"><span style=" top:-6.8px" class="s1"></span><span style=" top:-6.8px" class="s2"></span></span></div>
            </div>
        `)
    }

    LogonAnim = (user) => {
        $('.powerbtn').css('display', 'none')
        $('.selectuser, .login').addClass('welcome')
        $('.welcome').addClass('nocursor')
        $('.welcome').removeClass('selectuser')
        $('.welcome').removeClass('login')
        LogOn(user)
        /*setTimeout(() => {
            if (localStorage.getItem('OKNA8_user_' + currentUser + '_GoToDesktopInsteadOfStartscreen') != 'true') {
                $('.tilesContainer').css('animation', 'none')
                $('.tilesContainer').css('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton', 'none')
                $('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('opacity', '0')
                $('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('animation', 'none')
                setTimeout(() => {
                    $('#startscreen_Start-label, .btn_down, #start_avatar, #start_powerbtn, #start_searchbtn, .startScreen > .tiles > div > .downButton').css('animation', 'fadeani 2s 0.1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
                    StartScreenAnimation()
                    $('.welcome .usercontainer').css('margin-left', '-100px')
                }, 50)
            } else {
                $('.startScreen').css('display', 'none')
            }
            $('.welcome .usercontainer').css('transition', 'cubic-bezier(0.1, 0.9, 0.2, 1) 500ms')
            $('.welcome').css('opacity', '0')
            systemIsLocked = false
            $('.StartScreenBackground').css('display', 'none')
            setTimeout(() => {
                $('.StartScreenBackground').css('display', 'block')
            }, 100)
            setTimeout(() => {
                $('.welcome').css('display', 'none')
            }, 600)
        }, 2000)*/
    }

    LoginUser = (user) => {
        $('.usercontainer').css('display', 'none')
        $('#usercontainer_' + user).css('display', 'inline-block')
        if ((localStorage.getItem('OKNA8_user_' + user + '_OnlineAccount') == null && localStorage.getItem('OKNA8_user_' + user + '_password') == null) || localStorage.getItem('OKNA8_user_' + user + '_password') == '') {
            LogonAnim(user)
        } else {
            $('.selectuser').addClass('login')
            $('.selectuser').removeClass('selectuser')
            $('.login').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + user + '_color_background') + ')')
            $('.passwordEnterButton').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + user + '_color_foreground') + ')')
            if (localStorage.getItem('OKNA8_user_' + user + '_OnlineAccount') == null) {
                CheckPassword = () => {
                    if ($('#usercontainer_' + user + ' input').val() != '') {
                        $('.login').addClass('welcome')
                        $('.login').removeClass('login')
                        if (localStorage.getItem('OKNA8_user_' + user + '_password') == $('#usercontainer_' + user + ' input').val()) {
                            setTimeout(() => {
                                LogonAnim(user)
                            }, 2000)
                        } else {
                            $('#usercontainer_' + user + ' input').val('')
                            setTimeout(() => {
                                $('.welcome').addClass('login')
                                $('.welcome').removeClass('welcome')
                            }, 2000)
                        }
                    }
                }
            } else {
                CheckPassword = () => {
                    if ($('#usercontainer_' + user + ' input').val() != '') {
                        $('.login').addClass('welcome')
                        $('.login').removeClass('login')
                        var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + user + '_OnlineAccount'))
                        if (AccountInfo.Password == $('#usercontainer_' + user + ' input').val()) {
                            setTimeout(() => {
                                LogonAnim(user)
                            }, 2000)
                        } else {
                            $('#usercontainer_' + user + ' input').val('')
                            setTimeout(() => {
                                $('.welcome').addClass('login')
                                $('.welcome').removeClass('welcome')
                            }, 2000)
                        }
                    }
                }
            }
        }
    }

    ExitToSelectuser = () => {
        setTimeout(() => {
            $('.login').addClass('selectuser')
            $('.login').removeClass('login')
            $('.usercontainer').css('display', 'inline-block')
            $('.selectuser').css('background-color', 'rgb(24,0,82)')
        }, 100)
    }

    if (sessionStorage.getItem('OKNA8_LoginToUserAfterPrepare') != null) {
        var user = sessionStorage.getItem('OKNA8_LoginToUserAfterPrepare')
        sessionStorage.removeItem('OKNA8_LoginToUserAfterPrepare')
        $('.lock').css('top', '-100vh')
        LogOn(user)
        $('.welcome').css('display', 'none')
        systemIsLocked = false
        $('.selectuser').css('display', 'none')
        $('.HTMLpreloader').css('transition', 'none')
        $('.HTMLpreloader').css('background-color', 'rgb(' + localStorage.getItem('OKNA8_user_' + user + '_color_background') + ')')
        setTimeout(() => {
            $('.HTMLpreloader').css('transition', '1s cubic-bezier(0.1, 0.9, 0.2, 1)')
            $('.HTMLpreloader').css('opacity', '0')
            setTimeout(() => {
                $('.HTMLpreloader').css('display', 'none')
            }, 250)
        }, 1)
    } else {
        setTimeout(() => {
            $('.HTMLpreloader').css('opacity', '0')
            setTimeout(() => {
                $('.HTMLpreloader').css('display', 'none')
            }, 250)
        }, 750)
    }

    if (localStorage.getItem('OKNA8_users').split('|').length == 1 && localStorage.getItem('OKNA8_user_' + localStorage.getItem('OKNA8_users') + '_password') == null && localStorage.getItem('OKNA8_user_' + localStorage.getItem('OKNA8_users') + '_OnlineAccount') == null) {
        if (sessionStorage.getItem('OKNA8_DontSkipLockscreen') != 'true') {
            sessionStorage.removeItem('OKNA8_DontSkipLockscreen')
            var user = localStorage.getItem('OKNA8_users')
            $('.lock').css('top', '-100vh')
            $('.usercontainer').css('opacity', '0')
            setTimeout(() => {
                $('.HTMLpreloader').css('opacity', '0')
                setTimeout(() => {
                    $('.HTMLpreloader').css('display', 'none')
                }, 250)
            }, 2000)
            setTimeout(() => {
                $('.usercontainer').css('opacity', '1')
                systemIsLocked = false
                LoginUser(user)
            }, 800)
        }
    }
}

$(document).ready(DisplayLockscreen)

function shutdown(type) {
    $('#shutdownscreen').css('display', 'block')
    setTimeout(() => {
        if (type == 's') {
            $('.removeAfterLogoff').remove()
            DisplayLockscreen()
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        if (type == 'r') {
            $('.removeAfterLogoff').remove()
            DisplayLockscreen()
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        if (type == 'l') {
            $('.removeAfterLogoff').remove()
            DisplayLockscreen()
            setTimeout(() => {
                $('#shutdownscreen').css('display', 'none')
            }, 1000)
        }
        if (type == 'w') {
            $('.removeAfterLogoff').remove()
            DisplayLockscreen()
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        if (type == 'u') {
            $('.removeAfterLogoff').remove()
            DisplayLockscreen()
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }, 250)
}

function DisplayPowerMenuOnLock() {
    $('.metrocontextmenu').html(`
    <div class="element" onclick="shutdown('s')">${LOCALE_lockscreen[23]}</div>
    <div class="element" onclick="shutdown('r')">${LOCALE_lockscreen[24]}</div>`)
    setTimeout(() => {
        $('.metrocontextmenu').attr('style', 'bottom: 88px; right:4px;display:block')
    }, 1)
}

function localStorageToString() {
    return JSON.stringify(localStorage)
}

function loadLocalStorage(data) {
    if (typeof data == "object") {
        localStorage.clear()
        Object.keys(data).forEach(function (k) {
            localStorage.setItem(k, JSON.stringify(data[k]).replaceAll('\"', ''))
        })
        shutdown('r')
    } else if (typeof data == "string") {
        var newData = JSON.parse(data)
        Object.keys(newData).forEach(function (k) {
            localStorage.setItem(k, JSON.stringify(newData[k]).replaceAll('\"', ''))
        })
        shutdown('r')
    }
}