// function addTray(id, trayicon, tray, options){
//     let newTray = document.createElement("div")
//     newTray.className = `dock-br aero shadow n${id} tray`
//     newTray.windowid = id
//     newTray.style.width = tray.width + "px"
//     newTray.style.height = tray.height + "px"
//     newTray.style.display = "none"
//     newTray.setAttribute("name", tray.title)
//     newTray.innerHTML =
//     `
//     <div class="content">
//         ${tray.innerhtml}
//     </div>
//     `
//     trays.append(newTray)
//     newTray = document.createElement("div")
//     newTray.className = `trayicon n${id}`
//     newTray.style.width = trayicon.width + "px"
//     newTray.innerHTML =
//     `
//     <div style="width: 79px;" onclick="parent.showTray(parent.getTray(${id}))"></div>
//     ${trayicon.innerhtml}
//     `
//     trayicons.append(newTray)
//     broadcast("newprocess|" + id)
// }
// function showTray(tray){
//     if (tray == activetray){
//         tray.style.display = "none"
//         activetray = undefined
//         return
//     }
//     try{
//         activetray.style.display = "none"
//     } catch (e) {}
//     activetray = tray
//     activetray.style.display = "block"
// }
// function formatMonth(date){
//     return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
// }
// function formatWeekday(date){
//     return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] // why does it start with sunday and not monday aaaaaaaaaaaaaa
// }
// function padTo2Digits(num) {
//     return num.toString().padStart(2, '0');
// }
// function formatTime(date) {
//     return [date.getHours(), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(':');
// }
// let clockContainer = document.querySelector(".winda-c-tc")
// let weekday        = clockContainer.querySelector(".wd")
// let exactTime      = clockContainer.querySelector(".et")
// let hour           = clockContainer.querySelector(".h")
// let minute         = clockContainer.querySelector(".m")
// let second         = clockContainer.querySelector(".s")
// let datetime       = clockContainer.querySelector(".dt")
// function a(){
//     const time = new Date()
//     datetime.innerHTML = `${time.getDate()} ${formatMonth(time)} ${time.getFullYear()} г.`
//     const weekday2 = formatWeekday(time)
//     if (weekday2 != weekday.innerHTML) weekday.innerHTML = weekday2
//     exactTime.innerHTML = formatTime(time)
//     seconds = new Date().getSeconds()*6;
//     minutes = new Date().getMinutes()*6;
//     hours = new Date().getHours()*30+(minutes/10);
//     if (hours > 360) hours -= 360
//     hour.style.transform = `rotate(${hours}deg)`
//     minute.style.transform = `rotate(${minutes}deg)`
//     second.style.transform = `rotate(${seconds}deg)`
// }
// setInterval(a, 100);
// function clockTray(){
// let nowDate = new Date(),
//     nowDateNumber = nowDate.getDate(),
//     nowMonth = nowDate.getMonth(),
//     nowYear = nowDate.getFullYear(),
//     monthContainer = clockContainer.getElementsByClassName('month-name')[0],
//     yearContainer = clockContainer.getElementsByClassName('year-name')[0],
//     daysContainer = clockContainer.getElementsByClassName('days')[0],
//     prev = clockContainer.getElementsByClassName('prev')[0],
//     next = clockContainer.getElementsByClassName('next')[0],
//     monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// function setMonthCalendar(year, month) {
//     let monthDays = new Date(year, month + 1, 0).getDate(),
//         monthPrefix = new Date(year, month, 0).getDay(),
//         monthDaysText = '';
//     monthContainer.textContent = monthName[month];
//     yearContainer.textContent = year;
//     daysContainer.innerHTML = '';
//     if (monthPrefix > 0) {
//         for (let i = 1; i <= monthPrefix; i++) {
//             monthDaysText += '<li></li>';
//         }
//     }
//     for (let i = 1; i <= monthDays; i++) {
//         monthDaysText += '<li>' + i + '</li>';
//     }
//     daysContainer.innerHTML = monthDaysText;
//     if (month == nowMonth && year == nowYear) {
//         days = daysContainer.getElementsByTagName('li');
//         days[monthPrefix + nowDateNumber - 1].classList.add('date-now');
//     }
// }
// setMonthCalendar(nowYear, nowMonth);
// prev.onclick = function () {
//     let curDate = new Date(yearContainer.textContent, monthName.indexOf(monthContainer.textContent));
//     curDate.setMonth(curDate.getMonth() - 1);
//     let curYear = curDate.getFullYear(),
//         curMonth = curDate.getMonth();
//     setMonthCalendar(curYear, curMonth);
// }
// next.onclick = function () {
//     let curDate = new Date(yearContainer.textContent, monthName.indexOf(monthContainer.textContent));
//     curDate.setMonth(curDate.getMonth() + 1)
//     let curYear = curDate.getFullYear(),
//         curMonth = curDate.getMonth()
//     setMonthCalendar(curYear, curMonth);
// }
// }
// clockTray()
// addEventListener("changetaskbardir", (e) => {
//     trays.className = trays.className.replace("taskbar-bottom", "taskbar-" + e.detail.dir)
//     trays.className = trays.className.replace("taskbar-up", "taskbar-" + e.detail.dir)
//     trays.className = trays.className.replace("taskbar-left", "taskbar-" + e.detail.dir)
//     trays.className = trays.className.replace("taskbar-right", "taskbar-" + e.detail.dir)
// })
// trays.querySelector("input").value = localStorage.volume