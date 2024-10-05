function main(args){
    let win = AddWindow(new Winda7Window(0,0,"On-screen Keyboard", "", false), false, {
        noSelfOpen: true, 
        width: 500, 
        height: 200, 
        window: true, 
        noBorder: true, 
        xOnly: true}, getId(), el, onClose)
}