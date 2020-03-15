'use strict';
(function () {
  /*
  * Константы
  * */
  var MAP = document.querySelector('.js-map-container');
  var PIN_CARDS_SELECTOR = '.js-pin-card';
  var CARD_MOD_HIDDEN = 'map__card_hidden';

  /*
  * Хэндлеры
  * */
  // Нажатие Esc при открытой карточке
  var onCardEscPress = function (evt) {
    window.utils.isEscapeEvent(evt, closeCard);
  };
  // Нажатие Enter на кнопке закрытия карточки
  var onCardCloseEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, closeCard);
  };

  /*
  * Функции
  * */
  // Закрывает карточку
  var closeCard = function () {
    document.querySelector(PIN_CARDS_SELECTOR).classList.add(CARD_MOD_HIDDEN);
    document.removeEventListener('keyup', onCardEscPress);
  };
  // Показывает карточку объявления
  var insertCard = function (cardFragment) {
    MAP.insertBefore(cardFragment, MAP.querySelector('.js-map-filter'));
  };
  // Создаёт новую карточку и вставляет её на страницу
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

    // Id пользователя начинаются с 1, а элементы массива с 0
    var currentAd = window.pin.data[pin.dataset.id];

    // Вставлем в него данные из элемента массива с объявлениями
    card.querySelector('.js-card-title').textContent = currentAd.offer.title;
    card.querySelector('.js-card-address').textContent = currentAd.offer.address;
    card.querySelector('.js-card-price').textContent = currentAd.offer.price.toString();
    card.querySelector('.js-card-rooms-count').textContent = currentAd.offer.rooms.toString();
    card.querySelector('.js-card-guests-count').textContent = currentAd.offer.guests.toString();
    card.querySelector('.js-card-checkin').textContent = currentAd.offer.checkin;
    card.querySelector('.js-card-checkout').textContent = currentAd.offer.checkout;
    card.querySelector('.js-card-desc').textContent = currentAd.offer.description;

    // Добавляем фотографии объявления
    if (currentAd.offer.photos) {
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
    }

    // Подставляем ссылку на изображение аватара
    card.querySelector('.js-card-avatar').src = currentAd.author.avatar;

    // Подставляем значения типа квартиры
    card.querySelector('.js-card-type').textContent = window.data.cardTypesMap[currentAd.offer.type];

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
      insertCard(cardFragment);
    }

    var CLOSE_CARD_BTN = card.querySelector('.js-hide-card');

    CLOSE_CARD_BTN.addEventListener('click', closeCard);
    CLOSE_CARD_BTN.addEventListener('keyup', onCardCloseEnterPress);
    document.addEventListener('keyup', onCardEscPress);

    // Показываем карточку, если она скрыта
    if (cardIsExists && card.classList.contains(CARD_MOD_HIDDEN)) {
      card.classList.remove(CARD_MOD_HIDDEN);
    }
  };

  /*
  * Интерфейс
  * */
  window.card = {
    show: showAdInfoCard
  };
})();
