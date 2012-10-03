/**
 * Cookie and localstorage abstraction
 *
 * @author Monwara LLC / Branko Vukelic <branko@monwara.com>
 * @version 0.0.1
 */

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.memento = factory();
  }

}(this, function() {

  var HAS_LOCALSTORAGE = window.localStorage ? true : false;
  
  var EXPIRE = new Date();
  EXPIRE.setFullYear(EXPIRE.getFullYear() + 1); // in one year

  var REMOVE_DATE = new Date();
  REMOVE_DATE.setFullYear(REMOVE_DATE.getFullYear() - 1);


  var memento = {};

  memento.set = function(key, value) {

    if (!key || !value || key.indexOf(' ') > -1) {
      console.error('Missing key or value, or key with spaces');
      return false;
    }

    key = '_memento_' + key;
    try {
      value = JSON.stringify(value);
    } catch (strErr) {
      value = '';
    }

    console.debug('[' + 
                  (HAS_LOCALSTORAGE ? 'lstore' : 'cookie') +
                  '] <== (' + key + '=' + value + ')');


    if (HAS_LOCALSTORAGE) {
      window.localStorage[key] = value;
      return true;
    } else {
      document.cookie = key + '=' + value + '; expires=' + 
        EXPIRE.toString() + '; path=/';
      return true;
    }
  };

  memento.get = function(key, def) {
    if (!key) { return; }

    key = '_memento_' + key;

    if (HAS_LOCALSTORAGE) {
      try {
        return typeof window.localStorage[key] !== 'undefined' ? 
          JSON.parse(window.localStorage[key]) : def;
      } catch (parseErr) {
        return def;
      }
    } else {
      var cookies = document.cookie.split(';');
      var cookie;
      var item;
      var c;
      for (var i = 0, l = cookies.length; i < l; i++) {
        item = cookies[i];
        c = item.split('=');
        if (c[0] === key) {
          cookie = c[1].replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      if (!cooke) { return def; }
      try {
        return JSON.parse(cookie);
      } catch (parseErr) {
        return def;
      }
    }
  };

  memento.unset = function(key) {
    if (!key) { return; }

    key = '_memento_' + key;

    if (HAS_LOCALSTORAGE) {
      delete window.localStorage[key];
    } else {
      document.cookie = key + '=null;expires=' + REMOVE_DATE +
        ';path=/;secure';
    }
  };

  return memento;

}));
