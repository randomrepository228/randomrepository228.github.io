import os
from zipfile import ZipFile, ZIP_DEFLATED
images = []
files = []
fonts = []
with ZipFile("install.zip", 'w') as zip_object:
    for fn, _, file_names in os.walk("."):
        fn = fn.replace("\\", "/")
        for filename in file_names:
            if filename.endswith(".py"): continue
            if filename == "install.zip": continue
            file_path = os.path.join(fn, filename)
            print(file_path)
            files.append(file_path)
    realAmount = 0
    for a in files:
        if not a.endswith("\\empty"):
            realAmount += 1
    zip_object.writestr("fileAmount", str(realAmount))
    for a in files:
        zip_object.write(a, a, ZIP_DEFLATED, compresslevel=9)