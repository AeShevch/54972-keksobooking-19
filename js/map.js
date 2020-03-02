'use strict';
(function () {
  /*
  * Константы
  * */
  var MAP = document.querySelector('.js-map-container');
  var WIDTH = MAP.offsetWidth;
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  // Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;
  var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
  var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

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
  // Возвращает координаты главной метки. Если страница неактивно, то возврщает координаты центра страницы
  var getPinCoordinates = function () {
    return {
      x: Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2),
      y: Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (mapIsActive ? MAIN_PIN_HEIGHT : MAIN_PIN_HEIGHT / 2)),
    };
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
    window.utils.dragNdropInit(MAIN_PIN, MAP);

  };

  /*
  * Инициализация модуля
  * */
  var init = function () {
    MAIN_PIN.addEventListener('mouseup', onMainPinMouseUp);
    MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);
  };

  init();

  /*
  * Интерфейс
  * */
  window.map = {
    WIDTH: WIDTH,
    getPinCoordinates: getPinCoordinates
  };
})();
