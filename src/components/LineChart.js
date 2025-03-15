"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ chartId, data, revenueData, labels, title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Chuyển đổi nhãn thành tên tháng ngắn gọn
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedLabels = labels.map((label) => {
    const [year, month] = label.split("-");
    return monthNames[parseInt(month) - 1]; // Chỉ hiển thị tên tháng
  });

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Dataset cơ bản cho "Count" hoặc "Orders"
    const datasets = [
      {
        label: revenueData ? "Number of Orders" : "Count",
        data: data,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        yAxisID: "y",
      },
    ];

    // Scales cơ bản chỉ có trục y
    const scales = {
      y: {
        beginAtZero: true,
        position: "left",
        title: { display: true, text: revenueData ? "Orders" : "Count" },
      },
    };

    // Nếu có revenueData, thêm dataset và trục y1
    if (revenueData && Array.isArray(revenueData)) {
      datasets.push({
        label: "Revenue",
        data: revenueData,
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        yAxisID: "y1",
      });

      scales.y1 = {
        beginAtZero: true,
        position: "right",
        title: { display: true, text: "Revenue" },
        grid: { drawOnChartArea: false },
      };
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: formattedLabels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales, // Sử dụng scales đã định nghĩa
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, revenueData, labels, title]);

  return <canvas id={chartId} ref={chartRef} />;
};

export default LineChart;
