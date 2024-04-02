import os
from zipfile import ZipFile, ZIP_DEFLATED
import base64
import re
with ZipFile("install.zip", 'w') as zip_object:
    for fn, _, file_names in os.walk("."):
        folder_name = fn.replace("\\", "/")
        if ("bin/" in folder_name): continue
        if ("Winda.old" in folder_name): continue
        if ("fonts" in folder_name): continue
        for filename in file_names:
            if (filename.endswith(".py")): continue
            if ("install.zip" in filename): continue
            if ("install_web.js" in filename): continue
            if ("img" in folder_name and filename.endswith(".jpg")): continue
            file_path = os.path.join(folder_name, filename)
            print(file_path)
            zip_object.write(file_path, file_path, ZIP_DEFLATED, compresslevel=9)
with open("install.zip", "rb") as f:
    with open("install_web.js", "wb") as g:
        g.write(b"const installZip = `")
        g.write(base64.b64encode(f.read()))
        g.write(b"`")
