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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwicmVzdWx0c1RhYmxlTGlzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVzZXJzIiwibWFpblBhZ2UiLCJ1a0xlbmciLCJlbkxlbmciLCJockxlbmciLCJyb0xlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsInRyYW5zbGF0ZVN0YXRlIiwid2luZG93IiwidXNlcklkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJmZXRjaCIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwidGhlbiIsInJlcyIsImpzb24iLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJyZXBvcnRFcnJvciIsImxvYWRUcmFuc2xhdGlvbnMiLCJjb25jYXQiLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInJlbW92ZUF0dHJpYnV0ZSIsImxvZyIsImNsYXNzTGlzdCIsImFkZCIsInJlZnJlc2hMb2NhbGl6ZWRDbGFzcyIsInRyYW5zbGF0ZUtleSIsImVsZW1lbnQiLCJiYXNlQ3NzQ2xhc3MiLCJfaSIsIl9hcnIiLCJsYW5nIiwicmVtb3ZlIiwicmVwb3J0RGF0YSIsIm9yaWdpbiIsImxvY2F0aW9uIiwiaHJlZiIsInVzZXJpZCIsImVycm9yVGV4dCIsInRleHQiLCJtZXNzYWdlIiwidHlwZSIsIm5hbWUiLCJzdGFjayIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5Iiwid2FybiIsImdldERhdGEiLCJQcm9taXNlIiwiYWxsIiwiSW5pdFBhZ2UiLCJzb3J0IiwiYSIsImIiLCJwb2ludHMiLCJkYXRlIiwicmVuZGVyVXNlcnMiLCJSRVFVSVJFRF9VU0VSU19BTU9VTlQiLCJmaW5hbEJvYXJkV3JhcHBlciIsInVzZXIiLCJ1c2VyUm93IiwiY3JlYXRlRWxlbWVudCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNwbGl0IiwiYm9udXMiLCJhcHBlbmQiLCJpIiwidGl0bGUiLCJuYXZpZ2F0b3IiLCJwbGF0Zm9ybSIsImluY2x1ZGVzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdCIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdDIiLCJ0b2dnbGUiLCJsbmdCdG4iLCJyZW1vdmVJdGVtIiwic2V0SXRlbSIsInJlbG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxNQUFNLEdBQUcsOENBQThDO0VBRTdELElBQU1DLGdCQUFnQixHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztFQUV0RSxJQUFJQyxLQUFLO0VBRVQsSUFBTUMsUUFBUSxHQUFHSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxjQUFjLENBQUM7SUFDbkRHLE1BQU0sR0FBR0osUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQzFDSSxNQUFNLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUMxQ0ssTUFBTSxHQUFHTixRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDMUNNLE1BQU0sR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDOztFQUU5QztFQUNBLElBQUlPLE1BQU0sR0FBR0MsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSTtFQUVyRCxJQUFJTixNQUFNLEVBQUVJLE1BQU0sR0FBRyxJQUFJO0VBQ3pCLElBQUlGLE1BQU0sRUFBRUUsTUFBTSxHQUFHLElBQUk7RUFDekIsSUFBSUQsTUFBTSxFQUFFQyxNQUFNLEdBQUcs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LElBQUkrRixTQUFTLENBQUNDLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3RDSCxLQUFLLENBQUMvQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztFQUMxQzs7RUFFQTtFQUNBOztFQUVBO0VBQ0FqRCxRQUFRLENBQUNtRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0lBQUEsSUFBQUMscUJBQUE7SUFDaEQsQ0FBQUEscUJBQUEsR0FBQXBHLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFdBQVcsQ0FBQyxjQUFBbUcscUJBQUEsZUFBbkNBLHFCQUFBLENBQXFDRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtNQUFBLElBQUFFLHNCQUFBO01BQ2pFLENBQUFBLHNCQUFBLEdBQUFyRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUMsY0FBQW9HLHNCQUFBLGVBQXBDQSxzQkFBQSxDQUFzQ3JELFNBQVMsQ0FBQ3NELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEUsQ0FBQyxDQUFDO0VBQ04sQ0FBQyxDQUFDO0VBRUYsSUFBTUMsTUFBTSxHQUFHdkcsUUFBUSxDQUFDQyxhQUFhLENBQUMsVUFBVSxDQUFDO0VBRWpEc0csTUFBTSxDQUFDSixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtJQUNuQyxJQUFJMUYsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDbENELGNBQWMsQ0FBQytGLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQyxNQUFNO01BQ0gvRixjQUFjLENBQUNnRyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztJQUMxQztJQUNBNUYsTUFBTSxDQUFDK0MsUUFBUSxDQUFDOEMsTUFBTSxDQUFDLENBQUM7RUFDNUIsQ0FBQyxDQUFDO0FBRU4sQ0FBQyxFQUFFLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vYWxsd2luLXByb20ucHAudWEvYXBpX2V4cHJlc3NfYWxsd2luJztcblxuICAgIGNvbnN0IHJlc3VsdHNUYWJsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVSZXN1bHRzX19ib2R5Jyk7XG5cbiAgICBsZXQgdXNlcnM7XG5cbiAgICBjb25zdCBtYWluUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWxsV2luLXBhZ2VcIiksXG4gICAgICAgIHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKSxcbiAgICAgICAgZW5MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VuTGVuZycpLFxuICAgICAgICBockxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaHJMZW5nJyksXG4gICAgICAgIHJvTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb0xlbmcnKTtcblxuICAgIC8vIGxldCBsb2NhbGUgPSAndWsnO1xuICAgIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpIHx8IFwidWtcIlxuXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoaHJMZW5nKSBsb2NhbGUgPSAnaHInO1xuICAgIGlmIChyb0xlbmcpIGxvY2FsZSA9ICdybyc7XG4gICAgaWYgKGVuTGVuZykgbG9jYWxlID0gJ2VuJztcblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuICAgIGNvbnN0IHRyYW5zbGF0ZVN0YXRlID0gdHJ1ZTtcblxuICAgIHdpbmRvdy51c2VySWQgPSBudWxsO1xuXG4gICAgLy8gdmFyIHRvZGF5ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IGZ1bmN0aW9uIChsaW5rLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQVBJIHJlcXVlc3QgZmFpbGVkOicsIGVycik7XG5cbiAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbFdpbi1wYWdlJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAvLyBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmZhdmJldC5oci9cIikpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vY2lqZS9wcm9tb2NpamEvc3R1Yi8nO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9wcm9tb3MvcHJvbW8vc3R1Yi8nO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyByZXF1ZXN0KGAvbmV3LXRyYW5zbGF0ZXMvJHtsb2NhbGV9YClcbiAgICAvLyAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgLy8gICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgLy8gICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAvLyAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IHNob3VsZFNraXAgPSBtdXRhdGlvbnMuZXZlcnkobXV0YXRpb24gPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gbXV0YXRpb24udGFyZ2V0LmNsb3Nlc3QoJy5nYW1lLWNvbnRhaW5lcicpIHx8IG11dGF0aW9uLnRhcmdldC5jbG9zZXN0KCcudGFibGUnKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcCkgcmV0dXJuO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyYXp5LXByb21vXCIpLCB7XG4gICAgLy8gICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIC8vICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0KGAvdHJhbnNsYXRlcy8ke2xvY2FsZX1gKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JhenktcHJvbW8nKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBpZih0cmFuc2xhdGVTdGF0ZSl7XG4gICAgICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gaTE4bkRhdGFba2V5XSB8fCAnKi0tLS1ORUVEIFRPIEJFIFRSQU5TTEFURUQtLS0tKiAgIGtleTogICcgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpMThuRGF0YVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRyYW5zbGF0aW9uIHdvcmtzIVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgIG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ2VuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKCk7XG5cblxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8ICcqLS0tLU5FRUQgVE8gQkUgVFJBTlNMQVRFRC0tLS0qICAga2V5OiAgJyArIGtleTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoTG9jYWxpemVkQ2xhc3MoZWxlbWVudCwgYmFzZUNzc0NsYXNzKSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBbJ3VrJywnZW4nXSkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGJhc2VDc3NDbGFzcyArIGxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNlQ3NzQ2xhc3MgKyBsb2NhbGUpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcmVwb3J0RXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydERhdGEgPSB7XG4gICAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdXNlcmlkOiB1c2VySWQsXG4gICAgICAgICAgICBlcnJvclRleHQ6IGVycj8uZXJyb3IgfHwgZXJyPy50ZXh0IHx8IGVycj8ubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsXG4gICAgICAgICAgICB0eXBlOiBlcnI/Lm5hbWUgfHwgJ1Vua25vd25FcnJvcicsXG4gICAgICAgICAgICBzdGFjazogZXJyPy5zdGFjayB8fCAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZldGNoKCdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGktY21zL3JlcG9ydHMvYWRkJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlcG9ydERhdGEpXG4gICAgICAgIH0pLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgfVxuXG5cblxuICAgIGZ1bmN0aW9uIGdldERhdGEgKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgcmVxdWVzdCgnL3VzZXJzJyksXG4gICAgICAgIF0pXG4gICAgfVxuXG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgZ2V0RGF0YSgpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIHVzZXJzID0gcmVzWzBdLnNvcnQoKGEsIGIpID0+IGIucG9pbnRzIC0gYS5wb2ludHMpO1xuICAgICAgICAgICAgdXNlcnMgPSB1c2Vycy5zb3J0KChhLGIpID0+IChhLmRhdGUgPCBiLmRhdGUpID8gMSA6ICgoYi5kYXRlIDwgYS5kYXRlKSA/IC0xIDogMCkpO1xuICAgICAgICAgICAgcmVuZGVyVXNlcnModXNlcnMpO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEluaXRQYWdlKCk7XG5cbiAgICBjb25zdCBSRVFVSVJFRF9VU0VSU19BTU9VTlQgPSA3O1xuXG4gICAgY29uc3QgcmVuZGVyVXNlcnMgPSAodXNlcnMpID0+IHtcbiAgICAgICAgY29uc3QgZmluYWxCb2FyZFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVSZXN1bHRzX19ib2R5Jyk7XG4gICAgICAgIGZpbmFsQm9hcmRXcmFwcGVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGlmICh1c2VycyAmJiB1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlUmVzdWx0c19fcm93Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4ke25ldyBEYXRlKHVzZXIuZGF0ZSAqIDEwMDApLnRvTG9jYWxlU3RyaW5nKCkuc3BsaXQoXCIsXCIpWzBdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZVJlc3VsdHNfX2JvZHktY29sXCI+JHt1c2VyLnVzZXJpZH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVSZXN1bHRzX19ib2R5LWNvbFwiPiR7dXNlci5wb2ludHN9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4ke3VzZXIuYm9udXN9PC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuYXBwZW5kKHVzZXJSb3cpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB1c2VyUm93LmNsYXNzTGlzdC5hZGQoJ3RhYmxlUmVzdWx0c19fcm93Jyk7XG4gICAgICAgICAgICAgICAgdXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4qKioqKioqPC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgZmluYWxCb2FyZFdyYXBwZXIuYXBwZW5kKHVzZXJSb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFubmVyX190aXRsZSAubm9ybWFsJylcblxuICAgIGlmIChuYXZpZ2F0b3IucGxhdGZvcm0uaW5jbHVkZXMoJ1dpbjMyJykpIHtcbiAgICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnd2luLXRpdGxlLXN0eWxlJyk7XG4gICAgfVxuXG4gICAgLy8gbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgLy8gICAgIC50aGVuKEluaXRQYWdlKTtcblxuICAgIC8vIFRFU1RcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1idG5cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtdGVzdFwiKT8uY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbG5nQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sbmctYnRuXCIpXG5cbiAgICBsbmdCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikpIHtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oXCJsb2NhbGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG59KSgpO1xuXG5cblxuXG5cblxuXG4iXX0=
