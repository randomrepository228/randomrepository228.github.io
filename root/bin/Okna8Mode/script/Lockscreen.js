var systemIsLocked = true

function updLockscreen() {
    $('.lock').css('background-image', 'url(img/wallpaper/lock/' + localStorage.getItem('OKNA8_lockscreenWallpaper') + '.png)')
}

function lock() {
    $('.lock').css('display', 'block')
    systemIsLocked = true
}

var CheckPassword
var LoginUser
var ExitToSelectuser
var LogonAnim

var SkipOOBE
var UserToPrepare

function DisplayLockscreen() {
    $('.welcome').addClass('selectuser')
    $('.welcome').removeClass('nocursor')
    $('.welcome').removeClass('welcome')
    $('.selectuser').attr('style', '')
    $('.lock').attr('style', '')
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
    Users = Users.split('|')

    $('.selectuser .userslist').html('')

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
        if (localStorage.getItem('OKNA8_user_' + user + '_FirstLogonCompleted') == 'true') {
            LogOn(user)
        } else {
            SkipOOBE = true
            UserToPrepare = user
            addScript('apps/classic/oobe/oobeldr.js')
        }
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

    if (localStorage.getItem('OKNA8_LoginToUserAfterPrepare') != null) {
        $('.lock').css('top', '-100vh')
        $('.welcome').css('display', 'none')
        systemIsLocked = false
        currentUser = localStorage.getItem('OKNA8_LoginToUserAfterPrepare')
        $('.selectuser').css('display', 'none')
        localStorage.removeItem('OKNA8_LoginToUserAfterPrepare')
    } else {
        setTimeout(() => {
            $('.HTMLpreloader').css('opacity', '0')
            setTimeout(() => {
                $('.HTMLpreloader').css('display', 'none')
            }, 250)
        }, 1000)
    }

    if (localStorage.getItem('OKNA8_users').split('|').length == 1 && localStorage.getItem('OKNA8_user_' + localStorage.getItem('OKNA8_users') + '_password') == null && localStorage.getItem('OKNA8_user_' + localStorage.getItem('OKNA8_users') + '_OnlineAccount') == null && localStorage.getItem('OKNA8_DontSkipLockscreen') != 'true') {
        localStorage.removeItem('OKNA8_DontSkipLockscreen')
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

function shutdown(type) {
    $('.HTMLpreloader').css('opacity', '0')
    setTimeout(() => {
        $('.HTMLpreloader').css('display', 'block')
        setTimeout(() => {
            $('.HTMLpreloader').css('opacity', '1')
            setTimeout(() => {
                $('#shutdownscreen > h1').css('display', 'none')
                $('#shutdownscreen').css('display', 'block')
                $('.removeAfterLogoff').remove()
                DisplayLockscreen()
                if (type == 's') {
                    $('#shutdownscreen > .shutdown').css('display', 'block')
                    setTimeout(() => {
                        window.location.reload()
                    }, 5000)
                }
                if (type == 'r') {
                    $('#shutdownscreen > .reboot').css('display', 'block')
                    setTimeout(() => {
                        window.location.reload()
                    }, 5000)
                }
                if (type == 'l') {
                    $('#shutdownscreen > .logoff').css('display', 'block')
                    setTimeout(() => {
                        $('.HTMLpreloader').css('opacity', '0')
                        $('#shutdownscreen').css('display', 'none')
                    }, 5000)
                }
                if (type == 'w') {
                    $('#shutdownscreen > .pleasewait').css('display', 'block')
                    setTimeout(() => {
                        window.location.reload()
                    }, 5000)
                }
                if (type == 'u') {
                    $('#shutdownscreen > .pleasewait').css('display', 'block')
                    setTimeout(() => {
                        window.location.reload()
                    }, 5000)
                }
            }, 500)
        }, 10)
    }, 10)
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
    if (typeof data == 'object') {
        localStorage.clear()
        Object.keys(data).forEach(function (k) {
            localStorage.setItem(k, JSON.stringify(data[k]).replaceAll('"', ''))
        })
        shutdown('r')
    } else if (typeof data == 'string') {
        var newData = JSON.parse(data)
        Object.keys(newData).forEach(function (k) {
            localStorage.setItem(k, JSON.stringify(newData[k]).replaceAll('"', ''))
        })
        shutdown('r')
    }
}
