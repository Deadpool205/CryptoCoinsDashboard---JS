

$(window).on("scroll", function () {
    if ($(window).scrollTop()) {
        $('nav').addClass('black');
    }

    else {
        $('nav').removeClass('black');
    }
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

const CreateCoinCard = (coin) => {
    let card = `<div id="${coin.symbol}" class="card mt-3" style="width: 18rem; z-index: 1;">
        <input type="hidden" class="ml-auto" id="on-off-switch-${coin.id}" value="0">
            <div class="card-body"  style="padding: 10px";>
                <h5 class="card-title">${coin.symbol}</h5>
                <p class="card-text">${coin.name}</p>
                <a data-toggle="collapse" href="#collapse-${coin.name}" role="button" aria-expanded="true" aria-controls="collapse-${coin.name}" class="btn btn-warning">More Info</a>
            </div>
            <div class="collapse" id="collapse-${coin.name}">
            </div>
        </div>`;


    return card;
}

const drawCards = (coins) => {
    for (let i = 0; i < coins.length; i++) {
        DOM.coinsPage.append(CreateCoinCard(coins[i]));
        createToggle(coins[i].id)
        $("#" + coins[i].symbol).on("click", () => {
            moreInfo(coins[i]);
        })

    }
    DOM.mainContainer.height(DOM.coinsPage.height() + 300)
}

const drawCoins = async () => {
    try {
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
    $(id).append(`<div>USD: ${info.currencyExchange["USD"]}<br>EUR: ${info.currencyExchange["EUR"]}<br>ILS: ${info.currencyExchange["ILS"]}</div>`);


}

const moreInfo = async (coin) => {
    try {
        if ($("#collapse-" + coin.name).hasClass("show")) {
            return
        }
        else {
            let info = await getCoinDetails(coin.id);
            let currencyExchange = await convertCoin((coin.symbol).toUpperCase(), "USD,EUR,ILS");
            info.currencyExchange = currencyExchange;
            showMoreInfo("#collapse-" + coin.name, info);
        }

    }
    catch (err) {
        console.log(err)
    }
}

const filterCoin = (str) => {
    if (str) {
        let currentDiv = $("[id*=" + str + "]")
        currentDiv.show();
        let othersDIV = $(".card").not(currentDiv);
        othersDIV.hide();
    }
    else {
        $(".card").show();
    }
}

// const getView = async (view) => {

//         let content = await getTemplate(view);
//         DOM.mainContainer.html(content);

// }
