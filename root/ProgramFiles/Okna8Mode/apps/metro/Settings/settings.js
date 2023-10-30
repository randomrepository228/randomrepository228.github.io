var Settings = {
    'MainPage':`
    
    `,
    'WinActivation':`
    `,
    'PcInfo':`
        <h1>${LOCALE_app_settings[6]['PcInfo'][0]}</h1>
        <style>.PcInfoTable > tbody > tr > td {min-width:200px;} .PcInfoTable > tbody > tr {height:32px}</style>
        <table class="PcInfoTable">
            <tr>
                <td>${LOCALE_app_settings[6]['PcInfo'][1]}</td>
                <td>${localStorage.getItem('OKNA8_SYSTEM_pcname')}</td>
            </tr>
            <tr>
                <td>${LOCALE_app_settings[6]['PcInfo'][3]}</td>
                <td>${VERSION['ver']}, build ${VERSION['build']}</td>
            </tr>
        </table>
        <button class="MetroButton2" style="margin-left:0" onclick="window.top.postMessage('unavaiblefunction', '*')">${LOCALE_app_settings[6]['PcInfo'][2]}</button>
    `,
    'LockScreen':`
        <h1>${LOCALE_app_settings[6]['LockScreen'][0]}</h1>
        <style>
            #LockScreenPreview {top:10px;width: 600px; height: 337px; position:relative; background-image: url('../../../img/wallpaper/lock/img100.png');background-size:cover;background-color:grey;}
            #LockScreenPreview > h1 {color:white; font-weight: 100; font-size:70px; margin:0; position:absolute;bottom:66px;left:36px}
            #LockScreenPreview > h2 {display:none}
            #WallpaperSelector {width:610px;height:122px;font-size:0;margin-top:10px}
            #WallpaperSelector > div {width:112px;height:112px;display:inline-block;margin-top:10px;margin-right:10px;background-size:cover;background-color:grey;}
        </style>
        <script>
            if (localStorage.getItem('OKNA8_lockscreenWallpaper') == null) {
                localStorage.setItem('OKNA8_lockscreenWallpaper', 'img100')
            }

            $('#WallpaperSelector > .' + localStorage.getItem('OKNA8_lockscreenWallpaper')).css('display','none')

            $('#LockScreenPreview').css('background-image','url(\\'../../../img/wallpaper/lock/' + localStorage.getItem('OKNA8_lockscreenWallpaper') + '.png\\')')
            $('#LockScreenPreview').css('transition','500ms cubic-bezier(0.1, 0.9, 0.2, 1)')

            function setWallpaperLock (wallpaper) {
                localStorage.setItem('OKNA8_lockscreenWallpaper',wallpaper)
                $('#WallpaperSelector > div').css('display','inline-block')
                $('#WallpaperSelector > .' + localStorage.getItem('OKNA8_lockscreenWallpaper')).css('display','none')
                $('#LockScreenPreview').css('background-image','url(\\'../../../img/wallpaper/lock/' + localStorage.getItem('OKNA8_lockscreenWallpaper') + '.png\\')')
            }
        </script>
        <div id="LockScreenPreview">
            <h1>21:15<h1>
            <h2>четверг, 14 марта</h2>
        </div>
        <div id="WallpaperSelector">
            <div class="img100" onclick="setWallpaperLock('img100')" style="background-image:url('../../../img/wallpaper/lock/img100.png')"></div>
            <div class="img101" onclick="setWallpaperLock('img101')" style="background-image:url('../../../img/wallpaper/lock/img101.png')"></div>
            <div class="img102" onclick="setWallpaperLock('img102')" style="background-image:url('../../../img/wallpaper/lock/img102.png')"></div>
            <div class="img103" onclick="setWallpaperLock('img103')" style="background-image:url('../../../img/wallpaper/lock/img103.png')"></div>
            <div class="img104" onclick="setWallpaperLock('img104')" style="background-image:url('../../../img/wallpaper/lock/img104.png')"></div>
            <div class="img105" onclick="setWallpaperLock('img105')" style="background-image:url('../../../img/wallpaper/lock/img105.png')"></div>
        </div>
    `,
    'LangNRegion':`
        <h1>${LOCALE_app_settings[6]['LangNRegion'][0]}</h1>
        <p id="LangNRegion-P">${LOCALE_app_settings[6]['LangNRegion'][1]}</p>
        <style>
            .LangNRegion-languagesList > .lang {
                width: 450px; height: 60px; position:relative;
                transition:0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
            }

            .LangNRegion-languagesList > .lang:hover {
                background-color: rgb(242,242,242);
            }

            .LangNRegion-languagesList > .langactive:hover {
                background-color: rgb(232,232,232);
            }

            .LangNRegion-languagesList > .langactive {
                width: 450px; height: 120px;
                background-color: rgb(232,232,232);
                position:relative;
            }

            .LangNRegion-languagesList > .lang > img {
                margin: 10px;
            }

            .LangNRegion-languagesList > .lang > .langname {
                font-weight: 400;
                font-size: 16px;
                color: black;
                position: absolute;
                top: 9px; left: 60px;
                margin:0;
            }

            .LangNRegion-languagesList > .lang > .langnote {
                font-weight: 400;
                font-size: 16px;
                color: grey;
                position: absolute;
                top: 29px; left: 60px;
                margin:0;
            }

            .LangNRegion-languagesList > .lang > button {
                display:none;
            }

            .LangNRegion-languagesList > .langactive > button {
                display:block;
                position:absolute;
                right:10px;bottom:10px;
            }
        </style>
        <script>
            function SelectLanguageInLangSelector (r) {
                $('.langactive').removeClass('langactive')
                $('#LangNRegion-languageslist-' + r).addClass('langactive')
            }
            function SetSystemLocale (id) {
                localStorage.setItem('OKNA8_locale', id)
                window.top.postMessage(\`ModalMetroDialog|
                    <h1>${LOCALE_app_settings[6]['LangNRegion'][5]}</h1>
                    <p>${LOCALE_app_settings[6]['LangNRegion'][6]}</p>
                    <div class="buttons">
                        <button onclick="shutdown('l')">${LOCALE_app_settings[6]['LangNRegion'][7]}</button>
                        <button onclick="CloseMetroDialog(__ID__)">${LOCALE_app_settings[6]['LangNRegion'][8]}</button>
                    </div>\`,'*')
                $('.LangNRegion-languagesList').html('')
                $('#LangNRegion-P').html('${LOCALE_app_settings[6]['LangNRegion'][9]}')
            }
            for (let w = 0; w < VERSION['locales'].length; w++) {
                $('.LangNRegion-languagesList').html($('.LangNRegion-languagesList').html() + '<div onclick="SelectLanguageInLangSelector(\\'' + VERSION['locales'][w][0] + '\\')" class="lang" id="LangNRegion-languageslist-' + VERSION[\'locales\'][w][0] + '"><img draggable="false" src="gui/language.png"><p class="langname">' + VERSION[\'locales\'][w][1] + '</p><p class="langnote"></p><button onclick="SetSystemLocale(\\'' + VERSION['locales'][w][0] + '\\')" class="negative" style="margin-left:0">${LOCALE_app_settings[6]['LangNRegion'][3]}</button></div>')
            }
            $('#LangNRegion-languageslist-' + localStorage.getItem('OKNA8_locale') + ' > .langnote').html(LOCALE_app_settings[6]['LangNRegion'][4])
            $('#LangNRegion-languageslist-' + localStorage.getItem('OKNA8_locale') + ' > button').attr('disabled','true')
        </script>
        <div class="LangNRegion-languagesList">
        </div>
    `,
    'YourAccount':`
        <h1>${localStorage.getItem('OKNA8_user_' + currentUser + '_username')}</h1>
        <p>${LOCALE_app_settings[6]['YourAccount'][0]}</p>
        <button class="MetroButton2" style="margin-left:0" onclick="window.top.postMessage('unavaiblefunction', '*')">${LOCALE_app_settings[6]['YourAccount'][4]}</button>
        <br><br>
        <h1>${LOCALE_app_settings[6]['YourAccount'][5]}</h1>
        <img src="../../../img/avatar.png" style="width:230px;height:230px;"><br>
        <button class="MetroButton2" style="margin-left:0" onclick="window.top.postMessage('unavaiblefunction', '*')">${LOCALE_app_settings[6]['YourAccount'][6]}</button>
    `,
    'WindowsUpdate':`
        <script>
            function checkupdates () {
                var latestversion = null
                $('#WindowsUpdate-ProgressRing').css('display','block')
                $('#WindowsUpdate-Button').css('display','none')
                $('#WindowsUpdate-P').html('')
                $('#WindowsUpdate-IFRAME').attr('src','update-okna8.html')
                window.onmessage = (event) => {
                    if (event.data.startsWith('LatestVersion-')) {
                        latestversion = event.data.slice(14)
                        latestversion = latestversion.split('|')
                        if (latestversion[0] > VERSION['build']) {
                            $('#WindowsUpdate-ProgressRing').css('display','none')
                            $('#WindowsUpdate-P').html('${LOCALE_app_settings[6]['WindowsUpdate'][3]}' + latestversion[1])
                            $('#WindowsUpdate-Button').css('display','block')
                        } else {
                            $('#WindowsUpdate-ProgressRing').css('display','none')
                            $('#WindowsUpdate-P').html('${LOCALE_app_settings[6]['WindowsUpdate'][4]}')
                            $('#WindowsUpdate-Button').css('display','block')
                        }
                    }
                }
                setTimeout(()=>{
                    if (latestversion == null) {
                        $('#WindowsUpdate-P').html('${LOCALE_app_settings[6]['WindowsUpdate'][7]}')
                    }
                },10000)
            }
        </script>
        <style>
            #WindowsUpdate-ProgressRing {
                margin:0;
                margin-left: 10px;
                margin-top:10px;
                transform-origin: left top;
                scale: 0.7;
                display:none;
            }

            #WindowsUpdate-ProgressRing .progress-ring__wrap .progress-ring__circle:after {
                background:rgb(70,23,181);
                scale: 1.1;
            }
        </style>
        <h1>${LOCALE_app_settings[6]['WindowsUpdate'][0]}</h1>
        <div id="WindowsUpdate-ProgressRing" class="progress-ring">${Metro_ProgressRing}</div>
        <p id="WindowsUpdate-P">${LOCALE_app_settings[6]['WindowsUpdate'][1]}${VERSION['ver']}</p>
        <button id="WindowsUpdate-Button" class="MetroButton2" style="margin-left:0" onclick="checkupdates()">${LOCALE_app_settings[6]['WindowsUpdate'][2]}</button>
        <iframe id="WindowsUpdate-IFRAME"></iframe>
        
    `,
    'Recovery':`
    <h1>${LOCALE_app_settings[6]['Recovery'][0]}</h1>
    <p style="width: 680px">${LOCALE_app_settings[6]['Recovery'][1]}</p>
    <button onclick="window.top.postMessage('unavaiblefunction', '*')" style="margin-bottom:44px;margin-left:0" class="MetroButton2">${LOCALE_app_settings[6]['Recovery'][2]}</button>
    <h1>${LOCALE_app_settings[6]['Recovery'][3]}</h1>
    <p style="width: 680px">${LOCALE_app_settings[6]['Recovery'][4]}</p>
    <button onclick="window.top.postMessage('unavaiblefunction', '*')" style="margin-bottom:44px;margin-left:0" class="MetroButton2">${LOCALE_app_settings[6]['Recovery'][5]}</button>
    <h1>${LOCALE_app_settings[6]['Recovery'][6]}</h1>
    <p style="width: 680px">${LOCALE_app_settings[6]['Recovery'][7]}</p>
    <button onclick="window.top.postMessage('RestartToRecovery', '*')" style="margin-bottom:44px;margin-left:0" class="MetroButton2">${LOCALE_app_settings[6]['Recovery'][8]}</button>
    `,
    'LoginMethods':`
    <script>
        function ChangePassword () {
            if (localStorage.getItem('OKNA8_user_' + currentUser + '_password') == '' || localStorage.getItem('OKNA8_user_' + currentUser + '_password') == null) {
                window.top.postMessage(\`ModalMetroDialog|
                    <h1>${LOCALE_app_settings[6]['LoginMethods'][4]}</h1>
                    <p>${LOCALE_app_settings[6]['LoginMethods'][6]}</p>
                    <input type="password" id="password1" placeholder="${LOCALE_app_settings[6]['LoginMethods'][7]}" style="margin-bottom: 12px"><br>
                    <input type="password" id="password2" placeholder="${LOCALE_app_settings[6]['LoginMethods'][8]}" style="margin-bottom: 12px"><br>
                    <input type="text" id="password3" placeholder="${LOCALE_app_settings[6]['LoginMethods'][9]}">
                    <div class="buttons">
                        <button onclick="CloseMetroDialog(__ID__)">${LOCALE_app_settings[6]['LoginMethods'][10]}</button>
                        <button onclick="
                        if ($('#password1').val() != '' && $('#password1').val() == $('#password2').val()) {
                            localStorage.setItem('OKNA8_user_' + currentUser + '_password', $('#password1').val())
                            CloseMetroDialog(__ID__)
                        }">${LOCALE_app_settings[6]['LoginMethods'][11]}</button>
                    </div>
                \`, '*')
            } else {
                window.top.postMessage(\`ModalMetroDialog|
                    <h1>${LOCALE_app_settings[6]['LoginMethods'][5]}</h1>
                    <p>${LOCALE_app_settings[6]['LoginMethods'][6]}</p>
                    <input type="password" id="password1" placeholder="${LOCALE_app_settings[6]['LoginMethods'][7]}" style="margin-bottom: 12px"><br>
                    <input type="password" id="password2" placeholder="${LOCALE_app_settings[6]['LoginMethods'][8]}" style="margin-bottom: 12px"><br>
                    <input type="text" id="password3" placeholder="${LOCALE_app_settings[6]['LoginMethods'][9]}">
                    <div class="buttons">
                        <button onclick="CloseMetroDialog(__ID__)">${LOCALE_app_settings[6]['LoginMethods'][10]}</button>
                        <button onclick="
                        if ($('#password1').val() != '' && $('#password1').val() == $('#password2').val()) {
                            localStorage.setItem('OKNA8_user_' + currentUser + '_password', $('#password1').val())
                            CloseMetroDialog(__ID__)
                        }">${LOCALE_app_settings[6]['LoginMethods'][11]}</button>
                    </div>
                \`, '*')
            }
        }
    </script>
    <h1>${LOCALE_app_settings[6]['LoginMethods'][0]}</h1>
    <p>${LOCALE_app_settings[6]['LoginMethods'][1]}</p>
    <button class="MetroButton2" id="ButtonPasswordChange" onclick="ChangePassword()" style="margin-left:0"></button>
    <button class="MetroButton2" id="ButtonPasswordRemove" onclick="localStorage.removeItem('OKNA8_user_' + currentUser + '_password');openRightPage('LoginMethods')" style="display:none">${LOCALE_app_settings[6]['LoginMethods'][12]}</button>
    <script>
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_password') == '' || localStorage.getItem('OKNA8_user_' + currentUser + '_password') == null) {
            $('#ButtonPasswordChange').html('${LOCALE_app_settings[6]['LoginMethods'][2]}')
        } else {
            $('#ButtonPasswordChange').html('${LOCALE_app_settings[6]['LoginMethods'][3]}')
            $('#ButtonPasswordRemove').css('display','inline-block')
        }
    </script>
    `,
    'OtherUsers':`
        <style>
            .addAccount {
                width: 430px;
                height: 40px;
                position: absolute;
                top: 105px;
                left: 60px;
                padding: 10px;
                transition: 0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
            }

            .addAccount p {
                position: absolute;
                margin: 0;
                top: 10px;
                left: 60px;
            }

            .addAccount:hover {
                background-color: rgb(242,242,242);
            }

            .addAccount:active {
                scale: 0.95;
            }

            .useraccountslist {
                position: absolute;
                top: 165px;
                left: 60px;
            }

            .useraccountslist img {
                width: 40px;
                height: 40px;
            }

            .useraccountslist div {
                width: 430px;
                height: 40px;
                padding: 10px;
                transition: 0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
                position: relative;
            }

            .useraccountslist div p {
                position: absolute;
                margin: 0;
                top: 10px;
                left: 60px;
            }

            .useraccountslist div:hover {
                background-color: rgb(242,242,242);
            }

            .useraccountslist div:active {
                scale: 0.95;
            }

            .useraccountslist div button {
                display:none;
            }

            .useraccountslist div.active {
                height: 100px;
                background-color: rgb(242,242,242);
            }

            .useraccountslist div.active:active {
                scale: 1;
            }

            .useraccountslist div.active button {
                display: block;
                position: absolute;
                right: 10px;
                bottom: 10px;
                margin: 0;
            }
        </style>
        <h1>${LOCALE_app_settings[6]['OtherUsers'][0]}</h1>
        <div class="addAccount" onclick="window.top.postMessage('UserCreateDialog','*')"><img src="gui/add.png"><p>Добавление учётной записи</p></div>
        <div class="useraccountslist">
        </div>
        <script>
            var Users = localStorage.getItem('OKNA8_users').split('|')
            $('.useraccountslist').html('')
            for (let i = 0; i < Users.length; i++) {
                if (Users[i] != currentUser) {
                    $('.useraccountslist').append('<div id="UserAccountsList_User_' + Users[i] + '" onclick="$(\\'.useraccountslist div\\').removeClass(\\'active\\');$(\\'#UserAccountsList_User_' + Users[i] + '\\').addClass(\\'active\\');"><img src="../../../img/avatar.png"><p>' + localStorage.getItem('OKNA8_user_' + Users[i] + '_username') + '</p><button class="negative" onclick="window.top.postMessage(\\'removeUser_\\' + \\'' + Users[i] + '\\', \\'*\\');setTimeout(()=>{openRightPage(\\'OtherUsers\\')},100)">${LOCALE_app_settings[6]['OtherUsers'][6]}</button></div>')
                }
            }
        </script>
    `,
    'DataExport': `
        <h1>${LOCALE_app_settings[6]['DataExport'][0]}</h1>
        <p>${LOCALE_app_settings[6]['DataExport'][1]}</p>
        <button onclick="window.top.postMessage('export-data' + JSON.stringify(localStorage), '*')" class="MetroButton2" style="margin-left:0">${LOCALE_app_settings[6]['DataExport'][2]}</button>
        <button onclick="window.top.postMessage('import-data', '*')" class="MetroButton2">${LOCALE_app_settings[6]['DataExport'][3]}</button>
    `,
    'OknaMods': `
        <h1>${LOCALE_app_settings[6]['OknaMods'][0]}</h1>
        <style>
            .addMod {
                width: 430px;
                height: 40px;
                padding: 10px;
                transition: 0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
                position:relative;
            }

            .addMod p {
                position: absolute;
                margin: 0;
                top: 10px;
                left: 60px;
            }

            .addMod:hover {
                background-color: rgb(242,242,242);
            }

            .addMod:active {
                scale: 0.95;
            }

            .modslist {
                position: relative;
            }

            .modslist  img {
                width: 40px;
                height: 40px;
            }

            .modslist  div {
                width: 430px;
                height: 40px;
                padding: 10px;
                transition: 0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
                position: relative;
            }

            .modslist  div p {
                position: absolute;
                margin: 0;
                top: 10px;
                left: 60px;
            }

            .modslist  div:hover {
                background-color: rgb(242,242,242);
            }

            .modslist  div:active {
                scale: 0.95;
            }

            .modslist div button {
                display:none;
            }

            .modslist div.active {
                height: 100px;
                background-color: rgb(242,242,242);
            }

            .modslist div.active:active {
                scale: 1;
            }

            .modslist div.active button {
                display: block;
                position: absolute;
                right: 10px;
                bottom: 10px;
                margin: 0;
            }
        </style>
        <div class="addMod" onclick="window.top.postMessage('UserCreateDialog','*')"><img src="gui/add.png"><p>${LOCALE_app_settings[6]['OknaMods'][1]}</p></div>
        <div class="modslist mods">
        </div>
        <div class="addMod" onclick="window.top.postMessage('UserCreateDialog','*')"><img src="gui/add.png"><p>${LOCALE_app_settings[6]['OknaMods'][2]}</p></div>
        <div class="modslist apps">
        <div id="Modslist_Mod_" onclick="$('.modslist div').removeClass('active');$('#Modslist_Mod_').addClass('active');"><img src="../../../img/avatar.png"><p>Mod name</p><button class="negative" onclick="window.top.postMessage('removeUser_' + '', '*');setTimeout(()=>{openRightPage('OtherUsers')},100)">${LOCALE_app_settings[6]['OknaMods'][3]}</button></div>
        </div>
        <script>
            var Apps = localStorage.getItem('OKNA8_node_apps').split(';')
            for (let i = 0; Apps.length > i; i++) {
                Apps[i] = Apps[i].split('|')
            }
            console.log(Apps)
            $('.modslist.apps').html('')
            for (let i = 0; i < Apps.length; i++) {
                if (Apps[i][0] != '') {
                    $('.modslist.apps').append('<div id="UserAccountsList_User_' + Apps[i][0] + '" onclick="$(\\'.modslist.apps div\\').removeClass(\\'active\\');$(\\'#UserAccountsList_User_' + Apps[i][0] + '\\').addClass(\\'active\\');"><img src="' + Apps[i][1] + '/AppLogo.png"><p>' + Apps[i][0] + '</p><button class="negative" onclick="DeleteApp(' + Apps[i][0] + '">${LOCALE_app_settings[6]['OknaMods'][3]}</button></div>')
                }
            }

            function DeleteApp(Modname, Modfolder) {
                window.top.postMessage('DeleteAppDialog|' + Modname + '|' + Modfolder, '*')
            }
        </script>
    `
}