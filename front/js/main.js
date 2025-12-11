(function () {
    const apiURL = 'https://allwin-prom.pp.ua/api_express_allwin';

    const resultsTableList = document.querySelector('.table__body');

    let users;

    const mainPage = document.querySelector(".allWin-page"),
        ukLeng = document.querySelector('#ukLeng'),
        enLeng = document.querySelector('#enLeng');


    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};
    const translateState = true;

    window.userId = null;


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

                return Promise.reject(err);
            });
    }

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

            if(translateState){
                elems.forEach(elem => {
                    const key = elem.getAttribute('data-translate');
                    elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
                    if (i18nData[key]) {
                        elem.removeAttribute('data-translate');
                    }
                })
            }else{
                console.log("translation works!")
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
        for (const lang of ['uk','en']) {
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
    }



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
    }

    const renderUsers = (users) => {
        const finalBoardWrapper = document.querySelector('.table__body');
        finalBoardWrapper.innerHTML = '';

        if (users && users.length) {
            users.forEach(user => {
                let userRow = document.createElement('div');
                userRow.classList.add('table__row');
                userRow.innerHTML = `
                            <div class="table__body-col">${new Date(user.date * 1000).toLocaleString().split(",")[0]}</div>
                            <div class="table__body-col">${user.userid}</div>
                            <div class="table__body-col">${user.points}</div>
                            <div class="table__body-col">${user.bonus}</div>
            `
                finalBoardWrapper.append(userRow);
            })
        } else {
            for (let i = 0; i < 7; i++) {
                let userRow = document.createElement('div');
                userRow.classList.add('table__row');
                userRow.innerHTML = `
                <div class="table__body-col">*******</div>
                <div class="table__body-col">*******</div>
                <div class="table__body-col">*******</div>
                <div class="table__body-col">*******</div>
            `
                finalBoardWrapper.append(userRow);
            }
        }
    }

    loadTranslations()
        .then(InitPage);

})();







