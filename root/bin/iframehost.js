if (!window.winda.iframes) window.winda.iframes = {
    "bsod": {
        "width": 600,
        "height": 350,
        "title": "Blue Screen of Death",
        "icon": "icon.png",
        "window": true
    },
    "calc": {
        "width": 212,
        "height": 284,
        "title": "Calculator",
        "icon": "icon.png",
        "window": true,
        "noResize": true
    },
    "changelog": {
        "width": 500,
        "height": 500,
        "title": "Changelog",
        "icon": "icon.png",
        "window": true
    },
    "cmd": {
        "width": 500,
        "height": 500,
        "title": "Command Prompt",
        "icon": "icon.png",
        "window": true
    },
    "control": {
        "width": 500,
        "height": 500,
        "title": "Winda Control Panel",
        "icon": "icon.png",
        "window": true,
        "noGUI": true,
        "titleBarHeight": 30,
        "hideTitle": true
    },
    "dvd": {
        "width": 400,
        "height": 200,
        "title": "DVD",
        "icon": "",
        "window": true,
        "xOnly": true,
        "noResize": true
    },
    "ExampleApp": {
        "width": 500,
        "height": 500,
        "title": "Example App",
        "icon": "icon.png",
        "window": true
    },
    "explorer-file-manager": {
        "width": 500,
        "height": 500,
        "title": "Winda Explorer",
        "icon": "icon.png",
        "window": true,
        "noGUI": true,
        "titleBarHeight": 30,
        "hideTitle": true
    },
    "fileproperties": {
        "width": 600,
        "height": 350,
        "title": "Properties: ",
        "icon": "icon.png",
        "window": true
    },
    "iexplore": {
        "width": 500,
        "height": 500,
        "title": "Internet Explorer",
        "icon": "icon.png",
        "window": true,
        "noGUI": true,
        "titleBarHeight": 55
    },
    "monaco": {
        "width": 500,
        "height": 500,
        "title": "Monaco Editor",
        "icon": "icon.png",
        "window": true
    },
    "newlink": {
        "width": 612,
        "height": 388,
        "title": "Create link",
        "icon": "icon.png",
        "window": true,
        "xOnly": true,
        "noResize": true
    },
    "notepad": {
        "width": 500,
        "height": 500,
        "title": "Notepad",
        "icon": "icon.png",
        "window": true
    },
    "Okna8Mode": {
        "width": 300,
        "height": 500,
        "title": "Okna 8 Mode",
        "icon": "icon.png",
        "window": true,
        "noSelfOpen": true
    },
    "oobe": {
        "width": 600,
        "height": 350,
        "title": "Set Up Winda7",
        "icon": "icon.png",
        "window": true,
        "noResize": true
    },
    "paint": {
        "width": 500,
        "height": 500,
        "title": "Paint",
        "icon": "icon.png",
        "window": true
    },
    "regedit": {
        "width": 500,
        "height": 500,
        "title": "Registry Editor",
        "icon": "icon.png",
        "window": true
    },
    "run": {
        "width": 429,
        "height": 176,
        "title": "Run",
        "icon": "icon.png",
        "window": true,
        "xOnly": true,
        "noResize": true,
        "bottom": 10,
        "left": 10
    },
    "sfc": {
        "width": 380,
        "height": 400,
        "title": "System program checker",
        "icon": "icon.png",
        "window": true,
        "xOnly": true,
        "noResize": true
    },
    "taskbarproperties": {
        "width": 410,
        "height": 423,
        "title": "Taskbar and start menu properties",
        "icon": "icon.png",
        "window": true,
        "xOnly": true,
        "noResize": true,
        "bottom": 0,
        "left": 0
    },
    "taskmgr": {
        "width": 500,
        "height": 500,
        "title": "Task Manager",
        "icon": "icon.png",
        "window": true
    },
    "winver": {
        "width": 500,
        "height": 500,
        "title": "About \"Windows\"",
        "icon": "icon.png",
        "window": true
    },
    "wmplayer": {
        "width": 236,
        "height": 236,
        "minWidth": 236,
        "minHeight": 236,
        "title": "Winda Media Player",
        "icon": "",
        "window": true
    }
}
function main(args){ return new Promise(async (res, rej) => {
    let iframetype = args[args.length - 1]
    const packageName = args[0]
    let path;
    if (args[1] && args[1] !== iframetype) path = args[1]
    if (!path) path = "iframes/"
    path += packageName + "/"
    if (iframetype === "winda7"){
        let info;
        const arg = args[2]
        let id = args[3]
        try{
            info = winda.iframes[packageName]
        }
        catch(e){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == 4){
                    if(request.status == 200){
                        info = JSON.parse(request.responseText)
                    }
                    else{
                        msgbox(packageName, `Winda can't find ${packageName}. Make sure you typed the name correctly, and then try again`, undefined, "error")
                    }
                }
            }
            request.open("GET", path + "init.json", true);
            request.send();
        }
        info.iframeignore = true
        if (boot.params.debug) info.noSelfOpen = true
        if (typeof id == "undefined") id = getId()
        let iframeCont = document.createElement("toplevel")
        let iframe = document.createElement("iframe")
        iframe.src = path + "index.html"
        iframe.setAttribute("args", arg)
        iframe.frameBorder = 0
        iframe.setAttribute("onload", "sendInfo(this)")
        iframeCont.appendChild(iframe)
        iframeCont.appendChild(document.createElement("ignore"))
        if (info.window){
            const newInfo = {...info}
            newInfo.noFrame = info.noGUI
            newInfo.icon = path + info.icon
            newInfo.id = id
            newInfo.layout = {
                titlebar: {
                    buttons: {
                        min: true,
                        max: true,
                        close: true
                    }
                },
                cont: iframeCont,
                hideTitle: info.hideTitle
            }
            newInfo.aero = true
            const wnd = new Winda7Window(newInfo)
            wnd.show()
        }
    }
    // else{
    //     const name = args[2]
    //     const arg = args[3]
    //     const id = getId()
    //     if (iframetype === "okna8"){
    //         new Winda7Window({
    //             title: name, 
    //             icon: info.icon, 
    //             id: id, 
    //             layout: {
    //                 titlebar: true,
    //                 cont: `<iframe src="${path}index.html" args="${arg}" frameborder="0">`
    //             },
    //             aero: true
    //         })
    //         AddWindow(new Winda7Window( 0, 0, name, , '', true), undefined, {"window": true, "okna8": true, "title": packageName, "width": 800, "height": 600, "classes": " okna8 maximised", iframeignore: true}, id)
    //     }
    //     else{
    //         AddWindow(new Winda7Window(window.innerWidth - 100, window.innerHeight - 100, name, `<iframe src="${path}index.html" args="${arg}" sandbox="allow-scripts allow-same-origin" frameborder="0">`, {"window": true, "noSelfOpen": true, "title": packageName}, ""), undefined, {"window": true, "noSelfOpen": true, "title": packageName, iframeignore: true}, id)
    //     }
    // }
})}