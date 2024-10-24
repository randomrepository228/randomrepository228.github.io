// for (const a of document.querySelector(".menubar").querySelector(".element")){

// }
if (window.parent){
    addEventListener("mousedown", e => {
        frameElement.parentElement.parentElement.parentElement.context.focus()
        if (!e.target.parentElement.classList.contains("menubar")) parent.contextMenuOff()
        //parent.startMenu(false)
        focus()
    })
    addEventListener("touchstart", e => {
        e.preventDefault()
        frameElement.parentElement.parentElement.parentElement.context.focus()
        if (!e.target.parentElement.classList.contains("menubar")) parent.contextMenuOff()
        // parent.startMenu(false)
        focus()
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
function tabHandler(elem){
    for (const a of elem.firstElementChild.children){
        if (!a.hasAttribute("disabled")){
            a.setAttribute('onmousedown', 
               `for (const a of this.parentElement.parentElement.querySelectorAll("article[role=tabpanel]")){
                    a.style.display = "none"
                };
                this.parentElement.parentElement.querySelector("#"+this.getAttribute("aria-controls")).style.display = "block"
                for (const a of this.parentElement.parentElement.querySelectorAll(".button\[role=tab]")) {
                    a.setAttribute("aria-selected", "")
                }
                this.parentElement.parentElement.querySelector\(".button\[role=tab][aria-controls="+this.getAttribute("aria-controls")+"]").setAttribute("aria-selected", "true")`)
            a.setAttribute('ontouchstart', 
               `event.preventDefault();
                for (const a of this.parentElement.parentElement.querySelectorAll("article[role=tabpanel]")){
                    a.style.display = "none"
                };
                this.parentElement.parentElement.querySelector("#"+this.getAttribute("aria-controls")).style.display = "block"
                for (const a of this.parentElement.parentElement.querySelectorAll(".button\[role=tab]")) {
                    a.setAttribute("aria-selected", "")
                }
                this.parentElement.parentElement.querySelector\(".button\[role=tab][aria-controls="+this.getAttribute("aria-controls")+"]").setAttribute("aria-selected", "true")`)
        }
    }
}