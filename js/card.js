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
  var _onCardEscPress = function (evt) {
    window.utils.isEscapeEvent(evt, _closeCard);
  };
  // Нажатие Enter на кнопке закрытия карточки
  var _onCardCloseEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, _closeCard);
  };

  /*
  * Функции
  * */
  // Закрывает карточку
  var _closeCard = function (evt) {
    document.querySelector(PIN_CARDS_SELECTOR).classList.add(CARD_MOD_HIDDEN);

    // Удаляем хэндлеры
    // На escEvent у нас нет target, поэтому ищем его сами
    var closeBtn = evt ? evt.target : document.querySelector('.js-hide-card');
    _removeCardHandlers(closeBtn);
  };
  // Добавлят хэндлеры на закрытие карточки
  var _setCardHandlers = function (closeBtn) {
    closeBtn.addEventListener('click', _closeCard);
    closeBtn.addEventListener('keyup', _onCardCloseEnterPress);
    document.addEventListener('keyup', _onCardEscPress);
  };
  // Удаляет хэндлеры на закрытие карточки
  var _removeCardHandlers = function (closeBtn) {
    closeBtn.removeEventListener('click', _closeCard);
    closeBtn.removeEventListener('keyup', _onCardCloseEnterPress);
    document.removeEventListener('keyup', _onCardEscPress);
  };
  // Показывает карточку объявления
  var _insertCard = function (cardFragment) {
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

    var currentAd = window.pin.data[pin.dataset.id];

    // Вставлем в карточку данные
    // Заголовок
    card.querySelector('.js-card-title').textContent = currentAd.offer.title;
    // Адрес
    card.querySelector('.js-card-address').textContent = currentAd.offer.address;
    // Цена
    card.querySelector('.js-card-price').textContent = currentAd.offer.price.toString();
    // Кол-во комнат
    card.querySelector('.js-card-rooms-count').textContent = currentAd.offer.rooms.toString();
    // Кол-во гостей
    card.querySelector('.js-card-guests-count').textContent = currentAd.offer.guests.toString();
    // Время въезда
    card.querySelector('.js-card-checkin').textContent = currentAd.offer.checkin;
    // Время выезда
    card.querySelector('.js-card-checkout').textContent = currentAd.offer.checkout;
    // Описание
    card.querySelector('.js-card-desc').textContent = currentAd.offer.description;
    // Изображение аватара
    card.querySelector('.js-card-avatar').src = currentAd.author.avatar;
    // Тип квартиры
    card.querySelector('.js-card-type').textContent = window.data.cardTypesMap[currentAd.offer.type];

    // Добавляем картинки объявления
    var cardImagesBlock = card.querySelector('.js-card-photo');
    // Модификатор, скрывающий блок с картинками
    var hiddenModificator = 'popup__photos_hidden';
    // Если изображения есть
    if (currentAd.offer.photos.length) {
      // Используем имеющуюся в шаблоне вёрстку изображения как шаблон,
      // чтобы не пришлось вручную создавать тег, добавлять классы, высоту, ширину, alt
      var imagesFragment = document.createDocumentFragment();
      // Добавляем фотографии объявления
      currentAd.offer.photos.forEach(function (photo) {
        var imageHtml = cardImagesBlock.querySelector('img').cloneNode();
        imageHtml.src = photo;
        imagesFragment.appendChild(imageHtml);
      });
      // Очищаем блок и вставлем в него изображения из подготовленного фрагмента и показываем
      cardImagesBlock.innerHTML = '';
      cardImagesBlock.appendChild(imagesFragment);
      cardImagesBlock.classList.remove(hiddenModificator);
    } else {
      // Если изображений нет, то прячем блок
      cardImagesBlock.classList.add(hiddenModificator);
    }

    // Показываем все элементы features, которые у нас есть в массиве
    var featuresBlock = card.querySelector('.js-card-features');
    currentAd.offer.features.forEach(function (feature) {
      featuresBlock.querySelector('.popup__feature--' + feature).classList.remove('popup__feature--hidden');
    });

    // Кнопка закрытия карточки
    var CLOSE_CARD_BTN = card.querySelector('.js-hide-card');

    // Если карточки нет, то вставляем её на страницу и вешаем хэндлеры
    if (!cardIsExists) {
      // заполняем фрагмент
      cardFragment.appendChild(card);
      // Выводим фрагмент на страницу
      _insertCard(cardFragment);

      // Вешаем хэндлеры
      _setCardHandlers(CLOSE_CARD_BTN);
    }

    // Показываем карточку, если она скрыта
    if (cardIsExists && card.classList.contains(CARD_MOD_HIDDEN)) {
      card.classList.remove(CARD_MOD_HIDDEN);
      // Вешаем хэндлеры обратно, так как удалили их при закрытии
      _setCardHandlers(CLOSE_CARD_BTN);
    }
  };

  /*
  * Интерфейс
  * */
  window.card = {
    show: showAdInfoCard
  };
})();
