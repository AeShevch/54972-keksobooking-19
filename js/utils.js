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
  // Перемещение метки
  var _onDragNDropElemMouseDown = function (evt, container) {
    evt.preventDefault();
    var elem = evt.target;
    var dragged = false;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var _removeHandlers = function () {
      document.removeEventListener('mousemove', _onMouseMove);
      document.removeEventListener('mouseup', _onMouseUp);
    };

    var _onMouseMove = function (moveEvt) {
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
        _removeHandlers();
      };

      if (container) {
        container.addEventListener('mouseleave', onContainerMouseleave);
      }
    };

    var _onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      _removeHandlers();

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          elem.removeEventListener('click', onClickPreventDefault);
        };
        elem.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', _onMouseMove);
    document.addEventListener('mouseup', _onMouseUp);
  };

  /*
  * Функции
  * */
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
    isEnterEvent: isEnterEvent,
    isEscapeEvent: isEscapeEvent,
    dragNdrop: {
      init: dragNdropInit,
      remove: dragNdropRemove
    }
  };
})();
