

const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const coinsApi = "https://api.coingecko.com/api/v3/coins/";
const convertApi = "https://min-api.cryptocompare.com/data/price?fsym=";
const cache = {};

const DOM = function () {

    return {

        mainContainer: $("#main"),
        coinsPage: $("#coins-page"),
        coinSearch: $("#coinSearch")


    }

}();







