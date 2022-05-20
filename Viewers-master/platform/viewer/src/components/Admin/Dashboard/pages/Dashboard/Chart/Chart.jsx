import React from 'react';
import './chart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Studies On Server',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Studies',
      data: labels.map(() => [100, 200, 300, 302, 4, 543, 234]),
      borderColor: 'rgb(145, 185, 205)',
      backgroundColor: 'rgba(145, 185, 205, 1)',
    },
  ],
};

export default function Chart() {
  return (
    <div className="chart">
      <div className="chartItem">
        <Line options={options} data={data} />;
      </div>
    </div>
  );
}
