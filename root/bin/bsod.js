function main(args){
    function displayBSOD(reason){
        if (!reason) reason = "NULL"
        document.body.innerHTML = `
A problem has been detected and windows has been shut down to prevent damage
to your computer.

${reason.replace(/\n/g, "")}

If this is the first time you've seen this Stop error screen,
restart your computer. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacturer
for any windows updates you might need.

If problems continue, disable or remove any newly installed hardware
or software. Disable BIOS memory options such as caching or shadowing.
If you need to use Safe Mode to remove or disable components, restart
your computer, press F8 to select Advanced Startup options, and then
select Safe Mode.

Technical information:

***&nbsp;STOP:&nbsp;0x00000000&nbsp;(0x0000000000000000,0x0000000000000000,0x0000000000000000,0x0000080000000000)



Collecting data for crash dump ...
Initializing disk for crash dump ...
Beginning dump of physical memory. 
Dumping physical memory to disk:  <span id="bsodCounter" style="font-family: 'bsod'; line-height: 100%">0</span>`
            document.body.style.setProperty("--wallpaper", "none")
            document.body.setAttribute("style", "background-color: navy; white-space: pre-wrap; line-height: 100%; font-size: min(3vh, 2.02vw); color: white; font-family: 'bsod'; word-break: break-word;")
            bsodProgress = 0;
            const magicVariable = setInterval(() => {
                bsodProgress += 5
                if (bsodProgress > 99) {
                    bsodCounter.innerText = "100\nPhysical memory dump complete.\nContact your system admin or technical support group for further assistance."
                    if (bsodProgress > 100) {
                        clearInterval(magicVariable)
                        window.location.reload()
                    }
                    return
                }
                bsodCounter.innerText = bsodProgress
            }, 200)
    }
    if (args.length) {
        displayBSOD(args.join(" "))
        return
    }
    const el = document.createElement("div")
    el.style.height = "100%"
    const main = document.createElement("div")
    main.style.margin = "25px"
    main.style.marginTop = "10px"
    main.style.marginBottom = "15px"
    main.style.height = "calc(100% - 65px)"
    main.innerHTML = "Reason:<br>"
    const bsodreason = document.createElement("textarea")
    bsodreason.name = "bsodreason"
    bsodreason.style.appearance = "none"
    bsodreason.style.resize = "none"
    bsodreason.style.width = "100%"
    bsodreason.style.height = "calc(100% - 20px)"
    main.append(bsodreason)
    el.append(main)
    const footer = document.createElement("footer")
    const button = document.createElement("button")
    button.innerText = "Invoke"
    button.onclick = () => displayBSOD(bsodreason.value)
    footer.append(button)
    el.append(footer)
    const wnd = new Winda7Window({
        title: "Blue Screen of Death", 
        icon: "./bin/bsod.png", 
        id: getId(),
        layout: {
            titlebar: {
                buttons: {
                    min: true,
                    max: true,
                    close: true
                }
            },
            cont: el
        },
        width: 500,
        aero: true
    })
    wnd.show()
}