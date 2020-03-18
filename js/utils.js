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

  var _onDragNDropElemMouseDown = function (evt, container) {
    evt.preventDefault();
    var elem = evt.target;
    var dragged = false;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var removeHandlers = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      elem.style.top = (elem.offsetTop - shift.y) + 'px';
      elem.style.left = (elem.offsetLeft - shift.x) + 'px';

      var onContainerMouseleave = function () {
        removeHandlers();
      };

      if (container) {
        container.addEventListener('mouseleave', onContainerMouseleave);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      removeHandlers();

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          elem.removeEventListener('click', onClickPreventDefault);
        };
        elem.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /*
  * Функции
  * */
  // Возвращает случайный элемент массива
  var getRandomElem = function (arr) {
    return arr[getGetRandomNumber(0, arr.length - 1)];
  };
  // Возвращает ключ случайного элемента объекта
  var getRandomObjectKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[getGetRandomNumber(0, keys.length - 1)];
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
  // Запускает перетаскивание элемента, указанного в параметре elem при клике на элемент
  var dragNdropInit = function (elem, container) {
    elem.addEventListener('mousedown', function (evt) {
      _onDragNDropElemMouseDown(evt, container);
    });
  };

  var dragNdropRemove = function () {
    document.removeEventListener('mousedown', _onDragNDropElemMouseDown);
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
    getRandomObjectKey: getRandomObjectKey,
    dragNdrop: {
      init: dragNdropInit,
      remove: dragNdropRemove
    }
  };
})();
