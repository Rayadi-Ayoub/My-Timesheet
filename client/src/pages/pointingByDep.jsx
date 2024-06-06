import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import moment from "moment";

function MyChart1({ data, week, labels }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // If there is an old Chart instance, destroy it
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      console.log("data:", data);
      console.log("week:", week);
      console.log("labels:", labels);

      // Data
      const chartData = labels.map((username) => {
        if (data[username]) {
          return data[username];
        }
        return 0;
      });

      console.log("chartData:", chartData);

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
  }, [data, labels, week]);

  return <canvas ref={chartRef} />;
}

export default MyChart1;
