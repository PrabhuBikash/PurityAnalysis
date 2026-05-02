let worker;

const $ = id => document.getElementById(id);

$("startBtn").onclick = () => {
  const data = {
    func: $("funcInput").value,
    prop: $("propInput").value,
    threshold: $("thresholdInput").value,
    from: +$("fromInput").value,
    to: +$("toInput").value,
    gap: +$("gapInput").value,
    maxIter: +$("maxIterInput").value
  };

  const output = $("output");
  const timeEl = $("time");

  output.textContent = "";
  timeEl.textContent = "Starting...";

  if (worker) worker.terminate();
  worker = new Worker("worker.js");

  worker.postMessage(data);

  worker.onmessage = e => {
    const d = e.data;
    if (d.type === "result") output.textContent += d.value;
    if (d.type === "progress") timeEl.textContent = `n = ${d.n} | ${d.time}s`;
    if (d.type === "done") timeEl.textContent += `\nDone in ${d.time}s`;
    if (d.type === "error") {
      output.textContent += d.message;
      timeEl.textContent = "\nError";
    }
  };
};