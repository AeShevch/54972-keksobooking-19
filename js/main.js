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
  for (var i = 0; i <= getGetRandomNumber(1); i++) {
    arr.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return arr;
};

// Создаём массив с указанным количеством объявлений
for (var i = 1; i <= ADS_COUNT; i++) {
  ads.push(new Advertisement(i));
}

// Включаем карту
MAP.classList.remove('map--faded');

// Создаём по метке на каждое объявление
ads.forEach(function (ad) {
  createPinHtml(ad);
});

// Вставляём полученный фрашмент на карту
document.querySelector('.map__pins').appendChild(fragment);

