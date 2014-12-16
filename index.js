const crypto = require('crypto');

const LEFT_HASH = 1,
  RIGHT_HASH = 2;

var sha256 = exports.sha256 = function(data) {
  return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var twoSha256 = exports.twoSha256 = function(data) {
  return sha256(sha256(data));
};

var bufReverse = exports.bufReverse = function(buf) {
  return new Buffer(Array.prototype.slice.call(buf).reverse());
}

var getProof = exports.getProof = function(txs, index) {
  // if (txs.length == 0) {
  //   return [util.NULL_HASH.slice(0)];
  // }

  // adapted from BitcoinJ and bitcore
  var tree = txs.map(function(txStr) {
    return new Buffer(txStr, 'hex');
  });

  var j = 0;

  if (index >= 0) {
    var lookFor = txs[index].toString('hex');
    var proof = [];
    var foundPath = 0;
  }

  // Now step through each level ...
  for (var size = txs.length; size > 1; size = Math.floor((size + 1) / 2)) {
    // and for each leaf on that level ..
    for (var i = 0; i < size; i += 2) {
      var i2 = Math.min(i + 1, size - 1);
      var a = tree[j + i];
      var b = tree[j + i2];

      if (index >= 0) {
        var aHex = a.toString('hex'),
          bHex = b.toString('hex');
console.log('lf: ', lookFor, aHex, bHex)
        if (lookFor === aHex) {
          foundPath = RIGHT_HASH;
          proof.push({hash: bHex, path: RIGHT_HASH});
console.log('pA: ', proof)
        } else if (lookFor === bHex) {
          foundPath = LEFT_HASH;
          proof.push({hash: aHex, path: LEFT_HASH});
console.log('pB: ', proof)
        }
      }

      var dblSha = twoSha256(Buffer.concat([bufReverse(a), bufReverse(b)]));
      dblSha = bufReverse(dblSha);

      if (foundPath > 0) {
        lookFor = dblSha.toString('hex'); //foundPath === 1 ? aHex : bHex;
        console.log('@@@@@@@@ ', bufReverse(a), bufReverse(b), lookFor)

        foundPath = 0;
      }

      tree.push(dblSha);
    }
    j += size;
  }

  if (index >= 0) {
    console.log('@@@@@@@@@proof: ', proof)
    return proof;
  }

  return tree[tree.length - 1].toString('hex');
};

exports.getMerkleRoot = function(txs) {
  return getProof(txs, null);
}

exports.getTxMerkle = function(tx, proofArr) {
  var resultHash = new Buffer(tx, 'hex'),
    left,
    right;

  proofArr.forEach(function(proof) {
    var proofHex = new Buffer(proof.hash, 'hex');
    if (proof.path === LEFT_HASH) {
      left = proofHex;
      right = resultHash;
    } else if (proof.path === RIGHT_HASH) {
      left = resultHash;
      right = proofHex;
    }

    resultHash = twoSha256(Buffer.concat([bufReverse(left), bufReverse(right)]));
    resultHash = bufReverse(resultHash);
  })

  return resultHash.toString('hex');
}
