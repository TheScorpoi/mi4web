import React from 'react';
import './chart.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../../ApiConnections/apiManageAccess';
ChartJS.register(...registerables);

const state = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Studies per week',
      fill: true,
      lineTension: 0.01,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

//TODO: https://stackoverflow.com/questions/51508665/using-data-from-api-with-chart-js
//TODO: Ver cenas no link acima, para ver como se faz isso dinamico, e fazer uma querie a base de dados, com os ultimos x dias/meses whatever do que for, e mostrar no grafico 

export default function Chart() {

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    api.get('/chart_dash').then(res => {
      setDatas(res.data);
      console.log(data);
    });
  }, []);

  return (
    <div className="chart">
      <div className="chartItem">
        <Line
          data={state}
          options={{
            title: {
              display: false,
              text: 'Average Rainfall per month',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      </div>
    </div>
  );
}
