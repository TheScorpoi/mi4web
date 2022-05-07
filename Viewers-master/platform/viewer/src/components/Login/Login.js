import React from 'react';
import PropTypes from 'prop-types';

import './Login.css';

function Login({ hide }) {
  return (
    <div className="login" onClose="hide">
      <form>
        <div className="mb-3">
          <label>Email address</label>
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
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  hide: PropTypes.func,
};

export { Login };
