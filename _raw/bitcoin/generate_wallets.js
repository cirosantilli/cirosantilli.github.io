#!/usr/bin/env node

/**
 * Generate wallets (Alice, Bob, Carol), create a json file and import private keys to Bitcoin Core
 *
 * BIP32 methods
 *  - fromBase58
 *  - fromPrivateKey
 *  - fromPublicKey
 *  - fromSeed
 *
 * BIP39 methods
 *  - mnemonicToSeed
 *  - mnemonicToSeedHex
 *  - mnemonicToEntropy
 *  - entropyToMnemonic
 *  - generateMnemonic
 *  - validateMnemonic
 */

const { exec } = require('child_process')
const bitcoin = require('bitcoinjs-lib')
const bip32 = require('bip32')
const bip39 = require('bip39')
// Change the network appropriately
const network = bitcoin.networks.regtest

// Replace these values
// 128 bit entropy => 12 words mnemonic
// bx seed -b 128
const wallets = [
  {alice: '182301471f6892728ae56bb95b54396e'},
  {bob: '28c8b37e1462a460fafa440d3ec66d29'},
  {carol: '61628dbe355f4675d895d399b984aaf4'}
]

// Create a json file with main info
let walletsJSON="{"

// Iterate on wallets
wallets.map((wallet, wallet_index) => {
  walletsJSON += `"${Object.keys(wallet)}": [`
  // Get mnemonic from entropy
  let mnemonic = bip39.entropyToMnemonic(wallet[Object.keys(wallet)])
  console.log(`${Object.keys(wallet)} mnemonic  `, mnemonic)
  // Get seed from mnemonic
  let seed = bip39.mnemonicToSeed(mnemonic)
  console.log(`${Object.keys(wallet)} seed  `, seed.toString('hex'))
  // Get master BIP32 master from seed
  let master = bip32.fromSeed(seed, network)
  // Get private key WIF
  let wif = master.toWIF()
  console.log(`${Object.keys(wallet)} master wif  `, wif)
  // Get BIP32 extended private key
  let xpriv = master.toBase58()
  console.log(`${Object.keys(wallet)} master xpriv  `, xpriv)
  // Get BIP32 extended public key
  let xpub = master.neutered().toBase58()
  console.log(`${Object.keys(wallet)} master xpub  `, xpub)
  console.log()

  /**
   * Bitcoin Core derivation - m/0'/0'/${index}'
   * Derive 3 sets of addresses
   */
  ;[...Array(3)].map((u, i) => {
    // Get child node
    let child = master.derivePath(`m/0'/0'/${i}'`)
    // Get child wif private key
    let wif = child.toWIF()
    console.log(`${Object.keys(wallet)} child ${i} wif  `, wif)
    // Get child extended private key
    console.log(`${Object.keys(wallet)} child ${i} xpriv  `, child.toBase58())
    // Get child EC private key
    console.log(`${Object.keys(wallet)} child ${i} privKey  `, child.privateKey.toString('hex'))
    // Get child extended public key
    console.log(`${Object.keys(wallet)} child ${i} xpub  `, child.neutered().toBase58())
    // Get child EC public key
    let ECPubKey =  child.publicKey.toString('hex')
    console.log(`${Object.keys(wallet)} child ${i} pubKey  `, ECPubKey)

    // Addresses
    // P2PKH
    let p2pkh = bitcoin.payments.p2pkh({pubkey: child.publicKey, network}).address
    console.log(`${Object.keys(wallet)} child ${i} address p2pkh  `, p2pkh)
    // P2WPKH
    let p2wpkh = bitcoin.payments.p2wpkh({pubkey: child.publicKey, network})
    let p2wpkhAddress = p2wpkh.address
    console.log(`${Object.keys(wallet)} child ${i} address p2wpkh  `, p2wpkhAddress)
    // P2SH-P2WPKH
    let p2sh_p2wpkh = bitcoin.payments.p2sh({redeem: p2wpkh, network}).address
    console.log(`${Object.keys(wallet)} child ${i} address p2sh-p2wpkh  `, p2sh_p2wpkh)
    console.log()

    // No comma for the last derivation
    if (i === 2) {
      walletsJSON += `{"wif": "${wif}", "pubKey": "${ECPubKey}", "p2pkh": "${p2pkh}", "p2wpkh": "${p2wpkhAddress}", "p2sh-p2wpkh": "${p2sh_p2wpkh}"}`
    } else {
      walletsJSON += `{"wif": "${wif}", "pubKey": "${ECPubKey}", "p2pkh": "${p2pkh}", "p2wpkh": "${p2wpkhAddress}", "p2sh-p2wpkh": "${p2sh_p2wpkh}"},`
    }
  })

  // No comma for last wallet
  wallet_index === 2 ? walletsJSON+="]}" : walletsJSON+="],"
  console.log()
})



// Write a json file with main info
exec(
  `echo '${walletsJSON}' | jq . > wallets.json`, (error, stdout, stderr) => {
  if (error) {
    console.error('stderr', stderr)
    throw error
  }
    stdout && console.log(stdout)
    console.log('wallets.json has been written successfully')

    // Import private keys to Bitcoin Core
    exec('./import_privkeys.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('stderr', stderr)
        throw error
      }
      stdout && console.log(stdout)
      console.log('Private keys have been imported to Bitcoin Core successfully')
    })
})
