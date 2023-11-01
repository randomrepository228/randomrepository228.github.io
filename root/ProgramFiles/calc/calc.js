var CurrentMode = 'std'
var CalcString = '0'
var CalcStringSmall = ''
var IsWrittenByUser = 1

function AddSym(symbol) {
    if (typeof symbol == 'number') {
        if (CalcString == '0') {
            CalcString = symbol
        } else if (IsWrittenByUser == 0) {
            CalcString = symbol
            IsWrittenByUser = 1
        } else {
            CalcString = CalcString + symbol
        }
    } else if (symbol == '+' || symbol == '-' || symbol == '/' || symbol == '*') {
        CalcStringSmall = CalcStringSmall + ' ' + CalcString + ' ' + symbol
        IsWrittenByUser = 0
    } else if (symbol == 'd') {
        CalcString = CalcString.substring(0, CalcString.length - 1)
        if (CalcString == '') {
            CalcString = '0'
        }
    } else if (symbol == '=') {
        CalcString = eval(CalcStringSmall.toString().replaceAll(',', '.') + CalcString.toString().replaceAll(',', '.'))
        CalcString = CalcString.toString().replaceAll('.', ',')
        CalcStringSmall = ''
    } else if (symbol == 'CE') {
        CalcString = '0'
    } else if (symbol == 'C') {
        CalcString = '0'
        CalcStringSmall = ''
    } else if (symbol == '+-') {
        if (CalcString.startsWith('-')) {
            CalcString = CalcString.substring(1)
        } else {
            CalcString = '-' + CalcString
        }
    } else if (symbol == ',') {
        CalcString = CalcString + ','
    }
    document.querySelector('.output .stringSmall').innerText = CalcStringSmall
    document.querySelector('.output .string').innerText = CalcString
}

document.onkeydown = (e) => {
    if (String(Number(e.key)) != 'NaN') {
        AddSym(Number(e.key))
    } else if (e.key == 'Backspace') {
        AddSym('d')
    } else if (e.key == '/' || e.key == '*' || e.key == '+' || e.key == '-' || e.key == '=') {
        AddSym(e.key)
    } else if (e.key == 'Enter') {
        AddSym('=')
    }
}