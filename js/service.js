


const getAllCoins = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "get",
            url: coinsApi,
            success: (response) => {
                resolve(response);
            }, error: (error) => {
                reject(error);
            }
        })
    })
}





