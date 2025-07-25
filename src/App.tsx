import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React from 'react';
import PeopleList from "./components/PeopleList";
import Login from "./components/Login";
import { AuthProvider, useAuth } from './components/Auth';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <header>
        <span className="Logo">
          <img
            src={process.env.PUBLIC_URL + "/sw-logo.png"}
            alt="Star Wars Characters"
          />
        </span>
        <button className="btn btn-outline-light" onClick={logout}>
          Log Out
        </button>
      </header>

      <h1>Star Wars Characters</h1>
      <p className="text-white">Welcome, {user}</p>
      <PeopleList />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;