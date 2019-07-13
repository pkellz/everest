function BotIndicator() {}

BotIndicator.prototype.movingAverage = function(dataPoints, period)
{
  if(dataPoints.length > 1)
  {
    const average = parseFloat(Sum(dataPoints.slice(dataPoints.length-period))) / dataPoints.slice(dataPoints.length-period).length
    return average
    // console.log('length',  dataPoints.slice(dataPoints.length-period).length);
    // console.log(Sum(...dataPoints.slice(dataPoints.length-period)))
    // console.log(dataPoints.slice(dataPoints.length-period).length);
    // console.log();
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
  return nums.reduce((acc, num) => acc + num )
}

module.exports = BotIndicator
