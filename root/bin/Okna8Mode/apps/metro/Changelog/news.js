window.onload = async () => {
    $('.metrosplash .progress-ring').css('display', 'block')
    axios.get(VERSION.server + '/okna/news.json').then((response) => {
        console.log(response.data)
        if (response.data.app.minver > VERSION.build) {
            window.parent.postMessage('ModalMetroDialog|<h1>Требуется обновление Okna8.</h1><p>Ваша версия Okna8 устарела и больше не может отображать новости. Обновите Okna8.<br><br><a href="https://igorpc.ru/okna/download" target="_blank">Скачать новую версию</a></p><div class="buttons"><button onclick="closemetroapp(\'Changelog\');CloseMetroDialog(__ID__)">Закрыть</button></div>', '*')
            return
        }
        var news = response.data.news
        $('#newsElem1').attr('onclick', 'DisplayNews(' + news[0].id + ')')
        $('#newsElem1 img').attr('src', news[0].image)
        $('#newsElem1 h1').html(news[0].header)
        $('#newsElem1 h2').html(news[0].previewtext)
        $('#newsElem2').attr('onclick', 'DisplayNews(' + news[1].id + ')')
        $('#newsElem2 img').attr('src', news[1].image)
        $('#newsElem2 h1').html(news[1].header)
        $('#newsElem3').attr('onclick', 'DisplayNews(' + news[2].id + ')')
        $('#newsElem3 img').attr('src', news[2].image)
        $('#newsElem3 h1').html(news[2].header)
        $('#newsElem4').attr('onclick', 'DisplayNews(' + news[3].id + ')')
        $('#newsElem4 img').attr('src', news[3].image)
        $('#newsElem4 h1').html(news[3].header)
        $('#newsElem5').attr('onclick', 'DisplayNews(' + news[4].id + ')')
        $('#newsElem5 img').attr('src', news[4].image)
        $('#newsElem5 h1').html(news[4].header)
        $('#newsElem6').attr('onclick', 'DisplayNews(' + news[5].id + ')')
        $('#newsElem6 img').attr('src', news[5].image)
        $('#newsElem6 h1').html(news[5].header)
        $('#newsElem7').attr('onclick', 'DisplayNews(' + news[6].id + ')')
        $('#newsElem7 img').attr('src', news[6].image)
        $('#newsElem7 h1').html(news[6].header)
        setTimeout(() => {
            setTimeout(() => {
                $('.ShowAfterLoad').css('display', 'block')
                $('.metrosplash').addClass('metrosplashhideani')
                setTimeout(function () {
                    $('.metrosplash').addClass('hidden')
                }, 200)
            }, 200)
        }, 1000)
    })
}

var CurrentScrollBlock = "mainpage"

function DisplayNews(id) {
    if (id == null) return
    $('#scrollblock_' + CurrentScrollBlock).css('animation', 'Metro_HideAni1 cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
    var prevScrollBlock = CurrentScrollBlock
    setTimeout(() => {
        $('#scrollblock_' + prevScrollBlock).css('display', 'none')
        $('#scrollblock_' + prevScrollBlock).css('animation', '')
    }, 500)
    CurrentScrollBlock = "newsContent"
    console.log(VERSION.server + '/okna/news/' + id + '.json')
    axios.get(VERSION.server + '/okna/news/' + id + '.json').then((response) => {
        console.log(response.data)
        $('#scrollblock_newsContent .content').html(response.data.html)
        $('#scrollblock_newsContent h1').html(response.data.header)
        $('#scrollblock_newsContent').css('display', 'block')
    })
}

function DisplayMainpage() {
    $('#scrollblock_' + CurrentScrollBlock).css('animation', 'Metro_HideAni1 cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
    var prevScrollBlock = CurrentScrollBlock
    setTimeout(() => {
        $('#scrollblock_' + prevScrollBlock).css('display', 'none')
        $('#scrollblock_' + prevScrollBlock).css('animation', '')
    }, 500)
    CurrentScrollBlock = "mainpage"
    $('#scrollblock_mainpage').css('display', 'block')
    $('#scrollblock_mainpage').scrollLeft(0)
}
