import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

import { useHistory } from 'react-router-dom';
import './UsersRequests.css';

function UsersRequests() {
  const history = useHistory();

  const initDashboard = () => {
    history.push('/currentUsers');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'fullName',
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
      field: 'license',
      headerName: 'License Number',
      width: 225,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 225,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 400,
      renderCell: params => {
        return (
          <div className="actions">
            <button className="acceptBtn">Accept</button>
            <button className="declineBtn">Decline</button>
          </div>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      fullName: 'Jon Snow',
      hospital: 'Hospital da Luz',
      license: 354563789,
      email: 'snow@luz.pt',
    },
    {
      id: 2,
      fullName: 'Cersei Lannister',
      hospital: 'Hospital do Incesto',
      license: 123456789,
      email: 'snow@incesto.pt',
    },
    {
      id: 3,
      fullName: 'Jaime Lannister',
      hospital: 'Hospital do Incesto',
      license: 564728495,
      email: 'snow@incesto.pt',
    },
    {
      id: 4,
      fullName: 'Daenerys Targaryen',
      hospital: 'Hospital dos Dragões',
      license: 375839672,
      email: 'daenerys@dragoes.pt',
    },
    {
      id: 5,
      fullName: 'Arya Stark',
      hospital: 'Hospital da Luz',
      license: 193758364,
      email: 'arya@luz.pt',
    },
    {
      id: 6,
      fullName: 'Ferrara Clifford',
      hospital: 'Hospital do Boda',
      license: 685795732,
      email: 'ferrara@boda.pt',
    },
    {
      id: 7,
      fullName: 'Melisandre',
      hospital: 'Hospital do Boda',
      license: 453627589,
      email: 'meli@boda.pt',
    },
    {
      id: 8,
      fullName: 'Rossini Frances',
      hospital: 'Hospital da Sombra',
      license: 987654637,
      email: 'rossini@sombra.pt',
    },
    {
      id: 9,
      fullName: 'Harvey Roxie',
      hospital: 'Hospital do Porto',
      license: 198573863,
      email: 'harvey@porto.pt',
    },
    {
      id: 10,
      fullName: 'Eva Romão',
      hospital: 'Hospital da Luz',
      license: 598572628,
      email: 'eva@luz.pt',
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
          rows={rows}
          disableSelectionOnClick
          columns={columns}
          pageSize={6}
          checkboxSelection
        />
      </div>
    </>
  );
}

export default UsersRequests;
