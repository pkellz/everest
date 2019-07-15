const PoloniexBot = require("./Bot")
const bot = new PoloniexBot()
const BotCandlestick = require('./resources/BotCandlestick')

async function liveTrader()
{
  let developingCandlestick = new BotCandlestick(bot)
  while(true)
  {
    try
    {
      bot.chart.getCurrentPrice().then(price => {
        developingCandlestick.tick(price)
      })
    }
    catch(e)
    {
      e.stackTrace()
      setTimeout(() => {
        bot.chart.getCurrentPrice().then(price => {
          developingCandlestick.tick(price)
        })
      },30000)
    }

    if(developingCandlestick.isClosed())
    {
      bot.candlesticks.push(developingCandlestick)
      bot.strategy.tick(developingCandlestick)
      developingCandlestick = new BotCandlestick(bot)
    }
    await sleep(10000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// liveTrader()

async function backTester()
{
  await bot.chart.fetchHistoricalData()
  bot.chart.generateChart()
  bot.candlesticks.forEach(candlestick => {
    bot.strategy.tick(candlestick)
  })
}

// backTester()
