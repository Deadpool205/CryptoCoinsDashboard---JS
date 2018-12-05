let timer;
let options

$(window).on("scroll", function () {
    if ($(window).scrollTop()) {
        $('nav').addClass('black');
    }

    else {
        $('nav').removeClass('black');
    }
})

$(".menu").find("a").on("click", () => {
    stopTimer();
})

DOM.coinSearch.on("keyup", () => {
    filterCoin(DOM.coinSearch.val())
})



const createToggle = (target) => {
    new DG.OnOffSwitch({
        el: `#on-off-switch-${target}`,
        height: 25,
        trackColorOn: '#ffc107',
        trackColorOff: '#666',
        trackBorderColor: '#555',
        textColorOff: '#fff',
        textOn: '',
        textOff: ''
    })
}

const createCoinCard = (coin, state) => {
    let card = `<div id="${coin.id}" class="card mt-3" style="width: 18rem; z-index: 1;">
        <input type="hidden" class="ml-auto" id="on-off-switch-${coin.id}" value="${state}">
            <div class="card-body"  style="padding: 10px";>
                <h5 class="card-title">${coin.symbol}</h5>
                <p class="card-text">${coin.name}</p>
                <a data-toggle="collapse" href="#collapse-${coin.id}" role="button" aria-expanded="true" aria-controls="collapse-${coin.id}" class="btn btn-warning">More Info</a>
            </div>
            <div class="collapse" id="collapse-${coin.id}">
            </div>
        </div>`;


    return card;
}

const drawCards = (coins) => {
    let state;
    for (let i = 0; i < coins.length; i++) {
        let state = 0;
        for (let j = 0; j < coinsObjArray.length; j++) {
            if (coinsObjArray[j].id == coins[i].id) {
                state = 1
            }
        }
        DOM.coinsPage.append(createCoinCard(coins[i], state));
        createToggle(coins[i].id)
        $("#" + coins[i].id).find("a").on("click", () => {
            moreInfo(coins[i]);
        })
    }
    $(".on-off-switch").on("click", (e) => {
        let currentID = e.currentTarget.parentElement.id;
        if (e.currentTarget.previousSibling.value == "0") {
            addCoinToChart(currentID);
        }
        else {
            removeFromChart(currentID)
        }
    })
    DOM.mainContainer.height(DOM.coinsPage.height() + 300)
}

const drawCoins = async () => {
    try {
        DOM.coinsPage.empty();
        let coins = await getAllCoins();
        drawCards(coins);
    }
    catch (err) {
        console.log(err)
    }
}

const showMoreInfo = (id, info) => {
    $(id).empty();
    let src = info["image"]["thumb"];
    let img = $('<img>');
    img.attr('src', src);
    $(id).append(img);
    $(id).append(`<div> USD: ${info.currencyExchange["USD"]} <br> EUR: ${info.currencyExchange["EUR"]} <br> ILS: ${info.currencyExchange["ILS"]}</div>`);


}

const moreInfo = async (coin) => {
    try {
        if ($("#collapse-" + coin.id).hasClass("show")) {
            return
        }
        else {
            let info = await getCoinDetails(coin.id);
            let currencyExchange = await convertCoin((coin.symbol).toUpperCase(), "USD,EUR,ILS", true);
            info.currencyExchange = currencyExchange;
            showMoreInfo("#collapse-" + coin.id, info);
        }

    }
    catch (err) {
        console.log(err)
    }
}

const filterCoin = (str) => {
    if (str) {
        let currentDiv = $("h5:contains('" + str + "')").closest(".card")
        currentDiv.show();
        let othersDIV = $(".card").not(currentDiv);
        othersDIV.hide();
    }
    else {
        $(".card").show();
    }
}

const createOptions = () => {

    options = initOptions();

    for (let i = 0; i < coinsObjArray.length; i++) {
        let coinData = initCoinData(coinsObjArray[i].name, colors[i]);
        options.data.push(coinData)
    }
    initTimer();
    return options;
}



const initTimer = () => {
    timer = setInterval(async () => {
        let date = new Date();
        for (let i = 0; i < coinsObjArray.length; i++) {
            let usdPrice = await convertCoin(coinsObjArray[i].symbol.toUpperCase(), "USD", false)
            let currentPoint = { x: date, y: usdPrice["USD"] };
            options.data[i].dataPoints.push(currentPoint);
        }
        chart.render();
    }, 5000)
}


const stopTimer = () => {
    clearInterval(timer);
}

const addCoinToChart = async (coin) => {
    if (coinsObjArray.length >= 5) {
        $('.modal-body').empty();
        for (let i = 0; i < coinsObjArray.length; i++) {
            let useCoin = $(`<div class="card"><input data-coin=${coinsObjArray[i].id} type="hidden" class="ml-auto" id="on-off-switch-${coinsObjArray[i].id}-inUse" value="1"></div>`);
            useCoin.append(coinsObjArray[i].name)
            $('.modal-body').append(useCoin);
            createToggle(`${coinsObjArray[i].id}-inUse`)
            $("#save-button").on("click", (e) => {
                saveCoinsToChart()
            })
            $('#showModal').modal('show');
        }
    }
    else {
        let currentCoin = await getCoinDetails(coin);
        coinsObjArray.push(currentCoin);
    }

}


const removeFromChart = (coin) => {
    for (let i = 0; i < coinsObjArray.length; i++) {
        if (coinsObjArray[i].id == coin) {
            coinsObjArray.splice(i, 1)
        }

    }
}





const saveCoinsToChart = () => {
    let coinsInUse = $('.modal-body').find('input');
    // let coinsToRemove = []
    for (let i = 0; i < coinsInUse.length; i++) {
        if (coinsInUse[i].value !== "1") {
            // coinsToRemove.push(coinsInUse.data)
            for (let j = 0; j < coinsObjArray.length; j++) {
                if (coinsInUse[i].dataset["coin"] == coinsObjArray[j].id) {
                    coinsObjArray.splice(j, 1)
                }

            }
        }
    }

    $('#showModal').modal('toggle');
    router.home()

}