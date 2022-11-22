import React from 'react';
import { Route, Router } from 'react-router-dom';
import history from './utils/history';
import Home from './pages/customer/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/admin/AdminHome';
import DeveloperHome from './pages/developer/DeveloperHome';
import ProjectHome from './pages/developer/project/ProjectHome';
import Editor from './pages/gui-services/customizer/Editor';
import ClientView from './pages/gui-services/customizer/client-view/ClientView';
import ASPage from './pages/developer/service/ASPage';

const RouterConfig = () => (
  <Router history={history}>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route exact path="/home" component={Home} />
    <Route path="/developer" component={DeveloperHome} />
    <Route path="/admin" component={AdminHome} />
    <Route path="/home/project" component={ProjectHome} />
    <Route path="/layout/:id" component={Editor} />
    <Route path="/view/:id" component={ClientView} />
    <Route exact path="/refactor" component={ASPage} />
  </Router>
);

export default RouterConfig;
