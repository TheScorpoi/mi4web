import React from 'react';
import './Sidebar.css';

import { useHistory } from 'react-router-dom';

import Versions from '@material-ui/icons/DashboardOutlined';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import TreeRounded from '@material-ui/icons/AccountTreeRounded';
import DashboardOut from '@material-ui/icons/BarChartRounded';
import ContentCopyRoundedIcon from '@material-ui/icons/ComputerRounded';

import { slide as Menu } from 'react-burger-menu';

function Sidebar() {
  const history = useHistory();

  const initDashboard = () => {
    history.push('/dashboard');
  };

  const users = () => {
    history.push('/users');
  };

  const nodes = () => {
    history.push('/nodes')
  }

  return (
    <Menu>
      <a className="menu-item" onClick={initDashboard}>
        <span className="lefti">Dashboard </span>
        <span className="righti">
          <DashboardOut />
        </span>
      </a>
      <a className="menu-item" onClick={users}>
        <span className="lefti">Manage Acess </span>
        <span className="righti">
          <PeopleRoundedIcon />
        </span>
      </a>
      <a className="menu-item">
        <span className="lefti">SW Versions </span>
        <span className="righti">
          <Versions />
        </span>
      </a>
      <a className="menu-item" onClick={nodes}>
        <span className="lefti">DICOM Nodes </span>
        <span className="righti">
          <TreeRounded />
        </span>
      </a>
      <a className="menu-item">
        <span className="lefti">Extensions Installation </span>
        <span className="righti">
          <ContentCopyRoundedIcon />
        </span>
      </a>
    </Menu>
  );
}

export default Sidebar;
