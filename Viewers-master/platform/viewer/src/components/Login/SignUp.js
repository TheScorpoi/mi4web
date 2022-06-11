import React from 'react';
import PropTypes from 'prop-types';
import './SignUp.css';
import api from './api';
import { useState } from 'react';
var crypto = require('crypto');
const { SHA3 } = require('sha3');
//import CryptoJS from 'crypto';

function SignUp({ hide }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospital, setHospital] = useState('');
  const [professional_id, setProfessional_id] = useState('');
  const [type_user, setTypeUser] = useState('');
  console.log('name', name);
  console.log('email', email);
  console.log('hospital', hospital);
  console.log('speciality', professional_id);
  console.log('type_user', type_user);
  const hash = new SHA3(512);

  
    
  function register() {


    console.log('name', name);
    console.log('email', email);
    //console.log('password', password);
    console.log('hospital', hospital);
    console.log('speciality', professional_id);
    console.log('type_user', type_user);
    const encrypted_password = hash.update(password).digest("hex");
    console.log("password", encrypted_password);
  

    api.post(`/register_request/${name}/${email}/${encrypted_password}/${hospital}/${professional_id}/${type_user}`).then(res => {
       console.log("request made to api")
     });
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
          <label >Professional ID</label>
          <br />
          <br />
          <input
            value={professional_id}
            id = "professional_id"
            type="professional_id"
            className="form-control"
            placeholder="Enter Professional ID"
            onChange={event => setProfessional_id(event.target.value)}
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
