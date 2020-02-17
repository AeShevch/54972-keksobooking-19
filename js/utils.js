'use strict';
(function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

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

  window.utils = {
    getRandomElem: getRandomElem,
    getRandomNumberOfItems: getRandomNumberOfItems,
    getGetRandomNumber: getGetRandomNumber,
    ESC_KEY: ESC_KEY,
    ENTER_KEY: ENTER_KEY
  };
})();
