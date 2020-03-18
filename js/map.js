'use strict';
(function () {
  /*
  * Константы
  * */
  var MAP = document.querySelector('.js-map-container');
  var PIN_SELECTOR = '.js-map-pin-template';
  var WIDTH = MAP.offsetWidth;
  var MAIN_PIN = MAP.querySelector('.js-main-pin');


  // Флаг активности карты. По умолчанию карта выключена
  var mapIsActive = false;

  /*
  * Хэндлеры
  * */
  // Нажатие клавиши Enter на главной метке
  var onMainPinEnterPress = function (evt) {
    if (!mapIsActive) {
      window.utils.isEnterEvent(evt, setActiveMode);
    }
  };
  // Клик по главной метке
  var onMainPinMouseUp = function (evt) {
    if (evt.button === 0 && !mapIsActive) {
      setActiveMode();
    }
    window.form.setAddress();
  };

  /*
  * Функции
  * */
  var _clearMap = function () {
    var pins = MAP.querySelectorAll(PIN_SELECTOR);
    if (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  // Запускает активный режим
  var setActiveMode = function () {
    // Флаг активности
    mapIsActive = true;
    // Убираем overlay
    MAP.classList.remove('map--faded');
    // Добавляем пины на карту
    window.pin.init(MAP);
    // Отключаем хэндлеры на главной метке
    document.removeEventListener('mouseup', onMainPinMouseUp);
    document.removeEventListener('keyup', onMainPinEnterPress);
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
    _clearMap();
    // Выключаем форму
    window.form.disable();
    // Добавляем хэндлеры на главную метку
    MAIN_PIN.addEventListener('mouseup', onMainPinMouseUp);
    MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);
    // Выключает перетаскивание главной метки
    window.utils.dragNdrop.remove();
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
    WIDTH: WIDTH,
    setNonActiveMode: setNonActiveMode,
    isActive: mapIsActive
  };
})();
