import React from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import './UsersAccounts.css';
import Popup from 'reactjs-popup';
import api from '../../ApiConnections/apiManageAccess';

function UsersAccounts() {
  const [data, setData] = React.useState([]);

  const loadTheFuckingData = () => {
    api.get('/staff').then(res => {
      setData(res.data);
      console.log(res.data);
    });
  };

  React.useEffect(() => {
    loadTheFuckingData();
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
      width: 250,
    },
    {
      field: 'professional_id',
      headerName: 'License Number',
      width: 200,
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
      width: 300,
      renderCell: params => {
        return (
          <div className="actions">
            <Popup
              trigger={<button className="declineBtn"> Eliminate </button>}
              modal
              nested
            >
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Confirmation - Elimination </div>
                  <div className="content">
                    {' '}
                    Are you sure you want to eliminate this user?
                  </div>
                  <div className="actions">
                    <button
                      className="declineBtn"
                      onClick={() => {
                        handleDelete(params.row.email);
                        close();
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="acceptBtn"
                      onClick={() => {
                        close();
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        );
      },
    },
  ];

  const handleDelete = id => {
    api.get(`/staff_delete/${id}`).then(res => {
      console.log(res.affectedRows);
      setData(data.filter(item => item.id !== id));
    });
    loadTheFuckingData();
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
          rows={data}
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
