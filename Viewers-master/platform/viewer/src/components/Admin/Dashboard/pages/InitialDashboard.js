import React from 'react';
import './InitialDashboard.css';
import Dash from './Dash';
import Chart from './Chart';
import Dash2 from './Dash2';

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
