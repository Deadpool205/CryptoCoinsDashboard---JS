

const getAllCoins = () => {
    return apiCall(coinsApi);
}


const getCoinDetails = (coin) => {
    return apiCall(coinsApi + coin.toLowerCase());
}

const convertCoin = (from, to , cache) => {
    let url = convertApi + from + "&tsyms=" + to
    if (cache) {
        return apiCall(url);
    }
    else{
         return chartExchangeRate(url)
    }
    
}



const addCoinToChart = async (coin) => {

    let currentCoin = await getCoinDetails(coin);
    coinsObjArray.push(currentCoin);


}

const chartExchangeRate = (url) => {
    return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                dataType: "json",
                url: url,
                success: (response) => {
                    console.log("api hit")
                    resolve(response);

                }, error: (error) => {
                    reject(error);
                }
            })

        }
    )
}



