function WINAPI_BUTTON(content, action){
    if (content){
        if (!action){
            return `<button class="windowbtn">${content}</button>`
        }
        else{
            return `<button class="windowbtn" onclick="${action}">${content}</button>`
        }
    }
    else{
        return `<button class="windowbtn"></button>`
    }
}
function WINAPI_FOOTER(content){
    if (content){
        return `<div class="footer">${content}</div>`
    }
    else{
        return '<div class="footer"></div>'
    }
}
function WINAPI_VERTICAL_SCROLL(content){
    if (content){
        return `<div class="scrollable">${content}</div>`
    }
    else{
        return '<div class="scrollable"></div>'
    }
}