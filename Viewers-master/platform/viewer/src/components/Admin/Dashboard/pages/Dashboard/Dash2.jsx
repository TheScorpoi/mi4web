import React from 'react';
import './dash2.css';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import StorageIcon from '@material-ui/icons/Storage';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import api from '../api';

export default function Dash2() {
  const [data , setData] = React.useState([]);

  React.useEffect(() => {
    api.get('/system').then(res => {
      setData(res.data);
      console.log(res);
      console.log(data.PluginsEnabled);
    });
  }, []);

  return (
    <div>
    <span className="titleDashboard">Statistcs</span>
    <div className="dash">

      <div className="dashItem">
        <div className="part1">
          <span className="dashTitle">Server Name</span>
          <div className="dashInstancesContainer">
            <span className="dashInstances">{ data.Name}</span>
          </div>
        
        </div>
          <div className="dashIcons">
            <DeveloperBoardIcon  fontSize="large" />
        </div>
        
      </div>

      <div className="dashItem">
        <div className="part1">
          <span className="dashTitle">Server Version</span>
          <div className="dashInstancesContainer">
            <span className="dashInstances">{ data.Version}</span>
          </div>
        </div>
        <div className="dashIcons">
            <AccountTreeIcon  fontSize="large" />
        </div>
      </div>

      <div className="dashItem">
        <div className="part1">
          <span className="dashTitle">DICOM Port</span>
          <div className="dashInstancesContainer">
            <span className="dashInstances">{ data.DicomPort}</span>
          </div>
        </div>
        <div className="dashIcons">
            <MeetingRoom  fontSize="large" />
        </div>
      </div>

      <div className="dashItem">
        <div className="part1">
          <span className="dashTitle">Database Version</span>
          <div className="dashInstancesContainer">
            <span className="dashInstances">{ data.DatabaseVersion}</span>
          </div>
        </div>
        <div className="dashIcons">
            <StorageIcon  fontSize="large" />
        </div>
      </div>

    </div> 
    </div> 
  );
}
