if (!localStorage.appList || JSON.parse(localStorage.appList).length < 3) 
    localStorage.appList = JSON.stringify(["calc", "changelog", "control", "ExampleApp", "Okna8Mode", "regedit", "run", "sfc", "taskmgr", "dvd"])
apps = []