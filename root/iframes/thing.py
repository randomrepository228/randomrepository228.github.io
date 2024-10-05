import json
import os
iframes = {}
for a in os.listdir():
    if os.path.isdir(a):
        if os.path.isfile(a + "/init.json"):
            os.remove(a + "/init.json")