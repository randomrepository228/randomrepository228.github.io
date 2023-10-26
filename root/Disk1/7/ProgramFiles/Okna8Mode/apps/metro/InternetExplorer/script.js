function pageLoaded() {
    document.querySelector('input').value = document.querySelector('iframe').src.split('?url=').pop()
}

function url(ele) {
    if (event.key === 'Enter') {
        if (ele.value.indexOf('://') != -1) {
            document.querySelector('iframe').src = ele.value
        } else {
            document.querySelector('iframe').src = `https://www.google.com/search?q=${ele.value}`
        }
    }
}