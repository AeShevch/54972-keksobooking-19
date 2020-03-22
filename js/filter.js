'use strict';
(function () {
  /*
  * Константы
  * */
  var FILTER = document.querySelector('.js-map-filter');
  var FORM = FILTER.querySelector('form');
  // Максимальное количество меток на карте
  var MAX_PINS_COUNT = 5;

  /*
  * Словари соответствий
  * */
  // Словарь соответствия атрибута names у полей формы ключам в массиве объектов
  var selectNameToDataKey = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features',
  };
  // Словарь соответствия типа цены к её значению
  var pricesTypeToValue = {
    'low': {
      'min': 0,
      'max': 10000
    },
    'middle': {
      'min': 10000,
      'max': 50000
    },
    'high': {
      'min': 50000
    }
  };

  /*
  * Хэндлеры
  * */
  var _onFilterChange = window.debounce(function () {
    window.pin.reload(_filter().slice(0, MAX_PINS_COUNT));
  });

  /*
  * Функции
  * */
  // Добавляет хэндлер на изменений фильтров
  var _setHandlers = function () {
    FILTER.addEventListener('change', _onFilterChange);
  };
  // Удаляет хэндлер на изменений фильтров
  var removeHandlers = function () {
    FILTER.removeEventListener('change', _onFilterChange);
  };
  // Функция фильтрации
  var _filter = function () {
    // Собираем данные формы фильтров
    var filterData = new FormData(FORM);
    var filterDataKeys = Array.from(filterData.keys());
    // Берём данные меток из модуля pin.js и фльтруем их в соответствии с выбранными фильтрами
    return window.pin.data.filter(function (ad) {
      // Флаг подходящего под фильтр объявления
      // По-умолчанию true
      var addIsAppropriate = true;
      // Для каждого объявления проверяем все фильтры
      filterDataKeys.forEach(function (filterFieldKey) {
        // Значение поле
        var fieldValue = filterData.get(filterFieldKey);
        // Если значение не любое
        if (fieldValue !== 'any') {
          // Получаем ключ, соответствующий атрибуту «name» поля
          var offerKey = selectNameToDataKey[filterFieldKey];

          // Если это цена, то проверяем находится ли она в нужном диапазоне
          // Если нет, то объявление не проходит
          if (filterFieldKey === 'housing-price') {
            var priceRage = pricesTypeToValue[fieldValue];
            var currentPrice = ad['offer'][offerKey];
            var priceIsOutOfRange = !((priceRage['max'] ? currentPrice < priceRage['max'] : true) && currentPrice >= priceRage['min']);
            if (priceIsOutOfRange) {
              addIsAppropriate = false;
            }
          } else
          // Если это особенность (feature), то смотрим находится ли она в массиве особенностей объявления
          // Если нет, то объявление не проходит
          if (filterFieldKey === 'features' && ad['offer'][offerKey].indexOf(fieldValue) === -1) {
            addIsAppropriate = false;
          } else
          // Если это не особенность, то смотрим соответствует ли это поле значению в объявлении
          // Если нет, то объявление не проходит
          if (filterFieldKey !== 'features' && ad['offer'][offerKey].toString() !== fieldValue) {
            addIsAppropriate = false;
          }
        }
      });

      return addIsAppropriate;
    });
  };

  // Инициализация модуля
  var init = function () {
    _setHandlers(FILTER);
  };

  /*
  * Интерфейс модуля
  * */
  window.filter = {
    init: init,
    removeHandlers: removeHandlers,
    maxCount: MAX_PINS_COUNT
  };
})();
