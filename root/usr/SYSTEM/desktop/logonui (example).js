async function main(args){
    let logonUIBody = document.createElement("div")
    logonUIBody.className = "logonui"
    logonUIBody.innerHTML = `
<div class="logonui-users-container">
    <div class="user" onclick="login()">
        <div class="user-profile-container">
            <img src="Profileimgs/user.png">
        </div>
        SYSTEM
    </div>
</div>
<div class="logonui-status" style="display: none;">
    <img src="res/loading.png">
    <p class="logonui-status-text">Welcome</p>
</div>`
    winda.logonUIid = getId()
    AddWindow(new Winda7Window(0,0,"LogonUI",""), false, {
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "title": "LogonUI",
        "icon": "icon.png",
        "window": true,
        "noTray": true,
        "noResize": true,
        "NoGUI": true,
        "customPos": true, ()
        "noSelfOpen": true, // window.show() is not needed
        "overrideTaskbar": true // bottom is relative to screen, not taskbar
    }, winda.logonUIid, logonUIBody)
}