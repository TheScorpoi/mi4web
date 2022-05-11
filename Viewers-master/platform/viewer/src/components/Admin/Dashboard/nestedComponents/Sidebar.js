import React from 'react';
import './Sidebar.css';

import { useHistory } from 'react-router-dom';

function Sidebar() {
  const history = useHistory();

  const initDashboard = () => {
    history.push('/');
  };

  const users = () => {
    history.push('/users');
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <div className="list">
            <div>
              <li className="listElem" onClick={initDashboard}>
                Dashboard
              </li>
              <li className="listElem" onClick={users}>
                Manage Acess
              </li>
              <li className="listElem">SW Versions</li>
              <li className="listElem">DICOM Nodes</li>
            </div>
            <div>
              <li className="listElem2 ">Extensions Installation</li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
