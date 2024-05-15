import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function MyChart({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // If there is an old Chart instance, destroy it
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // labels
      const labels = Object.keys(data.daily);

      // data
      const chartData = labels.map((dateStr) => {
        // If there is data for the current day, return it, otherwise return 0
        return data.daily[dateStr] || 0;
      });

      // Create a new Chart instance and store it in the ref
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Number of hours",
              data: chartData,
              backgroundColor: "rgba(255, 26, 104, 0.2)", // single color
              borderColor: "rgba(255, 26, 104, 1)", // single color
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: 1,
              suggestedMax: 8,
            },
          },
        },
      });
    }
  }, [data, chartRef]);

  return <canvas ref={chartRef} />;
}

export default MyChart;