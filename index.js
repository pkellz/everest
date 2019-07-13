const Bot = require("./Bot")
const bot = new Bot()

async function init()
{
  await bot.chart.fetchHistoricalData()

  bot.candlesticks.forEach(candlestick => {
    bot.strategy.tick(candlestick)
  })
}

init()
