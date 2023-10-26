var ImagesLibrary
var currentUser = sessionStorage.getItem('OKNA8_sessionUser')
var CloseApp = () => { window.top.postMessage("eval>closemetroapp('Photos')", '*') }
var selectPhotosFolder = () => { window.top.postMessage('eval>ipcRenderer.send("SelectPhotosFolder")') }

$(document).ready(() => {
    if (typeof require == 'undefined') {
        window.top.postMessage('ModalMetroDialog|<h1>Приложение не доступно в этой версии Okna8</h1><p>Чтобы использовать "Фотографии", загрузите Okna8Node. Из-за технических ограничений браузера, невозможно просмотрить фотографии с вашего компьютера.</p><div class="buttons"><button onclick="closemetroapp(\'Photos\');CloseMetroDialog(\'__ID__\')">Выход</button></div>', '*')
    } else {
        var { ipcRenderer } = require('electron')
        setTimeout(() => {
            $('.metrosplash').addClass('metrosplashhideani')
            setTimeout(function () {
                $('.metrosplash').addClass('hidden')
                $('.ImagesContainer').css('display', 'flex')
            }, 200)
        }, 200)

        if (localStorage.getItem('OKNA8_user_' + currentUser + '_MetroApp_Photos_PhotosFolder') != null) {
            var ImagesFolder = localStorage.getItem('OKNA8_user_' + currentUser + '_MetroApp_Photos_PhotosFolder')
            ipcRenderer.send('PhotosList', ImagesFolder)
        } else {
            ModalMetroDialog(`
            <h1>Выберите папку с фотографиями</h1>
            <div class="buttons"><button onclick="selectPhotosFolder()">Выбор папки</button><button onclick="CloseApp()">Выход</button><div>`)
        }

        window.addEventListener('message', (event) => {
            if (event.data.startsWith('ListOfFiles|')) {
                var Files = event.data.substring(12).split('|')
                $('.ImagesContainer').html('')
                $('#ImagesView .Images').html('')
                ImagesLibrary = []
                for (let i = 0; i < Files.length; i++) {
                    if (Files[i].endsWith('.jpg') || Files[i].endsWith('.jpeg') || Files[i].endsWith('.png') || Files[i].endsWith('.gif') || Files[i].endsWith('.tiff') || Files[i].endsWith('.tif') || Files[i].endsWith('.bmp') || Files[i].endsWith('.jpe')) {
                        ImagesLibrary.push([Files[i], 'image'])
                    } else if (Files[i].endsWith('.mp4') || Files[i].endsWith('.avi') || Files[i].endsWith('.mkv') || Files[i].endsWith('.3gp') || Files[i].endsWith('.flv') || Files[i].endsWith('.mov')) {
                        ImagesLibrary.push([Files[i], 'video'])
                    }
                }
                for (let i = 0; i < ImagesLibrary.length; i++) {
                    if (ImagesLibrary[i][1] == 'image') {
                        $('.ImagesContainer').append(`<div class="Element" onclick="DisplayImage(${i})"><img src="${ImagesFolder + '/' + ImagesLibrary[i][0]}"></div>`)
                        $('#ImagesView .Images').append(`<div class="Image Image${i}"><img src="${ImagesFolder + '/' + ImagesLibrary[i][0]}"></div>`)
                    } else if (ImagesLibrary[i][1] == 'video') {
                        $('.ImagesContainer').append(`<div class="Element" onclick="DisplayImage(${i})"><video src="${ImagesFolder + '/' + ImagesLibrary[i][0]}"></div>`)
                        $('#ImagesView .Images').append(`<div class="Image Image${i}"><video controls src="${ImagesFolder + '/' + ImagesLibrary[i][0]}"></div>`)
                    }
                }
            } else if (event.data.startsWith('PhotosFolder|')) {
                localStorage.setItem('OKNA8_user_' + currentUser + '_MetroApp_Photos_PhotosFolder', event.data.substring(13))
                window.location.reload()
            }
        })
    }
})

var currentImage

function DisplayImage(number) {
    currentImage = number
    $('#ImagesLibrary').css('display', 'none')
    $('#ImagesView').css('display', 'block')
    $('#ImagesView .Images .Image' + number).css('left', '50%')
}

function DisplayLibrary() {
    $('#ImagesLibrary').css('display', 'block')
    $('#ImagesView').css('display', 'none')
}

function PrevImage() {
    if (currentImage != 0) {
        $('#ImagesView .Images .Image' + currentImage).css('animation', 'ImageCenterRightAni 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('#ImagesView .Images .Image' + (currentImage - 1)).css('animation', 'ImageLeftCenterAni 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        currentImage = currentImage - 1
    }
}

function NextImage() {
    if (currentImage + 1 != ImagesLibrary.length) {
        $('#ImagesView .Images .Image' + currentImage).css('animation', 'ImageCenterLeftAni 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('#ImagesView .Images .Image' + (currentImage + 1)).css('animation', 'ImageRightCenterAni 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        currentImage = currentImage + 1
    }
}