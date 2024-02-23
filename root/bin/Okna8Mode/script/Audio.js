function PlaySound (path) {
    var path = '../../../audio/' + path
    var audioElement = document.createElement('audio')
    audioElement.src = path
    audioElement.autoplay = true
    audioElement.volume = Number(localStorage.getItem("OKNA8_soundlevel")) / 100
    document.body.append(audioElement)
}