(function () {
    // const apiURL = 'https://fav-prom.com/api_express_hr';
    const apiURL = 'https://fav-prom.com/api_express_ua';
    // const apiURL = 'https://fav-prom.com/api_express_ro';

    const resultsTableList = document.querySelector('.tableResults__body');

    let users;

    const checkLink = document.querySelector('#checkLink'),
        ukLeng = document.querySelector('#ukLeng'),
        enLeng = document.querySelector('#enLeng'),
        hrLeng = document.querySelector('#hrLeng'),
        roLeng = document.querySelector('#roLeng');

    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (hrLeng) locale = 'hr';
    if (roLeng) locale = 'ro';
    if (enLeng) locale = 'en';

    let i18nData = {};

    window.userId = null;

    // var today = new Date().toISOString();

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        }).then(res => res.json())
            .catch(err => {
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
    }


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
        return request(`/translates/${locale}`)
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('crazy-promo'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })

            let host;
            if (window && window.location) {
                host = window.location.host + '';
            }

            if (window && window.location && host.indexOf('favorit') > -1) {
                document.querySelectorAll('.host-ref').forEach(el => {
                    el.innerHTML = 'favorit.com.ua';

                    const a = el.closest('a');
                    if (a && a.href.indexOf('favbet') > -1) {
                        const href = a.href;
                        const afterDomain = href.split('favbet')[1].split('/')[1];

                        a.setAttribute('href', 'https://' + host + (afterDomain ? ('/' + afterDomain) : ''));
                    }


                })
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
        for (const lang of ['hr','en']) {
            element.classList.remove(baseCssClass + lang);
        }
        element.classList.add(baseCssClass + locale);
    }


    function reportError(err) {
        const reportData = {
            origin: window.location.href,
            userid: userId,
            errorText: err?.error || err?.text || err?.message || 'Unknown error',
            type: err?.name || 'UnknownError',
            stack: err?.stack || ''
        };

        fetch('https://fav-prom.com/api-cms/reports/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        }).catch(console.warn);
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

    function getData () {
        return Promise.all([
            request('/users'),
        ])
    }


    const InitPage = () => {
        getData().then(res => {
            users = res[0].sort((a, b) => b.points - a.points);
            users = users.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
            renderUsers(users);
        })

        translate();
    }

    // InitPage();

    const REQUIRED_USERS_AMOUNT = 7;

    const renderUsers = (users) => {
        const finalBoardWrapper = document.querySelector('.tableResults__body');
        finalBoardWrapper.innerHTML = '';

        if (users && users.length) {
            users.forEach(user => {
                let userRow = document.createElement('div');
                userRow.classList.add('tableResults__row');
                userRow.innerHTML = `
                            <div class="tableResults__body-col">${new Date(user.date * 1000).toLocaleString().split(",")[0]}</div>
                            <div class="tableResults__body-col">${user.userid}</div>
                            <div class="tableResults__body-col">${user.points}</div>
                            <div class="tableResults__body-col">${user.bonus}</div>
            `
                finalBoardWrapper.append(userRow);
            })
        } else {
            for (let i = 0; i < 7; i++) {
                let userRow = document.createElement('div');
                userRow.classList.add('tableResults__row');
                userRow.innerHTML = `
                <div class="tableResults__body-col">*******</div>
                <div class="tableResults__body-col">*******</div>
                <div class="tableResults__body-col">*******</div>
                <div class="tableResults__body-col">*******</div>
            `
                finalBoardWrapper.append(userRow);
            }
        }
    }

    const title = document.querySelector('.banner__title .normal')

    if (navigator.platform.includes('Win32')) {
        title.classList.add('win-title-style');
    }

    // loadTranslations()
    //     .then(InitPage);
})();







