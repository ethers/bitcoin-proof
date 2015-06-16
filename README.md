bitcoin-proof
=============

Merkle proof for a Bitcoin transaction


## Status
 [![Build Status](https://travis-ci.org/ethers/bitcoin-proof.svg)](https://travis-ci.org/ethers/bitcoin-proof)


## Install

`npm install bitcoin-proof` or use Browserify


## Usage

```javascript
const btcProof = require('bitcoin-proof');

const BLOCK_100K_TRANSACTIONS = [
  '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87',
  'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4',
  '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4',
  'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d'
];

var proofOfFirstTx = btcProof.getProof(BLOCK_100K_TRANSACTIONS, 0);
var proofOfLastTx = btcProof.getProof(BLOCK_100K_TRANSACTIONS, 3);
```


### API


##### getProof(transactions, transactionIndex)

Computes the Merkle proof of a given transaction.

* `transactions` - array of transaction hashes (as hex string)
* `transactionIndex` - index of which transaction to compute a Merkle proof for

Returns an object with the following keys:
* `txHash` - transaction hash that the Merkle proof is computed for
* `txIndex` - index of `txHash` among `transactions`
* `sibling` - sibling hashes of `txHash` which comprise the Merkle proof

----

##### getMerkleRoot(transactions)

Computes the Merkle root of a set of transactions.

* `transactions` - array of transaction hashes (as hex string)

Returns the Merkle root as a hex string.

----

##### getTxMerkle(transactionHash, proof)

Computes the Merkle root of a given transaction and proof.

* `transactionHash` - hash of the transaction as a hex string
* `proof` - an object of the form returned by `getProof`

Returns the Merkle root as a hex string.

----

## Tests

`npm test`

### License

[MIT](LICENSE)
