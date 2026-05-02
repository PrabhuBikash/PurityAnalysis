importScripts("../functions.js");

self.onmessage = e => {
  const { func, prop, threshold, from, to, gap, maxIter } = e.data;

  const safe = (fn, msg) => (...args) => {
    try { return fn(...args); }
    catch { self.postMessage({ type: "error", message: msg }); throw 0; }
  };

  let seedFn, propFn, thresholdFn;

  try {
    seedFn = safe(new Function("n", "return " + func), "❌ Seed error\n");
    propFn = safe(new Function("n", "return " + prop), "❌ Property error\n");
    thresholdFn = safe(new Function("n", "return " + threshold), "❌ Threshold error\n");
  } catch {
    self.postMessage({ type: "error", message: "❌ Invalid function syntax\n" });
    return;
  }

  const t0 = performance.now();
  const getTime = () => ((performance.now() - t0) / 1000).toFixed(3)

  for (let n = from; n <= to; n += gap) {
    sum = coreseq(seedFn,propFn,n,maxIter).reduce((acc, val) => acc + val, 0)
    if (sum === thresholdFn(n)) self.postMessage({ type: "result", value: `${n},` });
    if (n % 100 === 0) self.postMessage({ type: "progress", n: n, time: getTime() });
  }

  self.postMessage({ type: "done", time: getTime() });
};