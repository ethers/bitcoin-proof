const crypto = require('crypto');

var sha256 = exports.sha256 = function(data) {
  return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var twoSha256 = exports.twoSha256 = function(data) {
  return sha256(sha256(data));
};

var bufReverse = exports.bufReverse = function(buf) {
  return new Buffer(Array.prototype.slice.call(buf).reverse());
}

exports.getProof = function(txs, index) {
  // if (txs.length == 0) {
  //   return [util.NULL_HASH.slice(0)];
  // }

  // adapted from BitcoinJ and bitcore
  var tree = txs.map(function(txStr) {
    return new Buffer(txStr, 'hex');
  });

  var j = 0;

  var lookFor = txs[index];
  var proof = [];
  var foundPath = 0;

  // Now step through each level ...
  for (var size = txs.length; size > 1; size = Math.floor((size + 1) / 2)) {
    // and for each leaf on that level ..
    for (var i = 0; i < size; i += 2) {
      var i2 = Math.min(i + 1, size - 1);
      var a = tree[j + i];
      var b = tree[j + i2];

console.log('lf: ', lookFor, a, b)
      if (index >= 0) {
        var aHex = a.toString('hex'),
          bHex = b.toString('hex');
        if (lookFor === aHex) {
          foundPath = 2;
          proof.push({hash: bHex, path: 2});
        } else if (lookFor === bHex) {
          foundPath = 1;
          proof.push({hash: aHex, path: 1});
        }
      }

      var dblSha = twoSha256(Buffer.concat([bufReverse(a), bufReverse(b)]));
      dblSha = bufReverse(dblSha);

      if (foundPath > 0) {
        lookFor = dblSha; //foundPath === 1 ? aHex : bHex;
        foundPath = 0;
      }

      tree.push(dblSha);
    }
    j += size;
  }

  if (index >= 0) {
    return proof;
  }

  return tree[tree.length - 1].toString('hex');
};
