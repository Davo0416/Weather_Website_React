// Chart.js temperature graph config

function configs(labels, datasets, unit) {
  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          tension: 0.4,
          pointRadius: 5,
          borderColor: "rgb(255, 191, 0)",
          pointBorderColor: "rgb(255, 191, 0)",
          pointBackgroundColor: "rgb(255, 221, 0)",
          borderColor: "rgb(255, 221, 0)",
          borderWidth: 4,
          backgroundColor: "transparent",
          fill: true,
          fill: "start",
          backgroundColor: "rgba(255, 213, 0, 0.48)",
          data: datasets.data,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function (tooltipItems, data) {
              return tooltipItems.formattedValue + unit;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(255, 255, 255, .2)",
          },
          ticks: {
            maxTicksLimit: 5,
            callback: function (value, index, ticks) {
              return Math.round(value * 10) / 10 + unit;
            },
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  };
}

export default configs;
