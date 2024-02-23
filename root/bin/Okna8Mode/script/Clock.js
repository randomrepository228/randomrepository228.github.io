var LongDate
var LockScreenDate
var Time

var UpdateClock = () => {
    var date = new Date()
    var beforelongdate = ''
    if (LOCALE_clock[22] == 1) {
        beforelongdate = LOCALE_clock[date.getDay()] + ', '
    }
    if (LOCALE_clock[20] == 1) {
        LongDate = beforelongdate + date.getDate() + ' ' + LOCALE_clock[date.getMonth() + 8] + ' ' + date.getFullYear() + LOCALE_clock[21]
        LockScreenDate = LOCALE_clock[date.getDay() + 1] + ', ' + date.getDate() + ' ' + LOCALE_clock[date.getMonth() + 8]
    } else {
        LongDate = beforelongdate + LOCALE_clock[date.getMonth() + 8] + ' ' + date.getDate() + ', ' + date.getFullYear() + LOCALE_clock[21]
        LockScreenDate = LOCALE_clock[date.getDay() + 1] + ', ' + LOCALE_clock[date.getMonth() + 8] + ' ' + date.getDate()
    }
    if (date.getMinutes() < 10) {
        Time = date.getHours() + ':' + '0' + date.getMinutes()
    } else { 
        Time = date.getHours() + ':' + date.getMinutes()
    }
    $('.LongDate').html(LongDate)
    $('.LockScreenDate').html(LockScreenDate)
    $('.LockScreenTime').html(Time)
}

UpdateClock()

var UpdateClockInterval = setInterval(UpdateClock, 1000);