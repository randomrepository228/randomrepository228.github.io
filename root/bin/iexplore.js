async function main(args){
    const ieContainer = document.createElement("div")
    ieContainer.style.height = "100%"
    const header = createElement("div", "ieheader", ieContainer)
    const travelButtons = createElement("div", "travelButtons", header)
    createElement("div", "back", travelButtons)
    createElement("div", "next", travelButtons)
    const urlBars = createElement("div", "url-bars", header)

}
<div class="ieheader">
            <div class="travelButtons">
                <div class="back"></div>
                <div class="next"></div>
            </div>
            <div class="url-bars">
                <input type="text" name="urlbar" id="urlbar" onkeydown="urlbarEnter(event)">
            </div>
        </div>
        <div class="tabs">
            <div class="tabContainer">
                <div class="tab active" onclick="ActivateTab('1')" id="Tab_1"><div></div></div>
            </div>
            <div class="newtab" onclick="NewTab()"><div><img src="" alt=""></div></div>
        </div>
        <div class="frames">
            <div class="frame content" style="display:block" id="Frame_1">
                <iframe src="about:blank" frameborder="0" sandbox="allow-forms allow-scripts allow-same-origin"></iframe>
            </div>
        </div>
        <div class="header topbar-ext" ondblclick="parent.maximise(thisWindow)"></div>