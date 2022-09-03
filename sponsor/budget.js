#!/usr3bin/env node

class IO {
  constructor(value, to, opts={}) {
    const { note, valueOrig, currencyOrig } = opts
    // Pounds in final account after any currency conversions and transfer fees.
    this.value = value
    this.to = to
    this.note = note
    // The original value on original currency noted on the respective dashboard.
    // The final value is the result of currency conversion + any transfer fees taken off it.
    this.valueOrig = valueOrig
    this.currencyOrig = currencyOrig
  }
}

const date_ioss = [
  //[[year, month], [
  //  IOs
  //]],
  [[2023, 01], [
    new IO(1144, 'GitHub sponsors'),
    new IO(-1366, 'Heroku', { valueOrig: -1623, currencyOrig: 'usd' }),
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
  ]],
]

let total = 0
for (const date_ios of date_ioss) {
  const [date, ios] = date_ios
  let sum = 0
  for (const io of ios) {
    sum += io.value
    total += io.value
  }
  console.log(`${date[0]}-${date[1].toString().padStart(2, '0')} ${Math.floor(sum/100)}.${Math.floor(Math.abs(sum) % 100)}`);
}
