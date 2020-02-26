'use strict';
(function () {
  // Массив объектов объявлений
  var ads = [];

  // TODO Точно это нужно?
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

  var adsPricesMap = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0,
  };

  var roomsToProhibitedGuestsCount = {
    '1': [2, 3, 0],
    '2': [3, 0],
    '3': [0],
    '100': [1, 2, 3]
  };

  // Количество объявлений
  var ADS_COUNT = 8;

  // Конструктор объектов рекламных объявлений
  function Advertisement(userId) {
    this.userId = userId;
    this.author = {
      'avatar': 'img/avatars/user' + '0' + userId + '.png',
    };

    this.offer = {
      'title': window.utils.getRandomElem(TITLES),
      'address': window.utils.getGetRandomNumber(0, 999) + ',' + window.utils.getGetRandomNumber(0, 999),
      'price': window.utils.getGetRandomNumber(0, 9999),
      'type': window.utils.getRandomElem(ROOM_TYPES),
      'rooms': window.utils.getGetRandomNumber(1),
      'guests': window.utils.getGetRandomNumber(1),
      'checkin': window.utils.getRandomElem(TIMES),
      'checkout': window.utils.getRandomElem(TIMES),
      'features': window.utils.getRandomNumberOfItems(FEATURES),
      'description': 'description',
      'photos': this.getRandomPhotos(),
    };

    this.location = {
      'x': window.utils.getGetRandomNumber(0, window.map.WIDTH),
      'y': window.utils.getGetRandomNumber(window.pin.positionY.MIN, window.pin.positionY.MAX),
    };
  }

  // Возвращает изображения со случайным индексом
  Advertisement.prototype.getRandomPhotos = function () {
    var arr = [];
    for (var i = 1; i <= window.utils.getGetRandomNumber(1, 3); i++) {
      arr.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
    }
    return arr;
  };

  // Создаём массив с указанным количеством объявлений
  for (var i = 1; i <= ADS_COUNT; i++) {
    ads.push(new Advertisement(i));
  }

  var cardTypesMap = {
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец',
    'flat': 'Квартира',
  };

  window.data = {
    ads: ads,
    cardTypesMap: cardTypesMap,
    adsPricesMap: adsPricesMap,
    roomsToProhibitedGuestsCount: roomsToProhibitedGuestsCount
  };
})();