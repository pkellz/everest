const fs = require('fs');
const bot = require("./bot")
const gChart = require('./googleChart')
const Poloniex = require('poloniex.js')
const poloniex = new Poloniex(process.env.API_KEY, process.env.API_SECRET)
require('dotenv').config();

console.log("Fetching chart data");
fetchChartData(bot)

function fetchChartData(bot)
{
  poloniex.returnChartData(bot.majorCurrency, bot.minorCurrency, bot.interval, bot.startTime, bot.endTime)
  .then(points => {
    bot.historicalData = points
    console.log(points);
    generateHistoricalDataChart(bot.historicalData)
  })
  .catch(err => {
    console.log(err);
  })
}

function generateHistoricalDataChart(historicalData)
{
  console.log('Generating Historical Data Chart');
  const chartHtml = buildHtmlFile(historicalData)

  fs.writeFile('chart.html', chartHtml, function(err){
    if(err) throw new Error(err)
    console.log('Chart Saved');
  })
}

function buildHtmlFile(historicalData)
{
  console.log('Building Html File');

  let nextDataPoint
  let lastPairPrice
  let dataDate
  let dataPoints = []
  let pointString = ``
  let done = true

  while(done)
  {
    if(historicalData.length > 0)
    {
        nextDataPoint = historicalData.pop()
        lastPairPrice = nextDataPoint.weightedAverage
        dataDate = new Date(nextDataPoint.date * 1000) 
    }
    else
    {
      dataPoints.forEach(point => {
        pointString += `['${point['date']}',${point['price']},${point['label']},${point['description']},${point['trend']}`
        pointString += "],\n"
      })
      done = false
      break;
    }

    dataPoints.push({
      date: dataDate,
      price: lastPairPrice,
      trend: bot.currentResistance,
      label: 'null',
      description: 'null'
    })
  }

  return gChart.head + pointString + gChart.tail
}
