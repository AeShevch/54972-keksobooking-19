'use strict';
(function () {
  var PIN_SELECTOR = '.js-map-pin-template';
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

  var addPinsOnMap = function () {
    // Создаём по метке на каждое объявление
    window.data.ads.forEach(function (ad) {
      createPinHtml(ad);
    });

    // Вставляем полученный фрагмент на карту
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var onPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, function () {
      window.card.show(evt.currentTarget);
    });
  };

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

  var removeHandlers = function () {
    document.removeEventListener('click', window.card.show);
    document.removeEventListener('keydown', onPinEnterPress);
  };

  var init = function (mapSelector) {
    addPinsOnMap(window.data.ads);
    setHandlers(mapSelector);
  };

  window.pin = {
    init: init,
    positionY: {
      MAX: MAX_POSITION_Y,
      MIN: MIN_POSITION_Y
    },
    addOnMap: addPinsOnMap,
    setHandlers: setHandlers,
    removeHandlers: removeHandlers
  };

})();
