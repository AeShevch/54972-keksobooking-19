'use strict';
(function () {
  /*
  * Словари
  * */
  // Словарь минимальных стоимостей
  var adsPricesMap = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0,
  };
  // Словарь запрещённых значений количества гостей для определённых количеств комнат
  var roomsToProhibitedGuestsCount = {
    '1': [2, 3, 0],
    '2': [3, 0],
    '3': [0],
    '100': [1, 2, 3]
  };
  // Словарь соответствий типов квартир
  var cardTypesMap = {
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец',
    'flat': 'Квартира',
  };

  /*
  * Интерфейс
  * */
  window.data = {
    cardTypesMap: cardTypesMap,
    adsPricesMap: adsPricesMap,
    roomsToProhibitedGuestsCount: roomsToProhibitedGuestsCount
  };
})();
