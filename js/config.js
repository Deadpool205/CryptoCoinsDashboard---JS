
// const coinsApi = "../templates/coins.html"
const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const coinsApi = "https://api.coingecko.com/api/v3/coins/";
const cache = {};

const DOM = function () {

    return {

        mainContainer: $("#main"),
        coinsPage: $("#coins-page"),


    }

}();






