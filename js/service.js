

const getAllCoins = () => {
    return apiCall(coinsApi);
}


const getCoinDetails = (coin) => {
    return apiCall(coinsApi + coin.toLowerCase());
}

const convertCoin = (from, to) => {
    return apiCall(convertApi + from + "&tsyms=" + to);
}




const addCoinToChart = async (coin) => {

    let currentCoin = await getCoinDetails(coin);
    coinsObjArray.push(currentCoin);


}

