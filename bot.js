const yargs = require("yargs").alias({
  'i': 'interval',
  'c': 'currency',
  'p': 'points',
  's': 'start',
  'e': 'end'
})
const argv = yargs.argv
const validIntervals = [300,900,1800,7200,14400,86400]

function Bot()
{
  const { interval, currency, points, start, end } = argv
  this.interval = interval || 300 // Poloniex-allowed candlestick periods [300,900,1800,7200,14400,86400]
  this.currency = currency || "BTC_XMR" // Default currency pair
  this.majorCurrency = this.currency.split("_")[0] // BTC
  this.minorCurrency = this.currency.split("_")[1] // XMR
  this.dataPoints = points || []
  this.startTime = start || 1491048000 // April 1, 2017
  this.endTime = end || this.startTime + 86400 // 12 hours later
  this.prices = []
  this.currentMovingAverage = 0
  this.lengthOfMA = 0
  this.historicalData = false
  this.tradePlaced = false
  this.typeOfTrade = false
  this.dataData = ""
  this.orderNumber = ""
  this.localMax = []
  this.currentResistance = 0.018
}

module.exports = new Bot()
