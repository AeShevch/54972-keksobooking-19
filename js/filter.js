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
      window.pin.reload(_filter().slice(0, MAX_PINS_COUNT))
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

    // Берём данные меток из модуля pin.js и фльтруем их в соответствии с выбранными фильтрами
    return window.pin.data.filter(function (item) {
      // Для каждого объявления проверяем все фильтры
      for (var field of filterData.entries()) {
        // Если значение поля «any», то пропускаем его
        if (field[1] === 'any') {
          continue;
        }
        // Получаем ключ, соответствующий атрибуту «name» поля
        var offerKey = selectNameToDataKey[field[0]];

        // Если это цена, то проверяем находится ли она в нужном диапазоне
        if (field[0] === 'housing-price') {
          var priceRage = pricesTypeToValue[field[1]];
          var currentPrice = item['offer'][offerKey];

          return (priceRage['max'] ? currentPrice < priceRage['max'] : true) && currentPrice >= priceRage['min'];
        }

        // Если это особенность (feature), то смотрим находится ли она в массиве особенностей объявления
        // Если нет, то пропускаем объявление
        if (field[0] === 'features' && item['offer'][offerKey].indexOf(field[1]) === -1) {
          return false
        } else
          // Если это не особенность, то смотрим соответствует ли это поле значению в объявлении
          // Если нет, то пропускаем объявление
          if (field[0] !== 'features' && item['offer'][offerKey].toString() !== field[1]) {
          return false;
        }
      }
      // Если мы дошли до сюда, значит все проверки пройдены - добавляем элемент в итоговый массив
      return true;
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
