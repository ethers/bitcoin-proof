const crypto = require('crypto');


exports.getProof = function(txs) {
  // if (txs.length == 0) {
  //   return [util.NULL_HASH.slice(0)];
  // }

  // adapted from BitcoinJ and bitcore
  var tree = txs.map(function(txStr) {
    var txHex = new Buffer(txStr, 'hex');
    return twoSha256(txHex);
  })

  var j = 0;
  // Now step through each level ...
  for (var size = txs.length; size > 1; size = Math.floor((size + 1) / 2)) {
    // and for each leaf on that level ..
    for (var i = 0; i < size; i += 2) {
      var i2 = Math.min(i + 1, size - 1);
      var a = tree[j + i];
      var b = tree[j + i2];
      tree.push(twoSha256(Buffer.concat([a, b])));
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
