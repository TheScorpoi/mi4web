import React from 'react';
import './Sidebar.css';

import { useHistory } from 'react-router-dom';

import Versions from '@material-ui/icons/DashboardOutlined';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import TreeRounded from '@material-ui/icons/AccountTreeRounded';
import DashboardOut from '@material-ui/icons/BarChartRounded';
import ContentCopyRoundedIcon from '@material-ui/icons/ComputerRounded';

function Sidebar() {
  const history = useHistory();

  const initDashboard = () => {
    history.push('/');
  };

  const users = () => {
    history.push('/users');
  };

  return (
    <div className="sidebarMenu">
      <div className="sidebar">
        <div className="list">
          <div id="sidebarDeasapear">
            <div>
              <li className="listElem" onClick={initDashboard}>
                Dashboard <DashboardOut />
              </li>
              <li className="listElem" onClick={users}>
                Manage Acess <PeopleRoundedIcon />
              </li>
              <li className="listElem">
                SW Versions <Versions />
              </li>
              <li className="listElem">
                DICOM Nodes <TreeRounded />
              </li>
            </div>
            <div>
              <li className="listElem2">
                Extensions Installation <ContentCopyRoundedIcon />
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
