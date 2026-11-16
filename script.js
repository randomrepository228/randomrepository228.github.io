main.classList.remove("nojs")
const ch = sdb.children, p = cnt.children, pn = []
let selectedIndex = +document.body.className
let selectedItem = ch[selectedIndex], selectedPage = p[selectedIndex]
const pp = []
function switchPage(idx){
    selectedPage.classList.add("hd")
	selectedPage = p[idx]
	selectedPage.classList.remove("hd")
	selectedItem.classList.remove("slp")
	selectedItem = ch[idx]
	selectedItem.classList.add("slp")
}
for (const el of p) pn.push(el.classList[0])
for (const el of ch){
    pp.push(el.href)
	el.onclick = function(e){
        e.preventDefault()
        const idx = pn.indexOf(this.classList[0])
        history.pushState(null, null, this.getAttribute("href"))
		switchPage(idx)
	}
}
const themeClassList = ["", "light", "dark"]
mode.onchange = () => {
	const sel = mode.selectedIndex
	localStorage.mode = sel
	document.body.className = themeClassList[sel]
}
mode.selectedIndex = +localStorage.mode
document.body.className = themeClassList[mode.selectedIndex]
onpopstate = e => switchPage(pp.indexOf(location.href))