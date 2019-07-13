const BotLogger = require('./BotLogger')

function BotTrade(currentPrice, stopLoss = 0)
{
  this.status = "OPEN"
  this.entryPrice = currentPrice
  this.exitPrice = ""
  this.log = new BotLogger().log
  this.log("Trade Opened")
  if(stopLoss)
    this.stopLoss = currentPrice - stopLoss
}

BotTrade.prototype.close = function(currentPrice)
{
  this.status = "CLOSED"
  this.exitPrice = currentPrice
  this.log("Trade Closed")
}

BotTrade.prototype.tick = function(currentPrice)
{
  if(this.stopLoss)
    if(currentPrice < this.stopLoss)
      this.close(currentPrice)
}

BotTrade.prototype.showTrade = function()
{
  let tradeStatus = `Entry Price: ${this.entryPrice} Status: ${this.status} Exit Price: ${this.exitPrice}`

  if(this.status = "CLOSED")
  {
    tradeStatus += "Profit: "
    if(this.exitPrice > this.entryPrice)
      tradeStatus += "\033[92m"
    else
      tradeStatus += "\033[91m"
    tradeStatus += "" + (this.exitPrice - this.entryPrice) + " \033]0m"
  }
  this.log(tradeStatus)
}

module.exports = BotTrade
