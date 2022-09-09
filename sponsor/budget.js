#!/usr/bin/env node

/** GBP in/out of bank account. */
class IO {
  constructor(value, to, opts={}) {
    const { note, valueOrig, currencyOrig } = opts
    // GBP cents in final account after any currency conversions and transfer fees.
    this.value = value
    // To or from which person or organization.
    this.to = to
    this.note = note
    // The original value on original currency noted on the respective dashboard.
    // The final value is the result of currency conversion + any transfer fees taken off it.
    this.valueOrig = valueOrig
    this.currencyOrig = currencyOrig
  }
}

/** Stack Overflow. */
class SO {
  constructor(yearRank, yearRankProof) {
    this.yearRank = yearRank
    this.yearRankProof = yearRankProof
  }
}

const date_ioss = [
  //[[year, month], [
  //  IOs
  //]],

$

  [[2023, 10], [
    new IO(0, 'Heroku TODO', { valueOrig: -1623, currencyOrig: 'usd' }),
  ]],
  [[2023, 09], [
    new IO(66375, 'anonymous one off', { valueOrig: 0.03207618, currencyOrig: 'btc', note: 'Coinbase, Spot Price: 21326.66, subtotal: £687.54, total (fees/spread): £677.30, then £13.55 Coinbase cashout fee (~2%). Transaction: https://www.blockchain.com/explorer/transactions/btc/c5fa598a6f283dbf1fb44233a91abf3f704d7fcd2d09b9bbb1a05e6018f3e53d' }),
    new IO(2114, 'GitHub sponsors', { note: 'one off extra donation received' }),
    new IO(-1339, 'Heroku'),
  ]],
  [[2023, 08], [
    new IO(1006, 'GitHub sponsors'),
    new IO(-1300, 'Heroku'),
  ]],
  [[2023, 07], [
    new IO(1011, 'GitHub sponsors'),
    new IO(-1293, 'Heroku'),
  ]],
  [[2023, 06], [
    new IO(1032, 'GitHub sponsors'),
    new IO(-1330, 'Heroku'),
  ]],
  [[2023, 05], [
    new IO(1027, 'GitHub sponsors'),
    new IO(-1319, 'Heroku'),
  ]],
  [[2023, 04], [
    new IO(1041, 'GitHub sponsors'),
    new IO(-1335, 'Heroku'),
  ]],
  [[2023, 03], [
    new IO(1068, 'GitHub sponsors'),
    new IO(-1393, 'Heroku'),
  ]],
  [[2023, 02], [
    new IO(2096, 'GitHub sponsors'),
    new IO(-1389, 'Heroku'),
  ]],
  [[2023, 01], [
    new IO(1144, 'GitHub sponsors'),
    new IO(-1366, 'Heroku', { valueOrig: -1623, currencyOrig: 'usd' }),
    new SO(45, 'https://stackexchange.com/leagues/1/year/stackoverflow/2022-01-01?sort=reputationchange&page=2'),
  ]],
  [[2022, 12], [
    new IO(1140, 'GitHub sponsors'),
    new IO(-1356, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd' }),
  ]],
  [[2022, 11], [
    new IO(1195, 'GitHub sponsors'),
    new IO(-1454, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd' }),
    new IO(-899, 'Porkbun', { note: 'ourbigbook.com domain annual renewal', valueOrig: -973, currencyOrig: 'usd' }),
  ]],
  [[2022, 10], [
    new IO(1244, 'GitHub sponsors'),
    new IO(-1495, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd' }),
  ]],
  [[2022, 09], [
    new IO(1195, 'GitHub sponsors'),
    new IO(-1420, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd' }),
  ]],
  [[2022, 08], [
    new IO(1136, 'GitHub sponsors'),
    new IO(-1370, 'Heroku', { valueOrig: -1603, currencyOrig: 'usd' }),
  ]],
  [[2022, 07], [
    new IO(1152, 'GitHub sponsors'),
    new IO(-1396, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd' }),
  ]],
  [[2022, 06], [
    new IO(1187, 'GitHub sponsors'),
    new IO(-1320, 'Heroku', { valueOrig: -1600, currencyOrig: 'usd', notes: 'needed to upgrade to PostgreSQL heroku-postgresql:basic (9 USD/month on top of the 7 USD/month dyno because the row count after cirosantilli.github.io upload was too much for the free plan. This upgrade will however hold for a very long time, plenty of storage available.' }),
  ]],
  [[2022, 05], [
    new IO(1105, 'GitHub sponsors'),
    new IO(-746, 'Heroku', { valueOrig: -888, currencyOrig: 'usd' }),
  ]],
  [[2022, 04], [
    new IO(1057, 'GitHub sponsors'),
    new IO(-556, 'Heroku', { valueOrig: -701, currencyOrig: 'usd' }),
  ]],
  [[2022, 03], [
    new IO(1036, 'GitHub sponsors'),
    new IO(-551, 'Heroku', { valueOrig: -700, currencyOrig: 'usd', notes: 'a bit higher than 700 because builds take up a separate dyno' }),
  ]],
  [[2022, 02], [
    new IO(682, 'Patreon'),
    new IO(1907, 'GitHub sponsors'),
    new IO(-533, 'Heroku', { valueOrig: -700, currencyOrig: 'usd' }),
  ]],
  [[2022, 01], [
    new IO(761, 'Patreon'),
    new IO(292, 'GitHub sponsors'),
    new IO(-531, 'Heroku', { valueOrig: -700, currencyOrig: 'usd' }),
    new SO(50, 'https://stackexchange.com/leagues/1/year/stackoverflow/2021-01-01?sort=reputationchange&page=2'),
  ]],
  [[2021, 12], [
    new IO(761, 'Patreon'),
    new IO(296, 'GitHub sponsors'),
    new IO(-536, 'Heroku', { valueOrig: -429, currencyOrig: 'usd', note: '7 USD/month hobby dyno monthly. Partial initial month. Billing happens for usage on previous whole month, e.g. this one is for November 2021. Upgrade needed because HTTPS does not work on free plan: https://stackoverflow.com/questions/52185560/heroku-set-ssl-certificates-on-free-plan' }),
  ]],
  [[2021, 11], [
    new IO(765, 'Patreon'),
    new IO(293, 'GitHub sponsors'),
    new IO(-704, 'Porkbun', { note: 'ourbigbook.com domain registration + annual cost', valueOrig: -913, currencyOrig: 'usd' }),
  ]],
  [[2021, 10], [
    new IO(519, 'GitHub sponsors'),
  ]],
  [[2021, 09], [
    new IO(285, 'GitHub sponsors'),
  ]],
  [[2021, 08], [
    new IO(285, 'GitHub sponsors'),
  ]],
  [[2021, 07], [
    new IO(355, 'GitHub sponsors'),
  ]],
  [[2021, 06], [
    new IO(140, 'GitHub sponsors'),
  ]],
  [[2021, 05], [
    new IO(140, 'GitHub sponsors'),
  ]],
  [[2021, 04], [
    new IO(143, 'GitHub sponsors'),
  ]],
  [[2021, 03], [
    new IO(142, 'GitHub sponsors'),
  ]],
  [[2021, 02], [
    new IO(142, 'GitHub sponsors'),
  ]],
  [[2021, 01], [
    new IO(437, 'GitHub sponsors'),
    new SO(56, 'https://stackexchange.com/leagues/1/year/stackoverflow/2020-01-01?sort=reputationchange&page=2'),
  ]],
  [[2020, 01], [
    new SO(59, 'https://stackexchange.com/leagues/1/year/stackoverflow/2019-01-01?sort=reputationchange&page=2'),
  ]],
  [[2019, 01], [
    new SO(97, 'https://stackexchange.com/leagues/1/year/stackoverflow/2018-01-01?sort=reputationchange&page=2'),
  ]],
  [[2018, 01], [
    new SO(127, 'https://stackexchange.com/leagues/1/year/stackoverflow/2017-01-01?sort=reputationchange&page=3'),
  ]],
  [[2017, 01], [
    new SO(128, 'https://stackexchange.com/leagues/1/year/stackoverflow/2016-01-01?sort=reputationchange&page=3'),
  ]],
  [[2016, 01], [
    new SO(426, 'https://stackexchange.com/leagues/1/year/stackoverflow/2015-01-01?sort=reputationchange&page=9'),
  ]],
  [[2015, 01], [
    new SO(2614, 'https://stackexchange.com/leagues/1/year/stackoverflow/2014-01-01?sort=reputationchange&page=53'),
  ]],
]

function centToDot(sum) {
  return `${sum > 0 ? '+' : ''}${Math.floor(sum/100)}.${Math.floor(Math.abs(sum) % 100)}`
}

let total = 0
for (const date_ios of [...date_ioss].reverse()) {
  const [date, ios] = date_ios
  let sum = 0
  for (const io of ios) {
    if (io.constructor === IO) {
      sum += io.value
      total += io.value
    }
  }
  console.log(`${date[0]}-${date[1].toString().padStart(2, '0')} ${centToDot(sum)}`);
}
console.log(`net profit: ${centToDot(total)}`);
