'use strict';
(function () {
  /*
  * Константы
  * */
  var MAP = document.querySelector('.js-map-container');
  var PIN_SELECTOR = '.js-map-pin-template';
  var URL = 'https://js.dump.academy/keksobooking/data';
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

  var pinsData = {};

  /*
  * Хэндлеры
  * */
  var onPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, function () {
      window.card.show(evt.currentTarget);
    });
  };

  var onAjaxError = function (error) {
    throw new Error(error);
  };

  /*
  * Функции
  * */
  // Создаёт вёрстку меток во фрагменте
  var createPinHtml = function (ad, index) {
    var pinHtml = TEMPLATE.cloneNode(true);
    pinHtml.dataset.id = index;

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
  var addPinsOnMap = function (ads) {
    window.pin.data = ads;
    // Создаём по метке на каждое объявление
    ads.forEach(function (ad, index) {
      createPinHtml(ad, index);
    });

    // Вставляем полученный фрагмент на карту
    PINS_CONTAINER.appendChild(fragment);
    setHandlers(MAP);
  };
  // Добавляет хэндлеры на клик и нажатие enter по меткам
  var setHandlers = function () {
    MAP.querySelectorAll(PIN_SELECTOR).forEach(function (pin) {
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
  var init = function () {
    window.ajax(URL, addPinsOnMap, onAjaxError, 'GET');
    // addPinsOnMap(window.data.ads);
  };

  /*
  * Интерфейс
  * */
  window.pin = {
    init: init,
    data: pinsData,
    positionY: {
      MAX: MAX_POSITION_Y,
      MIN: MIN_POSITION_Y
    }
  };

})();
