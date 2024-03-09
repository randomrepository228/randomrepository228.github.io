var Exec = (program) => {
    Programs[program.split(' ')[0]](program.substring(program.split(' ')[0].length + 1))
}

var Programs = {
    js: (args) => {
        eval(args)
    },
    ImmersiveApp: (args) => {
        var MetroHeader = 'MetroApp'
        if (tilesInfo[args][4] != '') {
            MetroHeader = tilesInfo[args][4]
        } else {
            MetroHeader = LOCALE_appsnames[tilesInfo[args][2]]
        }
        metro_open(args, tilesInfo[args][1], MetroHeader, tilesInfo[args][3])
    },
    shutdown: (args) => {
        CreateWindow('../shutdown/index.html', {
            args: args,
            processname: 'shutdown',
        })
    },
    winver: (args) => {
        CreateWindow('../winver/index.html', {
            width: '474px',
            height: '413px',
            top: '33px',
            left: '30px',
            onlyClose: true,
            resizable: false,
            args: args,
            processname: 'winver',
        })
    },
    run: (args) => {
        CreateWindow('../run/index.html', {
            width: '445px',
            height: '215px',
            top: 'calc(100vh - 259px)',
            left: '8px',
            onlyClose: true,
            resizable: false,
            args: args,
            processname: 'run',
        })
    },
    regedit: (args) => {
        CreateWindow('../regedit/index.html', {
            width: '800px',
            height: '500px',
            args: args,
            processname: 'regedit',
        })
    },
    'cpl:taskbarproperties': (args) => {
        CreateWindow('../cpl/taskbarProperties/index.html', {
            width: '414px',
            height: '521px',
            onlyClose: true,
            resizable: false,
            top: 'calc(100vh - 565px)',
            left: '0',
            args: args,
            processname: 'cpl:taskbarproperties',
        })
    },
    explorer: (args) => {
        CreateWindow('../explorer/explorer.html', {
            width: '1040px',
            height: '600px',
            top: 'calc(50vh - 300px)',
            left: 'calc(50vw - 520px)',
            args: args,
            processname: 'explorer',
        })
    },
    calc: (args) => {
        CreateWindow('../calc/index.html', {
            width: '228px',
            height: '323px',
            top: 'calc(50vh - 160px)',
            left: 'calc(50vw - 114px)',
            resizable: false,
            args: args,
            processname: 'calc',
        })
    },
    taskmgr: (args) => {
        CreateWindow('../taskmgr/index.html', {
            width: '660px',
            height: '600px',
            top: '26px',
            left: '26px',
            args: args,
            processname: 'taskmgr',
        })
    },
    control: (args) => {
        CreateWindow('../cpl/index.html', {
            width: '1040px',
            height: '600px',
            top: 'calc(50vh - 300px)',
            left: 'calc(50vw - 520px)',
            args: args,
            processname: 'control',
        })
    },
    license: (args) => {
        CreateWindow('../winver/license.html', {
            width: '690px',
            height: '444px',
            top: '33px',
            left: '30px',
            onlyClose: true,
            resizable: false,
            args: args,
            processname: 'license',
        })
    },
    notepad: (args) => {
        CreateWindow('../notepad/index.html', {
            width: '1040px',
            height: '600px',
            top: 'calc(50vh - 300px)',
            left: 'calc(50vw - 520px)',
            args: args,
            processname: 'notepad',
        })
    },
    'devmgmt.msc': (args) => {
        CreateWindow('../mmc/devmgmt/index.html', {
            width: '794px',
            height: '578px',
            top: '26px',
            left: '26px',
            args: args,
            processname: 'devmgmt.msc',
        })
    },
    iexplore: (args) => {
        CreateWindow('../iexplore/index.html', {
            width: '1000px',
            height: '700px',
            top: 'calc(50vh - 350px)',
            left: 'calc(50vw - 500px)',
            args: args,
            processname: 'iexplore',
        })
    },
    msgbox: (args) => {
        CreateWindow('../msgbox/index.html', {
            width: '0',
            height: '0',
            top: '0',
            left: '0',
            onlyClose: true,
            resizable: false,
            args: args,
            processname: 'msgbox',
        })
    },
    msoobe: (args) => {
        CreateWindow('../oobe/oobe.html', {
            width: '100vw',
            height: '100vh',
            top: '0',
            left: '0',
            onlyClose: true,
            resizable: false,
            frame: false,
            args: args,
            processname: 'msoobe',
            animation: 'none',
        })
    },
    FirstLogonAnim: (args) => {
        CreateWindow('../oobe/FirstLogonAnim.html', {
            width: '100vw',
            height: '100vh',
            top: '0',
            left: '0',
            onlyClose: true,
            resizable: false,
            frame: false,
            args: args,
            processname: 'FirstLogonAnim',
            animation: 'none',
        })
    },
}
