import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

function WeatherTemperatureChart({ chartData }) {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p>No forecast data available to display chart.</p>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          }
        }
      },
      title: {
        display: true,
        text: '5-Day Temperature Forecast (°C)',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 16
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default WeatherTemperatureChart;
