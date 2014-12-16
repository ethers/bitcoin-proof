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
          foundPath = 2;
          proof.push({hash: bHex, path: 2});
console.log('pA: ', proof)
        } else if (lookFor === bHex) {
          foundPath = 1;
          proof.push({hash: aHex, path: 1});
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

exports.getTxMerkle = function(tx, proofs) {
  var dblSha = new Buffer(tx, 'hex')

  proofs.forEach(function(proof) {
    var proofHash = new Buffer(proof.hash, 'hex');
    if (proof.path === 1) {
      left = proofHash;
      right = dblSha;
    } else if (proof.path === 2) {
      left = dblSha;
      right = proofHash;
    }

    dblSha = twoSha256(Buffer.concat([bufReverse(left), bufReverse(right)]));
    dblSha = bufReverse(dblSha);
  })

  return dblSha.toString('hex');
}
