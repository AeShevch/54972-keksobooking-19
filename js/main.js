'use strict';

var MAP = document.querySelector('.js-map-container');
var MAP_WIDTH = MAP.offsetWidth;

var PIN_SELECTOR = '.js-map-pin-template';
// Шаблон меток
var TEMPLATE = document.getElementById('pin').content.querySelector(PIN_SELECTOR);
// Размер метки
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
// Количество объявлений
var ADS_COUNT = 8;
// Максимальное и минимальное расположение метки по вертикали
var MAX_PIN_POSITION_Y = 630;
var MIN_PIN_POSITION_Y = 130;

var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';

var FORM = document.querySelector('.ad-form');
var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
var TIME_FIELD_SELECTOR = '.js-time-field';
var PRICE_FIELD = document.querySelector('.js-ad-price');
var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);
var DEFAULT_CAPACITY = '1';

var BUNGALO_MIN_PRICE = 0;
var FLAT_MIN_PRICE = 1000;
var HOUSE_MIN_PRICE = 5000;
var PALACE_MIN_PRICE = 10000;

var ONE_GUEST_OPTION_VALUE = '1';
var TWO_GUESTS_OPTION_VALUE = '2';
var NOT_FOR_GUESTS_OPTION_VALUE = '0';

var ONE_ROOM_OPTION_VALUE = '1';
var TWO_ROOMS_OPTION_VALUE = '2';
var THREE_ROOMS_OPTION_VALUE = '3';
var HUNDRED_ROOM_OPTION_VALUE = '100';

var MAIN_PIN = MAP.querySelector('.js-main-pin');
var PIN_CARDS_SELECTOR = '.js-pin-card';
var CARD_MOD_HIDDEN = 'map__card_hidden';

// Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
var MAIN_PIN_POINTER_HEIGHT = 22;

var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

var ADDRESS_FIELD = document.getElementById('address');

var ROOM_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo',
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

var TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

var TITLES = [
  'Calm House near Shinjuku/Shibuya',
  'New design capsule hotel (co-ed, no lock)',
  'Japanese-style room that can relax',
  'Authentic Japanese Room',
  '10 min to Shinjuku. A Japanese style house.',
  'Koala Guest House, Opened July 20, 2016!',
  'Asakusa Private Guest Room',
  'A cozy private space! Mixed Dormitory with Wi-Fi',
  'apartment hotel TASU TOCO',
];

// Массив объектов объявлений
var ads = [];

// Фрагмент для меток
var fragment = document.createDocumentFragment();

// Возвращает случайный элемент массива
var getRandomElem = function (arr) {
  var temp = arr[getGetRandomNumber(0, arr.length - 1)];
  return temp;
};

// Возвращает копию массива случайной длинны
var getRandomNumberOfItems = function (arr) {
  var startRndIndex = getGetRandomNumber(1, arr.length);
  var endRndIndex = getGetRandomNumber(startRndIndex, arr.length);
  return arr.slice(startRndIndex, endRndIndex);
};

// Возвращает случайное число в указанном диапазоне
var getGetRandomNumber = function (min, max) {
  var minValue = min ? min : 0;
  var maxValue = max ? max : 9;

  var temp = Math.floor(minValue + Math.random() * (maxValue + 1 - minValue));
  return temp;
};

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
  ads.forEach(function (ad) {
    createPinHtml(ad);
  });

  // Вставляем полученный фрагмент на карту
  document.querySelector('.map__pins').appendChild(fragment);
};

var setActiveMode = function () {
  FIELDS_TO_DISABLE.forEach(function (fieldset) {
    fieldset.removeAttribute('disabled');
  });

  MAP.classList.remove('map--faded');
  FORM.classList.remove('ad-form--disabled');

  addPinsOnMap(ads);

  MAP.querySelectorAll(PIN_SELECTOR).forEach(function (pin) {
    pin.addEventListener('click', function () {
      showAdInfoCard(pin);
    });
    pin.addEventListener('keydown', function () {
      onPinEnterPress(pin);
    });
  });
};

var onPinEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    showAdInfoCard(evt);
  }
};

var setAddress = function (type) {
  var coordinatesX = Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2);
  var coordinatesY = Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (type === 'center' ? MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT));

  ADDRESS_FIELD.value = coordinatesX + ', ' + coordinatesY;
};

var onPinMouseDown = function (evt) {
  if (evt.button === 0) {
    setActiveMode();
  }
  setAddress();
};

var onMainPinEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    setActiveMode();
  }
};

var setNonActiveMode = function () {
  FIELDS_TO_DISABLE.forEach(function (fieldset) {
    fieldset.setAttribute('disabled', 'disabled');
  });

  setAddress();

  MAIN_PIN.addEventListener('mousedown', onPinMouseDown);
  MAIN_PIN.addEventListener('keyup', onMainPinEnterPress);

  document.removeEventListener('click', showAdInfoCard);
  document.removeEventListener('keydown', onPinEnterPress);
};

var changeAdMinPrice = function (input, minPrice) {
  input.min = minPrice;
  input.placeholder = minPrice;
};

var onFlatTypeChange = function (evt) {
  switch (evt.target.selectedOptions[0].value) {
    case 'bungalo':
      changeAdMinPrice(PRICE_FIELD, BUNGALO_MIN_PRICE);
      break;
    case 'flat':
      changeAdMinPrice(PRICE_FIELD, FLAT_MIN_PRICE);
      break;
    case 'house':
      changeAdMinPrice(PRICE_FIELD, HOUSE_MIN_PRICE);
      break;
    case 'palace':
      changeAdMinPrice(PRICE_FIELD, PALACE_MIN_PRICE);
      break;
    default:
      throw new Error('Некорректное значение поля «Тип жилья»');
  }
};

var onTimeChange = function (evt) {
  document.querySelector(TIME_FIELD_SELECTOR + ':not(#' + evt.target.id + ')').value = evt.target.value;
};

var checkSelectValidity = function (select) {
  if (select.selectedOptions[0].disabled) {
    select.setCustomValidity('Выбран некорректный пункт');
  }
};

var setAvailableCapacity = function (value) {
  switch (value) {
    case ONE_ROOM_OPTION_VALUE:
      CAPACITY_OPTIONS.forEach(function (option) {
        option.disabled = option.value !== ONE_GUEST_OPTION_VALUE;
      });
      break;
    case TWO_ROOMS_OPTION_VALUE:
      CAPACITY_OPTIONS.forEach(function (option) {
        option.disabled = !(option.value === ONE_GUEST_OPTION_VALUE || option.value === TWO_GUESTS_OPTION_VALUE);
      });
      break;
    case THREE_ROOMS_OPTION_VALUE:
      CAPACITY_OPTIONS.forEach(function (option) {
        option.disabled = option.value === NOT_FOR_GUESTS_OPTION_VALUE;
      });
      break;
    case HUNDRED_ROOM_OPTION_VALUE:
      CAPACITY_OPTIONS.forEach(function (option) {
        option.disabled = option.value !== NOT_FOR_GUESTS_OPTION_VALUE;
      });
      break;
    default:
      throw new Error('Некорректное значение поля «Количество комнат»');
  }
  checkSelectValidity(CAPACITY_FIELD);
};

var onRoomsCountChange = function (evt) {
  setAvailableCapacity(evt.target.value);
};

var getCardTypeText = function (cardType) {
  switch (cardType) {
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    default:
      throw new Error('Некорректный тип квартиры');
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

var closeCard = function () {
  document.querySelector(PIN_CARDS_SELECTOR).classList.add(CARD_MOD_HIDDEN);
  document.removeEventListener('keyup', onCardEscPress);
};

var onCardEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    closeCard();
  }
};

var onCardCloseEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    closeCard();
  }
};

var capacityFieldOnChange = function () {
  checkSelectValidity(CAPACITY_FIELD);
};

// Конструктор объектов рекламных объявлений
function Advertisement(userId) {
  this.userId = userId;
  this.author = {
    'avatar': 'img/avatars/user' + '0' + userId + '.png',
  };

  this.offer = {
    'title': getRandomElem(TITLES),
    'address': getGetRandomNumber(0, 999) + ',' + getGetRandomNumber(0, 999),
    'price': getGetRandomNumber(0, 9999),
    'type': getRandomElem(ROOM_TYPES),
    'rooms': getGetRandomNumber(1),
    'guests': getGetRandomNumber(1),
    'checkin': getRandomElem(TIMES),
    'checkout': getRandomElem(TIMES),
    'features': getRandomNumberOfItems(FEATURES),
    'description': 'description',
    'photos': this.getRandomPhotos(),
  };

  this.location = {
    'x': getGetRandomNumber(0, MAP_WIDTH),
    'y': getGetRandomNumber(MIN_PIN_POSITION_Y, MAX_PIN_POSITION_Y),
  };
}

// Возвращает изображения со случайным индексом
Advertisement.prototype.getRandomPhotos = function () {
  var arr = [];
  for (var i = 1; i <= getGetRandomNumber(1, 3); i++) {
    arr.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return arr;
};

// Создаём массив с указанным количеством объявлений
for (var i = 1; i <= ADS_COUNT; i++) {
  ads.push(new Advertisement(i));
}

// Переводим страницу в неактивный режим
setNonActiveMode();
setAddress('center');
setAvailableCapacity(DEFAULT_CAPACITY);
FORM.querySelector('.js-flat-type').addEventListener('change', onFlatTypeChange);

FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
  timeField.addEventListener('change', onTimeChange);
});

FORM.querySelector('.js-rooms-count-field').addEventListener('change', onRoomsCountChange);

CAPACITY_FIELD.addEventListener('change', capacityFieldOnChange);
