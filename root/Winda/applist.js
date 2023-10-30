if (!localStorage.appList || JSON.parse(localStorage.appList).length < 3) 
    localStorage.appList = JSON.stringify(["clock", "ExampleApp", "regedit"])
apps = []