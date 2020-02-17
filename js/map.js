'use strict';
(function () {
  var MAP = document.querySelector('.js-map-container');
  var WIDTH = MAP.offsetWidth;
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  // Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;

  var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
  var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

  var coordinatesX = Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2);
  var coordinatesY = Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (type === 'center' ? MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT));

  var setActiveMode = function () {
    window.form.enable();
    window.form.fields.enable();

    MAP.classList.remove('map--faded');

    window.pin.addOnMap(window.data.ads);

  };

  var setNonActiveMode = function () {
    window.form.disable();
    window.form.fields.disable();

    setAddress();

    MAIN_PIN.addEventListener('mousedown', onPinMouseDown);
    MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);

    document.removeEventListener('click', showAdInfoCard);
    document.removeEventListener('keydown', onPinEnterPress);
  };

  var onMainPinEnterPress = function (evt) {
    if (evt.key === ENTER_KEY) {
      setActiveMode();
    }
  };

  var showAdInfoCard = function (pin) {
    var card = document.querySelector(PIN_CARDS_SELECTOR);
    var cardIsExists = true;

    // Если карточки ещё нет на странице, то берём её из шаблона
    if (!card) {
      cardIsExists = false;
      var CARD_TEMPLATE = document.getElementById('card').content.querySelector(PIN_CARDS_SELECTOR);
      var cardFragment = document.createDocumentFragment();
      // Клонируем шаблон
      card = CARD_TEMPLATE.cloneNode(true);
    }

    // Показываем карточку, если она скрыта
    if (cardIsExists && card.classList.contains(CARD_MOD_HIDDEN)) {
      card.classList.remove(CARD_MOD_HIDDEN);
    }

    // Id пользователя начинаются с 1, а элементы массива с 0
    var currentAd = ads[pin.dataset.id - 1];

    // Вставлем в него данные из элемента массива с объявлениями
    card.querySelector('.js-card-title').textContent = currentAd.offer.title;
    card.querySelector('.js-card-address').textContent = currentAd.offer.address;
    card.querySelector('.js-card-price').textContent = currentAd.offer.price.toString();
    card.querySelector('.js-card-rooms-count').textContent = currentAd.offer.rooms.toString();
    card.querySelector('.js-card-guests-count').textContent = currentAd.offer.guests.toString();
    card.querySelector('.js-card-checkin').textContent = currentAd.offer.checkin;
    card.querySelector('.js-card-checkout').textContent = currentAd.offer.checkout;
    card.querySelector('.js-card-desc').textContent = currentAd.offer.description;

    // Используем имеющуюся в шаблоне вёрстку изображения как шаблон изображений, чтобы не писать вёрстку в JS
    var cardImagesBlock = card.querySelector('.js-card-photo');
    var imagesFragment = document.createDocumentFragment();
    currentAd.offer.photos.forEach(function (photo) {
      var imageHtml = cardImagesBlock.querySelector('img').cloneNode();
      imageHtml.src = photo;
      imagesFragment.appendChild(imageHtml);
    });
    // Очищаем блок и вставлем в него изображения
    cardImagesBlock.innerHTML = '';
    cardImagesBlock.appendChild(imagesFragment);

    // Подставляем ссылку на изображение аватара
    card.querySelector('.js-card-avatar').src = currentAd.author.avatar;

    // Подставляем значения типа квартиры
    card.querySelector('.js-card-type').textContent = getCardTypeText(currentAd.offer.type);

    // Показываем все элементы features, которые у нас есть в массиве
    var featuresBlock = card.querySelector('.js-card-features');

    currentAd.offer.features.forEach(function (feature) {
      featuresBlock.querySelector('.popup__feature--' + feature).classList.remove('popup__feature--hidden');
    });

    // Если карточки нет, то вставляем её на страницу
    if (!cardIsExists) {
      // заполняем фрагмент
      cardFragment.appendChild(card);
      // Выводим фрагмент на страницу
      MAP.insertBefore(cardFragment, MAP.querySelector('.js-map-filter'));
    }

    var CLOSE_CARD_BTN = card.querySelector('.js-hide-card');

    CLOSE_CARD_BTN.addEventListener('click', closeCard);
    CLOSE_CARD_BTN.addEventListener('keyup', onCardCloseEnterPress);
    document.addEventListener('keyup', onCardEscPress);
  };


  // Переводим страницу в неактивный режим
  setNonActiveMode();
  setAddress('center');

  window.map = {
    // MAP: MAP,
    WIDTH: WIDTH,
  };
})();
