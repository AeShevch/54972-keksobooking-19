'use strict';
(function () {
  // КОНСТАНТЫ
  var FORM = document.querySelector('.ad-form');
  var FORM_DISABLED_MOD = 'ad-form--disabled';
  var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
  var TIME_FIELD_SELECTOR = '.js-time-field';
  var PRICE_FIELD = document.querySelector('.js-ad-price');
  var ADDRESS_FIELD = document.getElementById('address');
  var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
  var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);
  var ROOMS_COUNT_FIELD = FORM.querySelector('.js-rooms-count-field');

  var setAddress = function () {
    ADDRESS_FIELD.value = window.map.getPinCoordinates().x + ', ' + window.map.getPinCoordinates().y;
  };

  var changeAdMinPrice = function (input, minPrice) {
    input.min = minPrice;
    input.placeholder = minPrice;
  };

  var onFlatTypeChange = function (evt) {
    changeAdMinPrice(PRICE_FIELD, window.data.adsPricesMap[evt.target.selectedOptions[0].value]);
  };

  var onTimeChange = function (evt) {
    document.querySelector(TIME_FIELD_SELECTOR + ':not(#' + evt.target.id + ')').value = evt.target.value;
  };

  var checkSelectValidity = function (select) {
    if (select.selectedOptions[0].disabled) {
      select.setCustomValidity('Выбран некорректный пункт');
    }
  };

  var setAvailableCapacity = function (rooms) {
    CAPACITY_OPTIONS.forEach(function (option) {
      option.disabled = window.data.roomsToProhibitedGuestsCount[rooms].indexOf(parseInt(option.value, 10)) !== -1;
    });
    checkSelectValidity(CAPACITY_FIELD);
  };

  var onRoomsCountChange = function (evt) {
    setAvailableCapacity(evt.target.value);
  };

  var enableForm = function () {
    FORM.classList.remove(FORM_DISABLED_MOD);
    setAvailableCapacity(ROOMS_COUNT_FIELD.value);
    enableFields();
  };

  var disableForm = function () {
    FORM.classList.add(FORM_DISABLED_MOD);
    disableFields();
    setAddress();
  };
  var disableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };

  var enableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
  };
  var capacityFieldOnChange = function () {
    checkSelectValidity(CAPACITY_FIELD);
  };
  FORM.querySelector('.js-flat-type').addEventListener('change', onFlatTypeChange);

  FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
    timeField.addEventListener('change', onTimeChange);
  });

  FORM.querySelector('.js-rooms-count-field').addEventListener('change', onRoomsCountChange);

  CAPACITY_FIELD.addEventListener('change', capacityFieldOnChange);

  var init = function () {
    disableForm();
    setAddress();
  };

  init();

  window.form = {
    enable: enableForm,
    disable: disableForm,
    setAddress: setAddress
  };
})();
