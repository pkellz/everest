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
  this.orderNumber = null
  this.log = new BotLogger().log
  this.log("Opening Trade...".yellow)
  if(stopLoss)
    this.stopLoss = currentPrice - stopLoss

  // Place a real Buy Order
  if(this.bot.realMoney)
  {
    // Compensate for Maker/Taker Fee
    const fee = this.bot.tradeAmount * 0.025
    this.bot.tradeAmount += fee

    this.log(`Initiating Buy Order for ${this.bot.tradeAmount} ${this.bot.minorCurrency} at the rate of 1 ${this.bot.minorCurrency} = ${this.entryPrice} ${this.bot.majorCurrency}...`.yellow);

    // Buy
    poloniex.buy(this.bot.majorCurrency, this.bot.minorCurrency, this.entryPrice, this.bot.tradeAmount).then(order => {
      if(order.orderNumber)
        this.orderNumber = order.orderNumber
      console.log(order);
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

  // Place a real Sell Order
  if(this.bot.realMoney)
  {
    let buyOrderFulfilled = true

    // Check to see if the Buy Order has been closed
    if(this.orderNumber)
    {
      poloniex.returnOpenOrders("all").then(orders => {
        if(orders.length > 0)
        {
          orders.forEach(order => {
            if(order.orderNumber == this.orderNumber)
              buyOrderFulfilled = false
          })
        }
      }).catch(console.error)

      if(buyOrderFulfilled)
      {
        this.orderNumber = null

        // Compensate for Maker/Taker Fee
        const fee = parseFloat(this.bot.tradeAmount * 0.025)
        this.bot.tradeAmount += fee

        this.log(`Initiating Sell Order for ${this.bot.tradeAmount} ${this.bot.minorCurrency} at the rate of 1 ${this.bot.minorCurrency} = ${this.exitPrice} ${this.bot.majorCurrency}...`.yellow);

        // Sell
        poloniex.sell(this.bot.majorCurrency, this.bot.minorCurrency, this.exitPrice, this.bot.tradeAmount).then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log('Error When Placing Sell Order...'.red);
          console.log(err);
        })
      }
      else
        this.log("Buy Order has not been completely fulfilled yet. Retrying the sell on next iteration...".red)
    }
    else
      this.log("Cannot find the associated order number from the Buy Order".red)
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
