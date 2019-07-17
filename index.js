#!/usr/bin/env node

const PoloniexBot = require("./Bot")
const bot = new PoloniexBot()
const fs = require('fs')
const BotCandlestick = require('./resources/BotCandlestick')
const colors = require('colors')
const prompt = require('prompt');
const yargs = require("yargs").alias({
  'config':'config'
})
const argv = yargs.argv
require('dotenv').config();
prompt.message = "Enter your";

if(argv.config || !process.env.API_KEY && !process.env.API_SECRET)
{
  prompt.get(['API Key', 'Secret'], function (err, result) {
    const credentials = "API_KEY=" + result['API Key'] + "\nAPI_SECRET="+ result['Secret']

    // Save credentials to .env file
    fs.writeFile(__dirname + `/.env`, credentials, function(err){
      if(err) throw new Error(err)
      console.log('Credentials stored');
    })
  });
}
else
  init()

function init()
{
  if(bot.live)
  {
    console.log(`💰 Live Trading Mode... (Major: ${bot.majorCurrency}) (Minor: ${bot.minorCurrency}) (Interval: ${bot.interval}s) (Real Money: ${bot.realMoney}) (Trade Amount: ${bot.tradeAmount}) (Stop Loss: ${bot.stopLoss})`.yellow);
    liveTrader()
  }
  else
  {
    console.log(`📊 Backtesting Mode... (Major: ${bot.majorCurrency}) (Minor: ${bot.minorCurrency}) Period: ${bot.period}s Start: ${bot.startTime} End: ${bot.endTime}`.magenta);
    backTest()
  }
}

async function liveTrader()
{
  let developingCandlestick = new BotCandlestick(bot)
  while(true)
  {
    bot.chart.getCurrentPrice().then(price => {
      developingCandlestick.tick(price)
    })
    .catch(err => {
      throw err
    })

    if(developingCandlestick.isClosed())
    {
      bot.candlesticks.push(developingCandlestick)
      bot.strategy.tick(developingCandlestick)
      developingCandlestick = new BotCandlestick(bot)
    }
    await sleep(10000);
  }
}

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function backTest()
{
  await bot.chart.fetchHistoricalData()
  bot.chart.generateChart()
  bot.candlesticks.forEach(candlestick => {
    bot.strategy.tick(candlestick)
  })
}
