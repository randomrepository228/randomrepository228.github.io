import os
from PIL import Image
size = 80
for a in os.listdir("."):
    if not a.endswith(".jpg"): continue
    outfile = "./" + a.replace(".jpg", "_thumb.png")
    im = Image.open(a)
    im.thumbnail((size, size))
    im.save(outfile, "PNG")