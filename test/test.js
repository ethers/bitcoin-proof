const btcProof = require('../index'),
  assert = require('assert');

const BLOCK_100K = {
  txs: [
    '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87',
    'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4',
    '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4',
    'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d'
  ]
},
  BLOCK_106022 = {
    txs: [
      '3a459eab5f0cf8394a21e04d2ed3b2beeaa59795912e20b9c680e9db74dfb18c',
      'be38f46f0eccba72416aed715851fd07b881ffb7928b7622847314588e06a6b7',
      'd173f2a12b6ff63a77d9fe7bbb590bdb02b826d07739f90ebb016dc9297332be',
      '59d1e83e5268bbb491234ff23cbbf2a7c0aa87df553484afee9e82385fc7052f',
      'f1ce77a69d06efb79e3b08a0ff441fa3b1deaf71b358df55244d56dd797ac60c',
      '84053cba91fe659fd3afa1bf2fd0e3746b99215b50cd74e44bda507d8edf52e0'
    ]
  };

describe('getProof', function() {
  describe('for block 100k', function() {
    it('tx[0]', function() {
      const txs = BLOCK_100K.txs;

      // >>> i = '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4'.decode('hex')[::-1]
      // >>> j = 'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d'.decode('hex')[::-1]
      // >>> dbl_sha256(i+j).decode('hex')[::-1].encode('hex')
      // '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49'
      const hRight = '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49',
        expProof = [{ hash: txs[1], path: 2 }, { hash: hRight, path: 2 }];

      var proof = btcProof.getProof(txs, 0);
      assert.strictEqual(JSON.stringify(proof), JSON.stringify(expProof));
    });

    it('tx[1]', function() {
      const txs = BLOCK_100K.txs,
        hRight = '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49',
        expProof = [{ hash: txs[0], path: 1 }, { hash: hRight, path: 2 }];

      var proof = btcProof.getProof(txs, 1);
      assert.strictEqual(JSON.stringify(proof), JSON.stringify(expProof));
    });

    it('tx[2]', function() {
      const txs = BLOCK_100K.txs;

      // >>> i = '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87'.decode('hex')[::-1]
      // >>> j = 'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4'.decode('hex')[::-1]
      // >>> dbl_sha256(i+j).decode('hex')[::-1].encode('hex')
      // 'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815'
      const hLeft = 'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815',
        expProof = [{ hash: txs[3], path: 2 }, { hash: hLeft, path: 1 }];

      var proof = btcProof.getProof(txs, 2);
      assert.strictEqual(JSON.stringify(proof), JSON.stringify(expProof));
    });

    it('tx[3]', function() {
      const txs = BLOCK_100K.txs,
        hLeft = 'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815',
        expProof = [{ hash: txs[2], path: 1 }, { hash: hLeft, path: 1 }];

      var proof = btcProof.getProof(txs, 3);
      assert.strictEqual(JSON.stringify(proof), JSON.stringify(expProof));
    });
  });

  it('for block 106022 tx[0]', function() {
    const txs = BLOCK_106022.txs,
      expProof = [
        { hash: txs[1], path: 2 },
        { hash: 'f6ae335dc2d2aecb6a255ebd03caaf6820e6c0534531051066810080e0d822c8', path: 2 },
        { hash: '15eca0aa3e2cc2b9b4fbe0629f1dda87f329500fcdcd6ef546d163211266b3b3', path: 2 }
      ];

    var proof = btcProof.getProof(txs, 0);
    assert.strictEqual(JSON.stringify(proof), JSON.stringify(expProof));
  });
});

describe('getMerkleRoot', function() {
  it('should return merkle root of block 100k', function() {
    const txs = BLOCK_100K.txs,
      expMerkle = 'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766';

    var merkle = btcProof.getProof(txs);
    assert.strictEqual(merkle, expMerkle);
  });

  it('should return merkle root of block 100k-1 (odd num of tx)', function() {
    const txs = [
      '110ed92f558a1e3a94976ddea5c32f030670b5c58c3cc4d857ac14d7a1547a90'
    ],
      expMerkle = '110ed92f558a1e3a94976ddea5c32f030670b5c58c3cc4d857ac14d7a1547a90';

    var merkle = btcProof.getProof(txs);
    assert.strictEqual(merkle, expMerkle);
  });

  it('should return merkle root of block 106022', function() {
    const txs = BLOCK_106022.txs,
      expMerkle = '9cdf7722eb64015731ba9794e32bdefd9cf69b42456d31f5e59aedb68c57ed52';

    var merkle = btcProof.getProof(txs);
    assert.strictEqual(merkle, expMerkle);
  });
});

describe('getTxMerkle', function() {
  describe('for block 100k', function() {
    it('tx[0]', function() {
      const txs = BLOCK_100K.txs,
        hRight = '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49',
        proof = [{ hash: txs[1], path: 2 }, { hash: hRight, path: 2 }],
        expMerkle = 'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766';

      var merkle = btcProof.getTxMerkle(txs[0], proof);
      assert.strictEqual(merkle, expMerkle);
    });

    it('tx[1]', function() {
      const txs = BLOCK_100K.txs,
        hRight = '8e30899078ca1813be036a073bbf80b86cdddde1c96e9e9c99e9e3782df4ae49',
        proof = [{ hash: txs[0], path: 1 }, { hash: hRight, path: 2 }],
        expMerkle = 'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766';

      var merkle = btcProof.getTxMerkle(txs[1], proof);
      assert.strictEqual(merkle, expMerkle);
    });

    it('tx[2]', function() {
      const txs = BLOCK_100K.txs,
        hLeft = 'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815',
        proof = [{ hash: txs[3], path: 2 }, { hash: hLeft, path: 1 }],
        expMerkle = 'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766';

      var merkle = btcProof.getTxMerkle(txs[2], proof);
      assert.strictEqual(merkle, expMerkle);
    });

    it('tx[3]', function() {
      const txs = BLOCK_100K.txs,
        hLeft = 'ccdafb73d8dcd0173d5d5c3c9a0770d0b3953db889dab99ef05b1907518cb815',
        proof = [{ hash: txs[2], path: 1 }, { hash: hLeft, path: 1 }],
        expMerkle = 'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766';

      var merkle = btcProof.getTxMerkle(txs[3], proof);
      assert.strictEqual(merkle, expMerkle);
    });
  });

  it('for block 106022 tx[0]', function() {
    const txs = BLOCK_106022.txs,
      proof = [
        { hash: txs[1], path: 2 },
        { hash: 'f6ae335dc2d2aecb6a255ebd03caaf6820e6c0534531051066810080e0d822c8', path: 2 },
        { hash: '15eca0aa3e2cc2b9b4fbe0629f1dda87f329500fcdcd6ef546d163211266b3b3', path: 2 }
      ],
      expMerkle = '9cdf7722eb64015731ba9794e32bdefd9cf69b42456d31f5e59aedb68c57ed52';

    var merkle = btcProof.getTxMerkle(txs[0], proof);
    assert.strictEqual(merkle, expMerkle);
  });
});
