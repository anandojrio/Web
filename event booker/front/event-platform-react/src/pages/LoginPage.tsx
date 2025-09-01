import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      // res.data.data.user is the user, data.token is the auth token (in cookies)
      setUser(res.data.data.user); // Update AuthContext so nav updates
      navigate("/"); // Redirect to home (or dashboard) on success
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "Neuspešna prijava. Proverite podatke i pokušajte ponovo."
      );
    }
  };

  return (
    <div style={{ maxWidth: 370, margin: "70px auto", padding: 24, background: "#040B11", borderRadius: 10, color: "#F3F3F2", boxShadow: "0 3px 22px #0009" }}>
      <h2 style={{ color: "#CEE056", textAlign: "center", marginBottom: 17 }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>Email:</label>
<input
  style={{
    width: "100%",
    padding: 7,
    marginBottom: 18,  // Increase this for more margin BELOW each field
    borderRadius: 7,
    border: "none",
    background: "#040B11",
    color: "#F3F3F2",
    fontSize: "1em"
  }}
  type="email"
  id="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
/>
<label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>Password:</label>
<input
  style={{
    width: "100%",
    padding: 7,
    marginBottom: 22,
    borderRadius: 7,
    border: "none",
    background: "#040B11",
    color: "#F3F3F2",
    fontSize: "1em"
  }}
  type="password"
  id="password"
  value={password}
  onChange={e => setPassword(e.target.value)}
  required
/>

        {error && (
          <div style={{ color: "#EBC61D", marginBottom: 12, textAlign: "center" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          className="loginButton"
          style={{
            width: "100%",
            background: "#CEE056",
            color: "#040B11",
            fontWeight: 700,
            border: "none",
            borderRadius: 7,
            padding: "10px",
            fontSize: "1.06em",
            cursor: "pointer"
          }}
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
