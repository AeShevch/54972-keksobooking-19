'use strict';
(function () {
  var FILTER = document.querySelector('.js-map-filter');
  var HOUSING_TYPE_SELECT = FILTER.getElementById('housing-type');
  var URL = 'https://js.dump.academy/keksobooking/data';

  var _onAjaxError = function (error) {
    throw new Error(error);
  };

  var _onAjaxSuccess = function (request) {

  };

  var _onFilterChange = function (evt) {
    if (evt.target === HOUSING_TYPE_SELECT) {
      var value = evt.target.value;
      window.ajax(URL, _onAjaxSuccess, _onAjaxError);
    }
  };

  var _setHandlers = function () {
    FILTER.addEventListener('change', _onFilterChange);
  };

  var _removeHandlers = function () {
    FILTER.removeEventListener('change', _onFilterChange);
  };
  var _filter = function (data) {
    console.log();
    console.log('click');
    window.pin.reload(data);
  };

  var init = function () {
    _setHandlers();
  };

  init();

})();
