$(function() {
    $(window).on("scroll", function () {
        if ($(window).scrollTop()) {
            $('nav').addClass('black');
        }
    
        else {
            $('nav').removeClass('black');
        }
    })

    $(".menu-icon").on("click", function() {
        $("nav ul").toggleClass("showing");
  });
    
    $(".menu").find("a").on("click", () => {
        stopChartTimer();
        $("nav ul").toggleClass("showing");
    })
    
    DOM.coinSearch.on("keyup", () => {
        filterCoin(DOM.coinSearch.val())
    })
});





const createToggle = (target, bindToggleListener) => {
    let opts = {
        el: `#on-off-switch-${target}`,
        height: 25,
        trackColorOn: '#ffc107',
        trackColorOff: '#666',
        trackBorderColor: '#555',
        textColorOff: '#fff',
        textOn: '',
        textOff: ''
    };

    if (bindToggleListener) {
        opts["listener"] = toggleSwitchListener;
    }

    new DG.OnOffSwitch(opts);
}

const createCoinCard = (coin, state) => {
    let card = `<div id="${coin.id}" class="card m-3 p-3 col-md-4 col-sm-6" style="display: inline-flex; width: 18rem; z-index: 1;">
        <input type="hidden" name="${coin.id}" class="ml-auto" id="on-off-switch-${coin.id}" value="${state}">
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

const toggleSwitchListener = (name, checked) => {
    console.log("name: " + name + ", checked: " + checked);
    if (checked) {
        addCoinToChart(name);
    }
    else {
        removeFromChart(name)
    }
}

const drawCards = (coins) => {
    let state;
    for (var key in coins) {
        let coin = coins[key];
        let state = 0;
        for (let j = 0; j < selectedCoins.length; j++) {
            if (selectedCoins[j] == coin.id) {
                state = 1
            }
        }
        DOM.coinsPage.append(createCoinCard(coin, state));
        createToggle(coin.id, true)
        $("#" + coin.id).find("a").on("click", () => {
            moreInfo(coin);
        })
    }

    DOM.mainContainer.height(DOM.coinsPage.height() + 300);
}

const initCoinsData = async () => {
    response = await getAllCoins();
    for (let i = 0; i < response.length; i++) {
       coins[response[i].id] = response[i]
    }
}

const drawCoins = () => {
    try {
        DOM.coinsPage.empty();
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

const createChartOptions = () => {

    options = initChartOptions();

    for (let i = 0; i < selectedCoins.length; i++) {
        let coinData = initCoinData(coins[selectedCoins[i]].name, colors[i]);
        options.data.push(coinData)
    }
    initChartTimer();
    return options;
}

const initChartTimer = () => {
    let f = async () => {
        let date = new Date();
        for (let i = 0; i < selectedCoins.length; i++) {
            let usdPrice = await convertCoin(coins[selectedCoins[i]].symbol.toUpperCase(), "USD", false);
            let currentPoint = { x: date, y: usdPrice["USD"] };
            options.data[i].dataPoints.push(currentPoint);
        }
        chart.render();
    };

    timer = setInterval(f, 5000);
    f();
}


const stopChartTimer = () => {
    clearInterval(timer);
}

const addCoinToChart = async (coinID) => {
    selectedCoins.push(coinID);

    if (selectedCoins.length > 5) {
        // too many coins
        $('.modal-body').empty();
        for (let i = 0; i < selectedCoins.length; i++) {
            let useCoin = $(`<div class="card"><input data-coin=${selectedCoins[i]} name="${selectedCoins[i]}" type="hidden" class="ml-auto" id="on-off-switch-${selectedCoins[i]}-inUse" value="1"></div>`);
            useCoin.append(selectedCoins[i])
            $('.modal-body').append(useCoin);
            createToggle(`${selectedCoins[i]}-inUse`, false)
        }

        $('.modal-body').append(`<div id="modal-body-error" class="alert alert-danger"></div>`);
        $('#modal-body-error').hide();

        $('#showModal').on('hidden.bs.modal', function () {
            // closing event
            if (selectedCoins.length > 5) {
                removeFromChart(coinID);
            }
            drawCoins();
          })

        $("#save-button").on("click", (e) => {
            updateSelectedCoins();

            if (selectedCoins.length <= 5) {
                $('#showModal').modal('toggle');
            } else {
                $('#modal-body-error').show();
                $('#modal-body-error').text("You must select maximum 5 coins!!!");
            }
            
        })
        $('#showModal').modal('show');
    }

}


const removeFromChart = (coinID) => {
    for (let i = 0; i < selectedCoins.length; i++) {
        if (selectedCoins[i] == coinID) {
            selectedCoins.splice(i, 1);
        }
    }
}


const updateSelectedCoins = () => {
    let coinsInUse = $('.modal-body').find('input');
    for (let i = 0; i < coinsInUse.length; i++) {
        if (coinsInUse[i].value !== "1") {
            removeFromChart(coinsInUse[i].dataset["coin"]);
        }
    }
    drawCoins();
}