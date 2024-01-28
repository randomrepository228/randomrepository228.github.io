function addScript(src){
    var script = document.createElement('script')
    script.src = src
    script.async = false; 
    document.head.appendChild(script)
}

var currentUser = sessionStorage.getItem('OKNA8_sessionUser')

addScript('../../../localization/' + localStorage.getItem('OKNA8_locale') + '/apps/settings.js')
addScript('settings.js')
addScript('settinglist.js')