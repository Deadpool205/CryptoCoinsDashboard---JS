
const getAllCoins = () => {
    return apiCall(coinsApi);
}


const getCoinDetails = (coin) => {
    return apiCall(coinsApi + coin.toLowerCase());
}





