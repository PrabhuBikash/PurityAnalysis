let charts = {};

function makeMultiChart(canvasId, datasets, labels) {
  let ctx = document.getElementById(canvasId).getContext("2d");
  if (charts[canvasId]) charts[canvasId].destroy();
  let useLog = document.querySelector(`input[data-graph="${canvasId}"]`)?.checked;

  charts[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#e5e7eb" }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#94a3b8",
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10
          },
          grid: { color: "rgba(148,163,184,0.1)" }
        },
        y: {
          type: useLog ? "logarithmic" : "linear",
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(148,163,184,0.1)" }
        }
      }
    }
  });
}

function showPopup(n, coreseq, ordseq) {
  let popup = document.getElementById("popup");
  popup.style.display = "block";

  document.getElementById("popup-n").innerText = n;

  let labels = coreseq.map((_, i) => i + 1);

  makeMultiChart("popupCanvas", [
    makeDataset("coreseq", coreseq, "#38bdf8"),
    makeDataset("ordseq", ordseq, "#f59e0b")
  ], labels);
}

function makeDataset(label, data, color, dashed = false) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: "transparent",
    tension: 0,
    pointRadius: 0,
    borderDash: dashed ? [6, 6] : []
  };
}