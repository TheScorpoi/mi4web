import React from 'react';
import './InitialDashboard.css';
import Dash from '../../Dashboard/DashComp1/Dash';
import Chart from '../../Dashboard/Chart/Chart';
import Dash2 from '../../Dashboard/DashComp2/Dash2';

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
