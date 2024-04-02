import os 
l = []
for a, _, b in os.walk("."):
    for c in b:
        if c.endswith(".css") or c.endswith(".py") or c.endswith(".js"): continue
        if "aero8" in a or "aero10" in a: continue
        if os.name == "nt":
            a = a.replace("\\", "/")
        if a == ".": a = "res"
        l.append(a.replace(".", "res", 1) + "/" + c)
with open("preloadlist.js", "w", encoding="utf-8") as f:
    f.write(str(l))