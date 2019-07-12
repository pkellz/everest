const yargs = require("yargs").alias({
  'i': 'interval',
  'c': 'currency',
  'p': 'points'
})
const argv = yargs.argv

function Bot()
{
  this.period = 10
  this.pair = "BTC_XMR"
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
  this.dataPoints = []
  this.localMax = []
  this.currentResistance = 0.018
  process.argv.splice(0,2)
  this.args = argv
}

const bot = new Bot()
