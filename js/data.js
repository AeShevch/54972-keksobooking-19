'use strict';
(function () {
  /*
  * Константы
  * */
  // Минимальные стоимости
  var PALACE_MIN_PRICE = 10000;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var BUNGALO_MIN_PRICE = 0;

  var prohibitedGuestCountFor1Room = [2, 3, 0];
  var prohibitedGuestCountFor2Rooms = [3, 0];
  var prohibitedGuestCountFor3Rooms = [0];
  var prohibitedGuestCountFor100Rooms = [1, 2, 3];

  /*
  * Словари
  * */
  // Словарь минимальных стоимостей
  var AdsPricesMap = {
    'palace': PALACE_MIN_PRICE,
    'flat': FLAT_MIN_PRICE,
    'house': HOUSE_MIN_PRICE,
    'bungalo': BUNGALO_MIN_PRICE,
  };
  // Словарь запрещённых значений количества гостей для определённых количеств комнат
  var RoomsToProhibitedGuestsCount = {
    '1': prohibitedGuestCountFor1Room,
    '2': prohibitedGuestCountFor2Rooms,
    '3': prohibitedGuestCountFor3Rooms,
    '100': prohibitedGuestCountFor100Rooms
  };
  // Словарь соответствий типов квартир
  var CardTypesMap = {
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец',
    'flat': 'Квартира',
  };

  /*
  * Интерфейс
  * */
  window.data = {
    cardTypesMap: CardTypesMap,
    adsPricesMap: AdsPricesMap,
    roomsToProhibitedGuestsCount: RoomsToProhibitedGuestsCount
  };
})();
