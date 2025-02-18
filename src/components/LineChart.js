import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ chartId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Hủy biểu đồ cũ trước khi tạo mới
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Sales",
            data: [10, 20, 15, 30, 25, 40],
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      // Cleanup khi component bị unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas id={chartId} ref={chartRef} />;
};

export default LineChart;
