'use strict';
(function () {
  var PIN_CARDS_SELECTOR = '.js-pin-card';
  var CARD_MOD_HIDDEN = 'map__card_hidden';


  var closeCard = function () {
    document.querySelector(PIN_CARDS_SELECTOR).classList.add(CARD_MOD_HIDDEN);
    document.removeEventListener('keyup', onCardEscPress);
  };

  var onCardEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      closeCard();
    }
  };

  var onCardCloseEnterPress = function (evt) {
    if (evt.key === ENTER_KEY) {
      closeCard();
    }
  };
})();
