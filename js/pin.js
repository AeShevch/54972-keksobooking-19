'use strict';
(function () {
  /*
  * Константы
  * */
  var PIN_SELECTOR = '.js-map-pin-template';
  var PINS_CONTAINER = document.querySelector('.map__pins');
  // Шаблон меток
  var TEMPLATE = document.getElementById('pin').content.querySelector(PIN_SELECTOR);
  // Размер метки
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  // Максимальное и минимальное расположение метки по вертикали
  var MAX_POSITION_Y = 630;
  var MIN_POSITION_Y = 130;

  // Фрагмент для меток
  var fragment = document.createDocumentFragment();

  /*
  * Хэндлеры
  * */
  var onPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, function () {
      window.card.show(evt.currentTarget);
    });
  };

  /*
  * Функции
  * */
  // Создаёт вёрстку меток во фрагменте
  var createPinHtml = function (ad) {
    var pinHtml = TEMPLATE.cloneNode(true);

    pinHtml.dataset.id = ad.userId;

    // Выставляем положение элемента на карте
    pinHtml.style.top = ad.location.y + PIN_HEIGHT + 'px';
    pinHtml.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';

    // Задаём атрибуты изображению на метке
    var img = pinHtml.querySelector('img');
    img.src = ad.author.avatar;
    img.alt = ad.offer.title;

    fragment.appendChild(pinHtml);
  };
  // Добавляем метки на карту
  var addPinsOnMap = function () {
    // Создаём по метке на каждое объявление
    window.data.ads.forEach(function (ad) {
      createPinHtml(ad);
    });

    // Вставляем полученный фрагмент на карту
    PINS_CONTAINER.appendChild(fragment);
  };
  // Добавляет хэндлеры на клик и нажатие enter по меткам
  var setHandlers = function (mapSelector) {
    mapSelector.querySelectorAll(PIN_SELECTOR).forEach(function (pin) {
      pin.addEventListener('click', function () {
        window.card.show(pin);
      });
      pin.addEventListener('keydown', function () {
        onPinEnterPress(pin);
      });
    });
  };

  /*
  * Инициализация модуля
  * */
  var init = function (mapSelector) {
    addPinsOnMap(window.data.ads);
    setHandlers(mapSelector);
  };

  /*
  * Интерфейс
  * */
  window.pin = {
    init: init,
    positionY: {
      MAX: MAX_POSITION_Y,
      MIN: MIN_POSITION_Y
    }
  };

})();
