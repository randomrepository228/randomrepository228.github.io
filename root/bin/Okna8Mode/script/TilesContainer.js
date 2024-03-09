var addTile
var removeTile
var updtilescontainer
var LiveTiles = []

$(document).ready(() => {
    updtilescontainer = () => {
        if (localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout') == null || !localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').startsWith('92')) {
            console.error('Error: tilesContainer in localStorage is not compatible with the current version of Okna8')
            console.warn('Updating localStorage...')
            ModalMetroDialog(LOCALE_startscreen[23])
            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', "92metrotile, wide, 2, rgb(1,111,193), rgb(0,141,211), Mail, rgb(1,111,193), ../../metro/Mail, |metrotile, wide, 14, rgb(81,51,171), rgb(100,62,191), Sports, rgb(81,51,171), ../../metro/Sports, |metrotile, standart, 10, rgb(210,71,38), rgb(220,87,46), People, rgb(210,71,38), ../../metro/People, |metrotile, standart, 13, rgb(0,175,240), rgb(26,200,243), Skype, rgb(0,175,240), ../../metro/Skype, |desktoptile, wide, 6|metrotile, wide, 12, rgb(81,51,171), rgb(100,62,191), Calendar, rgb(81,51,171), ../../metro/Calendar, , 2|metrotile, wide, 15, rgb(0,138,0), rgb(0,166,0), Money, rgb(0,138,0), ../../metro/Money, |metrotile, large, 11, rgb(38,114,236), rgb(46,141,239), Weather, rgb(38,114,236), ../../metro/Weather, |metrotile, standart, 5, rgb(38,114,236), rgb(46,141,239), InternetExplorer, rgb(38,114,236), ../../metro/InternetExplorer, |metrotile, standart, 4, rgb(210,71,38), rgb(220,86,46), Music, rgb(210,71,38), ../../metro/Music, |metrotile, wide, 7, rgb(172,25,61), rgb(191,30,75), Changelog, rgb(172,25,61), ../../metro/Changelog, , 2|metrotile, standart, 1, rgb(81,51,171), rgb(100,62,191), Settings, rgb(81,51,171), ../../metro/Settings, , 0|metrotile, standart, 16, rgb(0,130,153), rgb(0,160,177), Photos, rgb(0,130,153), ../../metro/Photos, , 0|metrotile, large, 9, rgb(0,138,0), rgb(0,166,0), Store, rgb(0,138,0), ../../metro/Store, , 0")
        }
        var startScreen_layout = localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').substring(2)

        $('.tilesContainer').html('')

        function generateArrayForStartscreenLayout() {
            // STAGE 1
            startScreen_layout = startScreen_layout.split('|')
            // STAGE 2
            var generated = 0
            function stage2() {
                if (generated != startScreen_layout.length) {
                    startScreen_layout[generated] = startScreen_layout[generated].split(', ')
                    generated++
                    stage2()
                } else {
                    removeTile = (id) => {
                        if (id != 'DESKTOP') {
                            for (let i = 0; i < startScreen_layout.length; i++) {
                                if (startScreen_layout[i][5] == id) {
                                    startScreen_layout.splice(i, 1)
                                    i--
                                }
                            }

                            var t = startScreen_layout
                            for (let i = 0; i < startScreen_layout.length; i++) {
                                let t0 = t[i]
                                t0 = t0.join(', ')
                                t[i] = t0
                            }
                            t = t.join('|')
                            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', '92' + t)
                            $('#tile_1_' + id).css('animation', 'tileRemoveAni cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
                            setTimeout(() => {
                                updtilescontainer()
                            }, 500)
                        } else {
                            for (let i = 0; i < startScreen_layout.length; i++) {
                                if (startScreen_layout[i][0] == 'desktoptile') {
                                    startScreen_layout.splice(i, 1)
                                    i--
                                }
                            }

                            var t = startScreen_layout
                            for (let i = 0; i < startScreen_layout.length; i++) {
                                let t0 = t[i]
                                t0 = t0.join(', ')
                                t[i] = t0
                            }
                            t = t.join('|')
                            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', '92' + t)
                            $('#tile_1_DESKTOP').css('animation', 'tileRemoveAni cubic-bezier(0.1, 0.9, 0.2, 1) 0.5s forwards')
                            setTimeout(() => {
                                updtilescontainer()
                            }, 500)
                        }
                    }
                    addTile = (type, size, color, localizeName, path, label, TileColor1, TileColor2, id, livetile) => {
                        if (type == 'Metro') {
                            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout') + '|' +
                                'metrotile, ' +
                                size + ', ' +
                                localizeName + ', ' +
                                TileColor1 + ', ' +
                                TileColor2 + ', ' +
                                id + ', ' +
                                color + ', ' +
                                path + ', ' +
                                label + ', ' +
                                livetile
                            )
                            updtilescontainer()
                        } else if (type == 'DESKTOP') {
                            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout') + '|desktoptile, wide, 6')
                            updtilescontainer()
                        } else if (type == 'DesktopApp') {
                            localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout') + '|' +
                                'DesktopApp, standart, ' + localizeName + ', ' + TileColor1 + ', ' + TileColor2 + ', ' + id + ', ' + path + ', , ' + label)
                            updtilescontainer()
                        }
                    }
                }
            }
            stage2()
        }

        generateArrayForStartscreenLayout()

        LiveTiles = []

        console.log(startScreen_layout)
        for (let i = 0; i < startScreen_layout.length; i++) {
            console.log(startScreen_layout[i])
            var TileSize = ""
            var AppTile = ""
            var SquadTilesContainer1 = ""
            var SquadTilesContainer2 = ""
            var TwoStandartTiles = ""
            var LiveTileIframe = ""
            if (startScreen_layout[i][1] == 'standart') {
                if (startScreen_layout.length != i + 1) {
                    if (startScreen_layout[i + 1][1] == 'standart') {
                        SquadTilesContainer1 = '<div class="squadTilesContainer">'
                        SquadTilesContainer2 = '</div>'
                        TwoStandartTiles = true
                    }
                }
                TileSize = 'standart'
                AppTile = 'AppTile'
            } else if (startScreen_layout[i][1] == 'wide') {
                TileSize = 'wide'
                AppTile = 'AppTileWide'
            } else if (startScreen_layout[i][1] == 'large') {
                TileSize = 'large'
                AppTile = 'AppTileLarge'
            }

            var HtmlDocumentText = SquadTilesContainer1
            function AddHtmlDocumentText() {
                var TileLabel = ""

                if (startScreen_layout[i][8] == "") {
                    TileLabel = LOCALE_appsnames[startScreen_layout[i][2]]
                } else {
                    TileLabel = startScreen_layout[i][8]
                }

                if (startScreen_layout[i][0] == 'desktoptile') {
                    HtmlDocumentText = HtmlDocumentText + '<div id="tile_1_DESKTOP" onclick="closeStart()" class="tile desktoptile ' + startScreen_layout[i][1] + 'tile"><p id="tile_3_' + startScreen_layout[i][5] + '">' + LOCALE_startscreen[12] + '</p></div>'
                } else if (startScreen_layout[i][0] == 'metrotile') {
                    if (typeof tilesInfo[startScreen_layout[i][5]][7] != 'undefined' && tilesInfo[startScreen_layout[i][5]][7].indexOf(TileSize) != -1) {
                        if (startScreen_layout[i][9] == '2') {
                            LiveTiles.push(startScreen_layout[i][5])
                            LiveTileIframe = "<iframe style=\"display:block\" class=\"LiveTileFrame\" src=\"apps/classic/desktop/" + startScreen_layout[i][7] + "/LiveTile.html\" frameborder=\"\"></iframe>"
                        }
                    }

                    HtmlDocumentText = HtmlDocumentText + '<div ' +
                        'style="background: linear-gradient(90deg, ' + startScreen_layout[i][3] + ' 0%, ' + startScreen_layout[i][4] + ' 100%);" ' +
                        'id="tile_1_' + startScreen_layout[i][5] + '" ' +
                        'class="TILE_' + startScreen_layout[i][5] + ' metrotile tile ' + TileSize + 'tile" ' +
                        'onclick="metro_open_fromstartscreen(\''
                        + startScreen_layout[i][5] + '\',\''
                        + startScreen_layout[i][6] + '\',$(\'.TILE_' + startScreen_layout[i][5] + '\').offset(),\''
                        + startScreen_layout[i][1] + '\',LOCALE_appsnames[' + startScreen_layout[i][2] + '],\''
                        + startScreen_layout[i][7] + '\')" >' +
                        LiveTileIframe +
                        '<img id="tile_2_' + startScreen_layout[i][5] + '" src="apps/classic/desktop/' + startScreen_layout[i][7] + '/' + AppTile + '.png">' +
                        '<p id="tile_3_' + startScreen_layout[i][5] + '">' + TileLabel + '</p></div>'
                } else if (startScreen_layout[i][0] == 'DesktopApp') {
                    HtmlDocumentText = HtmlDocumentText + '<div ' +
                        'style="background: linear-gradient(90deg, ' + startScreen_layout[i][3] + ' 0%, ' + startScreen_layout[i][4] + ' 100%);" ' +
                        'id="tile_1_' + startScreen_layout[i][5] + '" ' +
                        'class="TILE_' + startScreen_layout[i][5] + ' tile ' + TileSize + 'tile" ' +
                        'onclick="closeStart();Exec(\'' + startScreen_layout[i][5].substring(8) + '\')" >' +
                        '<img id="tile_2_' + startScreen_layout[i][5] + '" src="apps/classic/desktop/' + startScreen_layout[i][6] + '">' +
                        '<p id="tile_3_' + startScreen_layout[i][5] + '">' + TileLabel + '</p></div>'
                }
            }

            AddHtmlDocumentText()
            if (TwoStandartTiles) {
                i++
                AddHtmlDocumentText()
                HtmlDocumentText = HtmlDocumentText + SquadTilesContainer2
            }
            $('.tilesContainer').append(HtmlDocumentText)
            if (localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper') != null) {
                $('.desktoptile').css('background-image', 'url(img/wallpaper/' + localStorage.getItem('OKNA8_user_' + currentUser + '_appearance_wallpaper').split('|')[0] + ')')
                $('.desktoptile').css('background-size', 'cover')
                $('.desktoptile').css('background-position', 'center')
            }
        }


        UpdateLiveTiles()
    }
    updtilescontainer()
})

function ResizeTile(id, size) {
    var TilesLayout = localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').substring(2).split('|')
    for (let i = 0; TilesLayout.length > i; i++) {
        TilesLayout[i] = TilesLayout[i].split(', ')
    }
    if (id != 'desktop') {
        for (let i = 0; TilesLayout.length > i; i++) {
            if (TilesLayout[i][5] == id) {
                TilesLayout[i][1] = size
            }
        }
    } else {
        for (let i = 0; TilesLayout.length > i; i++) {
            if (TilesLayout[i][0] == 'desktoptile') {
                TilesLayout[i][1] = size
            }
        }
    }
    var TilesLayoutLocalStorage = []
    for (let i = 0; TilesLayout.length > i; i++) {
        TilesLayoutLocalStorage.push(TilesLayout[i].join(', '))
    }
    TilesLayoutLocalStorage = TilesLayoutLocalStorage.join('|')
    localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', '92' + TilesLayoutLocalStorage)
    updtilescontainer()
}

function enableLiveTile(id) {
    setLiveTile(id, '2')
    $('.TILE_' + id).prepend("<iframe style=\"display:block\" class=\"LiveTileFrame\" src=\"apps/classic/desktop/" + tilesInfo[id][3] + "/LiveTile.html\" frameborder=\"\"></iframe>")
    LiveTiles.push(id)
    UpdateLiveTile(id)
}

function disableLiveTile(id) {
    setLiveTile(id, '1')
    DisplayIconOnLiveTile(id)
    LiveTiles.splice(LiveTiles.indexOf(id), 1)
}

function setLiveTile(id, state) {
    var startScreen_layout = localStorage.getItem('OKNA8_user_' + currentUser + '_startScreen-layout').split('|')
    for (let i = 0; i < startScreen_layout.length; i++) {
        startScreen_layout[i] = startScreen_layout[i].split(', ')
        if (startScreen_layout[i][5] == id) {
            startScreen_layout[i][9] = state
        }
    }
    for (let i = 0; i <startScreen_layout.length; i++) {
        startScreen_layout[i] = startScreen_layout[i].join(', ')
    }
    startScreen_layout = startScreen_layout.join('|')
    localStorage.setItem('OKNA8_user_' + currentUser + '_startScreen-layout', startScreen_layout)
}