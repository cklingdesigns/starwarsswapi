import React, { useState } from "react";
import { useAuth } from "./Auth";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("starwarsfan");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="LoginForm container mt-5 text-center">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          className="form-control mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="form-control mb-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
