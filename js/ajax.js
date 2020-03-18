'use strict';
(function () {
  /*
  * Модуль Ajax принимает 5 параметров:
  * url - адрес севрера, на который отправляем запрос;
  * onSuccess – функция, выполняющаяся при успешной отправке. В функцию передаётся ответ сервера.;
  * onError - функция, выполняющаяся при неудачной отправке. В функцию передаётся текст ошибки;
  * type – необязательный параметр. Тип запроса GET/POST. Если параметр не указан, то отправляется GET-запрос;
  * data – необязательный параметр. Передаваемый объект
  * */
  window.ajax = function (url, onSuccess, onError, type, data) {
    var TIMEOUT = 10000;
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(type ? type : 'GET', url);
    xhr.send(data ? data : '');
  };
})();
