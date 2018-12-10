let chart;
const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const coinsApi = "https://api.coingecko.com/api/v3/coins/";
const convertApi = "https://min-api.cryptocompare.com/data/price?fsym=";
const templateService = "http://localhost:5500/templates/";
const cache = {};
let timer;
let options;
let coins = {};
const selectedCoins = [];

const DOM = function () {
    return {
        mainContainer: $("#main"),
        coinSearch: $("#coinSearch"),
    }
}();

var router = {};


router.home = async () => {
    let content = await getTemplate("homeView");
    DOM.mainContainer.html(content);
    DOM.coinsPage = $("#coins-page")
    await initCoinsData();
    drawCoins();
}

router.liveReports = async () => {
    let content = await getTemplate("liveReportsView");
    DOM.mainContainer.html(content);
    chart = new CanvasJS.Chart("chartContainer", createChartOptions())
    chart.render();

}

router.about = async () => {
    let content = await getTemplate("aboutView")
    DOM.mainContainer.html(content);
}


const initCoinData = (name, color) => {

    let coinData = {
        type: "line",
        showInLegend: true,
        name,
        markerType: "square",
        xValueFormatString: "HH:mm:ss",
        color,
        yValueFormatString: "#,##0.##$",
        dataPoints: [ ]
    }
    return coinData

}


const initChartOptions = () => {
    let options = {

        animationEnabled: true,
        theme: "light2",
        zoomEnabled: true,
        zoomType: "x",
        culture: "en",
        title: {
            text: "Coins Charts"
        },
        axisX: {
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "Coin Value",
            suffix: "$"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true
        },
        data: []
    }
    return options;
};



const colors = ["red", "blue", "orange", "yellow", "green"]








