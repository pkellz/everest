#!/usr/bin/env node

const Poloniex = require('poloniex.js')
const PoloniexBot = require("./Bot")
const BotCandlestick = require('./resources/BotCandlestick')
const bot = new PoloniexBot()
const fs = require('fs')
const colors = require('colors')
const prompt = require('prompt');
const yargs = require("yargs").alias({
  'config':'config'
})
const argv = yargs.argv
require('dotenv').config();
prompt.message = "Enter your";

processCredentials()
.then(init)
.catch(promptForNewCredentials)

function processCredentials()
{
  return new Promise((resolve, reject) => {
    // If credentials.json doesn't exist or --config was passed in, prompt for new credentials
    if(!fs.existsSync(__dirname + "/credentials.json") || argv.config)
      reject()
    else
    {
      fs.readFile(__dirname + '/credentials.json', (err, credentials) => {
        if (err) reject(err)
        else
        {
          const poloniex = new Poloniex(JSON.parse(credentials).API_KEY, JSON.parse(credentials).API_SECRET)
          bot.poloniex = poloniex
          resolve()
        }
      });
    }
  })
}

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

function promptForNewCredentials()
{
  prompt.get(['API Key', 'Secret'], function (err, result) {
    const credentials = `{ "API_KEY": "${result['API Key']}", "API_SECRET": "${result['Secret']}" }`

    // Save credentials to credentials.json
    fs.writeFile(__dirname + `/credentials.json`, credentials, function(err){
      if(err) throw new Error(err)
      console.log('Credentials stored');
    })
  });
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
