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
    history.push('/');
  };

  const users = () => {
    history.push('/users');
  };

  return (
    <Menu>
      <a className="menu-item" onClick={initDashboard}>
        Dashboard{' '}
        <span>
          <DashboardOut />
        </span>
      </a>
      <a className="menu-item" onClick={users}>
        Manage Acess{' '}
        <span>
          <PeopleRoundedIcon />
        </span>
      </a>
      <a className="menu-item">
        SW Versions{' '}
        <span>
          <Versions />
        </span>
      </a>
      <a className="menu-item">
        DICOM Nodes{' '}
        <span>
          <TreeRounded />
        </span>
      </a>
      <a className="menu-item">
        Extensions Installation{' '}
        <span>
          <ContentCopyRoundedIcon />
        </span>
      </a>
    </Menu>
  );
}

export default Sidebar;
