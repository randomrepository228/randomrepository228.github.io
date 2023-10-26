var addLocalStorageToLeftpanel; var disp; var dispWelcome; var editFT; var editSTR; var saveSTR; var currentPage; var NewKey; var RemoveKey
$(document).ready(() => {
    $('.leftpanel > h1').html(LOCALE_registryeditor[3])
    editFT = (key) => {
        if (localStorage.getItem(key) == 'true') {
            localStorage.setItem(key, 'false')
        } else {
            localStorage.setItem(key, 'true')
        }
        $('.main p').html(localStorage.getItem(key))
    }
    saveSTR = (key) => {
        localStorage.setItem(key, $('.main > input').val())
        disp(key)
    }
    editSTR = (key) => {
        ModalMetroDialog(`
            <h1>Изменить значение</h1>
            <p>для ${key}</p>
            <textarea placeholder="Новое значение" id="TextArea__ID__">${localStorage.getItem(key)}</textarea>
            <div class="buttons" style="margin-top:60px"><button onclick="localStorage.setItem('${key}',$('#TextArea__ID__').val());$('.main p').html(localStorage.getItem('${key}'));CloseMetroDialog('__ID__')">Сохранить</button><button onclick="CloseMetroDialog('__ID__')">Отмена</button></div>
        `)
        //$('.main').html('<h1>' + key + '</h1><input class="metroinput" style="margin-left:20px;padding:7px 10px; width:400px " value="' + localStorage.getItem(key) + '"><br><br><button class="metrobutton" style="margin-left:20px" onclick="saveSTR(\'' + key + '\')">' + LOCALE_registryeditor[8] + '</button>')
    }
    RemoveKey = (key) => {
        localStorage.removeItem(key)
        addLocalStorageToLeftpanel()
        dispWelcome()
    }
    NewKey = () => {
        ModalMetroDialog(`
            <h1>Создать ключ</h1>
            <input type="text" style="width: calc(100% - 26px);margin:16px 0px" placeholder="префикс OKNA8 добавляется автоматически" id="InputNewKey__ID__">
            <textarea placeholder="Новое значение" id="TextArea__ID__">${localStorage.getItem(key)}</textarea>
            <div class="buttons" style="margin-top:60px"><button onclick="localStorage.setItem('OKNA8_' + $('#InputNewKey__ID__').val(),$('#TextArea__ID__').val());addLocalStorageToLeftpanel();disp('OKNA8_' + $('#InputNewKey__ID__').val());CloseMetroDialog('__ID__')">Сохранить</button><button onclick="CloseMetroDialog('__ID__')">Отмена</button></div>
        `)
        //$('.main').html('<h1>' + key + '</h1><input class="metroinput" style="margin-left:20px;padding:7px 10px; width:400px " value="' + localStorage.getItem(key) + '"><br><br><button class="metrobutton" style="margin-left:20px" onclick="saveSTR(\'' + key + '\')">' + LOCALE_registryeditor[8] + '</button>')
    }
    disp = (key) => {
        if (currentPage != key) {
            $('.main').css('display', 'none')
            currentPage = key
            var Gray = ''
            var content = localStorage.getItem(key)
            if (localStorage.getItem(key) == null) {
                Gray = 'Gray'
                content = 'Null'
            } else if (localStorage.getItem(key) == '') {
                Gray = 'Gray'
                content = 'Empty string'
            }
            if (localStorage.getItem(key) == 'true' || localStorage.getItem(key) == 'false') {
                $('.main').html('<h1>' + key + '</h1><p class="' + Gray + '">' + content + '</p><button class="metrobutton" style="margin-left:60px;margin-top:20px;" onclick="editFT(\'' + key + '\')">' + LOCALE_registryeditor[6] + '</button><button class="metrobutton" style="margin-left:20px" onclick="editSTR(\'' + key + '\')">' + LOCALE_registryeditor[7] + '</button><button class="metrobutton" style="margin-left:20px;margin-top:20px;" onclick="RemoveKey(\'' + key + '\')">' + 'Удалить' + '</button>')
            } else {
                $('.main').html('<h1>' + key + '</h1><p class="' + Gray + '">' + content + '</p><button class="metrobutton" style="margin-left:60px;margin-top:20px;" onclick="editSTR(\'' + key + '\')">' + LOCALE_registryeditor[6] + '</button><button class="metrobutton" style="margin-left:20px;margin-top:20px;" onclick="RemoveKey(\'' + key + '\')">' + 'Удалить' + '</button>')
            }
            setTimeout(() => {
                $('.main').css('display', 'block')
            }, 1)
        }
    }
    dispWelcome = (key) => {
        $('.main').html(LOCALE_registryeditor[5])
    }
    addLocalStorageToLeftpanel = () => {
        $('.leftpanel > .elements').html('<div class="element" onclick="dispWelcome()">' + LOCALE_registryeditor[4] + '</div>')
        $('.leftpanel > .elements').html('<div class="element" onclick="NewKey()">' + 'Создать' + '</div>')
        var Keys = []
        for (var i = 0; i < localStorage.length; i++) {
            Keys.push(localStorage.key(i))
        }
        Keys.sort()
        for (var i = 0; i < Keys.length; i++) {
            if (Keys[i].startsWith('OKNA8_')) {
                $('.elements').html($('.elements').html() + '<div class="element" onclick="disp(\'' + Keys[i] + '\')">' + Keys[i].replace('OKNA8_', '<span class="Gray">OKNA8_</span>') + '</div>')
            }
        }
    }

    setTimeout(() => {
        addLocalStorageToLeftpanel()
    }, 400)
    dispWelcome()
})