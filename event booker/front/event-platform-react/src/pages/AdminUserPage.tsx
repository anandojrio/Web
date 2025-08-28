/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/AdminUserPage.module.css";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "event creator";
  isActive: boolean;
};

const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "event creator" as "admin" | "event creator",
    password: "",
    confirmPassword: ""
  });
  const [formError, setFormError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    axios.get("/api/users")
      .then(res => setUsers(res.data.data ?? []))
      .catch(() => setError("Greška pri dohvatanju korisnika."))
      .finally(() => setLoading(false));
  }

  const openAddForm = () => {
    setEditing(null);
    setForm({ firstName: "", lastName: "", email: "", role: "event creator", password: "", confirmPassword: "" });
    setShowPasswordFields(true);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (user: User) => {
    setEditing(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: ""
    });
    setShowPasswordFields(false);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError("");
    setEditing(null);
    setShowPasswordFields(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (showPasswordFields && form.password !== form.confirmPassword) {
      setFormError("Lozinke se ne podudaraju.");
      return;
    }
    try {
      if (editing) {
        await axios.put(`/api/users/${editing.id}`, { ...form, password: showPasswordFields ? form.password : undefined }, { withCredentials: true });
      } else {
        await axios.post("/api/users", form, { withCredentials: true });
      }
      await fetchUsers();
      closeForm();
    } catch (err: any) {
      setFormError(
        err.response?.data?.error || "Došlo je do greške. Pokušajte ponovo."
      );
    }
  };

  const tryToggleStatus = async (user: User) => {
    if (user.role === "admin") {
      alert("Nijedan admin ne može biti deaktiviran.");
      return;
    }
    try {
      await axios.patch(`/api/users/${user.id}/status`, { isActive: !user.isActive }, { withCredentials: true });
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Greška pri promeni statusa.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Korisnici</h2>
      <button className={styles.addBtn} onClick={openAddForm}>Dodaj korisnika</button>
      {loading ? <p>Učitavanje...</p>
        : error ? <p className={styles.error}>{error}</p>
        : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ime</th>
                  <th>Prezime</th>
                  <th>Email</th>
                  <th>Tip</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role === "admin" ? "Admin" : "Event creator"}</td>
                    <td style={{ color: user.isActive ? "#CEE056" : "#EBC61D" }}>
                      {user.isActive ? "active" : "inactive"}
                    </td>
                    <td>
  <div className={styles.buttonGroup}>
    <button className={styles.actionBtn} onClick={() => openEditForm(user)}>Izmeni</button>
    <button
      className={styles.actionBtn}
      style={{
        opacity: user.role === "admin" ? 0.5 : 1,
        cursor: user.role === "admin" ? "not-allowed" : "pointer"
      }}
      onClick={() => tryToggleStatus(user)}
      disabled={user.role === "admin"}
      title={user.role === "admin" ? "Admin ne može biti deaktiviran" : ""}
    >
      {user.isActive ? "Deaktiviraj" : "Aktiviraj"}
    </button>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      {/* Add/Edit User Modal */}
      {showForm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>{editing ? "Izmena korisnika" : "Novi korisnik"}</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Ime:</label>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleFormChange}
                required
              />
              <label>Prezime:</label>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleFormChange}
                required
              />
              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
                disabled={!!editing} // don't allow changing email during edit
              />
              <label>Tip korisnika:</label>
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                required
                disabled={!!editing && editing.role === "admin"}
              >
                <option value="event creator">Event creator</option>
                <option value="admin">Admin</option>
              </select>
              {(showPasswordFields || !editing) && (
                <>
                  <label>Lozinka:</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleFormChange}
                    required={!editing || showPasswordFields}
                    autoComplete="new-password"
                  />
                  <label>Potvrdi lozinku:</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleFormChange}
                    required={!editing || showPasswordFields}
                    autoComplete="new-password"
                  />
                </>
              )}
              {formError && <div className={styles.error}>{formError}</div>}
              <div className={styles.modalActions}>
                <button type="submit" className={styles.actionBtn}>
                  {editing ? "Sačuvaj izmene" : "Dodaj"}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={closeForm}>Otkaži</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserPage;
