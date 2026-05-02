const makeFunction = (expr) => new Function("n", "return " + expr);
const formatSeq = (arr) => arr.join(" → ");

// ---------------- CORE ENGINE ----------------
function ord(f, P, n, maxIter) {
  let originalProperty = P(n);
  let current = n;

  for (let k = 1; k <= maxIter; k++) {
    current = f(current);
    if (current == n) return Infinity;
    if (P(current) !== originalProperty) return k;
  }
  return null;
}

function core(f, P, n, maxIter) {
  let k = ord(f, P, n, maxIter);
  if (!isFinite(k)) return undefined;

  let current = n;
  for (let i = 0; i < k; i++) current = f(current);
  return current;
}

function tau(f, P, n, maxIter) {
  let current = n;
  let prevP = P(n);
  let changes = 0;

  let visited = new Set([n]);
  for (let i = 0; i < maxIter; i++) {
    current = f(current);
    if (visited.has(current)) break;

    let newP = P(current);
    if (newP !== prevP) changes++;

    prevP = newP;
    visited.add(current);
  }
  return changes;
}

function coreseq(f, P, n, maxIter) {
  let result = [];
  let current = n;

  let t = tau(f, P, n, maxIter);
  for (let i = 0; i < t; i++) {
    current = core(f, P, current, maxIter);
    if (current === undefined) break;
    result.push(current);
  }
  return result;
}

function ordseq(f, P, n, maxIter) {
  let result = [];
  let current = n;

  let t = tau(f, P, n, maxIter);
  for (let i = 0; i < t; i++) {
    let o = ord(f, P, current, maxIter);
    if (!isFinite(o)) break;
    result.push(o);
    current = core(f, P, current, maxIter);
  }
  return result;
}