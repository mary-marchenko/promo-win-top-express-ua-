"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  // const apiURL = 'https://fav-prom.com/api_express_hr';
  var apiURL = 'https://fav-prom.com/api_express_ua';
  // const apiURL = 'https://fav-prom.com/api_express_ro';

  var resultsTableList = document.querySelector('.tableResults__body');
  var users;
  var checkLink = document.querySelector('#checkLink'),
    ukLeng = document.querySelector('#ukLeng'),
    enLeng = document.querySelector('#enLeng'),
    hrLeng = document.querySelector('#hrLeng'),
    roLeng = document.querySelector('#roLeng');
  var locale = 'uk';
  if (ukLeng) locale = 'uk';
  if (hrLeng) locale = 'hr';
  if (roLeng) locale = 'ro';
  if (enLeng) locale = 'en';
  var i18nData = {};
  window.userId = null;

  // var today = new Date().toISOString();

  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      return res.json();
    })["catch"](function (err) {
      console.error('API request failed:', err);
      reportError(err);
      document.querySelector('.fav-page').style.display = 'none';
      if (window.location.href.startsWith("https://www.favbet.hr/")) {
        window.location.href = '/promocije/promocija/stub/';
      } else {
        window.location.href = '/promos/promo/stub/';
      }
      return Promise.reject(err);
    });
  };

  // request(`/new-translates/${locale}`)
  //     .then(json => {
  //         i18nData = json;
  //         translate();
  //         var mutationObserver = new MutationObserver(function (mutations) {
  //             const shouldSkip = mutations.every(mutation => {
  //                 return mutation.target.closest('.game-container') || mutation.target.closest('.table');
  //             });
  //             if (shouldSkip) return;
  //
  //             translate();
  //         });
  //         mutationObserver.observe(document.getElementById("crazy-promo"), {
  //             childList: true,
  //             subtree: true
  //         });
  //     });

  function loadTranslations() {
    return request("/translates/".concat(locale)).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('crazy-promo'), {
        childList: true,
        subtree: true
      });
    });
  }
  function translate() {
    var elems = document.querySelectorAll('[data-translate]');
    if (elems && elems.length) {
      elems.forEach(function (elem) {
        var key = elem.getAttribute('data-translate');
        elem.innerHTML = translateKey(key);
        elem.removeAttribute('data-translate');
      });
      var host;
      if (window && window.location) {
        host = window.location.host + '';
      }
      if (window && window.location && host.indexOf('favorit') > -1) {
        document.querySelectorAll('.host-ref').forEach(function (el) {
          el.innerHTML = 'favorit.com.ua';
          var a = el.closest('a');
          if (a && a.href.indexOf('favbet') > -1) {
            var href = a.href;
            var afterDomain = href.split('favbet')[1].split('/')[1];
            a.setAttribute('href', 'https://' + host + (afterDomain ? '/' + afterDomain : ''));
          }
        });
      }
      if (locale === 'en') {
        mainPage.classList.add('en');
      }
    }
    refreshLocalizedClass();
  }
  function translateKey(key) {
    if (!key) {
      return;
    }
    return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
  }
  function refreshLocalizedClass(element, baseCssClass) {
    if (!element) {
      return;
    }
    for (var _i = 0, _arr = ['hr', 'en']; _i < _arr.length; _i++) {
      var lang = _arr[_i];
      element.classList.remove(baseCssClass + lang);
    }
    element.classList.add(baseCssClass + locale);
  }
  function reportError(err) {
    var reportData = {
      origin: window.location.href,
      userid: userId,
      errorText: (err === null || err === void 0 ? void 0 : err.error) || (err === null || err === void 0 ? void 0 : err.text) || (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
      type: (err === null || err === void 0 ? void 0 : err.name) || 'UnknownError',
      stack: (err === null || err === void 0 ? void 0 : err.stack) || ''
    };
    fetch('https://fav-prom.com/api-cms/reports/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    })["catch"](console.warn);
  }

  // function translate() {
  //     const elems = document.querySelectorAll('[data-translate]')
  //     if (elems && elems.length) {
  //         elems.forEach(elem => {
  //             const key = elem.getAttribute('data-translate');
  //             elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
  //             elem.removeAttribute('data-translate');
  //         })
  //     }
  // }

  function getData() {
    return Promise.all([request('/users')]);
  }
  var InitPage = function InitPage() {
    getData().then(function (res) {
      users = res[0].sort(function (a, b) {
        return b.points - a.points;
      });
      users = users.sort(function (a, b) {
        return a.date < b.date ? 1 : b.date < a.date ? -1 : 0;
      });
      renderUsers(users);
    });
    translate();
  };

  // InitPage();

  var REQUIRED_USERS_AMOUNT = 7;
  var renderUsers = function renderUsers(users) {
    var finalBoardWrapper = document.querySelector('.tableResults__body');
    finalBoardWrapper.innerHTML = '';
    if (users && users.length) {
      users.forEach(function (user) {
        var userRow = document.createElement('div');
        userRow.classList.add('tableResults__row');
        userRow.innerHTML = "\n                            <div class=\"tableResults__body-col\">".concat(new Date(user.date * 1000).toLocaleString().split(",")[0], "</div>\n                            <div class=\"tableResults__body-col\">").concat(user.userid, "</div>\n                            <div class=\"tableResults__body-col\">").concat(user.points, "</div>\n                            <div class=\"tableResults__body-col\">").concat(user.bonus, "</div>\n            ");
        finalBoardWrapper.append(userRow);
      });
    } else {
      for (var i = 0; i < 7; i++) {
        var userRow = document.createElement('div');
        userRow.classList.add('tableResults__row');
        userRow.innerHTML = "\n                <div class=\"tableResults__body-col\">*******</div>\n                <div class=\"tableResults__body-col\">*******</div>\n                <div class=\"tableResults__body-col\">*******</div>\n                <div class=\"tableResults__body-col\">*******</div>\n            ";
        finalBoardWrapper.append(userRow);
      }
    }
  };
  var title = document.querySelector('.banner__title .normal');
  if (navigator.platform.includes('Win32')) {
    title.classList.add('win-title-style');
  }

  // loadTranslations()
  //     .then(InitPage);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwicmVzdWx0c1RhYmxlTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVzZXJzIiwiY2hlY2tMaW5rIiwidWtMZW5nIiwiZW5MZW5nIiwiaHJMZW5nIiwicm9MZW5nIiwibG9jYWxlIiwiaTE4bkRhdGEiLCJ3aW5kb3ciLCJ1c2VySWQiLCJyZXF1ZXN0IiwibGluayIsImV4dHJhT3B0aW9ucyIsImZldGNoIiwiX29iamVjdFNwcmVhZCIsImhlYWRlcnMiLCJ0aGVuIiwicmVzIiwianNvbiIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInJlcG9ydEVycm9yIiwic3R5bGUiLCJkaXNwbGF5IiwibG9jYXRpb24iLCJocmVmIiwic3RhcnRzV2l0aCIsIlByb21pc2UiLCJyZWplY3QiLCJsb2FkVHJhbnNsYXRpb25zIiwiY29uY2F0IiwidHJhbnNsYXRlIiwibXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJvYnNlcnZlIiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImVsZW0iLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJ0cmFuc2xhdGVLZXkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJob3N0IiwiaW5kZXhPZiIsImVsIiwiYSIsImNsb3Nlc3QiLCJhZnRlckRvbWFpbiIsInNwbGl0Iiwic2V0QXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwiX2kiLCJfYXJyIiwibGFuZyIsInJlbW92ZSIsInJlcG9ydERhdGEiLCJvcmlnaW4iLCJ1c2VyaWQiLCJlcnJvclRleHQiLCJ0ZXh0IiwibWVzc2FnZSIsInR5cGUiLCJuYW1lIiwic3RhY2siLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJnZXREYXRhIiwiYWxsIiwiSW5pdFBhZ2UiLCJzb3J0IiwiYiIsInBvaW50cyIsImRhdGUiLCJyZW5kZXJVc2VycyIsIlJFUVVJUkVEX1VTRVJTX0FNT1VOVCIsImZpbmFsQm9hcmRXcmFwcGVyIiwidXNlciIsInVzZXJSb3ciLCJjcmVhdGVFbGVtZW50IiwiRGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwiYm9udXMiLCJhcHBlbmQiLCJpIiwidGl0bGUiLCJuYXZpZ2F0b3IiLCJwbGF0Zm9ybSIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLENBQUMsWUFBWTtFQUNUO0VBQ0EsSUFBTUEsTUFBTSxHQUFHLHFDQUFxQztFQUNwRDs7RUFFQSxJQUFNQyxnQkFBZ0IsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMscUJBQXFCLENBQUM7RUFFdEUsSUFBSUMsS0FBSztFQUVULElBQU1DLFNBQVMsR0FBR0gsUUFBUSxDQUFDQyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQ2xERyxNQUFNLEdBQUdKLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUMxQ0ksTUFBTSxHQUFHTCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDMUNLLE1BQU0sR0FBR04sUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQzFDTSxNQUFNLEdBQUdQLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUU5QyxJQUFJTyxNQUFNLEdBQUcsSUFBSTtFQUVqQixJQUFJSixNQUFNLEVBQUVJLE1BQU0sR0FBRyxJQUFJO0VBQ3pCLElBQUlGLE1BQU0sRUFBRUUsTUFBTSxHQUFHLElBQUk7RUFDekIsSUFBSUQsTUFBTSxFQUFFQyxNQUFNLEdBQUcsSUFBSTtFQUN6QixJQUFJSCxNQUFNLEVBQUVHLE1BQU0sR0FBRyxJQUFJO0VBRXpCLElBQUlDLFFBQVEsR0FBRyxDQUFDLENBQUM7RUFFakJDLE1BQU0s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QUN0Q0gsS0FBSyxDQUFDekMsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7RUFDMUM7O0VBRUE7RUFDQTtBQUNKLENBQUMsRUFBRSxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIC8vIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfZXhwcmVzc19ocic7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9leHByZXNzX3VhJztcbiAgICAvLyBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX2V4cHJlc3Nfcm8nO1xuXG4gICAgY29uc3QgcmVzdWx0c1RhYmxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZVJlc3VsdHNfX2JvZHknKTtcblxuICAgIGxldCB1c2VycztcblxuICAgIGNvbnN0IGNoZWNrTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGVja0xpbmsnKSxcbiAgICAgICAgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpLFxuICAgICAgICBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyksXG4gICAgICAgIGhyTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNockxlbmcnKSxcbiAgICAgICAgcm9MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvTGVuZycpO1xuXG4gICAgbGV0IGxvY2FsZSA9ICd1ayc7XG5cbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChockxlbmcpIGxvY2FsZSA9ICdocic7XG4gICAgaWYgKHJvTGVuZykgbG9jYWxlID0gJ3JvJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG5cbiAgICB3aW5kb3cudXNlcklkID0gbnVsbDtcblxuICAgIC8vIHZhciB0b2RheSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBmdW5jdGlvbiAobGluaywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSByZXF1ZXN0IGZhaWxlZDonLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXYtcGFnZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5mYXZiZXQuaHIvXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9wcm9tb2NpamUvcHJvbW9jaWphL3N0dWIvJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9zL3Byb21vL3N0dWIvJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gcmVxdWVzdChgL25ldy10cmFuc2xhdGVzLyR7bG9jYWxlfWApXG4gICAgLy8gICAgIC50aGVuKGpzb24gPT4ge1xuICAgIC8vICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgIC8vICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgLy8gICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBzaG91bGRTa2lwID0gbXV0YXRpb25zLmV2ZXJ5KG11dGF0aW9uID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmV0dXJuIG11dGF0aW9uLnRhcmdldC5jbG9zZXN0KCcuZ2FtZS1jb250YWluZXInKSB8fCBtdXRhdGlvbi50YXJnZXQuY2xvc2VzdCgnLnRhYmxlJyk7XG4gICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgaWYgKHNob3VsZFNraXApIHJldHVybjtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmF6eS1wcm9tb1wiKSwge1xuICAgIC8vICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAvLyAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gcmVxdWVzdChgL3RyYW5zbGF0ZXMvJHtsb2NhbGV9YClcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcblxuICAgICAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyYXp5LXByb21vJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpXG4gICAgICAgIGlmIChlbGVtcyAmJiBlbGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGxldCBob3N0O1xuICAgICAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24gJiYgaG9zdC5pbmRleE9mKCdmYXZvcml0JykgPiAtMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ob3N0LXJlZicpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnZmF2b3JpdC5jb20udWEnO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBlbC5jbG9zZXN0KCdhJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhICYmIGEuaHJlZi5pbmRleE9mKCdmYXZiZXQnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBocmVmID0gYS5ocmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJEb21haW4gPSBocmVmLnNwbGl0KCdmYXZiZXQnKVsxXS5zcGxpdCgnLycpWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovLycgKyBob3N0ICsgKGFmdGVyRG9tYWluID8gKCcvJyArIGFmdGVyRG9tYWluKSA6ICcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuXG4gICAgICAgIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUtleShrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCAnKi0tLS1ORUVEIFRPIEJFIFRSQU5TTEFURUQtLS0tKiAgIGtleTogICcgKyBrZXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaExvY2FsaXplZENsYXNzKGVsZW1lbnQsIGJhc2VDc3NDbGFzcykge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGxhbmcgb2YgWydocicsJ2VuJ10pIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShiYXNlQ3NzQ2xhc3MgKyBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzZUNzc0NsYXNzICsgbG9jYWxlKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEVycm9yKGVycikge1xuICAgICAgICBjb25zdCByZXBvcnREYXRhID0ge1xuICAgICAgICAgICAgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHVzZXJpZDogdXNlcklkLFxuICAgICAgICAgICAgZXJyb3JUZXh0OiBlcnI/LmVycm9yIHx8IGVycj8udGV4dCB8fCBlcnI/Lm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InLFxuICAgICAgICAgICAgdHlwZTogZXJyPy5uYW1lIHx8ICdVbmtub3duRXJyb3InLFxuICAgICAgICAgICAgc3RhY2s6IGVycj8uc3RhY2sgfHwgJydcbiAgICAgICAgfTtcblxuICAgICAgICBmZXRjaCgnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpLWNtcy9yZXBvcnRzL2FkZCcsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXBvcnREYXRhKVxuICAgICAgICB9KS5jYXRjaChjb25zb2xlLndhcm4pO1xuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAvLyAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAvLyAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAvLyAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgIC8vICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgIC8vICAgICAgICAgfSlcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGEgKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgcmVxdWVzdCgnL3VzZXJzJyksXG4gICAgICAgIF0pXG4gICAgfVxuXG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgZ2V0RGF0YSgpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIHVzZXJzID0gcmVzWzBdLnNvcnQoKGEsIGIpID0+IGIucG9pbnRzIC0gYS5wb2ludHMpO1xuICAgICAgICAgICAgdXNlcnMgPSB1c2Vycy5zb3J0KChhLGIpID0+IChhLmRhdGUgPCBiLmRhdGUpID8gMSA6ICgoYi5kYXRlIDwgYS5kYXRlKSA/IC0xIDogMCkpO1xuICAgICAgICAgICAgcmVuZGVyVXNlcnModXNlcnMpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEluaXRQYWdlKCk7XG5cbiAgICBjb25zdCBSRVFVSVJFRF9VU0VSU19BTU9VTlQgPSA3O1xuXG4gICAgY29uc3QgcmVuZGVyVXNlcnMgPSAodXNlcnMpID0+IHtcbiAgICAgICAgY29uc3QgZmluYWxCb2FyZFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVSZXN1bHRzX19ib2R5Jyk7XG4gICAgICAgIGZpbmFsQm9hcmRXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGlmICh1c2VycyAmJiB1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlUmVzdWx0c19fcm93Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4ke25ldyBEYXRlKHVzZXIuZGF0ZSAqIDEwMDApLnRvTG9jYWxlU3RyaW5nKCkuc3BsaXQoXCIsXCIpWzBdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZVJlc3VsdHNfX2JvZHktY29sXCI+JHt1c2VyLnVzZXJpZH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVSZXN1bHRzX19ib2R5LWNvbFwiPiR7dXNlci5wb2ludHN9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4ke3VzZXIuYm9udXN9PC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuYXBwZW5kKHVzZXJSb3cpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlUmVzdWx0c19fcm93Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuYXBwZW5kKHVzZXJSb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFubmVyX190aXRsZSAubm9ybWFsJylcblxuICAgIGlmIChuYXZpZ2F0b3IucGxhdGZvcm0uaW5jbHVkZXMoJ1dpbjMyJykpIHtcbiAgICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnd2luLXRpdGxlLXN0eWxlJyk7XG4gICAgfVxuXG4gICAgLy8gbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgLy8gICAgIC50aGVuKEluaXRQYWdlKTtcbn0pKCk7XG5cblxuXG5cblxuXG5cbiJdfQ==
