function UpdateLiveTiles() {
    for (let i = 0; i < LiveTiles.length; i++) {
        $('.TILE_' + LiveTiles[i] + ' img').css('animation', 'fadeani2 0.2s calc(0.5s + '  + (i * 3) + '00ms) cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        $('.TILE_' + LiveTiles[i] + ' p').css('animation', 'fadeani2 0.2s calc(0.5s + '  + (i * 3) + '00ms) cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
        setTimeout(() => {
            $('.TILE_' + LiveTiles[i] + ' .LiveTileFrame').attr('src', $('.TILE_' + LiveTiles[i] + ' .LiveTileFrame').attr('src'))
        }, 400 + (i * 300));
        $('.TILE_' + LiveTiles[i] + ' .LiveTileFrame').css('animation', 'fadeani 0.2s calc(0.5s + '  + (i * 3) + '00ms) cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    }
}

function UpdateLiveTile(id) {
    $('.TILE_' + id + ' img').css('animation', 'fadeani2 0.2s calc(200ms) cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.TILE_' + id + ' p').css('animation', 'fadeani2 0.2s calc(200ms) cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.TILE_' + id + ' .LiveTileFrame').attr('src', $('.TILE_' + id + ' .LiveTileFrame').attr('src'))
    $('.TILE_' + id + ' .LiveTileFrame').css('animation', 'fadeani 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
}

function DisplayIconOnLiveTile(id) {
    $('.TILE_' + id + ' img').css('animation', 'fadeani 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.TILE_' + id + ' p').css('animation', 'fadeani 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.TILE_' + id + ' .LiveTileFrame').attr('src', $('.TILE_' + id + ' .LiveTileFrame').attr('src'))
    $('.TILE_' + id + ' .LiveTileFrame').css('animation', 'fadeani2 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards')
    $('.TILE_' + id + ' .LiveTileFrame').remove()
}