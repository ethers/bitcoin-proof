const crypto = require('crypto');


exports.getProof = function(txs) {
  var dhash = txs.map(function(txStr) {
    var txBuf = new Buffer(txStr, 'hex'),
      txHash;

    sha256 = crypto.createHash('SHA256');
    txHash = sha256.update(txBuf).digest('hex');

    sha256 = crypto.createHash('SHA256');
    return sha256.update(txHash).digest('hex');
  })

  console.log('dhash: ', dhash)

  return dhash;
}
