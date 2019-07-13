const fs = require('fs');
const gChart = require('./assets/googleChart')
const Poloniex = require('poloniex.js')
const poloniex = new Poloniex(process.env.API_KEY, process.env.API_SECRET)
require('dotenv').config();

function Chart(bot)
{
  this.bot = bot
}

Chart.prototype.generateChart = function()
{
  console.log('Fetching Chart Data...');
  poloniex.returnChartData(this.bot.majorCurrency, this.bot.minorCurrency, this.bot.interval, this.bot.startTime, this.bot.endTime)
  .then(points => {
    console.log('Success!');
    this.bot.historicalData = points
    this.createGoogleChart(this.bot.historicalData)
  })
  .catch(err => {
    console.log(err);
  })
}

Chart.prototype.createGoogleChart = function(historicalData)
{
  const chartHtml = this.getHtmlForGoogleChart(historicalData)
  this.writeChartDataToHtmlFile(chartHtml)
}

Chart.prototype.getHtmlForGoogleChart = function(historicalData)
{
  console.log('Generating Html File...');

  let nextDataPoint
  let lastPairPrice
  let dataDate
  let dataPoints = []
  let pointString = ``
  let done = true
  let numberOfSimilarLocalMaxes

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
      trend: this.bot.currentResistance,
      label: 'null',
      description: 'null'
    })

    if(dataPoints.length > 2 && (dataPoints[dataPoints.length-2].price > dataPoints[dataPoints.length-1].price) && (dataPoints[dataPoints.length-2].price > dataPoints[dataPoints.length-3].price))
    {
      dataPoints[dataPoints.length-2].label = `'MAX'`
			dataPoints[dataPoints.length-2].description =`' This is a local maximum'`
      numberOfSimilarLocalMaxes = 0

      this.bot.localMax.forEach(oldMax => {
        if((oldMax > dataPoints[dataPoints.length-2].price - 0.0001) && (oldMax < dataPoints[dataPoints.length-2].price + 0.0001))
          ++numberOfSimilarLocalMaxes
      })

      if (numberOfSimilarLocalMaxes > 2)
      {
        this.bot.currentResistance = dataPoints[dataPoints.length-2].price
        dataPoints[dataPoints.length-2].trend = dataPoints[dataPoints.length-2].price
        dataPoints[dataPoints.length-1].trend = dataPoints[dataPoints.length-2].price
      }

      this.bot.localMax.push(dataPoints[dataPoints.length-2].price)
    }
  }

  return gChart.head + pointString + gChart.tail
}

Chart.prototype.writeChartDataToHtmlFile = function(chartHtml)
{
  console.log('Writing Chart Data To Html File...');
  fs.writeFile('chart.html', chartHtml, function(err){
    if(err) throw new Error(err)
    console.log('Success!');
  })
}
module.exports = Chart
