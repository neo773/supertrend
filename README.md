# simple-supertrend

## Overview

The `simple-supertrend` is a simple yet powerful tool for determining market trends. It provides a boolean signal indicating whether the market is in an uptrend or downtrend based on the Supertrend indicator.

## Features

- Calculates the Supertrend indicator
- Returns a boolean signal for uptrend (true) or downtrend (false)
- Lightweight and easy to integrate
- Based on TradingView's Supertrend Indicator

## Usage

```ts
import supertrend from "simple-supertrend";

const isSupertrendUptrend = supertrend(klines, period, multiplier);
// returns boolean
```
