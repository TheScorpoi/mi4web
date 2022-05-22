import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import './UsersAccounts.css';
import api from './apiManageAccess';

function UsersAccounts() {

  const [data, setData] = React.useState([]);

  
  React.useEffect(() => {
    api.get('/staff').then(res => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  const history = useHistory();

  const initDashboard = () => {
    history.push('/users');
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
              className="eliminateBtn"
              onClick={() => handleDelete(params.row.email)}
            >
              Eliminate</button>
            <button className="activateBtn">Activate</button>
            <button className="deactivateBtn">Deactivate</button>
          </div>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    api.get(`/staff_delete/${id}`).then(res => {
      console.log(res.affectedRows)
      setData(data.filter(item => item.id !== id));
    });
  };

  return (
    <>
      <h2 className="title">Current Accounts</h2>
      <div className="btns-wrapper">
        <div className="btns">
          <button className="request" onClick={initDashboard}>
            Request Accounts
          </button>
          <button className="current active">Current Accounts</button>
        </div>
      </div>
      <div className="userList">
        <DataGrid
          rows={ data }
          columns={columns}
          disableSelectionOnClick
          pageSize={6}
          getRowId={row => row.email}
        />
      </div>
    </>
  );
}

export default UsersAccounts;
