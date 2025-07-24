import React from "react";
import { useAuth } from "./Auth";
import PeopleList from "./PeopleList";

const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="App">
      <h2>Welcome, {user}</h2>
      <button className="btn btn-danger mb-3" onClick={logout}>
        Log Out
      </button>
      <PeopleList />
    </div>
  );
};

export default Dashboard;
