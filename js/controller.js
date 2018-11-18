

const CreateCoinCard = (coin) => {
    let card = `<div class="card mt-3" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${coin.symbol}</h5>
            <p class="card-text">${coin.name}</p>
            <a href="" class="btn btn-warning">More Info</a>
        </div>
    </div>`

    return card;
}

const drawCards = (coins) => {
    for (let i = 0; i < coins.length; i++) {
        let currentCard = CreateCoinCard(coins[i])
        DOM.coinsPage.append(currentCard);

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



