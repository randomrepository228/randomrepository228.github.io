window.ui = {}
window.ui.RibbonUI = {}
window.ui.RibbonUI.section = class{
    constructor(name){
        this.name = name
        this.elem = document.createElement("div")
        this.elem.className = "ribbon-ui section"
        this.subSections = []
    }
    addSubSection(s){
        let subSection = document.createElement("div")
        subSection.className = "ribbon-ui sub-section"
        let sContainer = document.createElement("div")
        sContainer.className = "ribbon-ui ribbon-container"
        for (let a of s.items){
            if (a.type === "button"){
                let sButton = document.createElement("div")
                let sButtonImage = document.createElement("img")
                sButtonImage.src = a.image
                sButton.appendChild(sButtonImage)
                a.text = a.text.replace(">", "&gt;")
                a.text = a.text.replace("<", "&lt;")
                sButton.innerHTML += a.text
                sButton.className = "ribbon-ui ribbon-item button"
                sButton.onclick = a.onclick
                sContainer.append(sButton)
            }
            if (a.type === "color-button"){
                let colorPicker = document.createElement("input")
                colorPicker.type = "color"
                colorPicker.id = a.uid
                colorPicker.className = "ribbon-ui"
                let sButton = document.createElement("label")
                sButton.htmlFor = a.uid
                let sButtonImage = document.createElement("img")
                sButtonImage.src = a.image
                sButton.appendChild(sButtonImage)
                a.text = a.text.replace(">", "&gt;")
                a.text = a.text.replace("<", "&lt;")
                sButton.innerHTML += a.text
                sButton.className = "ribbon-ui ribbon-item button"
                colorPicker.onchange = a.onchange
                sContainer.append(colorPicker)
                sContainer.append(sButton)
            }
        }
        let sNameElement = document.createElement("div")
        sNameElement.innerText = s.name
        sNameElement.className = "ribbon-ui sub-section-name"
        subSection.append(sContainer)
        subSection.append(sNameElement)
        this.elem.appendChild(subSection)
        return subSection
    }
}
window.ui.RibbonUI.ribbon = class{
    constructor(){
        this.elem = document.createElement("div")
        this.elem.className = "ribbon-ui ribbon"
        this.tabBar = document.createElement("div")
        this.tabBar.className = "ribbon-ui tab-bar"
        this.elem.appendChild(this.tabBar)
        this.infoBar = document.createElement("div")
        this.infoBar.className = "ribbon-ui info-bar"
        this.elem.appendChild(this.infoBar)
        this.sections = {}
        this.nSections = 0
    }
    addSection(section){
        if (this.nSections) throw new Error("multiple tabs not yet supported")
        this.nSections++
        this.infoBar.appendChild(section.elem)
        this.sections[section.name] = section.elem
        this.tabBar.innerHTML = '<div class="ribbon-ui tab" active></div>'
        this.tabBar.children[0].innerText = section.name
    }
}