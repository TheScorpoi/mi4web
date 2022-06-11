import React from 'react';
import PropTypes from 'prop-types';
import './SignUp.css';
import api from './api';
import {useState} from 'react';
function SignUp({ hide }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospital, setHospital] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [type_user, setTypeUser] = useState('');
  console.log('name', name);
  console.log('email', email);
  console.log('password', password);
  console.log('hospital', hospital);
  console.log('speciality', speciality);
  console.log('type_user', type_user);
  

  
    
  function register() {


    console.log('name', name);
    console.log('email', email);
    console.log('password', password);
    console.log('hospital', hospital);
    console.log('speciality', speciality);
    console.log('type_user', type_user);
    React.useEffect(() => {
      api.post(`/register_request/${name}/${email}/${password}/${hospital}/${speciality}/${type_user}`).then(res => {
  });
   },[]);
   return console.log('name', name);
  }

  return (
    <div className="signUp" onClose="hide">
      <br />
      <br />
      <form>
        <div className="mb-3">
          <label >Name</label>
          <br />
          <br />
          <input
            id = "name"
            type="name"
            value={name}
            className="form-control"
            placeholder="Enter name"
            onChange={event => setName(event.target.value)}
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Email</label>
          <br />
          <br />
          <input
            value={email}
            id = "email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={event => setEmail(event.target.value)}
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label>Password</label>
          <br />
          <br />
          <input
            value={password}
            id = "password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Hospital</label>
          <br />
          <br />
          <input
            value={hospital}
            id = "hospital"
            type="hospital"
            name="hospital"
            className="form-control"
            placeholder="Enter Hospital"
            onChange={event => setHospital(event.target.value)}
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Speciality</label>
          <br />
          <br />
          <input
            value={speciality}
            id = "speciality"
            type="speciality"
            className="form-control"
            placeholder="Enter speciality"
            onChange={event => setSpeciality(event.target.value)}
          />
        </div>
        <br />
        <br />
        <div class = "search_categories">
          <label>Type of User</label>
          <br />
          <br />
          <select className='sel' name = "Type of User" type = "type"  id = "type" value={type_user} onChange={event => setTypeUser(event.target.value)}>
            <option value="" disabled selected hidden>Select Type of User</option>
            <option value="Clinical Imaging Staff">Clinical Imaging Staff</option>
            <option value="Referring Clinical Staff">Referring Clinical Staff</option>
          </select>
        </div>
        <br />
        <br />
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" onClick={register()} >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

SignUp.propTypes = {
  hide: PropTypes.func,
};

export { SignUp };
