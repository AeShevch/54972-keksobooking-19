'use strict';
(function () {
  /*
  * Константы
  * */
  // Максимальное количество меток на карте
  var MAX_PINS_COUNT = 5;

  /*
  * Используемые DOM-узлы
  * */
  var filterNode = document.querySelector('.js-map-filter');
  var formNode = filterNode.querySelector('form');

  /*
  * Словари соответствий
  * */
  // Словарь соответствия атрибута names у полей формы ключам в массиве объектов
  var SelectNameToDataKey = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features',
  };
  // Словарь соответствия типа цены к её значению
  var PricesTypeToValue = {
    'low': {
      'min': 0,
      'max': 10000,
    },
    'middle': {
      'min': 10000,
      'max': 50000,
    },
    'high': {
      'min': 50000,
    },
  };

  /*
  * Хэндлеры
  * */
  var _onFilterChange = window.debounce(function () {
    window.pin.reload(_getFilteredData().slice(0, MAX_PINS_COUNT));
  });

  /*
  * Функции
  * */
  // Добавляет хэндлер на изменений фильтров
  var _setHandlers = function () {
    filterNode.addEventListener('change', _onFilterChange);
  };
  // Удаляет хэндлер на изменения фильтров
  var _removeHandlers = function () {
    filterNode.removeEventListener('change', _onFilterChange);
  };

  var resetFilters = function () {
    _removeHandlers();
    // Возвращаем селекты к изначальному значению
    formNode.querySelectorAll('select').forEach(function (select) {
      select.value = 'any';
    });
    //
    formNode.querySelectorAll('[name=features]').forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };
  // Функция фильтрации
  var _filter = function (data, filterData, filterDataKeys) {
    return data.filter(function (ad) {
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
          var offerKey = SelectNameToDataKey[filterFieldKey];

          // Если это цена, то проверяем находится ли она в нужном диапазоне
          // Если нет, то объявление не проходит
          if (filterFieldKey === 'housing-price') {
            var priceRage = PricesTypeToValue[fieldValue];
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
  // Возвращает отфильтрованные данные
  var _getFilteredData = function () {
    // Собираем данные формы фильтров
    var filterData = new FormData(formNode);
    var filterDataKeys = Array.from(filterData.keys());
    // Берём данные меток из модуля pin.js и фльтруем их в соответствии с выбранными фильтрами

    return _filter(window.pin.data, filterData, filterDataKeys);
  };

  // Инициализация модуля
  var init = function () {
    _setHandlers(filterNode);
  };

  /*
  * Интерфейс модуля
  * */
  window.filter = {
    init: init,
    reset: resetFilters,
    maxCount: MAX_PINS_COUNT,
  };
})();
