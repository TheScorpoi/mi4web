import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import './UsersAccounts.css';
function UsersAccounts() {
  const history = useHistory();

  const initDashboard = () => {
    history.push('/users');
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
            <button
              className="eliminateBtn"
              onClick={() => handleDelete(params.row.id)}
            >
              Eliminate
            </button>
            <button
              className="activateBtn"
              onClick={() => handleActive(params.row.id)}
            >
              Activate
            </button>
            <button className="deactivateBtn">Deactivate</button>
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

  const [rowData, setRowData] = useState(rows);

  const handleDelete = id => {
    setRowData(rowData.filter(item => item.id !== id));
  };

  const handleActive = id => {
    console.log(rowData.filter(item => item.id === id));
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
          rows={rowData}
          disableSelectionOnClick
          columns={columns}
          pageSize={6}
          checkboxSelection
        />
      </div>
    </>
  );
}

export default UsersAccounts;