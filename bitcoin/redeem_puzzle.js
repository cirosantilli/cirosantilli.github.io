#!/usr/bin/env node

// inputs
from_txid = '0f2084be761e258f9bdb00d546b44a173cc31951a7f8d1f64b63c4c5da73cdb4'
from_vout = 0
to_ammount = 63800

// Insane 6 btc one...
// https://www.blockchain.com/explorer/transactions/btc/5660d06bd69326c18ec63127b37fb3b32ea763c3846b3334c51beb6a800c57d3
from_txid = '5660d06bd69326c18ec63127b37fb3b32ea763c3846b3334c51beb6a800c57d3'
from_vout = 0


to_addr = '3KRk7f2JgekF6x7QBqPHdZ3pPDuMdY3eWR'
to_ammount = 63800
// https://bitcoinfees.gitlab.io/
to_fee = 27 * 255
to_net = to_ammount - to_fee

const bitcoin = require('bitcoinjs-lib')
const { alice } = require('./wallets.json')
const network = bitcoin.networks.bitcoin
const redeemScript = bitcoin.script.compile([
  bitcoin.opcodes.OP_ADD,
  bitcoin.opcodes.OP_5,
  bitcoin.opcodes.OP_EQUAL])
//const p2sh = bitcoin.payments.p2sh({redeem: {output: redeemScript, network}, network})
//const keyPairAlice0 = bitcoin.ECPair.fromWIF(alice[0].wif, network)
//const p2wpkhAlice0 = bitcoin.payments.p2pkh({ pubkey: keyPairAlice0.publicKey, network })
const p2wpkhAlice0 = bitcoin.payments.p2sh({ address: to_addr, network })
const txb = new bitcoin.TransactionBuilder(network)
txb.addInput(from_txid, from_vout)
txb.addOutput(p2wpkhAlice0.address, to_net)
console.error('p2wpkhAlice0.address: ' + require('util').inspect(p2wpkhAlice0.address));
//txb.addOutput(to_addr, to_ammount - to_fee)
const tx = txb.buildIncomplete()
const InputScriptP2SH = bitcoin.script.compile([bitcoin.opcodes.OP_2, bitcoin.opcodes.OP_3])
tx.setInputScript(0, InputScriptP2SH)
console.log(tx.toHex())
