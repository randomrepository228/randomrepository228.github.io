var Exec = (program)=>{
    Programs[program.split(' ')[0]](program.substring(program.split(' ')[0].length + 1))
}

var Programs = {
    'winver': (args) => {
        CreateWindow('../winver/index.html', {
            'width': '474px',
            'height': '413px',
            'top': '33px',
            'left': '30px',
            'onlyClose': true,
            'resizable': false,
            'args': args,
        })
    },
    'regedit': (args) => {
        CreateWindow('../regedit/index.html', {
            'width': '800px',
            'height': '500px',
            'args': args,
        })
    },
    'run': (args) => {
        CreateWindow('../run/index.html', {
            'width': '445px',
            'height': '215px',
            'top': 'calc(100vh - 259px)',
            'left': '8px',
            'onlyClose': true,
            'resizable': false,
            'args': args,
        })
    },
    'cpl:taskbarproperties': (args)=>{
        CreateWindow('../cpl/taskbarProperties/index.html', {
            'width': '414px',
            'height': '521px',
            'onlyClose': true,
            'resizable': false,
            'top': 'calc(100vh - 565px)',
            'left': '0',
            'args': args,
        })
    },
    'explorer': (args)=>{
        CreateWindow('../explorer/explorer.html', {
            'width': '1040px',
            'height': '600px',
            'top': 'calc(50vh - 300px)',
            'left': 'calc(50vw - 520px)',
            'args': args
        })
    },
    'shutdown': (args)=>{
        CreateWindow('../shutdown/index.html', {
            'args': args
        })
    }
}