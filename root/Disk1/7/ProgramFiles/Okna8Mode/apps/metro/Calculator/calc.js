var mode = 'calc'
var Action

function add (character) {
    if ($('.mode' + mode + ' > .output > h1').html().length != 20) {
        if (character != '.') {
            if ($('.mode' + mode + ' > .output > h1').html() != '0') {
                $('.mode' + mode + ' > .output > h1').html($('.mode' + mode + ' > .output > h1').html() + character)
            } else {
                $('.mode' + mode + ' > .output > h1').html(character)
            }
        } else if (character == '.') {
            if ($('.mode' + mode + ' > .output > h1').html().indexOf('.') == -1) {
                $('.mode' + mode + ' > .output > h1').html($('.mode' + mode + ' > .output > h1').html() + character)
            }
        }
    }
}

function c () {
    $('.mode' + mode + ' > .output').html('<h2></h2><h1>0</h1>')
}

function ce () {
    $('.mode' + mode + ' > .output > h1').html('0')
}

function setAction (action) {
    $('.mode' + mode + ' > .output > h2').html($('.mode' + mode + ' > .output > h1').html() + ' ' + action)
    Action = action
}

function bk () {
    $('.mode' + mode + ' > .output > h1').html($('.mode' + mode + ' > .output > h1').html().slice(0, -1))
    if ($('.mode' + mode + ' > .output > h1').html() == ''){
        $('.mode' + mode + ' > .output > h1').html('0')
    }
}

function calc () {
    $('.mode' + mode + ' > .output > h2').html($('.mode' + mode + ' > .output > h2').html().replace(Action, ""))
    $('.mode' + mode + ' > .output > h2').html($('.mode' + mode + ' > .output > h2').html().replace(" ", ""))
    var result
    if (Action == '*') {result = Number($('.mode' + mode + ' > .output > h2').html()) * Number($('.mode' + mode + ' > .output > h1').html())}
    if (Action == '/') {result = Number($('.mode' + mode + ' > .output > h2').html()) / Number($('.mode' + mode + ' > .output > h1').html())}
    if (Action == '+') {result = Number($('.mode' + mode + ' > .output > h2').html()) + Number($('.mode' + mode + ' > .output > h1').html())}
    if (Action == '-') {result = Number($('.mode' + mode + ' > .output > h2').html()) - Number($('.mode' + mode + ' > .output > h1').html())}

    $('.mode' + mode + ' > .output > h2').html('')
    $('.mode' + mode + ' > .output > h1').html(result)
}

