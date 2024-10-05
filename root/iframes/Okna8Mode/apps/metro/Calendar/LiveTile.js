$(document).ready(()=>{
    $('h4').html(LOCALE_calendar[3])
    
    function Update() {
        var date = new Date
    
        $('h2').html(date.getDate())
        $('h3').html(LOCALE_calendar[4 + date.getDay()])
    }
    
    Update()
    
    setInterval(Update, 10000)
})
