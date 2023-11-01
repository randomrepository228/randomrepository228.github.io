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
            if (CalcString.length > 15) return
            CalcString = CalcString.toString() + symbol
        }
    } else if (symbol == '+' || symbol == '-' || symbol == '/' || symbol == '*') {
        if (IsWrittenByUser)
            CalcStringSmall += ' ' + CalcString + ' ' + symbol
        else
        CalcStringSmall = CalcString + ' ' + symbol
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
    let output = document.querySelector('.output .string')
    output.innerText = CalcString
    if (CalcString.length > 16)
        output.style.fontSize = "12px"
    else if (CalcString.length > 12) 
        output.style.fontSize = "18px"
    else 
        output.style.fontSize = ""
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