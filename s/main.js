document.body.style.height = innerHeight + "px"
addEventListener("resize", () => document.body.style.height = innerHeight + "px")
const canvas = document.querySelector("canvas")
const tempCanvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
tctx = tempCanvas.getContext("2d")
let provinceImg
let provinceMap
let init = false
const provinceAmount = 400
const provinceSize = 20
const highestDev = 20
const colourList = []
const mapDimensions = {width: 0, height: 0}
let mapMode = 1
let prevDeltaTime = 0
const mt = {x: 0, y: 0, scale: 1, pX: 0, pY: 0}
let isMouseDown = false
let sp
addEventListener("mousedown", (e) => isMouseDown = true)
addEventListener("mouseup", () => {
    isMouseDown = false
    mt.pX = 0
    mt.pY = 0
})
addEventListener("mousemove", (e) => {
    if (!isMouseDown) return
    mt.x += e.clientX - (mt.pX ? mt.pX : e.clientX)
    mt.y += e.clientY - (mt.pY ? mt.pY : e.clientY)
    mt.pX = e.clientX
    mt.pY = e.clientY
    canvas.style.transform = `translate(${mt.x}px, ${mt.y}px) scale(${mt.scale})`
})
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}
function drawProvinces(){
    for(let a = 0; a < provinceMap.length; a++){
        const data = provinceMap[a]
        const rgb = HSVtoRGB(data.development / highestDev / 3, 1, 1)
        ctx.fillStyle = `rgb(${rgb.join(",")})`
        //ctx.fillStyle = "red"
        ctx.fillRect(mapDimensions.width,mapDimensions.height,provinceSize,provinceSize)
    }
}
function convert(uint32){
    let pos = 0
    for (let i = 0; i < uint32.length; i++){
        var view = new DataView(uint32.buffer);
        const uint = view.getUint32(pos)
        view.setUint32(pos, uint, true)
        pos += 4;                     
    }
}
async function mainloop(deltaTime){
    if (!init){
        const mapData = await (await fetch("mapData.json")).json()
        const img = new Image()
        img.onload = () => {
            provinceImg = new Uint16Array(img.naturalWidth * img.naturalHeight)
            tempCanvas.width = img.naturalWidth
            tempCanvas.height = img.naturalHeight
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            mapDimensions.width = img.naturalWidth
            mapDimensions.height = img.naturalHeight
            tctx.drawImage(img, 0, 0)
            ctx.drawImage(img, 0, 0)
            const arr = new Uint32Array(tctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data.buffer)
            convert(arr)
            const ep = {}
            for (let i = 0; i < arr.length; i++){
                let hex = arr[i].toString(16).padStart(8, "0")
                if (hex === "000000ff") continue
                provinceImg[i] = mapData.colours.indexOf(hex)
                if (!colourList.includes(hex)){
                    colourList.push(hex)
                }
                const c = {x: i % img.naturalWidth, y: i % img.naturalHeight}
                if (!ep[hex]){
                    ep[hex] = {w: c.x, n: c.y, e: c.x, s: c.y}
                }
                if (c.x < ep[hex].w){
                    ep[hex].w = c.x
                }
                else if (c.x > ep[hex].e){
                    ep[hex].e = c.x
                }
                if (c.y < ep[hex].s){
                    ep[hex].s = c.y
                }
                if (c.y > ep[hex].n){
                    ep[hex].n = c.y
                }
            }
            console.log(provinceImg)
            let i = 0
            for (let a of colourList){
                ctx.fillStyle = "#" + a
                console.log(ctx.fillStyle)
                ctx.fillRect(i * 20, 0, 20, 20)
                i++
            }
            if (colourList){
                alert("Colors: " + colourList.join(", "))
            }
        }
        img.src = "provincemap.png"
        provinceMap = mapData.provinces
        init = true
    }
    prevDeltaTime = deltaTime    
    drawProvinces()
    requestAnimationFrame(mainloop)
}
canvas.onclick = (e) => {
    sp = provinceImg[e.clientX + (e.clientY * mapDimensions.width)]
}
mainloop()