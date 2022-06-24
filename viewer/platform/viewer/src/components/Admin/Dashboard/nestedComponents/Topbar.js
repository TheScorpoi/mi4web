import React from 'react';
import './Topbar.css';

import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = 'http://localhost:3000';
  localStorage.removeItem('user');
  localStorage.removeItem('type_user');
};

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logo">System Manager Dashboard - MI4WEB</div>
        </div>
        <div className="topRigth">
          <div className="icons" onClick={() => handleLogout()}>
            Logout
            <PersonOutlineRoundedIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
