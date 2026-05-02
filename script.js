let DATA = [];
const tbody = document.querySelector("#resultTable tbody");

const closePopup = () => { document.getElementById("popup").style.display = "none"; }
document.querySelectorAll(".log-toggle").forEach(toggle => {
  toggle.addEventListener("change", () => { if (DATA.length) drawGraphs(toggle.dataset.graph); });
});

// ---------------- RUN ----------------
function computeData() {
  let f = makeFunction(document.getElementById("funcInput").value);
  let P = makeFunction(document.getElementById("propInput").value);
  let T = makeFunction(document.getElementById("thresholdInput").value);

  let from = +document.getElementById("fromInput").value;
  let to = +document.getElementById("toInput").value;
  let gap = +document.getElementById("gapInput").value;
  let maxIter = +document.getElementById("maxIterInput").value;

  DATA = [];

  for (let n = from; n <= to; n += gap) {
    let seed = f(n)
    let property = P(n)
    let threshold = T(n);

    let o = ord(f, P, n, maxIter);
    let c = core(f, P, n, maxIter);
    let t = tau(f, P, n, maxIter);

    let cs = coreseq(f, P, n, maxIter);
    let os = ordseq(f, P, n, maxIter);

    let coresum = cs.reduce((a, b) => a + b, 0);
    let ordsum = os.reduce((a, b) => a + b, 0);

    DATA.push({ n, seed, property, threshold, o, c, t, cs, os, coresum, ordsum });
  }
}

function renderTable(){
  tbody.innerHTML = "";
  DATA.forEach(({ n, seed, property, threshold, o, c, t, cs, os, coresum, ordsum }) => {
    let row = document.createElement("tr");
    row.classList.add(coresum > threshold ? "row-red" : coresum < threshold ? "row-green" : "row-yellow");
    row.innerHTML = `
      <td>${n}</td>
      <td>${seed}</td>
      <td>${property}</td>
      <td>${threshold}</td>
      <td>${o === Infinity ? "∞" : o}</td>
      <td>${c ?? "-"}</td>
      <td>${t}</td>
      <td>${coresum}</td>
      <td>${ordsum}</td>
      <td>${formatSeq(cs)}</td>
      <td>${formatSeq(os)}</td>
    `;
    row.onclick = () => showPopup(n, cs, os);
    tbody.appendChild(row);
  });
}

function run() {
  computeData()
  drawGraphs()
  renderTable()
}

function drawGraphs(id = null){
  let labels = DATA.map(d => d.n)
  const GRAPH_CONFIG = [
    { id: "graph_seed", label: "seed", key: d => d.seed, color: "#a78bfa" },
    { id: "graph_property", label: "property", key: d => d.property, color: "#14b8a6" },
    { id: "graph_ord", label: "ord", key: d => d.o === Infinity ? null : d.o, color: "#38bdf8" },
    { id: "graph_core", label: "core", key: d => d.c ?? null, color: "#22c55e" },
    { id: "graph_ordsum", label: "ordsum", key: d => d.ordsum, color: "#ef4444" },
    { id: "graph_coresum", label: "coresum", key: d => d.coresum, color: "#f59e0b" }
  ];

  if (id){
    if (id == "graph_all") makeMultiChart("graph_all", [
        ...GRAPH_CONFIG.map(cfg => makeDataset(cfg.label, DATA.map(cfg.key), cfg.color)),
        makeDataset("threshold", DATA.map(d => d.threshold), "#ffffff88", true)
      ], labels);

    else if (id == "graph_coresum") makeMultiChart("graph_coresum", [
      makeDataset("coresum", DATA.map(d => d.coresum), "#f59e0b"),
      makeDataset("threshold", DATA.map(d => d.threshold), "#ffffff88", true)
    ], labels);
    
    else{
      cfg = GRAPH_CONFIG.find(obj => obj.id === id)
      if (cfg) makeMultiChart(cfg.id, [makeDataset(cfg.label, DATA.map(cfg.key), cfg.color)], labels);
    }
    return
  }

  GRAPH_CONFIG.forEach(cfg => {
    makeMultiChart(cfg.id, [makeDataset(cfg.label, DATA.map(cfg.key), cfg.color)], labels);
  });

  makeMultiChart("graph_coresum", [
    makeDataset("coresum", DATA.map(d => d.coresum), "#f59e0b"),
    makeDataset("threshold", DATA.map(d => d.threshold), "#ffffff88", true)
  ], labels);
  
  makeMultiChart("graph_all", [
    ...GRAPH_CONFIG.map(cfg => makeDataset(cfg.label, DATA.map(cfg.key), cfg.color)),
    makeDataset("threshold", DATA.map(d => d.threshold), "#ffffff88", true)
  ], labels);
}