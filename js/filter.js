'use strict';
(function () {
  var FILTER = document.querySelector('.js-map-filter');
  var MAX_PINS_COUNT = 5;
  var selectNameToDataKey = {
    'housing-type': 'type'
  };

  var _onFilterChange = function (evt) {
    _filter(window.pin.data, selectNameToDataKey[evt.target.name], evt.target.value);
  };

  var _setHandlers = function () {
    FILTER.addEventListener('change', _onFilterChange);
  };

  var removeHandlers = function () {
    FILTER.removeEventListener('change', _onFilterChange);
  };

  var _filter = function (data, key, value) {
    window.pin.reload(data.filter(function (item) {
      return item['offer'][key] === value;
    }));
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
