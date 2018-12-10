const getAllCoins = () => {
    return apiCall(coinsApi);
}

const getCoinDetails = (coin) => {
    return apiCall(coinsApi + coin.toLowerCase());
}

const convertCoin = (from, to, cache) => {
    let url = convertApi + from + "&tsyms=" + to
    return apiCall(url, cache);
}