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
  var onFlatTypeChange = function (evt) {
    changeAdMinPrice(PRICE_FIELD, window.data.adsPricesMap[evt.target.selectedOptions[0].value]);
  };
  // Изменение времени заезда и выезда
  var onTimeChange = function (evt) {
    // Синхонизирует время заезда и выезда
    document.querySelector(TIME_FIELD_SELECTOR + ':not(#' + evt.target.id + ')').value = evt.target.value;
  };
  // Изменение количества комнат
  var onRoomsCountChange = function (evt) {
    setAvailableCapacity(evt.target.value);
  };
  // Изменение количества гостей
  var capacityFieldOnChange = function () {
    checkSelectValidity(CAPACITY_FIELD);
  };

  /*
  * Функции
  * */
  // Задаёт адрес
  var setAddress = function () {
    ADDRESS_FIELD.value = window.map.getPinCoordinates().x + ', ' + window.map.getPinCoordinates().y;
  };
  // Изменяет минимальную стоимость
  var changeAdMinPrice = function (input, minPrice) {
    input.min = minPrice;
    input.placeholder = minPrice;
  };
  // Устанавливает сообщение об ошибке, если выбрана отключенная опция
  var checkSelectValidity = function (select) {
    if (select.selectedOptions[0].disabled) {
      select.setCustomValidity('Выбран некорректный пункт');
    }
  };
  // Отключает неподходящие для типа жилья опции количества гостей
  var setAvailableCapacity = function (rooms) {
    CAPACITY_OPTIONS.forEach(function (option) {
      option.disabled = window.data.roomsToProhibitedGuestsCount[rooms].indexOf(parseInt(option.value, 10)) !== -1;
    });
    checkSelectValidity(CAPACITY_FIELD);
  };
  // Отключает поля формы
  var disableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };
  // Включает поля формы
  var enableFields = function () {
    FIELDS_TO_DISABLE.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
  };
  // Активирует форму
  var enableForm = function () {
    FORM.classList.remove(FORM_DISABLED_MOD);
    setAvailableCapacity(ROOMS_COUNT_FIELD.value);
    enableFields();
    setHandlers();
  };
  // Выключает форму
  var disableForm = function () {
    FORM.classList.add(FORM_DISABLED_MOD);
    disableFields();
    setAddress();
    removeHandlers();
  };
  // Добавляет хэндлеры
  var setHandlers = function () {
    FORM.querySelector('.js-flat-type').addEventListener('change', onFlatTypeChange);
    FORM.querySelectorAll(TIME_FIELD_SELECTOR).forEach(function (timeField) {
      timeField.addEventListener('change', onTimeChange);
    });
    FORM.querySelector('.js-rooms-count-field').addEventListener('change', onRoomsCountChange);
    CAPACITY_FIELD.addEventListener('change', capacityFieldOnChange);
  };
  // Удаляет хэндлеры
  var removeHandlers = function () {
    document.removeEventListener('change', onFlatTypeChange);
    document.removeEventListener('change', onTimeChange);
    document.removeEventListener('change', onRoomsCountChange);
    document.removeEventListener('change', capacityFieldOnChange);
  };

  /*
  * Иницализация модуля
  * */
  var init = function () {
    disableForm();
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
