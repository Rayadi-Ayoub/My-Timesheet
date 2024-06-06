import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import moment from "moment";

function MyChart({ data, week }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const labels = getWeekDates(week);
      const chartData = labels.map((dateStr) => data.daily[dateStr] || 0);

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Number of hours",
              data: chartData,
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
              ],
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
          maintainAspectRatio: false,
        },
      });
    }
  }, [data, week]);

  const getWeekDates = (week) => {
    if (!week) {
      return [];
    }

    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(
        moment()
          .year(week.split("-")[0])
          .week(week.split("-")[1])
          .startOf("week")
          .add(i, "days")
          .format("YYYY-MM-DD")
      );
    }
    return dates;
  };

  return <canvas ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}

export default MyChart;
