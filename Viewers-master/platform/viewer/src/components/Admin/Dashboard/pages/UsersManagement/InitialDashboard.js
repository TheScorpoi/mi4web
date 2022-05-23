import React from 'react';
import './InitialDashboard.css';
import Dash from '../Dashboard/Dash';
import Chart from '../Dashboard/Chart/Chart';
import Dash2 from '../Dashboard/Dash2';

function InitialDashboard() {
  return (
    <div className="initialDashboard">
      
      <Dash2 />
      <Dash />
      <Chart />
    </div>
  );
}

export default InitialDashboard;
