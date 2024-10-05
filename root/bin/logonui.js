function main(args){ return new Promise(async(res, rej) => {
    let logonUIBody = document.createElement("div")
    logonUIBody.className = "logonui"
    logonUIBody.innerHTML = `<link rel="stylesheet" href="./sys/logonui.css">
<div class="logonui-users-container">
    <div class="user" onclick="login()">
        <div class="user-profile-container">
            <img src="res/profileimgs.png">
        </div>
        SYSTEM
    </div>
</div>
<div class="logonui-status" style="display: none;">
    <img src="res/loading.png">
    <p class="logonui-status-text">Welcome</p>
</div>
<button style="position: absolute; bottom: 10px; right: 10px" onclick="bootloader.style.display = ''">bootlog</button>`
    let file = await fs.readFile("res/login.jpg")
    console.log(file)
    let logonui
    if (file) logonui = URL.createObjectURL(file)
    else logonui = "./res/login.jpg"
    logonUIBody.style.setProperty("--logonui-background", `url(${logonui})`)
    logonUIBody.style.display = ""
    const wnd = new Winda7Window({
        inset: "0px", 
        title: "LogonUI", 
        icon: "icon.png", 
        id: getId(), 
        layout: logonUIBody,
        ignoreWorkingArea: true,
        noResize: true
    })
    wnd.show()
})}