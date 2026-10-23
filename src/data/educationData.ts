export interface ScriptFrame {
  timeSec: number;
  headline: string;
  subtext: string;
  visualType: 'formula' | 'chart' | 'rules';
}

export interface EducationTutorial {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  category: 'Risk Management' | 'Forex Strategies' | 'Exotic Pairs' | 'Psychology';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor: string;
  summary: string;
  keyTakeaways: string[];
  actionableRule: string;
  scriptFrames: ScriptFrame[];
}

export const EDUCATION_TUTORIALS: EducationTutorial[] = [
  {
    id: 'tut-risk-1',
    title: 'The 1% Position Sizing & Stop Loss Rule',
    duration: '4:15',
    durationSeconds: 255,
    category: 'Risk Management',
    difficulty: 'Beginner',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'Learn the foundational rule that prevents margin calls. Calculate exact lot sizes based on your account equity rather than emotional guesswork.',
    actionableRule: 'Never risk more than 1% to 2% of your equity on any single trade setup. Set your Stop Loss before you hit Buy or Sell.',
    keyTakeaways: [
      'Risk Capital = Account Equity × 0.01 (e.g. $100 on a $10,000 account)',
      'Calculate Lot Size = (Risk Amount in $) / (Stop Loss in Pips × Pip Value)',
      'High leverage (1:500) increases buying power but accelerates margin depletion if position size is too large',
      'Always keep Free Margin above 300% to stay immune from broker liquidation',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'Lesson 1: The Mathematics of Capital Preservation',
        subtext: 'Why 90% of beginners blow trading accounts in 90 days: Over-leveraging and missing stop losses.',
        visualType: 'formula',
      },
      {
        timeSec: 45,
        headline: 'Position Sizing Formula Breakdown',
        subtext: 'Lot Size = Risk Capital / (Stop Loss Pips × Pip Value). On 1 Standard Lot, 1 pip = $10.',
        visualType: 'formula',
      },
      {
        timeSec: 110,
        headline: 'Live Terminal Demonstration',
        subtext: 'Placing a 0.10 Lot order on EUR/USD with a 20-pip SL equates to exactly $20 risk.',
        visualType: 'chart',
      },
      {
        timeSec: 180,
        headline: 'The Rule of Ruin',
        subtext: 'A 50% drawdown requires a 100% gain just to break even. 1% risk allows you to survive 10 consecutive losses.',
        visualType: 'rules',
      },
    ],
  },
  {
    id: 'tut-strategy-1',
    title: 'Support & Resistance Reversal Strategy',
    duration: '5:30',
    durationSeconds: 330,
    category: 'Forex Strategies',
    difficulty: 'Beginner',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'Identify psychological ceiling and floor levels on 1H and 4H charts. Enter high-probability trades with tight stop losses.',
    actionableRule: 'Wait for price to test a major support/resistance zone AND print a candlestick rejection wick before pulling the trigger.',
    keyTakeaways: [
      'Support is a price floor where buying pressure overcomes selling pressure',
      'Resistance is a price ceiling where selling pressure pushes prices lower',
      'Look for at least 2 distinct touches to confirm a valid horizontal zone',
      'Place your Stop Loss 5-10 pips beyond the rejection wick to avoid stop hunts',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'Mapping Key Institutional Zones',
        subtext: 'Identifying horizontal support and resistance on higher timeframes (1H & 4H).',
        visualType: 'chart',
      },
      {
        timeSec: 60,
        headline: 'The 3-Step Confirmation Protocol',
        subtext: '1. Zone arrival -> 2. Momentum deceleration -> 3. Rejection pin bar candle.',
        visualType: 'rules',
      },
      {
        timeSec: 150,
        headline: 'Entering with Asymmetric Risk-Reward',
        subtext: 'Aiming for the opposing boundary provides a minimum 1:2.5 reward-to-risk ratio.',
        visualType: 'chart',
      },
    ],
  },
  {
    id: 'tut-exotics-1',
    title: 'Trading USD/KES & Exotic Currency Pairs',
    duration: '4:45',
    durationSeconds: 285,
    category: 'Exotic Pairs',
    difficulty: 'Intermediate',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'Master the unique dynamics of the Kenyan Shilling (USD/KES). Learn how central bank decisions, M-Pesa volume, and wider spreads impact execution.',
    actionableRule: 'Account for higher spread pips (approx 30 pips) by using wider swing targets and avoiding ultra-short 1-minute scalping.',
    keyTakeaways: [
      'USD/KES is driven by Kenyan import-export cycles, tea/coffee yields, and CBK rate revisions',
      'Spread is higher on exotic pairs; trade on 1H or 1D timeframes for optimal net profit',
      'Local market liquidity is strongest between 9:00 AM and 3:00 PM East Africa Time (EAT)',
      'Convert trading earnings seamlessly to M-Pesa with instant local payouts',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'Introduction to Local Currency FX (USD/KES)',
        subtext: 'Why African exotic currency pairs offer high-yield macroeconomic trend opportunities.',
        visualType: 'chart',
      },
      {
        timeSec: 70,
        headline: 'Managing Exotic Spreads & Volatility',
        subtext: 'Exotics have wider spreads than EUR/USD. Never scalp; swing trade for 50-150 pip moves.',
        visualType: 'formula',
      },
      {
        timeSec: 160,
        headline: 'M-Pesa Cashflow & Treasury Hedging',
        subtext: 'Using WurlFX dual balances to hedge against local currency depreciation.',
        visualType: 'rules',
      },
    ],
  },
  {
    id: 'tut-strategy-2',
    title: 'Trend Following with 20 SMA & Pullbacks',
    duration: '5:10',
    durationSeconds: 310,
    category: 'Forex Strategies',
    difficulty: 'Intermediate',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'The simplest trend-following system used by institutional funds. Ride trends while buying dips at the 20-period Moving Average.',
    actionableRule: 'Only take Buy trades when price is above the 20 SMA, and only Sell when price is below the 20 SMA.',
    keyTakeaways: [
      'The 20 SMA acts as dynamic support in an uptrend and dynamic resistance in a downtrend',
      'Never chase an overextended candle; wait for price to retrace back to the moving average',
      'Combine the 20 SMA with the Relative Strength Index (RSI) for overbought/oversold filtering',
      'Trail your stop loss behind preceding swing lows as the trend progresses',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'The Principle of Dynamic Averages',
        subtext: 'Why the 20 SMA smooths price noise and reveals true market direction.',
        visualType: 'chart',
      },
      {
        timeSec: 75,
        headline: 'The Pullback Entry Trigger',
        subtext: 'Wait for price to test the moving average line, then enter on the first directional candle.',
        visualType: 'rules',
      },
      {
        timeSec: 160,
        headline: 'Trailing Stop Losses for Maximum Yield',
        subtext: 'Let winning trades run until price closes on the opposite side of the 20 SMA.',
        visualType: 'chart',
      },
    ],
  },
  {
    id: 'tut-risk-2',
    title: 'The Asymmetric 1:3 Risk-to-Reward Formula',
    duration: '3:50',
    durationSeconds: 230,
    category: 'Risk Management',
    difficulty: 'Beginner',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'Mathematical proof of why win rate is secondary. How a trader with only a 35% win rate can outperform someone with an 80% win rate.',
    actionableRule: 'Every trade setup must have a potential profit target at least 2 to 3 times greater than the risk distance.',
    keyTakeaways: [
      'With a 1:3 Risk/Reward: 10 Trades, 4 Wins (+$1,200), 6 Losses (-$600) = Net Profit +$600',
      'Never adjust your Take Profit closer out of fear while letting Stop Loss widen',
      'Calculate R-Multiples (1R, 2R, 3R) to standardize performance across different currency pairs',
      'Use the WurlFX Order Panel SL/TP calculators to verify R:R before executing',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'The Myth of High Win Rates',
        subtext: 'Why chasing a 90% win rate leads to catastrophic blowups when one large loss wipes out gains.',
        visualType: 'formula',
      },
      {
        timeSec: 60,
        headline: 'The 10-Trade Monte Carlo Simulation',
        subtext: 'Visualizing account equity curves with 40% win rate at 1:3 versus 70% win rate at 1:0.5.',
        visualType: 'formula',
      },
      {
        timeSec: 130,
        headline: 'Enforcing Asymmetric Execution in WurlFX',
        subtext: 'Setting Take Profit at 3x Stop Loss distance in the terminal.',
        visualType: 'rules',
      },
    ],
  },
  {
    id: 'tut-psych-1',
    title: 'Eliminating Revenge Trading & The Demo-to-Real Shift',
    duration: '4:00',
    durationSeconds: 240,
    category: 'Psychology',
    difficulty: 'All Levels',
    instructor: 'Wurl_Sphilah (Principal Trader)',
    summary: 'Master the psychological transition from risk-free Demo practice capital to real capital. Stop overtrading after an unexpected loss.',
    actionableRule: 'After 2 consecutive losses in a single day, enforce a mandatory 2-hour screen cooldown before entering another position.',
    keyTakeaways: [
      'Revenge trading happens when ego tries to recover losses by instantly doubling lot sizes',
      'Treat your $10,000 Demo balance with the exact same emotional discipline as real money',
      'Document every trade in the Trading History ledger with win rate analytics',
      'True professionals think in series of 100 trades, not single trade emotional highs or lows',
    ],
    scriptFrames: [
      {
        timeSec: 0,
        headline: 'The Psychology of Losses in Leveraged Trading',
        subtext: 'Understanding cortisol spikes and how impulsive clicks destroy capital.',
        visualType: 'rules',
      },
      {
        timeSec: 50,
        headline: 'The 2-Loss Mandatory Circuit Breaker',
        subtext: 'Stepping away from the terminal to reset objectivity.',
        visualType: 'rules',
      },
      {
        timeSec: 120,
        headline: 'Mindset Calibration: Series of 100 Trades',
        subtext: 'Evaluating your strategy over a statistical sample rather than today’s outcome.',
        visualType: 'formula',
      },
    ],
  },
];
