function code() {
    let canvas = document.getElementById("game");
    let ctx = canvas.getContext("2d");
    let score = -1
    let scoreblock = document.getElementById("score");
    let width = 0
    let height = 0
    let w, a, s, d
    w = a = d = false;
    s = true
    let gameover = false
    function Rand(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    function keyDownHandler(e) {
        if (e.key == "w") {
            a = s = d = false;
            w = true;
        }
        if (e.key == "a") {
            w = s = d = false;
            a = true;
        }
        if (e.key == "s") {
            w = a = d = false;
            s = true;
        }
        if (e.key == "d") {
            w = a = s = false;
            d = true;
        }
    }
    function outline(text, x, y, font) {
        ctx.font = font
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);
    }
    function replaceColor(srcR, srcG, srcB, dstR, dstG, dstB) {
        const im = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < im.data.length; i += 4) {
            if (
                im.data[i] === srcR &&
                im.data[i + 1] === srcG &&
                im.data[i + 2] === srcB
            ) {
                im.data[i] = dstR;
                im.data[i + 1] = dstG;
                im.data[i + 2] = dstB;
            }
        }
        ctx.putImageData(im, 0, 0);
    }
    document.addEventListener('keydown', keyDownHandler);
    function TrailRemover() {
        ctx.fillStyle = 'blue';
        let num = Rand(1, canvas.width - 50)
        let num2 = Rand(1, canvas.height - 50)
        X = Math.round(num / 5) * 5;
        Y = Math.round(num2 / 5) * 5;
        ctx.rect(X, Y, 50, 50);
        ctx.fill();
        ctx.fillStyle = 'red';
        score += 1
        scoreblock.innerHTML = "Score: " + score;
    }
    TrailRemover()
    function draw() {
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.rect(width, height, 50, 50);
        replaceColor(255, 0, 0, 0, 255, 0)
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.clearRect(width + 10, height + 10, 30, 30)
        ctx.closePath();
        if (w == true) {
            height -= 5
            imageData = [ctx.getImageData(width, height, 1, 1), ctx.getImageData(width + 50, height, 1, 1)];
            ctx.fill()
        }
        if (s == true) {
            height += 5
            imageData = [ctx.getImageData(width, height + 45, 1, 1), ctx.getImageData(width + 50, height + 45, 1, 1)];
            ctx.fill()
        }
        if (a == true) {
            width -= 5
            imageData = [ctx.getImageData(width, height + 50, 1, 1), ctx.getImageData(width, height, 1, 1)];
            ctx.fill()
        }
        if (d == true) {
            width += 5
            imageData = [ctx.getImageData(width + 45, height + 50, 1, 1), ctx.getImageData(width + 45, height, 1, 1)];
            ctx.fill()
        }
        if (height > canvas.height - 50 || imageData[0].data[1] == 255 || imageData[1].data[1] == 255 || width > canvas.width - 50 || height < 0 || width < 0) {
            canvas.removeEventListener('keydown', keyDownHandler)
            w = a = s = d = false
            gameOver()
        }
        if (imageData[0].data[2] == 255 || imageData[1].data[2] == 255) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            TrailRemover()
        }
        to = setTimeout(draw, 12);
    }
    function gameOver() {
        let gameover = true;
        document.addEventListener('keydown', (event) => {
            window.location.reload();
        });
        canvas.removeEventListener('keydown', keyDownHandler)
        w = -999
        height = -999
        ctx.clearRect(0, 0, canvas.w, canvas.height)
        ctx.beginPath();
        outline("Game Over", 125, 250, "50px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif")
        outline("Press any key", 185, 275, "20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif")
        replaceColor(255, 0, 0, 0, 255, 0)
        ctx.closePath()
    }
    function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
            return false;
        }
        return true;
    }
    draw()
}
code()