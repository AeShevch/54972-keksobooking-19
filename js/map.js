'use strict';
(function () {
  var MAP = document.querySelector('.js-map-container');
  var WIDTH = MAP.offsetWidth;
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  // Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;

  var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
  var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

  var getPinCoordinates = function (type) {
    return {
      x: Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2),
      y: Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (type === 'center' ? MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT))
    };
  };

  var setActiveMode = function () {
    window.form.enable();
    MAP.classList.remove('map--faded');
    window.pin.addOnMap(window.data.ads);
    window.pin.setHandlers(MAP);
  };

  var setNonActiveMode = function () {
    window.form.disable();

    MAIN_PIN.addEventListener('mousedown', onMainPinMouseDown);
    MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);

    window.pin.removeHandlers();
  };

  var onMainPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, setActiveMode);
  };

  var onMainPinMouseDown = function (evt) {
    if (evt.button === 0) {
      setActiveMode();
    }
    window.form.setAddress();
  };

  // Переводим страницу в неактивный режим
  setNonActiveMode();
  window.form.setAddress('center');

  window.map = {
    // MAP: MAP,
    WIDTH: WIDTH,
    getPinCoordinates: getPinCoordinates
  };
})();
