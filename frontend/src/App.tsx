// src/App.tsx
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { isAuthenticated } from './utils/token';

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route 
        path="/dashboard" 
        render={() => 
          isAuthenticated() ? 
            <Dashboard /> : 
            <Redirect to="/login" />
        } 
      />
    </Switch>
  );
};

export default App;