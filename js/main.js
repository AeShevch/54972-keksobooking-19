'use strict';

var MAP = document.querySelector('.js-map-container');
var MAP_WIDTH = MAP.offsetWidth;
// Шаблон меток
var TEMPLATE = document.getElementById('pin').content.querySelector('.js-map-pin-template');
// Размер метки
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
// Количество объявлений
var ADS_COUNT = 8;
// Максимальное и минимальное расположение метки по вертикали
var MAX_PIN_POSITION_Y = 630;
var MIN_PIN_POSITION_Y = 130;

var ENTER_KEY = 'Enter';

var FORM = document.querySelector('.ad-form');
var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
var TIME_FIELD_SELECTOR = '.js-time-field';
var PRICE_FIELD = document.querySelector('.js-ad-price');
var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);

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
  return arr[getGetRandomNumber(0, arr.length)];
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
  return Math.floor(minValue + Math.random() * (maxValue + 1 - minValue));
};


function createPinHtml(ad) {
  var pinHtml = TEMPLATE.cloneNode(true);

  // Выставляем положение элемента на карте
  pinHtml.style.top = ad.location.y + PIN_HEIGHT + 'px';
  pinHtml.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';

  // Задаём атрибуты изображению на метке
  var img = pinHtml.querySelector('img');
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;

  fragment.appendChild(pinHtml);
}

var addPinsOnMap = function (ads) {
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
};

var setAddress = function (type) {
  var coordinatesX = Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2);
  var coordinatesY = Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (type === 'center' ?  MAIN_PIN_HEIGHT / 2 : MAIN_PIN_HEIGHT));

  ADDRESS_FIELD.value = coordinatesX + ', ' + coordinatesY;
};

var onPinMouseDown = function (evt) {
  if (evt.button === 0) {
    setActiveMode();
  }
  setAddress();
};

var onPinEnterPress = function (evt) {
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
  MAIN_PIN.addEventListener('keyup', onPinEnterPress);
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

var onRoomsCountChange = function (evt) {
  switch (evt.target.value) {
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
};

// var createCards = function () {
//   // Вставляем информацию о предложении
// // Записываем вёрстку шаблона в константу
//   var CARD_TEMPLATE = document.getElementById('card').content.querySelector('.js-card-template');
//   var cardFragment = document.createDocumentFragment();
//
//   // Клонируем шаблон
//   var cardHtml = CARD_TEMPLATE.cloneNode(true);
//   // Вставлем в него данные из первого элемента массива с объявлениями
//   // В следующем задании тут будут цикл, который будет вставлять данные для всех элементов
//   cardHtml.querySelector('.js-card-title').textContent = ads[0].offer.title;
//   cardHtml.querySelector('.js-card-address').textContent = ads[0].offer.address;
//   cardHtml.querySelector('.js-card-price').textContent = ads[0].offer.price.toString();
//   cardHtml.querySelector('.js-card-rooms-count').textContent = ads[0].offer.rooms.toString();
//   cardHtml.querySelector('.js-card-guests-count').textContent = ads[0].offer.guests.toString();
//   cardHtml.querySelector('.js-card-checkin').textContent = ads[0].offer.checkin;
//   cardHtml.querySelector('.js-card-checkout').textContent = ads[0].offer.checkout;
//   cardHtml.querySelector('.js-card-desc').textContent = ads[0].offer.description;
//
//   // Используем имеющуюся в шаблоне вёрстку изображения как шаблон изображений, чтобы не писать вёрстку в JS
//   var cardImagesBlock = cardHtml.querySelector('.js-card-photo');
//   var imagesFragment = document.createDocumentFragment();
//   ads[0].offer.photos.forEach(function (photo) {
//     var imageHtml = cardImagesBlock.querySelector('img').cloneNode();
//     imageHtml.src = photo;
//     imagesFragment.appendChild(imageHtml);
//   });
//   // Очищаем блок и вставлем в него изображения
//   cardImagesBlock.innerHTML = '';
//   cardImagesBlock.appendChild(imagesFragment);
//
//   // Подставляем ссылку на изображение аватара
//   cardHtml.querySelector('.js-card-avatar').src = ads[0].author.avatar;
//
//   // Подставляем значения типа квартиры
//   var cardType = '';
//   switch (ads[0].offer.type) {
//     case 'bungalo':
//       cardType = 'Бунгало';
//       break;
//     case 'house':
//       cardType = 'Дом';
//       break;
//     case 'palace':
//       cardType = 'Дворец';
//       break;
//     default:
//       cardType = 'Квартира';
//       break;
//   }
//   cardHtml.querySelector('.js-card-type').textContent = cardType;
//
//   // Показываем все элементы features, которые у нас есть в массиве
//   var featuresBlock = cardHtml.querySelector('.js-card-features');
//   ads[0].offer.features.forEach(function (feature) {
//     featuresBlock.querySelector('.popup__feature--' + feature).classList.remove('popup__feature--hidden');
//   });
//
//   // заполняем фрагмент
//   cardFragment.appendChild(cardHtml);
//   // Выводим фрагмент на страницу
//   MAP.insertBefore(cardFragment, MAP.querySelector('.js-map-filter'));
// };

// Конструктор объектов рекламных объявлений
function Advertisement(userId) {
  this.author = {
    'avatar': 'img/avatars/user' + '0' + userId + '.png',
  };

  this.offer = {
    'title': getRandomElem(TITLES),
    'address': getGetRandomNumber(0, 999) + ',' + getGetRandomNumber(0, 999),
    'price': getGetRandomNumber(0, 9999),
    'type': getRandomElem(ROOM_TYPES),
    'rooms': getGetRandomNumber(),
    'guests': getGetRandomNumber(),
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

FORM.querySelector('.js-flat-type').addEventListener('change', onFlatTypeChange);

FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
  timeField.addEventListener('change', onTimeChange);
});

FORM.querySelector('.js-rooms-count-field').addEventListener('change', onRoomsCountChange);
