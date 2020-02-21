'use strict';
(function () {
  // КОНСТАНТЫ
  var MAP = document.querySelector('.js-map-container');
  var WIDTH = MAP.offsetWidth;
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  // Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;
  var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
  var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

  // По умолчанию карта выключена
  var mapIsActive = false;

  // ХЭНДЛЕРЫ
  // Нажатие клавиши Enter на главной метке
  var onMainPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, setActiveMode);
  };
  // Клик по главной метке
  var onMainPinMouseDown = function (evt) {
    if (evt.button === 0) {
      setActiveMode();
    }
    window.form.setAddress();
  };

  // ФУНКЦИИ
  // Возвращает координат главной метки. Если страница неактивно, то возврщает координаты центра страницы
  var getPinCoordinates = function () {
    return {
      x: Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2),
      y: Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (mapIsActive ? MAIN_PIN_HEIGHT : MAIN_PIN_HEIGHT / 2)),
    };
  };
  // Показывает карточку объявления
  var insertCard = function (cardFragment) {
    MAP.insertBefore(cardFragment, MAP.querySelector('.js-map-filter'));
  };
  // Запускает активный режим
  var setActiveMode = function () {
    // TODO При клике на главную метку перезагружаюся пины, нужно удалять хэндлеры в активном режиме
    mapIsActive = true;
    MAP.classList.remove('map--faded');
    // Добавляем пины на карту
    window.pin.init(MAP);
    // Включаем форму
    window.form.enable();
  };

  var init = function () {
    MAIN_PIN.addEventListener('mousedown', onMainPinMouseDown);
    MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);
  };

  init();

  window.map = {
    WIDTH: WIDTH,
    getPinCoordinates: getPinCoordinates,
    insertCard: insertCard,
  };
})();
