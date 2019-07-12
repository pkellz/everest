const yargs = require("yargs").alias({
  'i': 'interval',
  'c': 'currency',
  'p': 'points'
})
const argv = yargs.argv
const validIntervals = [300,900,1800,7200,14400,86400]

function Bot()
{
  const { interval, currency, points } = argv
  this.interval = interval || 10 // [300,900,1800,7200,14400,86400]
  this.currency = currency || "BTC_XMR"
  this.dataPoints = points || []
  this.prices = []
  this.currentMovingAverage = 0
  this.lengthOfMA = 0
  this.startTime = false
  this.endTime = false
  this.historicalData = false
  this.tradePlaced = false
  this.typeOfTrade = false
  this.dataData = ""
  this.orderNumber = ""
  this.localMax = []
  this.currentResistance = 0.018
}

module.exports = new Bot()
