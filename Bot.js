const yargs = require("yargs").alias({
  'i': 'interval',
  'c': 'currency',
  'p': 'points',
  's': 'start',
  'e': 'end'
})
const argv = yargs.argv
const validIntervals = {
  fiveMinutes: 300,
  fifteenMinutes: 900,
  thirtyMinutes: 1800,
  twoHours: 7200,
  fourHours: 14400,
  sixHours: 21600,
  twelveHours: 43200
}
const BotLogger = require('./resources/BotLogger')
const resources = {
  Chart: require('./resources/BotChart')
}

function Bot()
{
  const { interval, currency, points, start, end } = argv
  this.interval = interval || validIntervals.fifteenMinutes     // Poloniex-allowed candlestick periods [300,900,1800,7200,14400,86400]
  this.currency = currency || "BTC_XMR"                         // Default currency pair
  this.startTime = start || 1491048000                          // April 1, 2017
  this.dataPoints = points || []
  this.endTime = end || this.startTime + validIntervals.twelveHours
  this.majorCurrency = this.currency.split("_")[0]              // BTC
  this.minorCurrency = this.currency.split("_")[1]              // XMR
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
  this.log = new BotLogger().log
  initResources.call(this, resources)
}

function initResources(resources)
{
  for(let res in resources)
  {
    const boundResource = resources[res].bind(null, this);
    this[res.toLowerCase()] = new boundResource;
  }
}

module.exports = Bot
