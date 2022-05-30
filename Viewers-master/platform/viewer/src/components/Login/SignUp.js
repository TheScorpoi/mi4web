import React from 'react';
import PropTypes from 'prop-types';
import './SignUp.css';
function SignUp({ hide }) {
  return (
    <div className="signUp" onClose="hide">
      <br />
      <br />
      <form>
        <div className="mb-3">
          <label >Firstname</label>
          <br />
          <br />
          <input
            type="firstName"
            className="form-control"
            placeholder="Enter firstname"
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Lastname</label>
          <br />
          <br />
          <input
            type="lastName"
            className="form-control"
            placeholder="Enter lastname"
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Email address</label>
          <br />
          <br />
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label>Password</label>
          <br />
          <br />
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        <br />
        <br />
        <div className="mb-3">
          <label >Specialty</label>
          <br />
          <br />
          <input
            type="Specialty"
            className="form-control"
            placeholder="Enter specialty"
          />
        </div>
        <br />
        <br />
        <div class = "search_categories">
          <label>Type of User</label>
          <br />
          <br />
          <select className='sel' name = "Type of User" >
            <option value="" disabled selected hidden>Select Type of User</option>
            <option value="Clinical Imaging Staff">Clinical Imaging Staff</option>
            <option value="Referring Clinical Staff">Referring Clinical Staff</option>
          </select>
        </div>
        <br />
        <br />
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
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
