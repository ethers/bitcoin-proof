/** Produces a Merkle proof for a single tx within a list. */
export async function getProof(txIds: string[], txIndex: number) {
  const proof = {
    txId: txIds[txIndex],
    txIndex: txIndex,
    sibling: [],
  };

  let tree = new Array(txIds.length);
  for (let i = 0; i < tree.length; ++i) {
    tree[i] = reverse(fromHex(txIds[i]));
  }
  let target = tree[txIndex];

  while (tree.length !== 1) {
    const newTree = new Array(~~((tree.length + 1) / 2));
    for (let j = 0; j < tree.length; j += 2) {
      const hash1 = tree[j];
      const hash2 = tree[Math.min(j + 1, tree.length - 1)];

      newTree[j / 2] = await sha256x2(hash1, hash2);

      if (isEqual(target, hash1)) {
        proof.sibling.push(toHex(reverse(hash2)));
        target = newTree[j / 2];
      } else if (isEqual(target, hash2)) {
        proof.sibling.push(toHex(reverse(hash1)));
        target = newTree[j / 2];
      }
    }

    tree = newTree;
  }

  return proof;
}

export interface TxMerkleProof {
  txId: string;
  txIndex: number;
  sibling: string[];
}

/** Evaluates a transaction merkle proof, returning the root hash. */
export async function getTxMerkle(proofObj: TxMerkleProof) {
  let target = reverse(fromHex(proofObj.txId));
  let txIndex = proofObj.txIndex;
  const sibling = proofObj.sibling;

  for (let i = 0; i < proofObj.sibling.length; ++i, txIndex = ~~(txIndex / 2)) {
    if (txIndex % 2 === 1) {
      target = await sha256x2(reverse(fromHex(sibling[i])), target);
    } else {
      target = await sha256x2(target, reverse(fromHex(sibling[i])));
    }
  }

  return toHex(reverse(target));
}

/** Computes the Merkle root of a list of Bitcoin transaction IDs. */
export async function getMerkleRoot(txIds: string[]) {
  let tree = new Array(txIds.length) as Uint8Array[];
  for (let i = 0; i < tree.length; ++i) {
    tree[i] = reverse(fromHex(txIds[i]));
  }

  while (tree.length !== 1) {
    const newTree = new Array(~~((tree.length + 1) / 2));
    for (let j = 0; j < tree.length; j += 2) {
      const hash1 = tree[j];
      const hash2 = tree[Math.min(j + 1, tree.length - 1)];

      newTree[j / 2] = await sha256x2(hash1, hash2);
    }

    tree = newTree;
  }

  const ret = toHex(reverse(tree[0]));
  return ret;
}

// This ugly construction is required to make a library that bundles without
// error for browser use, but still uses Node builtins when running in node.
let nodeCrypto = null;
try {
  nodeCrypto = require("crypto");
} catch (_) {}

/** Computes a double-SHA256 hash of [a, b]. Async in-browser. */
async function sha256x2(
  buf1: Uint8Array,
  buf2: Uint8Array
): Promise<Uint8Array> {
  if (nodeCrypto) {
    // Synchronous native SHA256 via require("crypto")
    const hash1 = nodeCrypto
      .createHash("sha256")
      .update(buf1)
      .update(buf2)
      .digest();
    const hash2 = nodeCrypto.createHash("sha256").update(hash1).digest();
    return hash2;
  } else {
    // Asynchronous native SHA256 via SubtleCrypto
    const comb = new Uint8Array(buf1.length + buf2.length);
    comb.set(buf1, 0);
    comb.set(buf2, buf1.length);
    const hash1 = await crypto.subtle.digest("SHA-256", comb);
    const hash2 = await crypto.subtle.digest("SHA-256", hash1);
    return new Uint8Array(hash2);
  }
}

/** Reverse a byte array in-place. */
function reverse(buf: Uint8Array) {
  return buf.reverse();
}

/** Check deep equality between two byte arrays. */
function isEqual(buf1: Uint8Array, buf2: Uint8Array) {
  if (buf1.length !== buf2.length) {
    return false;
  }

  for (let i = 0; i < buf1.length; ++i) {
    if (buf1[i] !== buf2[i]) {
      return false;
    }
  }

  return true;
}

/** Parses hex to a Uint8Array */
function fromHex(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );
}

/** Print Uint8Array to hex */
function toHex(arr: Uint8Array): string {
  return Array.prototype.map
    .call(arr, function (byte: number) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}
