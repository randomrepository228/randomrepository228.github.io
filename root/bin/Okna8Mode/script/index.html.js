$(document).ready(() => {
    if (typeof LOCALE_index == "undefined") {
        window.location.reload(true)
    }
    if (location.protocol != "file:") {
        $('.welcome .content').html(LOCALE_index[3])
    } else if (typeof require != 'undefined') {
        $('.welcome .content').html(LOCALE_index[2].replace('((VER))', 'Ver. ' + VERSION['ver'] + ', build ' + VERSION['build']))
    } else {
        $('.welcome .content').html(LOCALE_index[1].replace('((VER))', 'Ver. ' + VERSION['ver'] + ', build ' + VERSION['build']))
    }
    $('#start').click(() => {
        $('.AppSplashContainerV2').css('display', 'block')
        $('.AppSplashContainerV2 .SplashV2').css('display', 'block')
        setTimeout(() => {
            window.location.href = 'res/pages/BIOSnSTART/checkSetupState_andStart.html'
        }, 1000)
    })
    $('#changelang').click(() => {
        localStorage.removeItem('OKNA8_locale')
        window.location.reload(true)
    })
    $('.welcome').css('display', 'block')

    var iframe = document.createElement('iframe')
    iframe.id = 'Okna8UpdateServerIframe'
    iframe.style.display = 'none'
    document.body.append(iframe)

    function CheckUpdates() {
        document.getElementById('Okna8UpdateServerIframe').setAttribute('src', 'https://updateokna8.ertorik.fun')
    }

    window.addEventListener('message', (event) => {
        if (event.data.startsWith('UpdateServer-')) {
            var LatestVersionInfo = event.data.substring(13)
            LatestVersionInfo = LatestVersionInfo.split('|')
            if (VERSION['build'] < LatestVersionInfo[0]) {
                $('#welcometext').append(LOCALE_index[4].replace('__NEWVER__', LatestVersionInfo[1]))
            }
        }
    })

    //CheckUpdates()

    var NewYear = () => {
        $(document).snowfall({
            flakeCount: 100,
            minSize: 1,
            maxSize: 5,
            round: true,
            shadow: false,
        })
        $('body').append(`
            <div class="circles">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
            </div>
            <style>
                .circle1 {
                    left: 35vw;
                    top: 30vh;
                    position: fixed;
                    animation: circle1Path 15s infinite, fadeCircleIn 1332ms ease-out;
                    animation-direction: alternate;
                    border-radius: 100vw;
                    background: radial-gradient(50% 50% at 50% 50%, rgba(12, 119, 255, 0.3) 15.62%, rgba(12, 119, 255, 0) 100%);
                }

                .circle2 {
                    left: 35vw;
                    top: 30vh;
                    position: fixed;
                    animation: circle2Path 15s infinite, fadeCircleIn 1332ms ease-out;
                    animation-direction: alternate;
                    border-radius: 100vw;
                    background: radial-gradient(50% 50% at 50% 50%, rgba(0, 56, 255, 0.3) 15.62%, rgba(12, 119, 255, 0) 100%);
                }

                .circle3 {
                    left: 35vw;
                    top: 30vh;
                    position: fixed;
                    animation: circle3Path 15s infinite, fadeCircleIn 1332ms ease-out;
                    animation-direction: alternate;
                    border-radius: 100vw;
                    background: radial-gradient(50% 50% at 50% 50%, rgba(65, 56, 210, 0.5) 15.62%, rgba(65, 56, 210, 0) 100%);
                }

                @keyframes circle1Path {
                    0% {
                        transform: translate(-85vw, -50vh);
                        width: 120vw;
                        height: 120vw;
                    }
        
                    100% {
                        transform: translate(5vw, -50vh);
                        width: 120vw;
                        height: 120vw;
                    }
                }
        
                @keyframes circle2Path {
                    0% {
                        transform: translate(0vw, -100vh);
                        width: 120vw;
                        height: 120vw;
                    }
        
                    100% {
                        transform: translate(-55vw, -100vh);
                        width: 120vw;
                        height: 120vw;
                    }
                }
        
                @keyframes circle3Path {
                    0% {
                        transform: translate(5vw, -50vh);
                        width: 120vw;
                        height: 120vw;
                    }
        
                    100% {
                        transform: translate(-60vw, -50vh);
                        width: 120vw;
                        height: 120vw;
                    }
                }
        
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                }
        
                @keyframes fadeCircleIn {
                    0% {
                        opacity: 0;
                    }
        
                    100% {
                        opacity: 1;
                    }
                }
            </style>
        `)
        $('.welcome').css('background-color', 'rgba(0,0,0,0)')
        $('body').css('background-color', 'black')
    }
    setTimeout(() => {
        var date = new Date
        if (date.getDate() > 19 && date.getMonth() == 11 || date.getDate() < 10 && date.getMonth() == 0) {
            NewYear()
        } else {
            $('.welcome').css('transition', 'none')
        }
    }, 1000);
})