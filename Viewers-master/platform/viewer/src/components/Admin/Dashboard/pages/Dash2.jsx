import React from 'react';
import './dash2.css';
import PeopleIcon from '@material-ui/icons/People';
import api from './api';

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
      
    <div className="dash">
      <div className="dashItem">
        <span className="dashTitle">Server Name</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{ data.Name}</span>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Server Version</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{ data.Version}</span>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">DICOM Port</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{ data.DicomPort}</span>
          <div className="dashIcons">
            <PeopleIcon size={70} />
          </div>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Database Version</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{ data.DatabaseVersion}</span>
        </div>
      </div>
    </div>
  );
}
