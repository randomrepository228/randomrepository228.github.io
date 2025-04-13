/// <reference path="../sys/windowManager.js"/>
async function main(args){ return new Promise(async (res, rej) => {
    if (args.length < 1){
        await msgbox("Error", "No arguments provided", undefined, "error")
        return
    }
    if (!(args[0] instanceof Function)){
        await msgbox("Error", "Entry point is not provided", undefined, "error")
        return
    }
    function setCSS(elem, css){
        for (let a in css) elem.style[a] = css[a]
    }
    let el = document.createElement("div")
    el.className = "cmd"
    setCSS(el, {
        fontFamily: 'fixedsys',
        backgroundColor: 'black',
        color: 'lightgray',
        whiteSpace: 'pre',
        height: "100%",
        fontSize: "16px",
        lineHeight: "16px",
        MozUserSelect: "text",
        userSelect: "text",
    })
    el.innerHTML = '<span class="consoleoutput"></span><span class="consoleinput" contenteditable="true" spellcheck="false"></span>'
    setCSS(el.children[1], {
        fontFamily: 'fixedsys',
        backgroundColor: 'black',
        color: 'lightgray',
        whiteSpace: 'pre',
        height: "16px",
        fontSize: "16px",
        lineHeight: "16px",
        border: "0",
        outline: "0",
        padding: "0",
    })
    el.innerHTML += "<style>.cmd input:hover{cursor: default}.cmd *::selection, .cmd *::-moz-selection{color: black; background-color: white}</style>"
    let consoleoutput = el.children[0]
    let consoleinput = el.children[1]
    let currentInputString = ""
    consoleinput.innerText = ""
    function print(string, end){
        if (!end) end = "\n"
        consoleoutput.append(string + end)
        el.scrollTo(0, el.scrollHeight);
    }
    const enterpressed = new CustomEvent("enterpressed")
    el.onkeydown = function(e){
        if (e.keyCode === 13) {
            e.preventDefault()
            dispatchEvent(enterpressed)
        }
    }
    el.onclick = () => {
        consoleinput.focus()
    }
    consoleinput.addEventListener('paste', function() {
        consoleinput.style.display = "none"
        setTimeout(() => {
          this.innerHTML = this.textContent;
          consoleinput.style.display = ""
        }, 0);
    })
    function input(string){ return new Promise((res, rej) => {
        consoleoutput.innerText += string
        currentInputString = string
        consoleinput.style.display = ""
        el.scrollTo(0, el.scrollHeight);
        addEventListener("enterpressed", (e) => {
            print(consoleinput.innerText)
            el.scrollTo(0, el.scrollHeight);
            const inp = consoleinput.innerText
            consoleinput.innerHTML = ""
            consoleinput.style.display = "none"
            res(inp.trim())
        }, {once: true})
        consoleinput.focus()
    })}
    const id = getId()
    const wnd = new Winda7Window({
        title: "Command Prompt", 
        icon: "./bin/conhost.png",
        id: id, 
        layout: {
            titlebar: {
                buttons: {
                    min: true,
                    max: true,
                    close: true
                }
            },
            cont: el
        },
        aero: true,
        height: 300,
        width: 500,
    })
    wnd.show()
    await args[0](print, input, consoleoutput)
    closeWindow(id, () => res(result))
})}