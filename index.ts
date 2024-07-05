
const supertrend = (
    klines: {
      o: number;
      h: number;
      l: number;
      c: number;
      v: number;
    }[],
    factor: number,
    atrPeriod: number
  ): boolean => {
    const high = klines.map((k) => k.h);
    const low = klines.map((k) => k.l);
    const close = klines.map((k) => k.c);
    const src = high.map((h, i) => (h + low[i]) / 2);
    const atr = calculateATR(high, low, close, atrPeriod);
  
    const upperBand = src.map((s, i) => s + factor * atr[i]);
    const lowerBand = src.map((s, i) => s - factor * atr[i]);
  
    const result: {
      supertrend: number;
      direction: number;
    }[] = [];
  
    for (let i = 0; i < close.length; i++) {
      const prevLowerBand =
        i > 0 ? result[i - 1]?.supertrend ?? lowerBand[i] : lowerBand[i];
      const prevUpperBand =
        i > 0 ? result[i - 1]?.supertrend ?? upperBand[i] : upperBand[i];
  
      const newLowerBand =
        lowerBand[i] > prevLowerBand || close[i - 1] < prevLowerBand
          ? lowerBand[i]
          : prevLowerBand;
      const newUpperBand =
        upperBand[i] < prevUpperBand || close[i - 1] > prevUpperBand
          ? upperBand[i]
          : prevUpperBand;
  
      let direction: number;
      let supertrend: number;
  
      if (i === 0) {
        direction = 1;
        supertrend = newUpperBand;
      } else if (result[i - 1].supertrend === prevUpperBand) {
        direction = close[i] > newUpperBand ? -1 : 1;
        supertrend = direction === -1 ? newLowerBand : newUpperBand;
      } else {
        direction = close[i] < newLowerBand ? 1 : -1;
        supertrend = direction === -1 ? newLowerBand : newUpperBand;
      }
  
      result.push({ supertrend, direction });
    }
  
    // Return true for up arrow (bullish), false for down arrow (bearish)
    return result[result.length - 1].direction < 0;
  };
  
  const calculateATR = (
    high: number[],
    low: number[],
    close: number[],
    period: number
  ): number[] => {
    const trueRange = high.map((h, i) => {
      if (i === 0) return h - low[i];
      return Math.max(
        h - low[i],
        Math.abs(h - close[i - 1]),
        Math.abs(low[i] - close[i - 1])
      );
    });
  
    return calculateRMA(trueRange, period);
  };
  
  const calculateRMA = (src: number[], length: number): number[] => {
    const alpha = 1 / length;
    const result: number[] = [];
  
    for (let i = 0; i < src.length; i++) {
      if (i === 0) {
        result.push(
          src.slice(0, length).reduce((sum, val) => sum + val, 0) / length
        );
      } else {
        result.push(alpha * src[i] + (1 - alpha) * result[i - 1]);
      }
    }
  
    return result;
  };
  
  export default supertrend;
  