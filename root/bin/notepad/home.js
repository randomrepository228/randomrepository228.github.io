function f1() {
// функция, чтобы сделать текст жирным, используя метод DOM
document.querySelector("#textarea1").style.fontWeight = "bold";
}

function f2() {
// функция, чтобы сделать текст курсивом, используя метод DOM
document.querySelector("#textarea1").style.fontStyle = "italic";
}

function f3() {
// функция для выравнивания текста по левому краю с использованием метода DOM
document.querySelector("#textarea1").style.textAlign = "left";
}

function f4() {
// функция для выравнивания текста по центру с использованием метода DOM
document.querySelector("#textarea1").style.textAlign = "center";
}

function f5() {
// функция для выравнивания текста с право с использованием метода DOM
document.querySelector("#textarea1").style.textAlign = "right";
}

function f6() {
// функция для преобразования текста в верхний регистр с использованием метода DOM
document.querySelector("#textarea1").style.textTransform = "uppercase";
}

function f7() {
// функция для преобразования текста в нижний регистр с использованием метода DOM
document.querySelector("#textarea1").style.textTransform = "lowercase";
}

function f8() {
// функция, чтобы сделать текст заглавным, используя метод DOM
document.querySelector("#textarea1").style.textTransform = "capitalize";
}

function f9() {
// функция, чтобы вернуть текст в нормальное состояние, удалив все примененные методы
// используя метод DOM
document.querySelector("#textarea1").style.fontWeight = "normal";
document.querySelector("#textarea1").style.textAlign = "left";
document.querySelector("#textarea1").style.fontStyle = "normal";
document.querySelector("#textarea1").style.textTransform = "capitalize";
document.querySelector("#textarea1").value = " ";
}