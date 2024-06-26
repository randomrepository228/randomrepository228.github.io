var LOCALE_app_settings = [
    "",
    "Параметры компьютера",
    "Параметры ПК",
    "Параметры компьютера",
    [
        '',
        'Активация Windows',
        'Компьютер и устройства',
        'Учётные записи',
        'OneDrive',
        'Поиск и приложения',
        'Конфиденциальность',
        'Сеть',
        'Время и язык',
        'Специальные возможности',
        'Обновление и восстановление',
    ],
    {                                   // Имена пунктов в Параметрах
        'WinActivation':[
            'Активация Windows',
        ],
        'PcAndDevices':[
            'Компьютер и устройства',
            'Экран блокировки',
            'Сведения о компьютере',
        ],
        'Accounts':[
            'Учётные записи',
            'Ваша учётная запись',
            'Параметры входа',
            'Другие учётные записи'
        ],
        'OneDrive':[
            'OneDrive'
        ],
        'SearchNApps':[
            'Поиск и приложения',
            'Моды Okna8'
        ],
        'Privacy':[
            'Конфиденциальность'
        ],
        'Network':[
            'Сеть'
        ],
        'TimeNLang':[
            'Время и язык',
            'Язык и регион'
        ],
        'EaseOfAccess':[
            'Специальные возможности'
        ],
        'UpdateNRecovery':[
            'Обновление и восстан...',
            'Центр обновления Windows',
            'Восстановление',
            'Импорт/экспорт параметров'
        ]
    },
    {                                   // Содержание Параметров
        'MainPage':[
            ''
        ],
        'PcInfo':[
            'Компьютер',
            'Имя компьютера',
            'Переименование компьютера',
            'Версия Okna8',
            '<h1>Переименуйте компьютер</h1><p>Можно использовать сочетание букв, дефисов и цифр. <br><br>Текущее имя компьютера: pcname</p><input class="MetroDialogPcRenameInput" type="text"><div class="buttons"><button onclick="localStorage.setItem(\'OKNA8_pcname\', $(\'.MetroDialogPcRenameInput\').val());$(\'#metrowindow_Settings iframe\')[0].contentWindow.postMessage(\'PcNameChanged\', \'*\');CloseMetroDialog(__ID__)">Далее</button><button onclick="CloseMetroDialog(__ID__)">Отмена</button></div>',
            '<h1>Переименуйте компьютер</h1><p>После перезапуска имя компьютера изменится на: pcname</p><div class="buttons"><button onclick="shutdown(\'r\');CloseMetroDialog(__ID__)">Перезагрузить сейчас</button><button onclick="CloseMetroDialog(__ID__)">Перезагрузить позже</button></div>'
        ],
        'LockScreen':[
            'Просмотр экрана блокировки'
        ],
        'LangNRegion':[
            'Языки',
            'Для изменения языка Okna8 выберите нужный язык ниже',
            'Язык интерфейса',
            'Установить языком интерфейса',
            'Текущий язык интерфейса',
            'Выход',
            'Для изменения языка интерфейса необходимо выйти из системы.',
            'Выйти сейчас',
            'Выйти потом',
            'Необходимо выйти из системы для изменения языка'
        ],
        'YourAccount':[
            'Локальная учётная запись',
            'Онлайн-учётная запись',
            'Подключить онлайн-аккаунт',
            'Отключить',
            'Изменить имя учётной записи',
            'Аватар',
            'Обзор',
            'Удалить',
        ],
        'WindowsUpdate':[
            'Центр обновления Windows',
            'Вы используете версию ',
            'Проверить наличие обновлений',
            'Доступна новая версия - ',
            'Вы используете последнюю версию',
            'Скачать',
            'Установить',
            'По какой-то причине нам не удалось связатся с сервером.<br>Возможно, это из-за сбоя на сервере, отсутствии Интернета или из-за блокировки браузером.<br>Продолжаются попытки соединится с сервером...'
        ],
        'Recovery':[
            'Восстановление компьютера без удаления файлов',
            'Если ваш компьютер работает неправильно, вы можете восстановить без потери фотографий, музыки, видео и личных файлов.',
            'Начать',
            'Удаление всех данных и переустановка Windows',
            'Если вы хотите отдать компьютер кому-то другому или заново начать работу с ним, можно вернуть его в исходное состояние.',
            'Начать',
            'Особые варианты загрузки',
            'Запустите систему с устройства либо диска (например, USB-накопителя или DVD-диска), измените параметры загрузки Windows или восстановите её из образа. Ваш компьютер перезагрузится.',
            'Перезагрузить сейчас',
        ],
        'LoginMethods':[
            'Пароль',
            'Надёжный пароль защищает учётную запись',
            'Добавить',
            'Изменить',
            'Создание пароля',
            'Изменение пароля',
            'Придумайте такой пароль, который вам будет легко запомнить, а другим - сложно угадать',
            'Введите пароль',
            'Введите пароль ещё раз',
            'Введите подсказку для пароля',
            'Отмена',
            'Далее',
            'Удалить'
        ],
        'OtherUsers':[
            'Управление другими учётными записями',
            'Добавление учётной записи',
            '',
            '',
            '',
            '',
            'Удалить',
            'Например: Игорь'
        ],
        'DataExport': [
            'Импорт/экспорт параметров',
            'Вы можете экспортировать свои настройки Okna8Node и импортировать их на другом ПК. Будет сохранено всё состояние Okna8 с этого ПК.',
            'Экспорт',
            'Импорт',
        ],
        'OknaMods': [
            'Моды и приложения Okna8',
            'Установить мод',
            'Установить приложение',
            'Удалить',
            'Удалить "__MODNAME__"?',
            '"__MODNAME__" будет удалён из папки Okna8',
            'Удалить',
            'Отмена'
        ]
    },
    "Панель управления"
]