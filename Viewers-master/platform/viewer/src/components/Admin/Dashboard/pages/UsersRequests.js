import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import './UsersRequests.css';
import api from './apiManageAccess';


function UsersRequests() {

  const [data, setData] = React.useState([]);

  const loadTheFuckingData = () => {
    api.get('/request_account').then(res => {
      setData(res.data);
      console.log(res.data);
    });
  };

  React.useEffect(() => {
    loadTheFuckingData();
  }, []);

  const history = useHistory();

  const initDashboard = () => {
    history.push('/currentUsers');
  };

  const handleDelete = (id) => {
    api.get(`/request_delete/${id}`).then(res => {
      loadTheFuckingData()
    });
  };

  const handleAccept = (id) => {
    api.get(`/request_accept/${id}`).then(res => {
      console.log(res.affectedRows)
      setData(data.filter(item => item.id !== id));
    });
    api.get(`/request_accepte_update/${id}`).then(res => {
      console.log(res.affectedRows)
      setData(data.filter(item => item.id !== id));
    });
    loadTheFuckingData()

  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'fullname',
      headerName: 'Full Name',
      sortable: false,
      width: 225,
    },
    {
      field: 'hospital',
      headerName: 'Hospital',
      width: 275,
    },
    {
      field: 'professional_id',
      headerName: 'License Number',
      width: 225,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 225,
    },
    {
      field: 'type_user',
      headerName: 'Job',
      width: 225,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 400,
      renderCell: params => {
        return (
          <div className="actions">
            <button
              className="acceptBtn"
              onClick={() => handleAccept(params.row.email)}
            >Accept</button>
            <button
              className="declineBtn"
              onClick={() => handleDelete(params.row.email)}
            >Decline</button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <h2 className="title">Manage Acess</h2>
      <div className="btns-wrapper">
        <div className="btns">
          <button className="request active">Request Accounts</button>
          <button className="current" onClick={initDashboard}>
            Current Accounts
          </button>
        </div>
      </div>
      <div className="userList">
        <DataGrid
          rows={data}
          disableSelectionOnClick
          columns={columns}
          pageSize={9}
          getRowId={row => row.email}
        />
      </div>
    </>
  );
}

export default UsersRequests;
