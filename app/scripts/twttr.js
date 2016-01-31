/* eslint no-underscore-dangle: 0 */
(function () {
  'use strict';
  window.twttr = (function (d, s, id) {
    var fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return window.twttr;
    }
    var js = d.createElement(s);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
    var t = {
      _e: [],
      ready: function (f) {
        t._e.push(f);
      }
    };
    return window.twttr || t;
  }(document, 'script', 'twitter-wjs'));

})();
