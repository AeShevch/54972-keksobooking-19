'use strict';
(function () {
  /*
  * Константы
  * */
  var FORM = document.querySelector('.ad-form');
  var FORM_DISABLED_MOD = 'ad-form--disabled';
  var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
  var TIME_FIELD_SELECTOR = '.js-time-field';
  var PRICE_FIELD = document.querySelector('.js-ad-price');
  var ADDRESS_FIELD = document.getElementById('address');
  var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
  var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);
  var ROOMS_COUNT_FIELD = FORM.querySelector('.js-rooms-count-field');

  /*
  * Хэндлеры
  * */
  // Изменение типа жилья
  var _onFlatTypeChange = function (evt) {
    _changeAdMinPrice(PRICE_FIELD, window.data.adsPricesMap[evt.target.selectedOptions[0].value]);
  };
  // Изменение времени заезда и выезда
  var _onTimeChange = function (evt) {
    // Синхонизирует время заезда и выезда
    document.querySelector(TIME_FIELD_SELECTOR + ':not(#' + evt.target.id + ')').value = evt.target.value;
  };
  // Изменение количества комнат
  var _onRoomsCountChange = function (evt) {
    _setAvailableCapacity(evt.target.value);
  };
  // Изменение количества гостей
  var _capacityFieldOnChange = function () {
    _checkSelectValidity(CAPACITY_FIELD);
  };

  var _onFormSubmit = function (evt) {
    evt.preventDefault();

  };

  /*
  * Функции
  * */
  // Задаёт адрес
  var setAddress = function () {
    ADDRESS_FIELD.value = window.map.getPinCoordinates().x + ', ' + window.map.getPinCoordinates().y;
  };
  // Изменяет минимальную стоимость
  var _changeAdMinPrice = function (input, minPrice) {
    input.min = minPrice;
    input.placeholder = minPrice;
  };
  // Устанавливает сообщение об ошибке, если выбрана отключенная опция
  var _checkSelectValidity = function (select) {
    if (select.selectedOptions[0].disabled) {
      select.setCustomValidity('Выбран некорректный пункт');
    }
  };
  // Отключает неподходящие для типа жилья опции количества гостей
  var _setAvailableCapacity = function (rooms) {
    CAPACITY_OPTIONS.forEach(function (option) {
      option.disabled = window.data.roomsToProhibitedGuestsCount[rooms].indexOf(parseInt(option.value, 10)) !== -1;
    });
    _checkSelectValidity(CAPACITY_FIELD);
  };
  // Отключает поля формы
  var _disableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };
  // Включает поля формы
  var _enableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
  };
  // Активирует форму
  var enableForm = function () {
    FORM.classList.remove(FORM_DISABLED_MOD);
    _setAvailableCapacity(ROOMS_COUNT_FIELD.value);
    _enableFields();
    _setHandlers();
  };
  // Выключает форму
  var _disableForm = function () {
    FORM.classList.add(FORM_DISABLED_MOD);
    _disableFields();
    setAddress();
    _removeHandlers();
  };
  // Добавляет хэндлеры
  var _setHandlers = function () {
    FORM.querySelector('.js-flat-type').addEventListener('change', _onFlatTypeChange);
    FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
      timeField.addEventListener('change', _onTimeChange);
    });
    FORM.querySelector('.js-rooms-count-field').addEventListener('change', _onRoomsCountChange);
    CAPACITY_FIELD.addEventListener('change', _capacityFieldOnChange);
    FORM.addEventListener('submit', _onFormSubmit);
  };
  // Удаляет хэндлеры
  var _removeHandlers = function () {
    document.removeEventListener('change', _onFlatTypeChange);
    document.removeEventListener('change', _onTimeChange);
    document.removeEventListener('change', _onRoomsCountChange);
    document.removeEventListener('change', _capacityFieldOnChange);
  };

  /*
  * Инициализация модуля
  * */
  var init = function () {
    _disableForm();
    setAddress();
  };

  init();

  /*
  * Интерфейс
  * */
  window.form = {
    enable: enableForm,
    setAddress: setAddress
  };
})();
