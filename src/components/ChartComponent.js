"use client";

import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = ({ chartId, data, title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Lưu trữ instance của biểu đồ

  useEffect(() => {
    const ctx = chartRef.current;

    // Hủy biểu đồ cũ nếu đã tồn tại
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Tạo biểu đồ mới
    chartInstance.current = new Chart(ctx, {
      type: "bar", // Thay đổi thành 'line', 'pie',... nếu muốn
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Cleanup: Hủy biểu đồ khi component bị unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title]);

  return <canvas id={chartId} ref={chartRef} />;
};

export default ChartComponent;
