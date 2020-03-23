'use strict';
(function () {
  /*
  * Константы
  * */
  var URL = 'https://js.dump.academy/keksobooking';
  var FORM_DISABLED_MOD = 'ad-form--disabled';
  var TIME_FIELD_SELECTOR = '.js-time-field';
  var SUCCESS_MESSAGE_BLOCK = 'success';
  var ERROR_MESSAGE_BLOCK = 'error';
  // Высота псевдоэлемента на укзателе, нужна, чтобы измерить его высоту
  var MAIN_PIN_POINTER_HEIGHT = 22;

  /*
  * Используемые DOM-узлы
  * */
  var formNode = document.querySelector('.ad-form');
  var fieldsToDisableOnLoad = document.querySelectorAll('.js-disable-on-load');
  var priceFieldNode = document.querySelector('.js-ad-price');
  var addressFieldNode = document.getElementById('address');
  var capacityFieldNode = document.querySelector('.js-capacity-field');
  var capacityOptions = [].slice.call(capacityFieldNode.options);
  var roomsCountFieldNode = formNode.querySelector('.js-rooms-count-field');
  var flatTypeSelectNode = formNode.querySelector('.js-flat-type');
  var timeSelectsNodes = formNode.querySelectorAll(TIME_FIELD_SELECTOR);
  var roomsCountSelectNode = formNode.querySelector('.js-rooms-count-field');
  var mapNode = document.querySelector('.js-map-container');
  var mainPinNode = mapNode.querySelector('.js-main-pin');

  /*
  * Переменные
  * */
  var mainPinWidth = mainPinNode.offsetWidth;
  var mainPinHeight = mainPinNode.offsetHeight + MAIN_PIN_POINTER_HEIGHT;

  /*
  * Хэндлеры
  * */
  // Изменение типа жилья
  var _onFlatTypeChange = function (evt) {
    _changeAdMinPrice(priceFieldNode, window.data.adsPricesMap[evt.target.selectedOptions[0].value]);
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
    _checkSelectValidity(capacityFieldNode);
  };
  // Ошибка аякса
  var _onAjaxError = function (error) {
    _showAfterAjaxMessage(ERROR_MESSAGE_BLOCK);
    throw new Error(error);
  };
  // Успешный ответ от сервера
  var _onAjaxSuccess = function () {
    window.map.setNonActiveMode();
    formNode.reset();
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
  // Возвращает координаты главной метки. Если страница неактивна, то возврщает координаты центра страницы
  var _getPinCoordinates = function () {
    var mapIsActive = !mapNode.classList.contains('map--faded');
    return {
      x: Math.floor(mainPinNode.offsetLeft - mapNode.offsetLeft + mainPinWidth / 2),
      y: Math.floor(mainPinNode.offsetTop - mapNode.offsetTop - (mapIsActive ? mainPinHeight : mainPinHeight / 2)),
    };
  };
  // Задаёт адрес
  var setAddress = function () {
    addressFieldNode.value = _getPinCoordinates().x + ', ' + _getPinCoordinates().y;
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
    capacityOptions.forEach(function (option) {
      option.disabled = window.data.roomsToProhibitedGuestsCount[rooms].indexOf(parseInt(option.value, 10)) !== -1;
    });
    _checkSelectValidity(capacityFieldNode);
  };
  // Отключает поля формы
  var _disableFields = function () {
    fieldsToDisableOnLoad.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });
  };
  // Включает поля формы
  var _enableFields = function () {
    fieldsToDisableOnLoad.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });
  };
  // Активирует форму
  var enableForm = function () {
    formNode.classList.remove(FORM_DISABLED_MOD);
    _setAvailableCapacity(roomsCountFieldNode.value);
    _enableFields();
    _setHandlers();
  };
  // Выключает форму
  var disableForm = function () {
    formNode.classList.add(FORM_DISABLED_MOD);
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
    flatTypeSelectNode.addEventListener('change', _onFlatTypeChange);
    timeSelectsNodes.forEach(function (timeField) {
      timeField.addEventListener('change', _onTimeChange);
    });
    roomsCountSelectNode.addEventListener('change', _onRoomsCountChange);
    capacityFieldNode.addEventListener('change', _capacityFieldOnChange);
    formNode.addEventListener('submit', _onFormSubmit);
  };
  // Удаляет хэндлеры
  var _removeHandlers = function () {
    flatTypeSelectNode.removeEventListener('change', _onFlatTypeChange);
    timeSelectsNodes.forEach(function (timeField) {
      timeField.removeEventListener('change', _onTimeChange);
    });
    roomsCountSelectNode.removeEventListener('change', _onRoomsCountChange);
    capacityFieldNode.removeEventListener('change', _capacityFieldOnChange);
    formNode.removeEventListener('submit', _onFormSubmit);
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
