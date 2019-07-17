const yargs = require("yargs").alias({
  'i': 'interval',
  'c': 'currency',
  's': 'start',
  'e': 'end',
  'p': 'period',
  'l': 'live',
  'r': 'real',
  't': 'tradeAmount',
  'stopLoss': 'stopLoss'
})
const argv = yargs.argv
// Time intervals (s)
const timeInterval = {
  twoMinutes: 120,
  fiveMinutes: 300,
  fifteenMinutes: 900,
  thirtyMinutes: 1800,
  oneHour: 3600,
  twoHours: 7200,
  fourHours: 14400,
  sixHours: 21600,
  twelveHours: 43200,
}
const BotLogger = require('./resources/BotLogger')
const resources = {
  Chart: require('./resources/BotChart'),
  Strategy: require('./resources/BotStrategy')
}

function Bot()
{
  const { interval, currency, points, start, end, period, live, real, tradeAmount, stopLoss } = argv

  // Live Trade Mode - No real money
  this.live = live || false
  // Live Trade Mode - With your real money
  this.realMoney = real || false
  // Amount to buy/sell for each Order
  this.tradeAmount = parseFloat(tradeAmount) || 0.01
  // Candlestick width for backtesting chart
  this.period = period || timeInterval.fifteenMinutes
  // Time interval (s) between calculating the next moving average. Shorter intervals = trades happen fastter
  this.interval = interval || timeInterval.twoMinutes
  // Default Currency Pair
  this.currency = currency || "BTC_ETH"
  // Default Backtesting End Date - Right Now
  this.endTime = end || Math.floor(new Date().getTime() / 1000)
  // Default Backtesting Start Date
  this.startTime = start || Math.floor(this.endTime - timeInterval.sixHours)
  if(this.endTime < this.startTime)
    throw new Error("Start time must be less than the end time!")
  this.dataPoints = points || []
  this.stopLoss = stopLoss || 0.001
  this.majorCurrency = this.currency.split("_")[0]
  this.minorCurrency = this.currency.split("_")[1]
  this.prices = []
  this.historicalData = false
  this.log = new BotLogger().log
  this.candlesticks = []
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
