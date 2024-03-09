function changeLocale(localeInfo, destElem){
    if (!(localeInfo instanceof Array)) return
    function iterList(list, elem){
        for (let i = 0; i < list.length; i++) {
            if (typeof i == "string") elem.children[i] += list[i].innerHTML;
            if (i instanceof Array) iterList(i, elem.children[i])
        }
    }
    iterList(localeInfo, destElem)
}