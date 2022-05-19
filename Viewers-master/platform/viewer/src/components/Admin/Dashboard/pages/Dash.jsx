import React from 'react';
import './dash.css';
import PeopleIcon from '@material-ui/icons/People';

export default function Dash() {
  return (
    <div className="dash">
      <div className="dashItem">
        <span className="dashTitle">Count Instances</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">6590</span>
          
        </div>
      </div>
      
      <div className="dashItem">
        <span className="dashTitle">Count Patients</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">4</span>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Count Series</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">26 </span>
          <div className="dashIcons"><PeopleIcon size={70}/></div>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Count Studies</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">8</span>
        </div>
      </div>
    </div>
  );
}
