import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await axios.post(
        "/api/auth/register",
        { ...form }, // all fields except "role" (defaults to event creator)
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/login"); // Go to login page
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "Registracija nije uspela. Proverite podatke i pokušajte ponovo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "70px auto",
      padding: 24,
      background: "#2D322C",
      borderRadius: 11,
      color: "#F3F3F2",
      boxShadow: "0 3px 22px #0009"
    }}>
      <h2 style={{ color: "#CEE056", textAlign: "center", marginBottom: 17 }}>Registration</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: 17 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 7 }}>Email:</label>
          <input
            style={{
              width: "100%", padding: 8, borderRadius: 7, border: "none",
              background: "#040B11", color: "#F3F3F2", fontSize: "1em"
            }}
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 17 }}>
          <label htmlFor="firstName" style={{ display: "block", marginBottom: 7 }}>Name:</label>
          <input
            style={{
              width: "100%", padding: 8, borderRadius: 7, border: "none",
              background: "#040B11", color: "#F3F3F2", fontSize: "1em"
            }}
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 17 }}>
          <label htmlFor="lastName" style={{ display: "block", marginBottom: 7 }}>Surname:</label>
          <input
            style={{
              width: "100%", padding: 8, borderRadius: 7, border: "none",
              background: "#040B11", color: "#F3F3F2", fontSize: "1em"
            }}
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 25 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 7 }}>Password:</label>
          <input
            style={{
              width: "100%", padding: 8, borderRadius: 7, border: "none",
              background: "#040B11", color: "#F3F3F2", fontSize: "1em"
            }}
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        {error && (
          <div style={{ color: "#EBC61D", marginBottom: 13, textAlign: "center" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="registerButton"
          style={{
            width: "100%",
            background: "#CEE056",
            color: "#040B11",
            fontWeight: 700,
            border: "none",
            borderRadius: 7,
            padding: "10px",
            fontSize: "1.08em",
            cursor: "pointer",
            transition: "background 0.15s, transform 0.15s, box-shadow 0.13s"
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#EBC61D")}
          onMouseLeave={e => (e.currentTarget.style.background = "#CEE056")}
        >
          {submitting ? "Registrujem..." : "Registruj se"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
