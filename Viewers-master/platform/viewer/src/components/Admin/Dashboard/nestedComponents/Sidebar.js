import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebarWrapper">
      <div className="sidebarMenu">
        <div className="sidebar">
          <div className="list">
            <div id="sidebarDeasapear">
              <div>
                <li className="listElem">Dashboard</li>
                <li className="listElem">Manage Acess</li>
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
    </div>
  );
}

export default Sidebar;
