import json
import random
provinceData = []
for a in range(400):
    provinceData.append({
        "development": random.randint(1,20), 
        "population": random.randint(200000, 500000), 
        "owner": None, 
        "dimensions": {
            "size": 20, 
            "x": (a % 20) * 20, 
            "y": int(a / 20) * 20
        }
    })
with open("provinceData.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(provinceData, indent=4))
    f.close()