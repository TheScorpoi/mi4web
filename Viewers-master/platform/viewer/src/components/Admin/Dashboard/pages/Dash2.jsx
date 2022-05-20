import React from 'react';
import './dash2.css';
import PeopleIcon from '@material-ui/icons/People';
import api from './api';

export default function Dash2() {
  const [data_stats, setData] = React.useState([]);
  const [data_system, setDataSystem] = React.useState([]);

  console.log('aqui oh cornos');

  React.useEffect(() => {
    api.get('/statistics').then(res => {
      setData(res.data);
      console.log(res);
    });
  }, []);

  React.useEffect(() => {
    api.get('/system').then(res => {
      setDataSystem(res.data);
      console.log(res);
    });
  }, []);

  return (
    <div className="dash">
      <div className="dashItem">
        <span className="dashTitle">Server Name</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{data_stats.CountInstances}</span>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Server Version</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{data_stats.CountPatients}</span>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">DICOM Port</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances"> {data_stats.CountSeries}</span>
          <div className="dashIcons">
            <PeopleIcon size={70} />
          </div>
        </div>
      </div>

      <div className="dashItem">
        <span className="dashTitle">Puglins Enable</span>
        <div className="dashInstancesContainer">
          <span className="dashInstances">{data_stats.TotalDiskSizeMB}</span>
        </div>
      </div>
    </div>
  );
}
