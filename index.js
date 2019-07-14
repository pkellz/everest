const PoloniexBot = require("./Bot")
const bot = new PoloniexBot()

async function backTest()
{
  await bot.chart.fetchHistoricalData()
  bot.chart.generateChart()
  // bot.candlesticks.forEach(candlestick => {
  //   bot.strategy.tick(candlestick)
  // })
}

backTest()
