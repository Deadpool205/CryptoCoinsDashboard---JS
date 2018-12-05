const coinsObjArray = [];
let chart;
const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const coinsApi = "https://api.coingecko.com/api/v3/coins/";
const convertApi = "https://min-api.cryptocompare.com/data/price?fsym=";
const templateService = "http://localhost:5500/templates/";
const cache = {};

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
    drawCoins();
}

router.liveReports = async () => {
    let content = await getTemplate("liveReportsView");
    DOM.mainContainer.html(content);
    chart = new CanvasJS.Chart("chartContainer", createOptions())
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
        xValueFormatString: "mm:ss",
        color,
        yValueFormatString: "#,##$",
        dataPoints: [
        ]
    }
    return coinData

}



const initOptions = () => {

    let options = {

        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Coins Charts"
        },
        axisX: {
            valueFormatString: "mm:ss"
        },
        axisY: {
            title: "coins value",
            suffix: "$"
            // minimum: 30
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: []
    }
    return options;

};



const colors = ["red", "blue", "orange", "yellow", "green"]

function toogleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}









