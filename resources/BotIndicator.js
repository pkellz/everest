function BotIndicator() {}

BotIndicator.prototype.movingAverage = function(dataPoints, period)
{
  if(dataPoints.length > 1)
  {
    let average;

    if(dataPoints.length < period)
      average = Sum(...dataPoints) / dataPoints.length
    else
      average = parseFloat(Sum(...dataPoints.slice(dataPoints.length-period))) / period

    return average
  }
}

BotIndicator.prototype.momentum = function(dataPoints, period = 14)
{
  if(dataPoints.length > period - 1)
    return dataPoints[dataPoints.length-1] * 100 / dataPoints[dataPoints.length-period]
}

BotIndicator.prototype.EMA = function(prices, period)
{}

BotIndicator.prototype.MACD = function(prices, nslow = 26, nfast = 12)
{}

BotIndicator.prototype.RSI = function(prices, period = 14)
{}

function Sum(...nums)
{
  return parseFloat(nums.reduce((acc, num) => acc + num))
}

module.exports = BotIndicator
