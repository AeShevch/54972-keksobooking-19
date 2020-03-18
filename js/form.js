'use strict';
(function () {
  /*
  * Константы
  * */
  var FORM = document.querySelector('.ad-form');
  var URL = 'https://js.dump.academy/keksobooking';
  var FORM_DISABLED_MOD = 'ad-form--disabled';
  var FIELDS_TO_DISABLE = document.querySelectorAll('.js-disable-on-load');
  var TIME_FIELD_SELECTOR = '.js-time-field';
  var PRICE_FIELD = document.querySelector('.js-ad-price');
  var ADDRESS_FIELD = document.getElementById('address');
  var CAPACITY_FIELD = document.querySelector('.js-capacity-field');
  var CAPACITY_OPTIONS = [].slice.call(CAPACITY_FIELD.options);
  var ROOMS_COUNT_FIELD = FORM.querySelector('.js-rooms-count-field');
  var SUCCESS_MESSAGE_BLOCK = 'success';
  var ERROR_MESSAGE_BLOCK = 'error';

  var FLAT_TYPE_SELECT = FORM.querySelector('.js-flat-type');
  var TIME_SELECTS = FORM.querySelectorAll(TIME_FIELD_SELECTOR);
  var ROOMS_COUNT_SELECT = FORM.querySelector('.js-rooms-count-field');


  var MAP = document.querySelector('.js-map-container');
  var MAIN_PIN = MAP.querySelector('.js-main-pin');
  // Так как указатель метки псевдоэлементом, мы не можем измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;
  var MAIN_PIN_WIDTH = MAIN_PIN.offsetWidth;
  var MAIN_PIN_HEIGHT = MAIN_PIN.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

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
  // Ошибка аякса
  var _onAjaxError = function (error) {
    _showAfterAjaxMessage(ERROR_MESSAGE_BLOCK);
    throw new Error(error);
  };
  // Успешный ответ от сервера
  var _onAjaxSuccess = function () {
    window.map.setNonActiveMode();
    FORM.reset();
    disableForm();
    _showAfterAjaxMessage(SUCCESS_MESSAGE_BLOCK);
  };
  // Отправка формы
  var _onFormSubmit = function (evt) {
    evt.preventDefault();
    var data = new FormData(document.querySelector('.ad-form'));
    window.ajax(URL, _onAjaxSuccess, _onAjaxError, 'POST', data);
  };
  // Нажатие ESC на сообщении после отправки Ajax
  var _onAfterAjaxMessageEscPress = function (evt) {
    window.utils.isEscapeEvent(evt, _closeAfterAjaxMessage);
  };

  /*
  * Функции
  * */
  // Возвращает координаты главной метки. Если страница неактивно, то возврщает координаты центра страницы
  var _getPinCoordinates = function () {
    var mapIsActive = !MAP.classList.contains('map--faded');
    return {
      x: Math.floor(MAIN_PIN.offsetLeft - MAP.offsetLeft + MAIN_PIN_WIDTH / 2),
      y: Math.floor(MAIN_PIN.offsetTop - MAP.offsetTop - (mapIsActive ? MAIN_PIN_HEIGHT : MAIN_PIN_HEIGHT / 2)),
    };
  };
  // Задаёт адрес
  var setAddress = function () {
    ADDRESS_FIELD.value = _getPinCoordinates().x + ', ' + _getPinCoordinates().y;
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
  var disableForm = function () {
    FORM.classList.add(FORM_DISABLED_MOD);
    _disableFields();
    setAddress();
    _removeHandlers();
  };
  // Закрывает сообщение после отправки формы
  var _closeAfterAjaxMessage = function () {
    var errorMessage = document.querySelector('.' + ERROR_MESSAGE_BLOCK);
    var successMessage = document.querySelector('.' + SUCCESS_MESSAGE_BLOCK);
    var messageBlock;
    var messageHiddenModificator;

    if (errorMessage && !errorMessage.classList.contains(ERROR_MESSAGE_BLOCK + '_hidden')) {
      messageBlock = errorMessage;
      messageHiddenModificator = ERROR_MESSAGE_BLOCK + '_hidden';
    } else if (successMessage && !successMessage.classList.contains(ERROR_MESSAGE_BLOCK + '_hidden')) {
      messageBlock = successMessage;
      messageHiddenModificator = SUCCESS_MESSAGE_BLOCK + '_hidden';
    } else {
      throw new Error('Не найдено окон для закрытия');
    }

    messageBlock.classList.add(messageHiddenModificator);

    messageBlock.removeEventListener('click', _closeAfterAjaxMessage);
    document.removeEventListener('keydown', _onAfterAjaxMessageEscPress);
  };
  // Показывает сообщение после отправки формы
  var _showAfterAjaxMessage = function (messageBlockName) {
    var messageBlock = document.querySelector('.' + messageBlockName);
    var messageHtml = document.getElementById(messageBlockName).cloneNode(true).content;

    if (messageBlock) {
      messageBlock.classList.remove(messageBlockName + '_hidden');
    } else {
      document.querySelector('main').prepend(messageHtml);
      messageBlock = document.querySelector('.' + messageBlockName);
    }

    messageBlock.addEventListener('click', _closeAfterAjaxMessage);
    document.addEventListener('keydown', _onAfterAjaxMessageEscPress);
  };
  // Добавляет хэндлеры
  var _setHandlers = function () {
    FLAT_TYPE_SELECT.addEventListener('change', _onFlatTypeChange);
    TIME_SELECTS.forEach(function (timeField) {
      timeField.addEventListener('change', _onTimeChange);
    });
    ROOMS_COUNT_SELECT.addEventListener('change', _onRoomsCountChange);
    CAPACITY_FIELD.addEventListener('change', _capacityFieldOnChange);
    FORM.addEventListener('submit', _onFormSubmit);
  };
  // Удаляет хэндлеры
  var _removeHandlers = function () {
    FLAT_TYPE_SELECT.removeEventListener('change', _onFlatTypeChange);
    TIME_SELECTS.forEach(function (timeField) {
      timeField.removeEventListener('change', _onTimeChange);
    });
    ROOMS_COUNT_SELECT.removeEventListener('change', _onRoomsCountChange);
    CAPACITY_FIELD.removeEventListener('change', _capacityFieldOnChange);
    FORM.removeEventListener('submit', _onFormSubmit);
  };

  /*
  * Инициализация модуля
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
    disable: disableForm,
    setAddress: setAddress
  };
})();
