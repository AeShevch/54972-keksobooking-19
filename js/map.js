'use strict';
(function () {
  /*
  * Константы
  * */
  var PIN_SELECTOR = '.js-map-pin-template';
  var CARD_SELECTOR = '.js-pin-card';
  var CARD_HIDDEN_MODIFICATOR = 'map__card_hidden';
  var MAIN_PIN_ORIG_LEFT = 570;
  var MAIN_PIN_ORIG_TOP = 375;

  /*
  * Используемые DOM-узлы
  * */
  var mapNode = document.querySelector('.js-map-container');
  var mainPinNode = mapNode.querySelector('.js-main-pin');

  // Флаг активности карты. По умолчанию карта выключена
  var mapIsActive = false;

  /*
  * Хэндлеры
  * */
  // Нажатие клавиши Enter на главной метке
  var _onMainPinEnterPress = function (evt) {
    if (!mapIsActive) {
      window.utils.isEnterEvent(evt, _setActiveMode);
    }
  };
  // Клик по главной метке
  var _onMainPinMouseUp = function (evt) {
    if (evt.button === 0 && !mapIsActive) {
      _setActiveMode();
    }
    window.form.setAddress();
  };

  /*
  * Функции
  * */
  var clearMap = function () {
    var pins = mapNode.querySelectorAll(PIN_SELECTOR);
    if (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
    var card = document.querySelector(CARD_SELECTOR);
    if (card) {
      card.classList.add(CARD_HIDDEN_MODIFICATOR);
    }
  };

  var _returnMainPin = function () {
    mainPinNode.style.top = MAIN_PIN_ORIG_TOP + 'px';
    mainPinNode.style.left = MAIN_PIN_ORIG_LEFT + 'px';
  };

  // Запускает активный режим
  var _setActiveMode = function () {
    // Флаг активности
    mapIsActive = true;
    // Убираем overlay
    mapNode.classList.remove('map--faded');
    // Добавляем пины на карту
    window.pin.init(mapNode);
    // Инициализируем фильтры
    window.filter.init();
    // Отключаем хэндлеры на главной метке
    mainPinNode.removeEventListener('mouseup', _onMainPinMouseUp);
    mainPinNode.removeEventListener('keyup', _onMainPinEnterPress);
    // Включаем форму
    window.form.enable();
    // Включает перетаскивание главной метки
    window.utils.dragNdrop.init(mainPinNode, mapNode);
  };

  var setNonActiveMode = function () {
    // Флаг активности
    mapIsActive = false;
    // Добавляем overlay
    mapNode.classList.add('map--faded');
    // Удаляем все пины
    clearMap();
    // Выключаем форму
    window.form.disable();
    // Добавляем хэндлеры на главную метку
    mainPinNode.addEventListener('mouseup', _onMainPinMouseUp);
    mainPinNode.addEventListener('keyup', _onMainPinEnterPress);
    // Выключает перетаскивание главной метки
    window.utils.dragNdrop.remove(mainPinNode);
    // Удаляем хэндлеры фильтра
    if (window.filter) {
      window.filter.reset();
    }
    // Возвращаем главную метку на место
    _returnMainPin();
  };

  /*
  * Инициализация модуля
  * */
  var init = function () {
    setNonActiveMode();
  };

  init();

  /*
  * Интерфейс
  * */
  window.map = {
    clear: clearMap,
    setNonActiveMode: setNonActiveMode
  };
})();
