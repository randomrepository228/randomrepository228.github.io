function propertiesDisplayTab (tabid) {
    $('.properties-tabs > .tab').removeClass('activetab')
    $('.properties-tabs > .tab#properties_tab_' + tabid).addClass('activetab')
    $('.properties-content').css('display', 'none')
    $('#properties-content_' + tabid).css('display', 'block')
}

$(document).ready(()=>{
    $('.properties-tabs > .tab').click((e)=>{
        propertiesDisplayTab(e.target.id.substring(15))
    })
})