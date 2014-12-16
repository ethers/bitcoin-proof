const crypto = require('crypto');


exports.getProof = function(txs) {
  // if (txs.length == 0) {
  //   return [util.NULL_HASH.slice(0)];
  // }

// txs=["3a459eab5f0cf8394a21e04d2ed3b2beeaa59795912e20b9c680e9db74dfb18c",
// "be38f46f0eccba72416aed715851fd07b881ffb7928b7622847314588e06a6b7",
// "d173f2a12b6ff63a77d9fe7bbb590bdb02b826d07739f90ebb016dc9297332be",
// "59d1e83e5268bbb491234ff23cbbf2a7c0aa87df553484afee9e82385fc7052f",
// "f1ce77a69d06efb79e3b08a0ff441fa3b1deaf71b358df55244d56dd797ac60c",
// "84053cba91fe659fd3afa1bf2fd0e3746b99215b50cd74e44bda507d8edf52e0"]

  // adapted from BitcoinJ and bitcore
  var tree = txs.map(function(txStr) {
    return new Buffer(txStr, 'hex');
  })

  var j = 0;
  // Now step through each level ...
  for (var size = txs.length; size > 1; size = Math.floor((size + 1) / 2)) {
    // and for each leaf on that level ..
    for (var i = 0; i < size; i += 2) {
      var i2 = Math.min(i + 1, size - 1);
      var a = tree[j + i];
a = bufReverse(a);
console.log('@@@@@@a: ', a)

      var b = tree[j + i2];
b = bufReverse(b);

console.log('b: ', b)


      var dblSha = twoSha256(Buffer.concat([a, b]));
      dblSha = bufReverse(dblSha)

      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 2sha: ', dblSha)

      tree.push(dblSha);
    }
    j += size;
  }

  return tree[tree.length - 1].toString('hex');
}

var sha256 = exports.sha256 = function(data) {
  return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var twoSha256 = exports.twoSha256 = function(data) {
  return sha256(sha256(data));
};

function bufReverse(buf) {
  return new Buffer(Array.prototype.slice.call(buf).reverse());
}
