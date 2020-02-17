'use strict';
(function () {
  var FORM = document.querySelector('.ad-form');
  var FORM_DISABLED_MOD = 'ad-form--disabled';
  var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
  var TIME_FIELD_SELECTOR = '.js-time-field';
  var PRICE_FIELD = document.querySelector('.js-ad-price');
  var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
  var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);
  var DEFAULT_CAPACITY = '1';

  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  var ONE_GUEST_OPTION_VALUE = '1';
  var TWO_GUESTS_OPTION_VALUE = '2';
  var NOT_FOR_GUESTS_OPTION_VALUE = '0';

  var ONE_ROOM_OPTION_VALUE = '1';
  var TWO_ROOMS_OPTION_VALUE = '2';
  var THREE_ROOMS_OPTION_VALUE = '3';
  var HUNDRED_ROOM_OPTION_VALUE = '100';


  var ADDRESS_FIELD = document.getElementById('address');

  var setAddress = function (type) {


    ADDRESS_FIELD.value = coordinatesX + ', ' + coordinatesY;
  };
  var changeAdMinPrice = function (input, minPrice) {
    input.min = minPrice;
    input.placeholder = minPrice;
  };

  var onFlatTypeChange = function (evt) {
    switch (evt.target.selectedOptions[0].value) {
      case 'bungalo':
        changeAdMinPrice(PRICE_FIELD, BUNGALO_MIN_PRICE);
        break;
      case 'flat':
        changeAdMinPrice(PRICE_FIELD, FLAT_MIN_PRICE);
        break;
      case 'house':
        changeAdMinPrice(PRICE_FIELD, HOUSE_MIN_PRICE);
        break;
      case 'palace':
        changeAdMinPrice(PRICE_FIELD, PALACE_MIN_PRICE);
        break;
      default:
        throw new Error('Некорректное значение поля «Тип жилья»');
    }
  };

  var onTimeChange = function (evt) {
    document.querySelector(TIME_FIELD_SELECTOR + ':not(#' + evt.target.id + ')').value = evt.target.value;
  };

  var checkSelectValidity = function (select) {
    if (select.selectedOptions[0].disabled) {
      select.setCustomValidity('Выбран некорректный пункт');
    }
  };

  var setAvailableCapacity = function (value) {
    switch (value) {
      case ONE_ROOM_OPTION_VALUE:
        CAPACITY_OPTIONS.forEach(function (option) {
          option.disabled = option.value !== ONE_GUEST_OPTION_VALUE;
        });
        break;
      case TWO_ROOMS_OPTION_VALUE:
        CAPACITY_OPTIONS.forEach(function (option) {
          option.disabled = !(option.value === ONE_GUEST_OPTION_VALUE || option.value === TWO_GUESTS_OPTION_VALUE);
        });
        break;
      case THREE_ROOMS_OPTION_VALUE:
        CAPACITY_OPTIONS.forEach(function (option) {
          option.disabled = option.value === NOT_FOR_GUESTS_OPTION_VALUE;
        });
        break;
      case HUNDRED_ROOM_OPTION_VALUE:
        CAPACITY_OPTIONS.forEach(function (option) {
          option.disabled = option.value !== NOT_FOR_GUESTS_OPTION_VALUE;
        });
        break;
      default:
        throw new Error('Некорректное значение поля «Количество комнат»');
    }
    checkSelectValidity(CAPACITY_FIELD);
  };

  var onRoomsCountChange = function (evt) {
    setAvailableCapacity(evt.target.value);
  };

  var getCardTypeText = function (cardType) {
    switch (cardType) {
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      case 'flat':
        return 'Квартира';
      default:
        throw new Error('Некорректный тип квартиры');
    }
  };
  var enableForm = function () {
    FORM.classList.remove(FORM_DISABLED_MOD);
  };

  var disableForm = function () {
    FORM.classList.add(FORM_DISABLED_MOD);
  };
  var disableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
  };

  var enableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };
  var capacityFieldOnChange = function () {
    checkSelectValidity(CAPACITY_FIELD);
  };
  setAvailableCapacity(DEFAULT_CAPACITY);
  FORM.querySelector('.js-flat-type').addEventListener('change', onFlatTypeChange);

  FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
    timeField.addEventListener('change', onTimeChange);
  });

  FORM.querySelector('.js-rooms-count-field').addEventListener('change', onRoomsCountChange);

  CAPACITY_FIELD.addEventListener('change', capacityFieldOnChange);

  window.form = {
    enable: enableForm,
    disable: disableForm,
    fields: {
      disable: disableFields,
      enable: enableFields
    }
  };
})();
