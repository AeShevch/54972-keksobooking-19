'use strict';
(function () {
  /*
  * Константы
  * */
  var PIN_SELECTOR = '.js-map-pin-template';
  var URL = 'https://js.dump.academy/keksobooking/data';
  // Размер метки
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  /*
  * Используемые DOM-узлы
  * */
  var mapNode = document.querySelector('.js-map-container');
  var pinsContainerNode = document.querySelector('.map__pins');

  // Шаблон меток
  var pinTemplate = document.getElementById('pin').content.querySelector(PIN_SELECTOR);

  // Фрагмент для меток
  var fragment = document.createDocumentFragment();

  /*
  * Хэндлеры
  * */
  // Нажатия Enter при фокусе на пине
  var _onPinEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, function () {
      window.card.show(evt.currentTarget);
    });
  };
  // Событие при ошибке получения данных
  var _onAjaxError = function (error) {
    throw new Error(error);
  };
  // Событие при успешном получении данных
  var _onAjaxSuccess = function (request) {
    var ads = request;
    // Добавляем Id к каждому объявлению
    ads.forEach(function (ad, index) {
      ads[index]['id'] = index;
    });
    _addPinsOnMap(request.slice(0, window.filter.maxCount));
    window.pin.data = request;
  };

  /*
  * Функции
  * */
  // Создаёт вёрстку меток во фрагменте
  var _createPinHtml = function (ad) {
    var pinHtml = pinTemplate.cloneNode(true);
    pinHtml.dataset.id = ad.id;

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
  var _addPinsOnMap = function (ads) {
    // Создаём по метке на каждое объявление
    ads.forEach(function (ad) {
      _createPinHtml(ad);
    });

    // Вставляем полученный фрагмент на карту
    pinsContainerNode.appendChild(fragment);
    _setHandlers(mapNode);
  };
  // Добавляет хэндлеры на клик и нажатие enter по меткам
  var _setHandlers = function () {
    mapNode.querySelectorAll(PIN_SELECTOR).forEach(function (pin) {
      pin.addEventListener('click', function () {
        window.card.show(pin);
      });
      pin.addEventListener('keydown', function () {
        _onPinEnterPress(pin);
      });
    });
  };
  // Очишает карту и добавляет новые пины
  var reloadPins = function (ads) {
    window.map.clear();
    _addPinsOnMap(ads);
  };

  /*
  * Инициализация модуля
  * */
  var init = function () {
    window.ajax(URL, _onAjaxSuccess, _onAjaxError);
  };

  /*
  * Интерфейс
  * */
  window.pin = {
    init: init,
    reload: reloadPins
  };

})();
