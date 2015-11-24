# bitcoin-proof

[![NPM Package](https://img.shields.io/npm/v/bitcoin-proof.svg?style=flat-square)](https://www.npmjs.org/package/bitcoin-proof)
[![Build Status](https://img.shields.io/travis/ethers/bitcoin-proof.svg?branch=master&style=flat-square)](https://travis-ci.org/ethers/bitcoin-proof)
[![js-standard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![Dependency status](https://img.shields.io/david/ethers/bitcoin-proof.svg?style=flat-square)](https://david-dm.org/ethers/bitcoin-proof#info=dependencies)

Merkle proof for a Bitcoin transaction.

## Install

```
npm install bitcoin-proof
```

## API

  - [`getProof(String[] txIds, Number txIndex)`](#getproofstring-txids-number-txindex---txid-string-txindex-number-sibling-string)
  - [`getTxMerkle({txId: String, txIndex: Number, sibling: String[]})`](#gettxmerkletxid-string-txindex-number-sibling-string---string)
  - [`getMerkleRoot(String[] txIds)`](#getmerklerootstring-txids---string)

----

#####`getProof(String[] txIds, Number txIndex)` -> `{txId: String, txIndex: Number, sibling: String[]}`

Computes the Merkle proof of a given transaction.

  * `txIds` - array of transaction hashes (as hex string)
  * `txIndex` - index of which transaction to compute a Merkle proof for

Returns an object with the following keys:
  * `txId` - transaction hash that the Merkle proof is computed for
  * `txIndex` - index of `txId` among `txIds`
  * `sibling` - sibling hashes of `txId` which comprise the Merkle proof

----

#####`getTxMerkle({txId: String, txIndex: Number, sibling: String[]})` -> `String`

Computes the Merkle root of a given proof.

  * `proof` - an object of the form returned by `getProof`

Returns the Merkle root as a hex string.

----

#####`getMerkleRoot(String[] txIds)` -> `String`

Computes the Merkle root of a set of transactions.

  * `txIds` - array of transaction hashes (as hex string)

Returns the Merkle root as a hex string.

## Usage

```javascript
var btcProof = require('bitcoin-proof');

var BLOCK_100K_TRANSACTIONS = [
  '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87',
  'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4',
  '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4',
  'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d'
];

var proofOfFirstTx = btcProof.getProof(BLOCK_100K_TRANSACTIONS, 0);
// {
//   txId: '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87',
//   txIndex: 0,
//   sibling: [
//     'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4',
//     '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49'
//   ]
// }

var proofOfLastTx = btcProof.getProof(BLOCK_100K_TRANSACTIONS, 3);
// {
//   txId: 'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d',
//   txIndex: 0,
//   sibling: [
//     '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4',
//     'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815'
//   ]
// }
```

## License

[MIT](LICENSE)
