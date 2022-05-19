import React from 'react';
import './InitialDashboard.css';
import Dash from './Dash';
import Chart from './Chart';

function InitialDashboard() {
  return (
    <div className="initialDashboard">
      <Dash />
      <Chart />
    </div>
  );
}

export default InitialDashboard;
