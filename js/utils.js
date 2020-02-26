'use strict';
(function () {
  /*
  * Константы
  * */
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  /*
  * Хэндлеры
  * */
  // Хэндлер на нажатие клавиши Esc, принимает параметрами эвент и функцию, которую необходимо выполнить
  var isEscapeEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };
  // Хэндлер на нажатие клавиши Enter, принимает параметрами эвент и функцию, которую необходимо выполнить
  var isEnterEvent = function (evt, action) {
    if (evt.key === ENTER_KEY) {
      action();
    }
  };

  /*
  * Функции
  * */
  // Возвращает случайный элемент массива
  var getRandomElem = function (arr) {
    return arr[getGetRandomNumber(0, arr.length - 1)];
  };
  // Возвращает копию массива случайной длинны
  var getRandomNumberOfItems = function (arr) {
    var startRndIndex = getGetRandomNumber(1, arr.length);
    var endRndIndex = getGetRandomNumber(startRndIndex, arr.length);
    return arr.slice(startRndIndex, endRndIndex);
  };
  // Возвращает случайное число в указанном диапазоне
  var getGetRandomNumber = function (min, max) {
    var minValue = min ? min : 0;
    var maxValue = max ? max : 9;

    return Math.floor(minValue + Math.random() * (maxValue + 1 - minValue));
  };


  /*
  * Интерфейс
  * */
  window.utils = {
    ESC_KEY: ESC_KEY,
    ENTER_KEY: ENTER_KEY,
    isEnterEvent: isEnterEvent,
    isEscapeEvent: isEscapeEvent,
    getRandomElem: getRandomElem,
    getRandomNumberOfItems: getRandomNumberOfItems,
    getGetRandomNumber: getGetRandomNumber,
  };
})();
