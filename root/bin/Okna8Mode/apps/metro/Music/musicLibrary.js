var MusicLibrary = {}

window.addEventListener('message', (event) => {
    if (event.data.startsWith('MusicPaths|')) {
        var MusicFilePaths = event.data.substring(11).split('|')
        let last = false
        for (let i = 0; i < MusicFilePaths.length || (last = !last); i++) {
            ID3.loadTags(MusicFilePaths[i], function () {
                var tags = ID3.getAllTags(MusicFilePaths[i])
                if (MusicLibrary[tags.artist] == null) {
                    MusicLibrary[tags.artist] = {}
                }
                if (MusicLibrary[tags.artist][tags.album] == null) {
                    MusicLibrary[tags.artist][tags.album] = []
                }
                MusicLibrary[tags.artist][tags.album][Number(tags.track)] = [tags.title, MusicFilePaths[i]]
                if (last) console.log(JSON.stringify(MusicLibrary))
            })
        }
        
    }
})