'use strict';
(function () {
  var FILTER = document.querySelector('.js-map-filter');
  var FORM = FILTER.querySelector('form');
  var MAX_PINS_COUNT = 5;
  var selectNameToDataKey = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features',
  };

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

  var _onFilterChange = function () {
    window.pin.reload(_filter().slice(0, MAX_PINS_COUNT));
  };

  var _setHandlers = function () {
    FILTER.addEventListener('change', _onFilterChange);
  };

  var removeHandlers = function () {
    FILTER.removeEventListener('change', _onFilterChange);
  };

  var _filter = function () {
    var filterData = new FormData(FORM);

    return window.pin.data.filter(function (item) {
      for (var field of filterData.entries()) {

        if (field[1] === 'any') {
          continue;
        }

        var offerKey = selectNameToDataKey[field[0]];

        if (field[0] === 'housing-price') {
          var priceRage = pricesTypeToValue[field[1]];
          var currentPrice = item['offer'][offerKey];

          return (priceRage['max'] ? currentPrice < priceRage['max'] : true) && currentPrice >= priceRage['min'];
        }

        if (field[0] === 'features' && item['offer'][offerKey].indexOf(field[1]) === -1) {
          return false
        } else if (field[0] !== 'features' && item['offer'][offerKey].toString() !== field[1]) {
          return false;
        }

      }
      return true;
    });
  };

  var init = function () {
    _setHandlers(FILTER);
  };

  window.filter = {
    init: init,
    removeHandlers: removeHandlers,
    maxCount: MAX_PINS_COUNT
  };
})();
