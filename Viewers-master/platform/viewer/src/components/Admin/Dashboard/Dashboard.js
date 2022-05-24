import React, { Component } from 'react';
import './Dashboard.css';
import Sidebar from './nestedComponents/Sidebar';
import Topbar from './nestedComponents/Topbar';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UsersRequests from './pages/UsersManagement/UserRequests/UsersRequests';
import InitialDashboard from './pages/UsersManagement/InitialDashboard/InitialDashboard';
import UsersAccounts from './pages/UsersManagement/UserAccounts/UsersAccounts2';
import Nodes from './pages/UsersManagement/DicomNodes/Nodes';
import ExtensionInstall from './pages/UsersManagement/ExtensionInstall/ExtensionInstall';
import SwVersions from './pages/UsersManagement/SwVersions/SwVersions';
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
                <UsersAccounts />
              </div>
            </Route>
            <Route path="/nodes">
              <div className="middle">
                <Nodes />
              </div>
            </Route>
            <Route path="/swversions">
              <div className="middle">
                <SwVersions />
              </div>
            </Route>
            <Route path="/extInstallation">
              <div className="middle">
                <ExtensionInstall />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;
