


const getAllCoins = () => {
    return apiCall(coinsApi);
}


const getCoinDetails = (coin) => {
    return apiCall(coinsApi + coin.toLowerCase());
}

const convertCoin = (from, to) => {
    return apiCall(convertApi + from + "&tsyms=" + to);
}




