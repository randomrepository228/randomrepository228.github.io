function StartScreenAnimation() {
    ColorPaletteApply()
    $('.tilesContainer > div').css('animation', 'none')
    $('.tilesContainer > div').css('opacity', '0')
    $('.tilesContainer').css('animation', 'none')
    $('.startScreen').css('display', 'block')
    for (let i = 0; i < $('.tilesContainer > div').length; i++) {
        $('.tilesContainer > div:nth-child(' + (i + 1) + ')').css('animation', 'fadeani 0.7s ' + ($('.tilesContainer > div:nth-child(' + (i + 1) + ')').offset()['left'] / 2000) + 's cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    }
    $('.tilesContainer').css('animation', 'StartOpenTilesContainerAnim cubic-bezier(0.1, 0.9, 0.2, 1) 1s 0.1s forwards')
}