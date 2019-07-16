const BotLogger = require('./BotLogger')
const Poloniex = require('poloniex.js')
const poloniex = new Poloniex(process.env.API_KEY, process.env.API_SECRET)
require('dotenv').config();

function BotTrade(currentPrice, bot, stopLoss)
{
  this.bot = bot
  this.status = "OPEN"
  this.entryPrice = currentPrice
  this.exitPrice = ""
  this.log = new BotLogger().log
  this.log("Opening Trade...".yellow)
  if(stopLoss)
    this.stopLoss = currentPrice - stopLoss

  if(this.bot.realMoney)
  {
    this.log(`Initiating Buy Order for ${this.bot.tradeAmount} ${this.bot.majorCurrency} at the rate of 1 ${this.bot.minorCurrency} = ${this.entryPrice} ${this.bot.majorCurrency}...`.yellow);
    poloniex.buy(this.bot.majorCurrency, this.bot.minorCurrency, this.entryPrice, this.bot.tradeAmount).then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log('Error When Placing Buy Order...'.red);
      console.log(err);
    })
  }
}

BotTrade.prototype.close = function(currentPrice)
{
  this.status = "CLOSED"
  this.exitPrice = currentPrice
  this.log('Closing Trade...'.yellow);

  if(this.bot.realMoney)
  {
    this.log(`Initiating Sell Order for ${this.bot.tradeAmount} ${this.bot.majorCurrency} at the rate of 1 ${this.bot.minorCurrency} = ${this.exitPrice} ${this.bot.majorCurrency}...`.yellow);
    poloniex.sell(this.bot.majorCurrency, this.bot.minorCurrency, this.exitPrice, this.bot.tradeAmount).then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log('Error When Placing Sell Order...'.red);
      console.log(err);
    })
  }
}

BotTrade.prototype.tick = function(currentPrice)
{
  if(this.stopLoss)
    if(currentPrice < this.stopLoss)
    {
      this.log("Stop Loss Triggered...".red);
      this.close(currentPrice)
    }
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
