var OpenedWindowsIDs = []
var AeroSnapExceptions = []
var ZIndexExceptions = []
var WindowsWithFixedZ = []
var WindowMaxZindex = 200
var ActiveWindowID = ''
var ProcessesInfo = {}

function CreateSectionWindows() {
    let i = document.createElement('section')
    i.className = 'Section-Windows'
    i.id = 'Section-Windows'
    document.body.append(i)
}

CreateSectionWindows()

addScript('script/WindowsCommunication.js')

function FocusToWindow(WinID) {
    if (ZIndexExceptions.indexOf(WinID.replace('WindowHeader_', '')) == -1) {
        WindowMaxZindex++
        document.getElementById(WinID.replace('Header', '')).style.zIndex = WindowMaxZindex
    }
    $('.Window').addClass('InActive')
    $('#' + WinID.replace('Header', '')).removeClass('InActive')
    $('#' + WinID.replace('Header', '')).css('display', 'block')
    $('.desktop-taskbar .openedWindows > div').removeClass('active')
    $('.desktop-taskbar .openedWindows > div#TaskbarOpenedWindow_' + WinID.replace('Header', '').replace('Window_', '')).addClass('active')
    ActiveWindowID = WinID.replace('Header', '').replace('Window_', '')
}

function RemoveFocusFromWindows() {
    $('.Window').addClass('InActive')
    $('.desktop-taskbar .openedWindows > div').removeClass('active')
    ActiveWindowID = ''
}

function CreateWindow(path, parameters) {
    let TemporaryWindow = document.createElement('div')
    TemporaryWindow.className = 'Window'
    TemporaryWindow.style.display = 'none'
    let TemporaryWindowID = Math.random() * 899999999
    TemporaryWindowID = TemporaryWindowID + 100000000
    TemporaryWindowID = TemporaryWindowID.toFixed('0')
    TemporaryWindow.id = 'Window_' + TemporaryWindowID
    TemporaryWindow.innerHTML = `
        <div class="content">
            <img>
            <div class="WindowHeader" id="WindowHeader_${TemporaryWindowID}">
                <div class="WindowCloseButton" onclick="CloseWindow('${TemporaryWindowID}')"></div>
                <div class="WindowMaximizeButton" onclick="FullscreenWindow('${TemporaryWindowID}')"></div>
                <div class="WindowRestoreButton" style="display:none" onclick="RestoreWindow('${TemporaryWindowID}')"></div>
                <div class="WindowMinimizeButton" onclick="MinimizeWindow('${TemporaryWindowID}')"></div>
            </div>
            <iframe id="WindowFrame_${TemporaryWindowID}" src="apps/classic/desktop/${path}"></iframe>
            <div style="display:none" class="IframeIgnoreLayer"></div>
        </div>
    `
    document.getElementById('Section-Windows').append(TemporaryWindow)

    //  Window personalization
    if (parameters['frame'] == false) {
        $('#Window_' + TemporaryWindowID).addClass('WindowWithoutFrame')
    }
    if (parameters['zindexFixed'] == true) {
        $('#Window_' + TemporaryWindowID).css('z-index', parameters['zindex'])
        ZIndexExceptions.push(TemporaryWindowID)
    }
    if (parameters['onlyClose'] == true) {
        $('#Window_' + TemporaryWindowID + ' .WindowHeader').addClass('WindowHeaderMin')
    }
    if (parameters['blur'] != null) {
        $('#Window_' + TemporaryWindowID).css('backdrop-filter', 'blur(' + parameters['blur'] + ')')
    }
    if (parameters['animation'] != null) {
        $('#Window_' + TemporaryWindowID).css('animation', parameters['animation'])
    }
    if (parameters['resizable'] != false) {
        $('#Window_' + TemporaryWindowID + ' .content').append(`
        <div class="corner_lt" id="WindowCornerLT_${TemporaryWindowID}"></div>
        <div class="corner_lb" id="WindowCornerLB_${TemporaryWindowID}"></div>
        <div class="corner_rt" id="WindowCornerRT_${TemporaryWindowID}"></div>
        <div class="corner_rb" id="WindowCornerRB_${TemporaryWindowID}"></div>
        `)
    } else {
        $('#Window_' + TemporaryWindowID + ' .content > .WindowHeader > .WindowMaximizeButton').addClass('disabled')
        $('#Window_' + TemporaryWindowID + ' .content > .WindowHeader > .WindowMaximizeButton').attr('onclick', '')
        AeroSnapExceptions.push(TemporaryWindowID)
    }
    if (parameters['hidden'] == true) {
        $('#Window_' + TemporaryWindowID).css('display', 'none')
    }
    $('#Window_' + TemporaryWindowID).css('top', parameters['top'])
    $('#Window_' + TemporaryWindowID).css('left', parameters['left'])
    $('#Window_' + TemporaryWindowID).css('width', parameters['width'])
    $('#Window_' + TemporaryWindowID).css('height', parameters['height'])

    ProcessesInfo[TemporaryWindowID] = {
        title: 'Window',
        icon: 'img/shell/imageres/15.ico',
        processname: parameters['processname'],
    }
    if (parameters['processname'] == null) {
        ModalMetroDialog(`
            <h1>App is not supported</h1>
            <p>This app is not supported by your version of Okna8. Not available to you some functions and app may not work stable. In one of the next versions you will no longer be able to open this application.</p>
            <div class="buttons">
                <button onclick="CloseMetroDialog(__ID__);CloseWindow(${TemporaryWindowID})">Close app</button>
                <button onclick="CloseMetroDialog(__ID__)">Continue using this app</button>
            </div>
        `)
    }

    $('.desktop-taskbar .openedWindows').append('<div style="display:none" onclick="if(ActiveWindowID!=\'' + TemporaryWindowID + "'){FocusToWindow('WindowHeader_" + TemporaryWindowID + "')}else{MinimizeWindow(" + TemporaryWindowID + ')}" id="TaskbarOpenedWindow_' + TemporaryWindowID + '"><div></div><img draggable="false" src="' + res + 'img/shell/imageres/15.ico" alt=""></div>')

    document.getElementById('Section-Windows').dispatchEvent(
        new CustomEvent('WindowCreate', {
            detail: {
                WindowID: TemporaryWindowID,
                WindowArgs: parameters,
                ProcessName: parameters['processname'],
            },
        })
    )

    OpenedWindowsIDs.push(TemporaryWindowID)

    //  After-load Scripts

    $('#WindowFrame_' + TemporaryWindowID)[0].addEventListener('load', () => {
        sendToWin('WindowFrame_' + TemporaryWindowID, 'YourID-' + TemporaryWindowID)
        sendToWin('WindowFrame_' + TemporaryWindowID, 'Arguments-' + parameters['args'])
        $('#Window_' + TemporaryWindowID).css('display', 'block')
        FocusToWindow('Window_' + TemporaryWindowID)
        $('#TaskbarOpenedWindow_' + TemporaryWindowID).css('display', 'inline-block')
    })
}

addScript('script/Exec.js')

function FullscreenWindow(WinID) {
    document.getElementById('Window_' + WinID).style.animation = 'FullScreenAnimation cubic-bezier(0.1, 0.9, 0.2, 1) 0s forwards'
    $('#Window_' + WinID).addClass('WindowFullscreen')
    $('#Window_' + WinID + ' .WindowRestoreButton').css('display', 'block')
    $('#Window_' + WinID + ' .WindowMaximizeButton').css('display', 'none')
}

function RestoreWindow(WinID) {
    document.getElementById('Window_' + WinID).style.animation = 'none'
    $('#Window_' + WinID).removeClass('WindowFullscreen')
    $('#Window_' + WinID + ' .WindowMaximizeButton').css('display', 'block')
    $('#Window_' + WinID + ' .WindowRestoreButton').css('display', 'none')
}

function MinimizeWindow(WinID) {
    document.getElementById('Window_' + WinID).style.animation = 'MinimizeAnimation 1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
    RemoveFocusFromWindows()
    setTimeout(() => {
        document.getElementById('Window_' + WinID).style.display = 'none'
        document.getElementById('Window_' + WinID).style.animation = 'none'
    }, 500)
}

function MinimizeWindows() {
    for (let i = 0; i < OpenedWindowsIDs.length; i++) {
        MinimizeWindow(OpenedWindowsIDs[i])
    }
}

function CloseWindow(WinID, animation) {
    document.getElementById('Section-Windows').dispatchEvent(
        new CustomEvent('WindowRemove', {
            detail: {
                WindowID: WinID,
                ProcessName: ProcessesInfo[WinID]['processname'],
            },
        })
    )
    delete ProcessesInfo[WinID]
    if (animation == null) {
        document.getElementById('Window_' + WinID).style.animation = 'WindowCloseAnim 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
    } else {
        document.getElementById('Window_' + WinID).style.animation = animation
    }
    setTimeout(() => {
        document.getElementById('Window_' + WinID).remove()
        OpenedWindowsIDs.splice(OpenedWindowsIDs.indexOf(WinID), 1)
        if (AeroSnapExceptions.indexOf(WinID) != -1) {
            AeroSnapExceptions.splice(AeroSnapExceptions.indexOf(WinID), 1)
        }
        if (ZIndexExceptions.indexOf(WinID) != -1) {
            ZIndexExceptions.splice(ZIndexExceptions.indexOf(WinID), 1)
        }
    }, 400)
    $('#TaskbarOpenedWindow_' + WinID).css('animation', 'fadeani2 0.2s ease forwards')
    setTimeout(() => {
        $('#TaskbarOpenedWindow_' + WinID).remove()
    }, 200)
}

var WindowMove
var CursorX
var CursorY

document.addEventListener('mousemove', (e) => {
    CursorX = e.pageX
    CursorY = e.pageY
})

function AeroSnap(WindowID, SnapPosition) {
    if (AeroSnapExceptions.indexOf(WindowID) == -1) {
        if (SnapPosition == 'r') {
            $('#Window_' + WindowID).css('top', '0')
            $('#Window_' + WindowID).css('left', '50%')
            $('#Window_' + WindowID).css('height', 'calc(100% - 40px)')
            $('#Window_' + WindowID).css('width', '50%')
        }
        if (SnapPosition == 'l') {
            $('#Window_' + WindowID).css('top', '0')
            $('#Window_' + WindowID).css('left', '0')
            $('#Window_' + WindowID).css('height', 'calc(100% - 40px)')
            $('#Window_' + WindowID).css('width', '50%')
        }
        if (SnapPosition == 't') {
            FullscreenWindow(WindowID)
        }
    }
}

window.addEventListener('mousedown', (e) => {
    // Событие зажатия кнопки мыши, перемещение окна или изменение размера
    var WindowID = e.srcElement.id
    var offset_y = e.offsetY
    var offset_x = e.offsetX

    if (WindowID.startsWith('WindowHeader')) {
        FocusToWindow(WindowID)
        $('.IframeIgnoreLayer').css('display', 'block')
        WindowMove = (e) => {
            document.getElementById(WindowID.replace('Header', '')).style.top = e.pageY - offset_y + 'px'
            document.getElementById(WindowID.replace('Header', '')).style.left = e.pageX - offset_x + 'px'
            if (window.innerWidth - CursorX < 20) {
                AeroSnap(WindowID.substring(13, 22), 'r')
            } else {
            }
            if (CursorX < 20) {
                AeroSnap(WindowID.substring(13, 22), 'l')
            } else {
            }
            if (CursorX > 50 && window.innerWidth - CursorX > 50 && CursorY < 5) {
                AeroSnap(WindowID.substring(13, 22), 't')
            } else {
            }
        }
        window.addEventListener('mousemove', WindowMove)
    } else if (WindowID.startsWith('WindowCorner')) {
        $('.IframeIgnoreLayer').css('display', 'block')
        if (WindowID.startsWith('WindowCornerRB')) {
            FocusToWindow(WindowID.replace('CornerRB', ''))
            var OrigWidth = document.getElementById(WindowID.replace('CornerRB', '')).offsetWidth
            var OrigMouseX = e.pageX
            var OrigHeight = document.getElementById(WindowID.replace('CornerRB', '')).offsetHeight
            var OrigMouseY = e.pageY
            WindowMove = (e) => {
                document.getElementById(WindowID.replace('CornerRB', '')).style.height = OrigHeight + e.pageY - OrigMouseY + 'px'
                document.getElementById(WindowID.replace('CornerRB', '')).style.width = OrigWidth + e.pageX - OrigMouseX + 'px'
            }
        } else if (WindowID.startsWith('WindowCornerRT')) {
            FocusToWindow(WindowID.replace('CornerRT', ''))
            var OrigWidth = document.getElementById(WindowID.replace('CornerRT', '')).offsetWidth
            var OrigMouseX = e.pageX
            var OrigHeight = document.getElementById(WindowID.replace('CornerRT', '')).offsetHeight
            var OrigMouseY = e.pageY
            WindowMove = (e) => {
                document.getElementById(WindowID.replace('CornerRT', '')).style.top = e.pageY + 'px'
                document.getElementById(WindowID.replace('CornerRT', '')).style.height = OrigHeight + OrigMouseY - e.pageY + 'px'
                document.getElementById(WindowID.replace('CornerRT', '')).style.width = OrigWidth + e.pageX - OrigMouseX + 'px'
            }
        } else if (WindowID.startsWith('WindowCornerLB')) {
            FocusToWindow(WindowID.replace('CornerLB', ''))
            var OrigWidth = document.getElementById(WindowID.replace('CornerLB', '')).offsetWidth
            var OrigMouseX = e.pageX
            var OrigHeight = document.getElementById(WindowID.replace('CornerLB', '')).offsetHeight
            var OrigMouseY = e.pageY
            WindowMove = (e) => {
                document.getElementById(WindowID.replace('CornerLB', '')).style.left = e.pageX + 'px'
                document.getElementById(WindowID.replace('CornerLB', '')).style.height = OrigHeight + e.pageY - OrigMouseY + 'px'
                document.getElementById(WindowID.replace('CornerLB', '')).style.width = OrigWidth + OrigMouseX - e.pageX + 'px'
            }
        } else if (WindowID.startsWith('WindowCornerLT')) {
            FocusToWindow(WindowID.replace('CornerLT', ''))
            var OrigWidth = document.getElementById(WindowID.replace('CornerLT', '')).offsetWidth
            var OrigMouseX = e.pageX
            var OrigHeight = document.getElementById(WindowID.replace('CornerLT', '')).offsetHeight
            var OrigMouseY = e.pageY
            WindowMove = (e) => {
                document.getElementById(WindowID.replace('CornerLT', '')).style.left = e.pageX + 'px'
                document.getElementById(WindowID.replace('CornerLT', '')).style.top = e.pageY + 'px'
                document.getElementById(WindowID.replace('CornerLT', '')).style.height = OrigHeight + OrigMouseY - e.pageY + 'px'
                document.getElementById(WindowID.replace('CornerLT', '')).style.width = OrigWidth + OrigMouseX - e.pageX + 'px'
            }
        }
        window.addEventListener('mousemove', WindowMove)
    }
})
window.addEventListener('mouseup', (e) => {
    window.removeEventListener('mousemove', WindowMove)
    $('.IframeIgnoreLayer').css('display', 'none')
})

var StyleThemes = document.createElement('style')
StyleThemes.id = 'ThemeStyles'
StyleThemes.className = 'ThemeStyles'
document.body.append(StyleThemes)

window.addEventListener('message', (event) => {
    if (event.data.startsWith('eval|') || event.data.startsWith('eval>')) {
        eval(event.data.substring(5))
    } else if (event.data.startsWith('SetWindowHeader')) {
        ProcessesInfo[event.data.substring(15, 24)]['title'] = event.data.substring(25)
        $('#WindowHeader_' + event.data.substring(15, 24)).html(`
        ${event.data.substring(25)}
        <div class="WindowCloseButton" onclick="CloseWindow('${event.data.substring(15, 24)}')"></div>
        <div class="WindowMaximizeButton" onclick="FullscreenWindow('${event.data.substring(15, 24)}')"></div>
        <div class="WindowRestoreButton" style="display:none" onclick="RestoreWindow('${event.data.substring(15, 24)}')"></div>
        <div class="WindowMinimizeButton" onclick="MinimizeWindow('${event.data.substring(15, 24)}')"></div>
        `)
    } else if (event.data.startsWith('SetWindowIcon')) {
        ProcessesInfo[event.data.substring(13, 22)]['icon'] = event.data.substring(23)
        $('#Window_' + event.data.substring(13, 22) + ' img').attr('src', event.data.substring(23))
        $('.desktop-taskbar .openedWindows > div#TaskbarOpenedWindow_' + event.data.substring(13, 22) + ' > img').attr('src', event.data.substring(23))
    } else if (event.data.startsWith('KillWindow')) {
        CloseWindow(event.data.substring(11))
    } else if (event.data.startsWith('MenuBar')) {
        setTimeout(() => {
            var MenuBarData = event.data.substring(8).split('|')
            var PosX = $('#Window_' + MenuBarData[0]).offset()['left'] + 8 + Number(MenuBarData[1])
            var PosY = $('#Window_' + MenuBarData[0]).offset()['top'] + 51
            $('.contextmenu').html(MenuBarData[2])
            $('.contextmenu').append('<div class="verticalSeparator"></div>')
            var contextmenutop
            if (window.innerHeight < $('.contextmenu').outerHeight() + 100 + PosY) {
                contextmenutop = PosY - $('.contextmenu').outerHeight()
            } else {
                contextmenutop = PosY
            }
            var contextmenuleft
            if (window.innerWidth < $('.contextmenu').outerWidth() + 100 + PosX) {
                contextmenuleft = PosX - $('.contextmenu').outerWidth()
            } else {
                contextmenuleft = PosX
            }
            $('.contextmenu').attr('style', 'top: ' + contextmenutop + 'px; left:' + contextmenuleft + 'px')
            $('.contextmenu').css('display', 'block')
        }, 1)
    } else if (event.data == 'HideContextMenu') {
        $('.metrocontextmenu').attr('style', '')
        $('.metrocontextmenucompact').attr('style', '')
        $('.contextmenu').attr('style', '')
    }
})
