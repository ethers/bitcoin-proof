const btcproof = require('../index'),
  assert = require('assert');

describe('getProof', function() {
  it('should return something', function() {
    var proof = btcproof.getProof();
    assert(proof);
  })
})
