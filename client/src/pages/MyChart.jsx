import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function MyChart({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Add this line

  useEffect(() => {
    if (chartRef.current) {
      // If there is an old Chart instance, destroy it
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // All days of the week
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // labels
      const labels = daysOfWeek;

      // data
      const chartData = daysOfWeek.map((day) => {
        // Get the date string that corresponds to the current day
        const dateStr = Object.keys(data.daily).find((dateStr) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", { weekday: "long" }) === day;
        });

        // If there is data for the current day, return it, otherwise return 0
        return dateStr ? data.daily[dateStr] : 0;
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
