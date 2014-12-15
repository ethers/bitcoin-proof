const crypto = require('crypto');


exports.getProof = function() {
  sha256 = crypto.createHash('SHA256');
  return sha256;
}
