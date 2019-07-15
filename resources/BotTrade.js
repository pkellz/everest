const BotLogger = require('./BotLogger')
const Poloniex = require('poloniex.js')
const poloniex = new Poloniex(process.env.API_KEY, process.env.API_SECRET)
require('dotenv').config();

function BotTrade(currentPrice, bot, stopLoss = 0)
{
  this.bot = bot
  this.status = "OPEN"
  this.entryPrice = currentPrice
  this.exitPrice = ""
  this.log = new BotLogger().log
  this.log("Opening Trade...")

  // Uncomment the following lines when you are ready for your bot to make real Buy Orders when live-trading
  // poloniex.buy(this.bot.majorCurrency, this.bot.minorCurrency, this.entryPrice, 0.01).then(data => {
  //   console.log(data);
  // })
  // .catch(err => {
  //   throw new Error(err)
  // })
  if(stopLoss)
    this.stopLoss = currentPrice - stopLoss
}

BotTrade.prototype.close = function(currentPrice)
{
  this.status = "CLOSED"
  this.exitPrice = currentPrice
  this.log('Closing Trade...');

  // Uncomment the following lines when you are ready for your bot to make real Sell Orders when live-trading
  // poloniex.sell(this.bot.majorCurrency, this.bot.minorCurrency, this.exitPrice, 0.001).then(data => {
  //   console.log(data);
  // })
  // .catch(err => {
  //   console.log(err);
  // })
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

  if(this.status == "CLOSED")
  {
    tradeStatus += " Profit: "
    if(this.exitPrice > this.entryPrice)
      tradeStatus += "\033[92m"
    else
      tradeStatus += "\033[91m"
    tradeStatus += this.exitPrice - this.entryPrice +"\033[0m"
  }
  this.log(tradeStatus)
}

module.exports = BotTrade
