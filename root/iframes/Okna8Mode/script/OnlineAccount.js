// ToDo: сделать блокировку символов ` ~ ! @ " № # $ ; % ^ : & ? * ( ) { } [ ] ' / | \ < > + =

var syncSuccess = null

var OnlineAccountDialogStyles = /*css*/ `
    .AccountInfo {
        width: 100%;
        height: 70px;
        padding-top: 16px;
        position: relative;
    }

    .AccountInfo img {
        width: 44px;
        height: 44px;
    }

    .AccountInfo h1 {
        position: absolute;
        left: 50px;
        top: 0;
        margin: 8px 0px;
        color: white;
        font-size: 28px;
        font-weight: 100;
    }

    .AccountInfo p {
        position: absolute;
        left: 50px;
        margin: 8px 0px;
        color: white;
        font-size: 16px;
        top: 30px;
    }

    .InputsContainer {
        width: 410px;
    }

    .InputsContainer > div {
        width: 410px;
        height: 50px;
        position: relative;
    }

    .InputsContainer > div > p {
        width: 140px;
        position: absolute;
        left: 0; top: 0;
        color: white;
        margin: 12px 0px;
    }

    .InputsContainer > div > input {
        left: 150px;
        top: 8px;
        position: absolute;
        width: 260px;
    }
`

var OnlineAccount = {
    disable: () => {
        var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount'))
        var DialogID = ModalMetroDialog(/*html*/ `
            <div class="page1 page" style="height:100%;width:100%">
                <h1>Переключиться на локальную учётную запись</h1>
                <p>
                    Вместо входа в систему с учётной записью Okna вы можете использовать учётную запись только на этом компьютере. Сохраните свои данные, так как вам потребуется выйти из системы.<br><br>
                    Сначала нам нужно проверить ваш текущий пароль.
                </p>
                <div class="AccountInfo">
                    <img src="img/avatar.png">
                    <h1>${AccountInfo.FirstName} ${AccountInfo.LastName}</h1>
                    <p>${AccountInfo.Email}</p>
                </div>
                <div class="InputsContainer">
                    <div>
                        <p>Текущий пароль</p>
                        <input class="DisableOnlineAccountInputPassword" type="Password">
                    </div>
                </div>
                <p class="errormessage" style="color: yellow"></p>
                <style>
                    ${OnlineAccountDialogStyles}
                </style>
                <div class="buttons">
                    <button onclick="CheckPasswordAndDisable()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page2 page" style="display:none;height:100%;width:100%">
                <h1>Переключиться на локальную учётную запись</h1>
                <p>
                    Введите следующие данные. Теперь вы будете входить в Okna с локальной учётной записью.
                </p>
                <div class="InputsContainer">
                    <div>
                        <p>Имя пользователя</p>
                        <input class="DisableOnlineAccountInputNewUsername" type="text">
                    </div>
                </div>
                <div class="buttons">
                    <button onclick="CheckNewUsernameAndDisable()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page3 page" style="height:100%;width:100%;display:none">
                <h1 style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)">
                    <div class="progress-ring" style="display: inline-block; scale: 0.6; vertical-align: -6px; margin-right: 8px;">${Metro_ProgressRing}</div>
                    Подождите
                </h1>
            </div>
            <script>
                async function CheckPasswordAndDisable() {
                    if ($(".DisableOnlineAccountInputPassword").val() != "") {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                        axios.post(VERSION.server + '/TryLogin', JSON.stringify({Login: JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount')).Email, Password: $(".DisableOnlineAccountInputPassword").val()}))
                            .then(response=>{
                                if (typeof response.data == "object") {
                                    var AccountInfo = response.data.AccountInfo
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2').css('display', 'block')
                                } else {
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1 > .errormessage').html('Неопознанная ошибка.')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                                }
                                console.log(typeof response.data)
                                console.log(response.data)
                            })
                            .catch(()=>{
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1 > .errormessage').html('Неопознанная ошибка.')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                            })
                    }
                }

                function CheckNewUsernameAndDisable() {
                    if ($(".DisableOnlineAccountInputNewUsername").val() != "") {
                        localStorage.removeItem('OKNA8_user_' + currentUser + '_OnlineAccount')
                        localStorage.setItem('OKNA8_user_' + currentUser + '_username', $(".DisableOnlineAccountInputNewUsername").val())
                        localStorage.removeItem('OKNA8_user_' + currentUser + '_password')
                        shutdown('l')
                    }
                }
            </script>
            
        `)
        $('#ModalMetroDialog' + DialogID + ' > .metrodialog > .cont').css('min-height', (window.innerHeight * 0.6).toFixed(0) + 'px')
    },
    connect: () => {
        var DialogID = ModalMetroDialog(/*html*/ `
            <div class="page2 page" style="display:none;height:100%;width:100%">
                <h1>Переключение на онлайн-учётную запись</h1>
                <div class="AccountInfo">
                    <img src="img/avatar.png">
                    <h1></h1>
                    <p></p>
                </div>
                <style>
                    ${OnlineAccountDialogStyles}
                </style>
                <div class="buttons">
                    <button onclick="">Переключиться</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page1 page" style="height:100%;width:100%">
                <h1>Вход в онлайн-учётную запись</h1>
                <p>
                    Выполните вход, чтобы использовать веб-почту, фотографии, файлы и настройки (например, журнал браузера и избранное) на всех своих устройствах. Вы можете управлять своими синхронизируемыми в любое время.<br><br>
                </p>
                <input class="ConnectOnlineAccountInputEmail" placeholder="Адрес электронной почты" type="text"><br><br>
                <input class="ConnectOnlineAccountInputPassword" placeholder="Пароль" type="password">
                <p class="errormessage" style="color: yellow"></p>
                <p style="position: absolute;bottom: 84px;">
                    Нет учётной записи?<br>
                    <a onclick="CreateNewAccount()">Создать новую учётную запись</a>
                </p>
                <div class="buttons">
                    <button onclick="CheckEmailAndLogin()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page3 page" style="height:100%;width:100%;display:none">
                <h1>Регистрация учётной записи Okna</h1>
                <p>
                    Введите свой адрес электронной почты, придумайте надёжный пароль, введите имя и фамилию.<br><br>
                </p>
                <input class="RegisterOnlineAccountInputEmail" placeholder="Адрес электронной почты" type="text"><br><br>
                <input class="RegisterOnlineAccountInputPassword" placeholder="Пароль" type="password"><br><br>
                <input class="RegisterOnlineAccountInputFirstName" placeholder="Имя" type="text"><br><br>
                <input class="RegisterOnlineAccountInputLastName" placeholder="Фамилия" type="text">
                <p class="errormessage" style="color: yellow"></p>
                <div class="buttons">
                    <button onclick="CheckAccountInfoAndRegister()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page4 page" style="height:100%;width:100%;display:none">
                <h1 style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)">
                    <div class="progress-ring" style="display: inline-block; scale: 0.6; vertical-align: -6px; margin-right: 8px;">${Metro_ProgressRing}</div>
                    Подождите
                </h1>
            </div>
            <div class="page5 page" style="height:100%;width:100%;display:none">
                <h1>Регистрация учётной записи Okna</h1>
                <p>
                    На ваш адрес <span id="RegisterOnlineAccountEmail"></span> отправлен код подтверждения. Введите его здесь.<br><br>
                </p>
                <input class="RegisterOnlineAccountInputVerifyCode" placeholder="Проверочный код" type="text"><br><br>
                <p class="errormessage" style="color: yellow"></p>
                <div class="buttons">
                    <button onclick="CheckVerifyCodeAndRegister()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            
            <script>
                async function TryLogin(Login, Password) {
                    axios.post(VERSION.server + '/TryLogin', JSON.stringify({Login: Login, Password: Password}))
                        .then(response=>{
                            if (typeof response.data == "object") {
                                var AccountInfo = response.data.AccountInfo
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2').css('display', 'block')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2 > .AccountInfo > h1').html(AccountInfo.FirstName + " " + AccountInfo.LastName)
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2 > .AccountInfo > p').html(AccountInfo.Email + "<br><br>Почти готово. Старая учётная запись будет изменена на онлайн-учётную запись. Все ваши файлы на этом компьютере останутся на месте.")
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2 > .buttons > button:nth-child(1)').attr('onclick', 'UseOnlineInsteadOfLocal({"Email": "' + AccountInfo.Email + '", "Password": "' + Password + '", "FirstName": "' + AccountInfo.FirstName + '", "LastName": "' + AccountInfo.LastName + '"})')
                            } else {
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1 > .errormessage').html('Неверный пароль.')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                            }
                            console.log(typeof response.data)
                            console.log(response.data)
                        })
                        .catch(()=>{
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1 > .errormessage').html('Учётной записи не существует.')
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                        })
                }

                async function CheckEmailAndLogin() {
                    if ($(".ConnectOnlineAccountInputEmail").val() != "" && $(".ConnectOnlineAccountInputPassword").val() != "") {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page4').css('display', 'block')
                        var OknaUsersList = localStorage.getItem('OKNA8_users').split('|')
                        var EmailAlreadyUsed = false
                        for (let i = 0; i < OknaUsersList.length; i++) {
                            if (localStorage.getItem('OKNA8_user_' + OknaUsersList[i] + '_OnlineAccount') != null) {
                                if (JSON.parse(localStorage.getItem('OKNA8_user_' + OknaUsersList[i] + '_OnlineAccount')).Email == $(".ConnectOnlineAccountInputEmail").val()) {
                                    EmailAlreadyUsed = true
                                }
                            }
                        }
                        if (!EmailAlreadyUsed) {
                            TryLogin($(".ConnectOnlineAccountInputEmail").val(), $(".ConnectOnlineAccountInputPassword").val())
                        } else {
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1 > .errormessage').html('Этот электронный адрес используется в другой учётной записи.')
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                            $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                        }
                    }
                }

                async function CheckAccountInfoAndRegister() {
                    if ($(".RegisterOnlineAccountInputEmail").val() != "" &&
                        $(".RegisterOnlineAccountInputPassword").val() != "" &&
                        $(".RegisterOnlineAccountInputFirstName").val() != "" &&
                        $(".RegisterOnlineAccountInputLastName").val() != "" &&
                        /^[a-zA-Z0-9-_-_@_.]*$/.test($(".RegisterOnlineAccountInputEmail").val()) &&
                        /^[a-zA-Zа-яА-Я0-9\s]+$/.test($(".RegisterOnlineAccountInputFirstName").val()) &&
                        /^[a-zA-Zа-яА-Я0-9\s]+$/.test($(".RegisterOnlineAccountInputLastName").val()) &&
                        /^[a-zA-Z0-9-_-_@$!%*?&_.]{8,20}$/.test($(".RegisterOnlineAccountInputPassword").val())
                    ) {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page4').css('display', 'block')

                        axios.post(VERSION.server + '/RegisterAccount', JSON.stringify({Login: $(".RegisterOnlineAccountInputEmail").val(), Password: $(".RegisterOnlineAccountInputPassword").val(), FirstName: $(".RegisterOnlineAccountInputFirstName").val(), LastName: $(".RegisterOnlineAccountInputLastName").val()}))
                                .then(response=>{
                                    if (response.data == 'success') {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5').css('display', 'block')
                                        //TryLogin($(".RegisterOnlineAccountInputEmail").val(), $(".RegisterOnlineAccountInputPassword").val())
                                    } else {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3 > .errormessage').html('Неопознанная ошибка.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                                    }
                                })
                                .catch(err=>{
                                    console.log(err.response.data)
                                    if (err.response.data == 'error:account_already_exist') {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3 > .errormessage').html('Учётная запись с таким адресом электронной почты уже существует.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                                    } else {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3 > .errormessage').html('Неопознанная ошибка.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                                    }
                                })
                    } else {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3 > .errormessage').html('Не все поля заполнены корректно.')
                    }
                }

                async function CheckVerifyCodeAndRegister() {
                    if ($(".RegisterOnlineAccountInputVerifyCode").val() != "") {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page4').css('display', 'block')

                        axios.post(VERSION.server + '/VerifyAccount', JSON.stringify({Login: $(".RegisterOnlineAccountInputEmail").val(), Code: $(".RegisterOnlineAccountInputVerifyCode").val()}))
                                .then(response=>{
                                    if (response.data == 'success') {
                                        console.log('ебать оно работает')
                                        TryLogin($(".RegisterOnlineAccountInputEmail").val(), $(".RegisterOnlineAccountInputPassword").val())
                                    } else {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5 > .errormessage').html('Неопознанная ошибка.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5').css('display', 'block')
                                    }
                                })
                                .catch(err=>{
                                    console.log(err.response.data)
                                    if (err.response.data == 'error:account_already_exist') {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5 > .errormessage').html('Учётная запись с таким адресом электронной почты уже существует.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5').css('display', 'block')
                                    } else {
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5 > .errormessage').html('Неопознанная ошибка.')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page5').css('display', 'block')
                                    }
                                })
                    } else {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3 > .errormessage').html('Необходимо заполнить все поля.')
                    }
                }

                function UseOnlineInsteadOfLocal(AccountInfo) {
                    localStorage.setItem('OKNA8_user_' + currentUser + '_OnlineAccount', JSON.stringify(AccountInfo))
                    localStorage.removeItem('OKNA8_user_' + currentUser + '_password')
                    shutdown('l')
                }

                function CreateNewAccount() {
                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'none')
                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                }
            </script>
        `)
        $('#ModalMetroDialog' + DialogID + ' > .metrodialog > .cont').css('min-height', (window.innerHeight * 0.6).toFixed(0).slice(0, -1) + '0px')
    },
    changePassword: () => {
        var DialogID = ModalMetroDialog(/*html*/ `
            <div class="page2 page" style="display:none;height:100%;width:100%">
                <h1>Изменение пароля учётной записи</h1>
                <div class="AccountInfo">
                    <img src="img/avatar.png">
                    <h1></h1>
                    <p></p>
                </div>
                <style>
                    ${OnlineAccountDialogStyles}
                </style>
                
                <div class="InputsContainer" style="margin-top: 60px">
                    <div>
                        <p>Новый пароль</p>
                        <input class="ChangepassOnlineAccountInputPasswordNewPassword1" type="Password">
                    </div>
                    <div>
                        <p>Введите пароль ещё раз</p>
                        <input class="ChangepassOnlineAccountInputPasswordNewPassword2" type="Password">
                    </div>
                </div>
                <div class="buttons">
                    <button onclick="CheckNewPasswordsAndChange()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            <div class="page1 page" style="height:100%;width:100%">
                <h1>Подтвердите свою учётную запись</h1>
                <p>
                    Так как вы пытаетесь получить доступ к конфиденциальным сведениям, нужно ещё раз ввести пароль.<br><br>
                    <span class="CurrentOnlineAccountEmail">test@example.com</span><br><br>
                </p>
                <input class="ChangepassOnlineAccountInputPassword" placeholder="Пароль" type="password">
                <div class="buttons">
                    <button onclick="CheckPasswordAndChange()">Далее</button>
                    <button onclick="CloseMetroDialog(__ID__)">Отмена</button>
                </div>
            </div>
            
            <script>
                $('.CurrentOnlineAccountEmail').html(JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount')).Email)

                async function CheckPasswordAndChange() {
                    if ($(".ChangepassOnlineAccountInputPassword").val() != "") {
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                        $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                        axios.post(VERSION.server + '/TryLogin', JSON.stringify({Login: JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount')).Email, Password: $(".ChangepassOnlineAccountInputPassword").val()}))
                            .then(response=>{
                                if (typeof response.data == "object") {
                                    var AccountInfo = response.data.AccountInfo
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2').css('display', 'block')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2 > .AccountInfo > h1').html(AccountInfo.FirstName + " " + AccountInfo.LastName)
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page2 > .AccountInfo > p').html(AccountInfo.Email)
                                } else {
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                                }
                                console.log(typeof response.data)
                                console.log(response.data)
                            })
                            .catch(()=>{
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                            })
                    }
                }

                async function CheckNewPasswordsAndChange() {
                    if ($(".ChangepassOnlineAccountInputPasswordNewPassword1").val() != "" && $(".ChangepassOnlineAccountInputPasswordNewPassword1").val() == $(".ChangepassOnlineAccountInputPasswordNewPassword2").val()) {
                        axios
                            .post(VERSION.server + '/ChangeAccountPassword',
                                JSON.stringify({
                                    Login: JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount')).Email,
                                    CurrentPassword: $(".ChangepassOnlineAccountInputPassword").val(),
                                    NewPassword: $(".ChangepassOnlineAccountInputPasswordNewPassword1").val()
                                })
                            )
                            .then(response=>{
                                if (typeof response.data == "object") {
                                    var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount'))
                                    AccountInfo.Password = $(".ChangepassOnlineAccountInputPasswordNewPassword1").val()
                                    localStorage.setItem('OKNA8_user_' + currentUser + '_OnlineAccount', JSON.stringify(AccountInfo))
                                    OnlineAccount.sync()
                                    CloseMetroDialog(__ID__)
                                } else {
                                    console.log('Error')
                                }
                            })
                            .catch(()=>{
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page').css('display', 'none')
                                $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'block')
                            })
                    }
                }

                function UseOnlineInsteadOfLocal(AccountInfo) {
                    localStorage.setItem('OKNA8_user_' + currentUser + '_OnlineAccount', JSON.stringify(AccountInfo))
                    localStorage.removeItem('OKNA8_user_' + currentUser + '_password')
                    shutdown('l')
                }

                function CreateNewAccount() {
                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page1').css('display', 'none')
                    $('#ModalMetroDialog__ID__ > .metrodialog > .cont > .page3').css('display', 'block')
                }
            </script>
        `)
        $('#ModalMetroDialog' + DialogID + ' > .metrodialog > .cont').css('min-height', (window.innerHeight * 0.6).toFixed(0).slice(0, -1) + '0px')
    },
    sync: () => {
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount') != null) {
            log('Syncing with Online...')
            var AccountInfo = JSON.parse(localStorage.getItem('OKNA8_user_' + currentUser + '_OnlineAccount'))
            axios
                .post(VERSION.server + '/TryLogin', JSON.stringify({ Login: AccountInfo.Email, Password: AccountInfo.Password }))
                .then((response) => {
                    syncSuccess = true
                })
                .catch((error) => {
                    log('Syncing with Online failed.')
                    if (syncSuccess != false) {
                        ModalMetroDialog('<h1>Ошибка синхронизации</h1><p>Произошла ошибка при получении данных с сервера.</p><div class="buttons"><button onclick="CloseMetroDialog(__ID__)">Close</button></div>')
                    }
                    syncSuccess = false
                })
        }
    },
}

setInterval(() => {
    OnlineAccount.sync()
}, 10000)
