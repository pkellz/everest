function BotTrade(currentPrice, stopLoss)
{
  this.status = "OPEN"
  this.entryPrices = currentPrice
  this.exitPrice = ""
  // this.bot....

}

module.exports = new BotTrade()
