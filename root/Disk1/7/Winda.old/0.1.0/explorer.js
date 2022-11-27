let bR = document.createElement("bottomright")
bR.innerHTML = "Okna7<br>Version 0.1.0 Alpha"
bR.style.position = "absolute"
bR.style.right = bR.style.bottom = "0px"
bR.style.textAlign = "right"
bR.style.color = "white"
document.querySelector(".explorer").appendChild(bR)

// version icons

let icon1 = document.createElement("div")
icon1.className = "icon"
icon1.innerHTML = '<img src="img/icon.jpg">Version 0.0.1'
icon1.setAttribute("onclick", "window.location.href = './../0.0.1/simulator.html'")
document.querySelector(".explorer").appendChild(icon1)
let icon2 = document.createElement("div")
icon2.className = "icon"
icon2.innerHTML = '<img src="img/icon.jpg">Version 0.0.2'
icon2.setAttribute("onclick", "window.location.href = './../0.0.2/simulator.html'")
document.querySelector(".explorer").appendChild(icon2)