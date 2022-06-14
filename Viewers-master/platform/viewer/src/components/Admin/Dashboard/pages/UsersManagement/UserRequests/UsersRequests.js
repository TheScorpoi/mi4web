import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import './UsersRequests.css';
import api from '../../ApiConnections/apiManageAccess';

import Popup from 'reactjs-popup';

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

  const handleDelete = id => {
    api.get(`/request_delete/${id}`).then(res => {
      loadTheFuckingData();
    });
  };

  const handleAccept = id => {
    api.get(`/request_accept/${id}`).then(res => {
      console.log(res.affectedRows);
      setData(data.filter(item => item.id !== id));
    });
    api.get(`/request_accepte_update/${id}`).then(res => {
      console.log(res.affectedRows);
      setData(data.filter(item => item.id !== id));
    });
    loadTheFuckingData();
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
              trigger={<button className="acceptBtn"> Accept </button>}
              modal
              nested
            >
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Confirmation - Accept</div>
                  <div className="header" style={{ color: "white" , align: "center", borderBottomWidth: 0 }}>
                    {' '}
                    Are you sure you want to accept this user?
                  </div>
                  <div className="actions">
                    <button
                      className="declineBtn"
                      onClick={() => {
                        handleAccept(params.row.email);
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

            <Popup
              trigger={<button className="declineBtn"> Decline </button>}
              modal
              nested
            >
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Confirmation - Decline </div>
                  <div className="header" style={{ color: "white" , align: "center", borderBottomWidth: 0 }}>

                    {' '}
                    Are you sure you want to decline this user?
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
