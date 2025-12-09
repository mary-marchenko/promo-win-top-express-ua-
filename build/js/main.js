"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var apiURL = 'https://allwin-prom.pp.ua/api_express_allwin';
  var resultsTableList = document.querySelector('.tableResults__body');
  var users;
  var mainPage = document.querySelector(".allWin-page"),
    ukLeng = document.querySelector('#ukLeng'),
    enLeng = document.querySelector('#enLeng'),
    hrLeng = document.querySelector('#hrLeng'),
    roLeng = document.querySelector('#roLeng');

  // let locale = 'uk';
  var locale = sessionStorage.getItem("locale") || "uk";
  if (ukLeng) locale = 'uk';
  if (hrLeng) locale = 'hr';
  if (roLeng) locale = 'ro';
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
      //
      // return Promise.reject(err);
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
    fetch('https://fav-prom.com/api-cms/reports/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    })["catch"](console.warn);
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

    // translate();
  };

  // InitPage();

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
  var title = document.querySelector('.banner__title .normal');
  if (navigator.platform.includes('Win32')) {
    title.classList.add('win-title-style');
  }
  loadTranslations().then(InitPage);

  // TEST
  document.addEventListener("DOMContentLoaded", function () {
    var _document$querySelect;
    (_document$querySelect = document.querySelector(".menu-btn")) === null || _document$querySelect === void 0 || _document$querySelect.addEventListener("click", function () {
      var _document$querySelect2;
      (_document$querySelect2 = document.querySelector(".menu-test")) === null || _document$querySelect2 === void 0 || _document$querySelect2.classList.toggle("hide");
    });
  });
  var lngBtn = document.querySelector(".lng-btn");
  lngBtn.addEventListener("click", function () {
    if (sessionStorage.getItem("locale")) {
      sessionStorage.removeItem("locale");
    } else {
      sessionStorage.setItem("locale", "en");
    }
    window.location.reload();
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwicmVzdWx0c1RhYmxlTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVzZXJzIiwibWFpblBhZ2UiLCJ1a0xlbmciLCJlbkxlbmciLCJockxlbmciLCJyb0xlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsInRyYW5zbGF0ZVN0YXRlIiwid2luZG93IiwidXNlcklkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJmZXRjaCIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwidGhlbiIsInJlcyIsImpzb24iLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJyZXBvcnRFcnJvciIsImxvYWRUcmFuc2xhdGlvbnMiLCJjb25jYXQiLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInJlbW92ZUF0dHJpYnV0ZSIsImxvZyIsImNsYXNzTGlzdCIsImFkZCIsInJlZnJlc2hMb2NhbGl6ZWRDbGFzcyIsImVsZW1lbnQiLCJiYXNlQ3NzQ2xhc3MiLCJfaSIsIl9hcnIiLCJsYW5nIiwicmVtb3ZlIiwicmVwb3J0RGF0YSIsIm9yaWdpbiIsImxvY2F0aW9uIiwiaHJlZiIsInVzZXJpZCIsImVycm9yVGV4dCIsInRleHQiLCJtZXNzYWdlIiwidHlwZSIsIm5hbWUiLCJzdGFjayIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5Iiwid2FybiIsImdldERhdGEiLCJQcm9taXNlIiwiYWxsIiwiSW5pdFBhZ2UiLCJzb3J0IiwiYSIsImIiLCJwb2ludHMiLCJkYXRlIiwicmVuZGVyVXNlcnMiLCJSRVFVSVJFRF9VU0VSU19BTU9VTlQiLCJmaW5hbEJvYXJkV3JhcHBlciIsInVzZXIiLCJ1c2VyUm93IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNwbGl0IiwiYm9udXMiLCJhcHBlbmQiLCJpIiwidGl0bGUiLCJuYXZpZ2F0b3IiLCJwbGF0Zm9ybSIsImluY2x1ZGVzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdCIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdDIiLCJ0b2dnbGUiLCJsbmdCdG4iLCJyZW1vdmVJdGVtIiwic2V0SXRlbSIsInJlbG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxNQUFNLEdBQUcsOENBQThDO0VBRTdELElBQU1DLGdCQUFnQixHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUV0RSxJQUFJQyxLQUFLO0VBRVQsSUFBTUMsUUFBUSxHQUFHSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxjQUFjLENBQUM7SUFDbkRHLE1BQU0sR0FBR0osUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQzFDSSxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUMxQ0ssTUFBTSxHQUFHTixRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDMUNNLE1BQU0sR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDOztFQUU5QztFQUNBLElBQUlPLE1BQU0sR0FBR0MsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSTtFQUVyRCxJQUFJTixNQUFNLEVBQUVJLE1BQU0sR0FBRyxJQUFJO0VBQ3pCLElBQUlGLE1BQU0sRUFBRUUsTUFBTSxHQUFHLElBQUk7RUFDekIsSUFBSUQsTUFBTSxFQUFFQyxNQUFNLEdBQUcsSUFBSTtFQUN6QixJQUFJ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LFFBQVEsQ0FBQzs7RUFFbkI7RUFDQTVFLFFBQVEsQ0FBQ2tHLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07SUFBQSxJQUFBQyxxQkFBQTtJQUNoRCxDQUFBQSxxQkFBQSxHQUFBbkcsUUFBUSxDQUFDQyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQUFrRyxxQkFBQSxlQUFuQ0EscUJBQUEsQ0FBcUNELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO01BQUEsSUFBQUUsc0JBQUE7TUFDakUsQ0FBQUEsc0JBQUEsR0FBQXBHLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFlBQVksQ0FBQyxjQUFBbUcsc0JBQUEsZUFBcENBLHNCQUFBLENBQXNDcEQsU0FBUyxDQUFDcUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsRSxDQUFDLENBQUM7RUFDTixDQUFDLENBQUM7RUFFRixJQUFNQyxNQUFNLEdBQUd0RyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFFakRxRyxNQUFNLENBQUNKLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0lBQ25DLElBQUl6RixjQUFjLENBQUNDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtNQUNsQ0QsY0FBYyxDQUFDOEYsVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUN2QyxDQUFDLE1BQU07TUFDSDlGLGNBQWMsQ0FBQytGLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO0lBQzFDO0lBQ0EzRixNQUFNLENBQUM4QyxRQUFRLENBQUM4QyxNQUFNLENBQUMsQ0FBQztFQUM1QixDQUFDLENBQUM7QUFFTixDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9hbGx3aW4tcHJvbS5wcC51YS9hcGlfZXhwcmVzc19hbGx3aW4nO1xuXG4gICAgY29uc3QgcmVzdWx0c1RhYmxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZVJlc3VsdHNfX2JvZHknKTtcblxuICAgIGxldCB1c2VycztcblxuICAgIGNvbnN0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hbGxXaW4tcGFnZVwiKSxcbiAgICAgICAgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpLFxuICAgICAgICBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyksXG4gICAgICAgIGhyTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNockxlbmcnKSxcbiAgICAgICAgcm9MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvTGVuZycpO1xuXG4gICAgLy8gbGV0IGxvY2FsZSA9ICd1ayc7XG4gICAgbGV0IGxvY2FsZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikgfHwgXCJ1a1wiXG5cbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChockxlbmcpIGxvY2FsZSA9ICdocic7XG4gICAgaWYgKHJvTGVuZykgbG9jYWxlID0gJ3JvJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgY29uc3QgdHJhbnNsYXRlU3RhdGUgPSB0cnVlO1xuXG4gICAgd2luZG93LnVzZXJJZCA9IG51bGw7XG5cbiAgICAvLyB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBUEkgcmVxdWVzdCBmYWlsZWQ6JywgZXJyKTtcblxuICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKGVycik7XG5cbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsV2luLXBhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZmF2YmV0LmhyL1wiKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9jaWplL3Byb21vY2lqYS9zdHViLyc7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vcy9wcm9tby9zdHViLyc7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIHJlcXVlc3QoYC9uZXctdHJhbnNsYXRlcy8ke2xvY2FsZX1gKVxuICAgIC8vICAgICAudGhlbihqc29uID0+IHtcbiAgICAvLyAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAvLyAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgIC8vICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgLy8gICAgICAgICAgICAgY29uc3Qgc2hvdWxkU2tpcCA9IG11dGF0aW9ucy5ldmVyeShtdXRhdGlvbiA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBtdXRhdGlvbi50YXJnZXQuY2xvc2VzdCgnLmdhbWUtY29udGFpbmVyJykgfHwgbXV0YXRpb24udGFyZ2V0LmNsb3Nlc3QoJy50YWJsZScpO1xuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgIGlmIChzaG91bGRTa2lwKSByZXR1cm47XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JhenktcHJvbW9cIiksIHtcbiAgICAvLyAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgLy8gICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QoYC90cmFuc2xhdGVzLyR7bG9jYWxlfWApXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmF6eS1wcm9tbycpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGlmKHRyYW5zbGF0ZVN0YXRlKXtcbiAgICAgICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBpMThuRGF0YVtrZXldIHx8ICcqLS0tLU5FRUQgVE8gQkUgVFJBTlNMQVRFRC0tLS0qICAga2V5OiAgJyArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkxOG5EYXRhW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidHJhbnNsYXRpb24gd29ya3MhXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gJ2VuJykge1xuICAgICAgICAgICAgbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnZW4nKTtcbiAgICAgICAgfVxuICAgICAgICByZWZyZXNoTG9jYWxpemVkQ2xhc3MoKTtcblxuXG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoTG9jYWxpemVkQ2xhc3MoZWxlbWVudCwgYmFzZUNzc0NsYXNzKSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBbJ3VrJywnZW4nXSkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGJhc2VDc3NDbGFzcyArIGxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNlQ3NzQ2xhc3MgKyBsb2NhbGUpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcmVwb3J0RXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydERhdGEgPSB7XG4gICAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdXNlcmlkOiB1c2VySWQsXG4gICAgICAgICAgICBlcnJvclRleHQ6IGVycj8uZXJyb3IgfHwgZXJyPy50ZXh0IHx8IGVycj8ubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsXG4gICAgICAgICAgICB0eXBlOiBlcnI/Lm5hbWUgfHwgJ1Vua25vd25FcnJvcicsXG4gICAgICAgICAgICBzdGFjazogZXJyPy5zdGFjayB8fCAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZldGNoKCdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGktY21zL3JlcG9ydHMvYWRkJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlcG9ydERhdGEpXG4gICAgICAgIH0pLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgfVxuXG5cblxuICAgIGZ1bmN0aW9uIGdldERhdGEgKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgcmVxdWVzdCgnL3VzZXJzJyksXG4gICAgICAgIF0pXG4gICAgfVxuXG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgZ2V0RGF0YSgpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIHVzZXJzID0gcmVzWzBdLnNvcnQoKGEsIGIpID0+IGIucG9pbnRzIC0gYS5wb2ludHMpO1xuICAgICAgICAgICAgdXNlcnMgPSB1c2Vycy5zb3J0KChhLGIpID0+IChhLmRhdGUgPCBiLmRhdGUpID8gMSA6ICgoYi5kYXRlIDwgYS5kYXRlKSA/IC0xIDogMCkpO1xuICAgICAgICAgICAgcmVuZGVyVXNlcnModXNlcnMpO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEluaXRQYWdlKCk7XG5cbiAgICBjb25zdCBSRVFVSVJFRF9VU0VSU19BTU9VTlQgPSA3O1xuXG4gICAgY29uc3QgcmVuZGVyVXNlcnMgPSAodXNlcnMpID0+IHtcbiAgICAgICAgY29uc3QgZmluYWxCb2FyZFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHknKTtcbiAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgaWYgKHVzZXJzICYmIHVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHVzZXJSb3cuY2xhc3NMaXN0LmFkZCgndGFibGVfX3JvdycpO1xuICAgICAgICAgICAgICAgIHVzZXJSb3cuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4ke25ldyBEYXRlKHVzZXIuZGF0ZSAqIDEwMDApLnRvTG9jYWxlU3RyaW5nKCkuc3BsaXQoXCIsXCIpWzBdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4ke3VzZXIudXNlcmlkfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4ke3VzZXIucG9pbnRzfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4ke3VzZXIuYm9udXN9PC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuYXBwZW5kKHVzZXJSb3cpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlX19yb3cnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+KioqKioqKjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZV9fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlX19ib2R5LWNvbFwiPioqKioqKio8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVfX2JvZHktY29sXCI+KioqKioqKjwvZGl2PlxuICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgIGZpbmFsQm9hcmRXcmFwcGVyLmFwcGVuZCh1c2VyUm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhbm5lcl9fdGl0bGUgLm5vcm1hbCcpXG5cbiAgICBpZiAobmF2aWdhdG9yLnBsYXRmb3JtLmluY2x1ZGVzKCdXaW4zMicpKSB7XG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3dpbi10aXRsZS1zdHlsZScpO1xuICAgIH1cblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKVxuICAgICAgICAudGhlbihJbml0UGFnZSk7XG5cbiAgICAvLyBURVNUXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtYnRuXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LXRlc3RcIik/LmNsYXNzTGlzdC50b2dnbGUoXCJoaWRlXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxuZ0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG5nLWJ0blwiKVxuXG4gICAgbG5nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpKSB7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFwibG9jYWxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsZVwiLCBcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcblxufSkoKTtcblxuXG5cblxuXG5cblxuIl19
