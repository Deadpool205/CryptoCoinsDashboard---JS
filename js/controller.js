$(window).on("scroll", function () {
    if ($(window).scrollTop()) {
        $('nav').addClass('black');
    }

    else {
        $('nav').removeClass('black');
    }
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
    let card = `<div class="card d-flex mt-3" style="width: 18rem; z-index: 1">
        <input type="hidden" class="ml-auto" id="on-off-switch-${coin.symbol}" value="0">
            <div class="card-body">
                <h5 class="card-title">${coin.symbol}</h5>
                <p class="card-text">${coin.name}</p>
                <a href="" class="btn btn-warning">More Info</a>
            </div>
        </div>`;


    return card;
}

const drawCards = (coins) => {
    for (let i = 0; i < coins.length; i++) {
        DOM.coinsPage.append(CreateCoinCard(coins[i]));
        createToggle(coins[i].symbol)

    }
    DOM.mainContainer.height(DOM.coinsPage.height() + 300)
}

const drawCoins = async () => {
    try {
        let coins = await getAllCoins();
        coins = JSON.parse(coins)
        drawCards(coins);

    }
    catch (err) {
        console.log(err)
    }
}



