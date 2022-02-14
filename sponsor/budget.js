#!/usr/bin/env node

class IO {
  constructor(value, to, item, notes) {
    // Cents of dollar in my account, i.e. after any fees.
    // Currency conversions done with https://www1.oanda.com/currency/converter/
    // at the date of transfer.
    this.value = value
    this.to = to
    this.item = item
    this.notes = notes
  }
}

const date_ioss = [
  //[[year, month], [
  //  IOs
  //]],
  [[2022, 02], [
    new IO(682, 'Patreon'),
  ]],
  [[2022, 01], [
    new IO(761, 'Patreon'),
    new IO(398, 'GitHub sponsors'),
    new IO(-700, 'Heroku', 'hobby dyno monthly'),
  ]],
  [[2021, 12], [
    new IO(761, 'Patreon'),
    new IO(392, 'GitHub sponsors'),
    new IO(-700, 'Heroku', 'hobby dyno monthly'),
  ]],
  [[2021, 11], [
    new IO(765, 'Patreon'),
    new IO(394, 'GitHub sponsors'),
    new IO(-429, 'Heroku', 'hobby dyno monthly', 'partial initial month. Needed because HTTPS does not work on free plan: https://stackoverflow.com/questions/52185560/heroku-set-ssl-certificates-on-free-plan'),
    new IO(-913, 'Porkbun', 'ourbigbook.com annual'),
  ]],
  [[2021, 10], [
    new IO(763, 'Patreon'),
    new IO(716, 'GitHub sponsors'),
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
