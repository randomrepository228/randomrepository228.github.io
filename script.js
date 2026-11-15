main.classList.remove("nojs")
		const ch = sdb.children, p = cnt.children, pn = []
        let selectedIndex = document.body.className
		let selectedItem = ch[selectedIndex], selectedPage = p[selectedIndex]
		for (const el of p) pn.push(el.classList[0])
		for (const el of ch){
			el.onclick = function(e){
                if (el.getAttribute("href") === "") e.preventDefault()
				selectedPage.classList.add("hd")
				selectedPage = p[pn.indexOf(this.classList[0])]
				selectedPage.classList.remove("hd")
				selectedItem.classList.remove("slp")
				selectedItem = this
				selectedItem.classList.add("slp")
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