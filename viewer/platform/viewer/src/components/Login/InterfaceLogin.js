import React from 'react';
import PropTypes from 'prop-types';

function InterfaceLogin({ hide }) {
  return (
    <div className="interfaceLogin" onClose="hide">
      <br></br>
      <br></br>
      <form>
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
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

InterfaceLogin.propTypes = {
  hide: PropTypes.func,
};

export { InterfaceLogin };
