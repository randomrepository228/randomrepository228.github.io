$('.appscontainer').html('')

function updateAppsContainer() {
    $('.appscontainer').html('')

    var AppsList = []

    for (let i = 1; i < LOCALE_searchdata.length; i++) {
        if (LOCALE_searchdata[i] != null) {
            AppsList.push([LOCALE_appsnames[i], LOCALE_searchdata[i][0]])
        }
    }

    var SortedAppsList = AppsList.sort()
    var AppsLetters = []

    let i = 0

    function add () {
        if (i < SortedAppsList.length) {
            var category = ''
            var category2 = ''
            if (AppsLetters.indexOf(SortedAppsList[i][0].substring(0,1).toUpperCase()) == -1) {
                AppsLetters.push(SortedAppsList[i][0].substring(0,1).toUpperCase())
                category = '<div class="categoryInAppscontainer"><p>' + SortedAppsList[i][0].substring(0,1).toUpperCase() + '</p>'
                category2 = '</div>'
            }
            if (SortedAppsList[i][1] == 'DESKTOP') {
                $(category + '<div class="appInAppscontainer" id="appInAppsContainer1_' + SortedAppsList[i][1] + '" onclick="closeStart();displayStartTiles()"><img id="appInAppsContainer2_' + SortedAppsList[i][1] + '" src="apps/classic/desktop/AppLogo.png"><p id="appInAppsContainer3_' + SortedAppsList[i][1] + '">' + SortedAppsList[i][0] + '</p></div>').appendTo('.appscontainer')
            } else if (SortedAppsList[i][1].startsWith('desktop:')) {
                $(category + '<div class="appInAppscontainer DesktopApp" id="appInAppsContainer1_desktop_' + SortedAppsList[i][1].substring(8) + '" onclick="Exec(\'' + SortedAppsList[i][1].substring(8) + '\');closeStart()"><div class="iconbackground" style="background-color:' + tilesInfo[SortedAppsList[i][1]][2] + ';"></div><img id="appInAppsContainer2_desktop_' + SortedAppsList[i][1].substring(8) + '" src="apps/classic/desktop/' + tilesInfo[SortedAppsList[i][1]][5] + '"><p id="appInAppsContainer3_desktop_' + SortedAppsList[i][1].substring(8) + '">' + SortedAppsList[i][0] + '</p></div>' + category2).appendTo('.appscontainer')
            } else {
                $(category + '<div class="appInAppscontainer" id="appInAppsContainer1_' + SortedAppsList[i][1] + '" onclick="metro_open(\'' + SortedAppsList[i][1] + '\',\'' + tilesInfo[SortedAppsList[i][1]][1] + '\',\'' + SortedAppsList[i][0] + '\',\'' + tilesInfo[SortedAppsList[i][1]][3] + '\')"><img id="appInAppsContainer2_' + SortedAppsList[i][1] + '" src="apps/classic/desktop/' + tilesInfo[SortedAppsList[i][1]][3] + '/AppLogo.png"><p id="appInAppsContainer3_' + SortedAppsList[i][1] + '">' + SortedAppsList[i][0] + '</p></div>' + category2).appendTo('.appscontainer')
            }
            i++
            add()
        }   
    }

    add()
}

document.getElementById('AppsSearchInput').oninput = ()=>{
    var tested = 1
    $('.appscontainer').html('')
    function search () {
        if (LOCALE_appsnames.length != tested) {
            if (LOCALE_appsnames[tested].toLowerCase().indexOf($('#AppsSearchInput').attr('value').toLowerCase()) != '-1') {
                $('<div class="appInAppscontainer" id="appInAppsContainer1_' + LOCALE_searchdata[tested][0] + '" onclick="metro_open(\'' + LOCALE_searchdata[tested][0] + '\',\'' + tilesInfo[LOCALE_searchdata[tested][0]][1] + '\',\'' + LOCALE_appsnames[tested] + '\',\'' + tilesInfo[LOCALE_searchdata[tested][0]][3] + '\')"><img id="appInAppsContainer2_' + LOCALE_searchdata[tested][0] + '" src="apps/classic/desktop/' + tilesInfo[LOCALE_searchdata[tested][0]][3] + '/AppLogo.png"><p id="appInAppsContainer3_' + LOCALE_searchdata[tested][0] + '">' + LOCALE_appsnames[tested] + '</p></div>').appendTo('.appscontainer')
            }
            tested = tested + 1
            search()
        }
    }

    if ($('#AppsSearchInput').attr('value') == '') {
        updateAppsContainer()
    } else {
        search()
    }
}