function SetLang() {
    localStorage.setItem('OKNA8_locale',$('select[name=langselector]').val())
    
    ConnectScript('res/localization/' + localStorage.getItem('OKNA8_locale') + '/index.html.js')
    ConnectScript('res/script/index.html.js')
}

$(document).ready(() => {
    $('.content').html(`
        <img src="res/img/logo2.png" alt="">
        <h1>Okna8</h1>
        <p id="welcometext">Select your language</p>
        <select name="langselector" id="" style="margin-left: 40px">
            <option value="ru-ru" style="color:black">Русский язык (ru-ru)</option>
            <option value="en-us" style="color:black">English language (en-us)</option>
            <!--<option value="uk-ua" style="color:black">Українська мова (uk-ua)</option>-->
            <!--<option value="other" style="color:black">Другой / Other</option>-->
        </select> <br> <br>
        <button id="start" onclick="SetLang()">Continue</button>
        <p id="ver">Ver. ${VERSION['ver']}, build ${VERSION['build']}</p>
    `)
    $('.welcome').css('display', 'block')

})