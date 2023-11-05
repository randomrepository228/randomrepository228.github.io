//     Файл AppInit.js для кастомных оконных приложений Okna8
//     Предназначен для Okna8 build 85 и выше
//     Если не понимаете, как заполнить файл, пишите мне на почту:
//                                    igor-kosov@outlook.com

var UserApp = [
    // Для списка приложений и плиток
    /* имя пакета               */ 'fleen5177-notepad',
    /* название приложения      */ 'Блокнот',
    /* язык приложения          */ 'ru-ru',
    /* цвет 1                   */ 'rgb(0,130,153)',
    /* цвет 2                   */ 'rgb(0,159,177)',
    /* минимальная версия okna8 */ 92,
    /* путь до иконки           */ 'icon.png',
    /* версия приложения        */ '1.0',
    /*
        Цвет 1 отображается на левой стороны плитки.
        Цвет 2 отображается на правой стороне плитки.
        Цвет 2 должен быть слегка светлее цвета 1, чтобы создать градиент.

        Изменить размер плитки со стандартной на другую нельзя.

        Для иконки можно использовать уже имеющиеся в Okna8 иконки,
        достаточно указать путь до нужной.
    */
    // Для окна
    /* Ширина окна              */ '800px',
    /* Высота окна              */ '600px',
    /* Положение сверху         */ 'calc(50vh - 300px)',
    /* Положение слева          */ 'calc(50vw - 400px)',
    /* Только кнопка закрытия   */ false,
    /* Изменение размера окна   */ true,
]

// Код далее не изменять.

if (VERSION["build"] >= UserApp[5]) {
    userAppsData.push({'packageName': UserApp[0],'appName': UserApp[1],'locale': UserApp[2],'color': UserApp[3],'minVer': UserApp[5],})
    LOCALE_appsnames.push(UserApp[1])
    LOCALE_searchdata.push(['desktop:' + UserApp[0], 'standart', UserApp[3], '../../../../mods/apps/' + UserApp[0] + '/' + UserApp[6], UserApp[1]])
    tilesInfo['desktop:' + UserApp[0]] = [['standart'], LOCALE_appsnames.length - 1, UserApp[3], UserApp[4], UserApp[1], '../../../../mods/apps/' + UserApp[0] + '/' + UserApp[6]]
    eval(`Programs['${UserApp[0]}'] = (args) => {CreateWindow('../../../../mods/apps/' + '${UserApp[0]}' + '/index.html', {'width': '${UserApp[8]}','height': '${UserApp[9]}','top': '${UserApp[10]}','left': '${UserApp[11]}','onlyClose': ${UserApp[12]},'resizable': ${UserApp[13]},'args': args,})}`)
}

UserApp = null