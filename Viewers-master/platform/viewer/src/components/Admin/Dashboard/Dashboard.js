import React, { Component } from 'react';
import './Dashboard.css';
import Sidebar from './nestedComponents/Sidebar';
import Topbar from './nestedComponents/Topbar';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UsersRequests from './pages/UsersRequests';
import InitialDashboard from './pages/InitialDashboard';
import RemoveUsers from './pages/UsersAccounts';
function Dashboard() {
  return (
    <Router>
      <div className="interface">
        <Topbar />
        <div className="container">
          <Sidebar />
          <Switch>
            <Route exact path="/dashboard">
              <div className="middle">
                <InitialDashboard />
              </div>
            </Route>
            <Route path="/users">
              <div className="middle">
                <UsersRequests />
              </div>
            </Route>
            <Route path="/currentUsers">
              <div className="middle">
                <RemoveUsers />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;
