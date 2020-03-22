'use strict';
(function () {
  /*
  * Константы
  * */
  var MAP = document.querySelector('.js-map-container');
  var PIN_SELECTOR = '.js-map-pin-template';
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  var CARD_SELECTOR = '.js-pin-card';
  var CARD_HIDDEN_MODIFICATOR = 'map__card_hidden';


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
    var pins = MAP.querySelectorAll(PIN_SELECTOR);
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

  // Запускает активный режим
  var _setActiveMode = function () {
    // Флаг активности
    mapIsActive = true;
    // Убираем overlay
    MAP.classList.remove('map--faded');
    // Добавляем пины на карту
    window.pin.init(MAP);
    // Инициализируем фильтры
    window.filter.init();
    // Отключаем хэндлеры на главной метке
    MAIN_PIN.removeEventListener('mouseup', _onMainPinMouseUp);
    MAIN_PIN.removeEventListener('keyup', _onMainPinEnterPress);
    // Включаем форму
    window.form.enable();
    // Включает перетаскивание главной метки
    window.utils.dragNdrop.init(MAIN_PIN, MAP);
  };

  var setNonActiveMode = function () {
    // Флаг активности
    mapIsActive = false;
    // Добавляем overlay
    MAP.classList.add('map--faded');
    // Удаляем все пины
    clearMap();
    // Выключаем форму
    window.form.disable();
    // Добавляем хэндлеры на главную метку
    MAIN_PIN.addEventListener('mouseup', _onMainPinMouseUp);
    MAIN_PIN.addEventListener('keyup', _onMainPinEnterPress);
    // Выключает перетаскивание главной метки
    window.utils.dragNdrop.remove();
    // Удаляем хэндлеры фильтра
    if (window.filter) {
      window.filter.removeHandlers();
    }
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
