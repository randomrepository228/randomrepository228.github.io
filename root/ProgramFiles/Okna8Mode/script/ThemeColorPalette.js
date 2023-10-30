if (localStorage.getItem('OKNA8_user_' + currentUser + '_theme_color') == null || localStorage.getItem('OKNA8_user_' + currentUser + '_theme_color') == '') {
    localStorage.setItem('OKNA8_user_' + currentUser + '_theme_color', '42,56,94')
}

localStorage.setItem('OKNA8_user_' + currentUser + '_theme_color', '42,81,67')

var HSLToRGB = (h, s, l) => {
    s /= 100
    l /= 100
    var k = n => (n + h / 30) % 12
    var a = s * Math.min(l, 1 - l)
    var f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [255 * f(0), 255 * f(8), 255 * f(4)]
}

function ApplyColor () {
    var ColorsFromLocalStorage = localStorage.getItem('OKNA8_user_' + currentUser + '_theme_color').split(',')
    var ColorRGB = HSLToRGB(ColorsFromLocalStorage[0], ColorsFromLocalStorage[1], ColorsFromLocalStorage[2])
    /*$('body#taskbarBody').css('background-color', 'rgba(' + ColorRGB + ', 0.3)')
    $('body#taskbarBody').css('box-shadow', 'inset 0px 1px 0px 0px rgba(' + ColorRGB + ', 0.1)')*/
    $('style#ThemeStyles').html(`
        .Window {
            background-color: rgb(${ColorRGB})
        }
    `)
}

ApplyColor()