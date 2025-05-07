import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import './pollutionChart.css'; 
// Register chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PlasticPollutionChart = () => {
  const data = {
    labels: ['Plastic Bottles', 'Plastic Bags', 'Other Plastic Waste', 'Plastic Packaging'],
    datasets: [
      {
        data: [44, 26, 13, 17], // Example values, change these as needed
        backgroundColor: [
          '#4caf50', // Green for Plastic Bottles
          '#ff9800', // Orange for Plastic Bags
          '#f44336', // Red for Other Plastic Waste
          '#2196f3', // Blue for Plastic Packaging
        ],
        hoverBackgroundColor: [
          '#66bb6a', '#ffb74d', '#ef5350', '#42a5f5',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false, // Ensure chart can be resized
  };

  return (
    <div className="chart-container" style={{ width: '92%', height: '300px' }}>
      <h3>Plastic Pollution Breakdown</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PlasticPollutionChart;
