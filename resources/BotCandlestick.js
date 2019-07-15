const BotLogger = require('./BotLogger')

function BotCandlestick(bot, open = null, close = null, high = null, low = null, priceAverage = null)
{
  this.bot = bot
  this.current = null
  this.open = open
  this.close = close
  this.high = high
  this.low = low
  this.startTime = Date.now() / 1000
  this.period = this.bot.interval || 300
  this.log = new BotLogger().log
  this.priceAverage = priceAverage
}

BotCandlestick.prototype.tick = function(price)
{
  this.current = parseFloat(price)

  if(this.open == null)
    this.open = this.current

  if(this.high == null || this.current > this.high)
    this.high = this.current

  if(this.low == null || this.current < this.low)
    this.low = this.current

  if(Date.now() / 1000 >= (this.startTime + this.period))
  {
    this.close = this.current
    this.priceAverage = ( this.high + this.low + this.close ) / 3
  }

  this.log(`${new Date(Date.now()).toLocaleString()} Open: ${this.open} Close: ${this.close} High: ${this.high} Low: ${this.low} Current: ${this.current}`)
}

BotCandlestick.prototype.isClosed = function()
{
  return this.close != null
}

module.exports = BotCandlestick
