"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var apiURL = 'https://allwin-prom.pp.ua/api_express_allwin';
  var resultsTableList = document.querySelector('.table__body');
  var users;
  var mainPage = document.querySelector(".allWin-page"),
    ukLeng = document.querySelector('#ukLeng'),
    enLeng = document.querySelector('#enLeng'),
    hrLeng = document.querySelector('#hrLeng'),
    roLeng = document.querySelector('#roLeng');
  var locale = 'uk';
  // let locale = sessionStorage.getItem("locale") || "uk"

  if (ukLeng) locale = 'uk';
  // if (hrLeng) locale = 'hr';
  // if (roLeng) locale = 'ro';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var translateState = true;
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

      // document.querySelector('.allWin-page').style.display = 'none';
      // if (window.location.href.startsWith("https://www.favbet.hr/")) {
      //     window.location.href = '/promocije/promocija/stub/';
      // } else {
      //     window.location.href = '/promos/promo/stub/';
      // }

      return Promise.reject(err);
    });
  };
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
      if (translateState) {
        elems.forEach(function (elem) {
          var key = elem.getAttribute('data-translate');
          elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
          if (i18nData[key]) {
            elem.removeAttribute('data-translate');
          }
        });
      } else {
        console.log("translation works!");
      }
    }
    if (locale === 'en') {
      mainPage.classList.add('en');
    }
    refreshLocalizedClass();
  }
  function refreshLocalizedClass(element, baseCssClass) {
    if (!element) {
      return;
    }
    for (var _i = 0, _arr = ['uk', 'en']; _i < _arr.length; _i++) {
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

    // fetch('https://fav-prom.com/api-cms/reports/add', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(reportData)
    // }).catch(console.warn);
  }
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
  };
  var REQUIRED_USERS_AMOUNT = 7;
  var renderUsers = function renderUsers(users) {
    var finalBoardWrapper = document.querySelector('.table__body');
    finalBoardWrapper.innerHTML = '';
    if (users && users.length) {
      users.forEach(function (user) {
        var userRow = document.createElement('div');
        userRow.classList.add('table__row');
        userRow.innerHTML = "\n                            <div class=\"table__body-col\">".concat(new Date(user.date * 1000).toLocaleString().split(",")[0], "</div>\n                            <div class=\"table__body-col\">").concat(user.userid, "</div>\n                            <div class=\"table__body-col\">").concat(user.points, "</div>\n                            <div class=\"table__body-col\">").concat(user.bonus, "</div>\n            ");
        finalBoardWrapper.append(userRow);
      });
    } else {
      for (var i = 0; i < 7; i++) {
        var userRow = document.createElement('div');
        userRow.classList.add('table__row');
        userRow.innerHTML = "\n                <div class=\"table__body-col\">*******</div>\n                <div class=\"table__body-col\">*******</div>\n                <div class=\"table__body-col\">*******</div>\n                <div class=\"table__body-col\">*******</div>\n            ";
        finalBoardWrapper.append(userRow);
      }
    }
  };
  loadTranslations().then(InitPage);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwicmVzdWx0c1RhYmxlTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVzZXJzIiwibWFpblBhZ2UiLCJ1a0xlbmciLCJlbkxlbmciLCJockxlbmciLCJyb0xlbmciLCJsb2NhbGUiLCJpMThuRGF0YSIsInRyYW5zbGF0ZVN0YXRlIiwid2luZG93IiwidXNlcklkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJmZXRjaCIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwidGhlbiIsInJlcyIsImpzb24iLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJyZXBvcnRFcnJvciIsIlByb21pc2UiLCJyZWplY3QiLCJsb2FkVHJhbnNsYXRpb25zIiwiY29uY2F0IiwidHJhbnNsYXRlIiwibXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJvYnNlcnZlIiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImVsZW0iLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJyZW1vdmVBdHRyaWJ1dGUiLCJsb2ciLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwiX2kiLCJfYXJyIiwibGFuZyIsInJlbW92ZSIsInJlcG9ydERhdGEiLCJvcmlnaW4iLCJsb2NhdGlvbiIsImhyZWYiLCJ1c2VyaWQiLCJlcnJvclRleHQiLCJ0ZXh0IiwibWVzc2FnZSIsInR5cGUiLCJuYW1lIiwic3RhY2siLCJnZXREYXRhIiwiYWxsIiwiSW5pdFBhZ2UiLCJzb3J0IiwiYSIsImIiLCJwb2ludHMiLCJkYXRlIiwicmVuZGVyVXNlcnMiLCJSRVFVSVJFRF9VU0VSU19BTU9VTlQiLCJmaW5hbEJvYXJkV3JhcHBlciIsInVzZXIiLCJ1c2VyUm93IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNwbGl0IiwiYm9udXMiLCJhcHBlbmQiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLENBQUMsWUFBWTtFQUNULElBQU1BLE1BQU0sR0FBRyw4Q0FBOEM7RUFFN0QsSUFBTUMsZ0JBQWdCLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQztFQUUvRCxJQUFJQyxLQUFLO0VBRVQsSUFBTUMsUUFBUSxHQUFHSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxjQUFjLENBQUM7SUFDbkRHLE1BQU0sR0FBR0osUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQzFDSSxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUMxQ0ssTUFBTSxHQUFHTixRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDMUNNLE1BQU0sR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0VBRTlDLElBQUlPLE1BQU0sR0FBRyxJQUFJO0VBQ2pCOztFQUVBLElBQUlKLE1BQU0sRUFBRUksTUFBTSxHQUFHLElBQUk7RUFDekI7RUFDQTtFQUNBLElBQUlILE1BQU0sRUFBRUcsTUFBTSxHQUFHLElBQUk7RUFFekIsSUFBSUMsUUFBUSxHQUFHLENBQUMsQ0FBQztFQUNqQixJQUFNQyxjQUFjLEdBQUcsSUFBSTtFQUUzQkMsTUFBTSxDQUFDQyxNQUFNLEdBQUcsSUFBSTs7RUFFcEI7O0VBRUEsSUFBTUMsT0FBTyxHQUFHLFNBQVZBLE9BQU9BLENBQWFDLElBQUksRUFBRUMsWUFBWSxFQUFFO0lBQzFDLE9BQU9DLEtBQUssQ0FBQ2xCLE1BQU0sR0FBR2dCLElBQUksRUFBQUcsYUFBQTtNQUN0QkMsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFLGtCQUFrQjtRQUM1QixjQUFjLEVBQUU7TUFDcEI7SUFBQyxHQUNHSCxZQUFZLElBQUksQ0FB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QUMzQ0QsT0FBTyxDQUFDaEMsU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQ25DK0IsT0FBTyxDQUFDbkMsU0FBUywyUUFLcEI7UUFDR2lDLGlCQUFpQixDQUFDUSxNQUFNLENBQUNOLE9BQU8sQ0FBQztNQUNyQztJQUNKO0VBQ0osQ0FBQztFQUVEcEQsZ0JBQWdCLENBQUMsQ0FBQyxDQUNiVCxJQUFJLENBQUNtRCxRQUFRLENBQUM7QUFFdkIsQ0FBQyxFQUFFLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vYWxsd2luLXByb20ucHAudWEvYXBpX2V4cHJlc3NfYWxsd2luJztcblxuICAgIGNvbnN0IHJlc3VsdHNUYWJsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHknKTtcblxuICAgIGxldCB1c2VycztcblxuICAgIGNvbnN0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hbGxXaW4tcGFnZVwiKSxcbiAgICAgICAgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpLFxuICAgICAgICBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyksXG4gICAgICAgIGhyTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNockxlbmcnKSxcbiAgICAgICAgcm9MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvTGVuZycpO1xuXG4gICAgbGV0IGxvY2FsZSA9ICd1ayc7XG4gICAgLy8gbGV0IGxvY2FsZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikgfHwgXCJ1a1wiXG5cbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIC8vIGlmIChockxlbmcpIGxvY2FsZSA9ICdocic7XG4gICAgLy8gaWYgKHJvTGVuZykgbG9jYWxlID0gJ3JvJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgY29uc3QgdHJhbnNsYXRlU3RhdGUgPSB0cnVlO1xuXG4gICAgd2luZG93LnVzZXJJZCA9IG51bGw7XG5cbiAgICAvLyB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBUEkgcmVxdWVzdCBmYWlsZWQ6JywgZXJyKTtcblxuICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKGVycik7XG5cbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsV2luLXBhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZmF2YmV0LmhyL1wiKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9jaWplL3Byb21vY2lqYS9zdHViLyc7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vcy9wcm9tby9zdHViLyc7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gcmVxdWVzdChgL3RyYW5zbGF0ZXMvJHtsb2NhbGV9YClcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcblxuICAgICAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyYXp5LXByb21vJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpXG4gICAgICAgIGlmIChlbGVtcyAmJiBlbGVtcy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgaWYodHJhbnNsYXRlU3RhdGUpe1xuICAgICAgICAgICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaTE4bkRhdGFba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0cmFuc2xhdGlvbiB3b3JrcyFcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgICAgIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcygpO1xuXG5cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcyhlbGVtZW50LCBiYXNlQ3NzQ2xhc3MpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBsYW5nIG9mIFsndWsnLCdlbiddKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYmFzZUNzc0NsYXNzICsgbGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2VDc3NDbGFzcyArIGxvY2FsZSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZXBvcnRFcnJvcihlcnIpIHtcbiAgICAgICAgY29uc3QgcmVwb3J0RGF0YSA9IHtcbiAgICAgICAgICAgIG9yaWdpbjogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICB1c2VyaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGVycm9yVGV4dDogZXJyPy5lcnJvciB8fCBlcnI/LnRleHQgfHwgZXJyPy5tZXNzYWdlIHx8ICdVbmtub3duIGVycm9yJyxcbiAgICAgICAgICAgIHR5cGU6IGVycj8ubmFtZSB8fCAnVW5rbm93bkVycm9yJyxcbiAgICAgICAgICAgIHN0YWNrOiBlcnI/LnN0YWNrIHx8ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gZmV0Y2goJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaS1jbXMvcmVwb3J0cy9hZGQnLCB7XG4gICAgICAgIC8vICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgLy8gICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIC8vICAgICB9LFxuICAgICAgICAvLyAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVwb3J0RGF0YSlcbiAgICAgICAgLy8gfSkuY2F0Y2goY29uc29sZS53YXJuKTtcbiAgICB9XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0RGF0YSAoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICByZXF1ZXN0KCcvdXNlcnMnKSxcbiAgICAgICAgXSlcbiAgICB9XG5cblxuICAgIGNvbnN0IEluaXRQYWdlID0gKCkgPT4ge1xuICAgICAgICBnZXREYXRhKCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgdXNlcnMgPSByZXNbMF0uc29ydCgoYSwgYikgPT4gYi5wb2ludHMgLSBhLnBvaW50cyk7XG4gICAgICAgICAgICB1c2VycyA9IHVzZXJzLnNvcnQoKGEsYikgPT4gKGEuZGF0ZSA8IGIuZGF0ZSkgPyAxIDogKChiLmRhdGUgPCBhLmRhdGUpID8gLTEgOiAwKSk7XG4gICAgICAgICAgICByZW5kZXJVc2Vycyh1c2Vycyk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgUkVRVUlSRURfVVNFUlNfQU1PVU5UID0gNztcblxuICAgIGNvbnN0IHJlbmRlclVzZXJzID0gKHVzZXJzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbmFsQm9hcmRXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlX19ib2R5Jyk7XG4gICAgICAgIGZpbmFsQm9hcmRXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGlmICh1c2VycyAmJiB1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlX19yb3cnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+JHtuZXcgRGF0ZSh1c2VyLmRhdGUgKiAxMDAwKS50b0xvY2FsZVN0cmluZygpLnNwbGl0KFwiLFwiKVswXX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+JHt1c2VyLnVzZXJpZH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+JHt1c2VyLnBvaW50c308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+JHt1c2VyLmJvbnVzfTwvZGl2PlxuICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgIGZpbmFsQm9hcmRXcmFwcGVyLmFwcGVuZCh1c2VyUm93KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB1c2VyUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5jbGFzc0xpc3QuYWRkKCd0YWJsZV9fcm93Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlX19ib2R5LWNvbFwiPioqKioqKio8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+KioqKioqKjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlX19ib2R5LWNvbFwiPioqKioqKio8L2Rpdj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICBmaW5hbEJvYXJkV3JhcHBlci5hcHBlbmQodXNlclJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKClcbiAgICAgICAgLnRoZW4oSW5pdFBhZ2UpO1xuXG59KSgpO1xuXG5cblxuXG5cblxuXG4iXX0=
