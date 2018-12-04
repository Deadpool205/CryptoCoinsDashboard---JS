// Generic Api Call function that supports caching
const apiCall = (url) => {
    return new Promise((resolve, reject) => {
        if (url in cache && $.now() - cache[url].time < cacheTimeout) {
            console.log("cache hit")
            resolve(cache[url].response);
        }
        else {
            $.ajax({
                method: "GET",
                dataType: "json",
                url: url,
                success: (response) => {
                    cache[url] = new Object();
                    cache[url].response = response;
                    cache[url].time = $.now();
                    console.log("api hit")
                    resolve(response);

                }, error: (error) => {
                    reject(error);
                }
            })

        }
    })
}






const getTemplate = (param) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "GET",
            url: templateService + param + ".html",
            success: (response) => {
                resolve(response);

            }, error: (error) => {
                reject(error);
            }
        })

    })
}