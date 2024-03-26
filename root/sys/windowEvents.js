// for (a of document.querySelector(".menubar").querySelector(".element")){

// }
if (window.parent){
    addEventListener("mousedown", () => {
        parent.setActive(frameElement.parentElement.parentElement.parentElement)
    })
    addEventListener("touchstart", e => {
        e.preventDefault()
        parent.setActive(frameElement.parentElement.parentElement.parentElement)
    })
}
function minimise(){
    for(a of document.querySelectorAll(".content")){
        a.parentElement.className = a.parentElement.className.replace(" maximisedm", "")
    }
}
function maximise(){
    for(a of document.querySelectorAll(".content")){
        a.parentElement.className += " maximisedm"
    }
}
function focus(){
    for(a of document.querySelectorAll(".content")){
        a.parentElement.className += " focus"
    }
}
function unfocus(){
    for(a of document.querySelectorAll(".content")){
        a.parentElement.className = a.parentElement.className.replace(" focus", "")
    }
}