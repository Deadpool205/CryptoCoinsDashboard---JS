

const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const coinsApi = "https://api.coingecko.com/api/v3/coins/";
const convertApi = "https://min-api.cryptocompare.com/data/price?fsym=";
const templateService = "http://localhost:5500/templates/";
const cache = {};

const DOM = function () {

    return {

        mainContainer: $("#main"),
        coinSearch: $("#coinSearch"),


    }

}();

var router = {};


router.home = async () => {
    let content = await getTemplate("homeView");
    DOM.mainContainer.html(content);
    DOM.coinsPage = $("#coins-page")
    drawCoins();
}

router.liveReports = function () {
    getView("liveReportsView");
}

router.about = async () => {
    let content = await getTemplate("aboutView")
    DOM.mainContainer.html(content);
}










