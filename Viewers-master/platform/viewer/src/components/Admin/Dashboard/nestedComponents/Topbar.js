import React from 'react';
import './Topbar.css';

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logo">System Manager Dashboard - MI4WEB</div>
        </div>
        <div className="topRigth">
          <div className="icons">Icones</div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
