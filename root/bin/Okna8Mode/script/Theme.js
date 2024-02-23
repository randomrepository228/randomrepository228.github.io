if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_theme') == null) {
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_theme', 'aero')
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_wallpaper', 'img0.jpg')
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_color', '253,206,77')
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle', 'cover')
    localStorage.setItem('OKNA8_user_' + currentUser + '_appearance_visualstyle', 'aero')
}

/*
    WallpaperStyle
    cover
    contain
    stretch
    tile
    center
*/

var WallpaperSlideshowInterval
var WallpaperSlideshowPosition
var WallpaperSlideshowImgList

function UpdateThemeColors(image) {
    $('.Window, .desktop-taskbar').css('transition', '1s ease background-color')

    if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color') != 'auto') {
        var rgb0 = localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_color').split(',')
        $("#DesktopThemeStyle").html(`
            .Window {
                background-color: rgb(${rgb0[0]}, ${rgb0[1]}, ${rgb0[2]})
            }
            .desktop-taskbar {
                background-color: rgba(${rgb0[0]}, ${rgb0[1]}, ${rgb0[2]}, 0.5)
            }
        `)
    } else if (VERSION['additionalFeatures']['AutoColorSupport']) {
        RGBaster.colors(image, {
            exclude: ['rgb(255,255,255)'],
            success: function(payload) {
                var rgb0 = payload.dominant.substring(4, payload.dominant.length - 1).split(',')
                var hsv0 = rgb2hsv(rgb0[0], rgb0[1], rgb0[2])
                var rgb1 = hsv2rgb(hsv0['h'], hsv0['s'] / 100 * 70, 75 + (hsv0['v'] / 4))
                var rgb2 = hsv2rgb(hsv0['h'], hsv0['s'] / 100 * 70, 50 + (hsv0['v'] / 4))
                $("#DesktopThemeStyle").html(`
                    .Window {
                        background-color: rgb(${rgb1['r']}, ${rgb1['g']}, ${rgb1['b']})
                    }
                    .desktop-taskbar {
                        background-color: rgba(${rgb2['r']}, ${rgb2['g']}, ${rgb2['b']}, 0.5)
                    }
                `)
            }
        })
    } else {
        var rgb0 = ['171', '171', '171']
        $("#DesktopThemeStyle").html(`
            .Window {
                background-color: rgb(${rgb0[0]}, ${rgb0[1]}, ${rgb0[2]})
            }
            .desktop-taskbar {
                background-color: rgba(${rgb0[0]}, ${rgb0[1]}, ${50 + (Number(rgb0[2]) / 4)}, 0.5)
            }
        `)
    }
    setTimeout(() => {
        $('.Window, .desktop-taskbar').css('transition', 'none')
    }, 1000);
}

function UpdateTheme() {
    if (typeof WallpaperSlideshowInterval != 'undefined') {
        clearInterval(WallpaperSlideshowInterval)
        WallpaperSlideshowPosition = null
    }

    $('#DESKTOP').css('background-image', 'url(img/wallpaper/' + localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[0] + ')')
    
    if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle') == 'cover') {
        $('#DESKTOP, .startScreen').css('background-size', 'cover')
        $('#DESKTOP, .startScreen').css('background-position', 'center center')
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle') == 'contain') {
        $('#DESKTOP, .startScreen').css('background-size', 'contain')
        $('#DESKTOP, .startScreen').css('background-position', 'center center')
        $('#DESKTOP, .startScreen').css('background-color', 'black')
        $('#DESKTOP, .startScreen').css('background-repeat', 'no-repeat')
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle') == 'stretch') {
        $('#DESKTOP, .startScreen').css('background-size', '100vw 100vh')
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle') == 'tile') {
        $('#DESKTOP, .startScreen').css('background-size', 'auto')
        $('#DESKTOP, .startScreen').css('background-position', 'left top')
    } else if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaperstyle') == 'center') {
        $('#DESKTOP, .startScreen').css('background-size', 'auto')
        $('#DESKTOP, .startScreen').css('background-color', 'black')
        $('#DESKTOP, .startScreen').css('background-position', 'center center')
    }

    if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|').length > 1) {
        WallpaperSlideshowImgList = localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')
        WallpaperSlideshowPosition = 0
        function WallpaperSlideshowNext() {
            $('#DESKTOP').css('background-image', 'url(img/wallpaper/' + WallpaperSlideshowImgList[WallpaperSlideshowPosition] + ')')
            $('.startScreen').css('background-image', 'url(img/wallpaper/' + WallpaperSlideshowImgList[WallpaperSlideshowPosition] + ')')
            $('.desktoptile').css('background-image', 'url(img/wallpaper/' + WallpaperSlideshowImgList[WallpaperSlideshowPosition] + ')')
            var image = 'img/wallpaper/' + WallpaperSlideshowImgList[WallpaperSlideshowPosition]
            UpdateThemeColors(image)
            if (WallpaperSlideshowPosition + 1 == WallpaperSlideshowImgList.length) {
                WallpaperSlideshowPosition = 0
            } else {
                WallpaperSlideshowPosition++
            }
        }
        WallpaperSlideshowNext()
        WallpaperSlideshowInterval = setInterval(WallpaperSlideshowNext, 10000)
    } else {
        var image = 'img/wallpaper/' + localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[0]
        UpdateThemeColors(image)
    }
}

UpdateTheme()