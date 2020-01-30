'use strict';

var map = document.querySelector('.js-map-container');
var mapWidth = map.offsetWidth;

var roomTypes = [
  'palace',
  'flat',
  'house',
  'bungalo',
];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

var times = [
  '12:00',
  '13:00',
  '14:00',
];

// Возвращает случайный элемент массива
var getRandomElem = function (arr) {
  return arr[getGetRandomNumber(0, arr.length)];
};

// Возвращает копию массива случайной длинны
var getRandomNumberOfItems = function (arr) {
  return arr.slice(getGetRandomNumber(1, arr.length));
};

// Возвращает случайное число в указанном диапазоне
var getGetRandomNumber = function (min, max) {
  var minValue = min ? min : 0;
  var maxValue = max ? max : 9;
  return Math.floor(minValue + Math.random() * (maxValue + 1 - minValue));
};

// Конструктор объектов рекламных объявлений
function Advertisement(userId) {
  this.author = {
    'avatar': 'img/avatars/user' + '0' + userId + '.png',
  };

  this.offer = {
    'title': 'title',
    'address': '600, 350',
    'price': 999,
    'type': getRandomElem(roomTypes),
    'rooms': 1,
    'guests': 2,
    'checkin': getRandomElem(times),
    'checkout': getRandomElem(times),
    'features': getRandomNumberOfItems(features),
    'description': 'description',
    'photos': this.getRandomPhotos(),
  };

  this.location = {
    'x': getGetRandomNumber(0, mapWidth),
    'y': getGetRandomNumber(130, 630),
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
var ADS_COUNT = 8;
var ads = [];
for (var i = 1; i <= ADS_COUNT; i++) {
  ads.push(new Advertisement(i));
}

// Включаем карту
map.classList.remove('map--faded');

// Создаём вёрстку используя данные из массива ads
var fragment = document.createDocumentFragment();
var template = document.getElementById('pin').content.querySelector('.js-map-pin-template');

// Размер метки
var pinWidth = 50;
var pinHeight = 70;

ads.forEach(function (ad) {
  createPinHtml(ad);
});

function createPinHtml(ad) {
  var pinHtml = template.cloneNode(true);

  // Выставляем положение элемента на карте
  pinHtml.style.top = ad.location.y + pinHeight + 'px';
  pinHtml.style.left = ad.location.x - pinWidth / 2 + 'px';

  // Задаём атрибуты изображению на метке
  var img = pinHtml.querySelector('img');
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;

  fragment.appendChild(pinHtml);
}

// Вставляём полученный фрашмент на карту
document.querySelector('.map__pins').appendChild(fragment);

