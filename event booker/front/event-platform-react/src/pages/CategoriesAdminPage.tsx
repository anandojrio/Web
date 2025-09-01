/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/CategoriesAdminPage.module.css";

type Category = { id: number; name: string; description: string; };
type Event = { id: number; title: string; categoryId: number };

const CategoriesAdminPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  // Fetch categories and event counts per category
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("/api/categories"),
      axios.get("/api/events")
    ])
      .then(([catRes, eventRes]) => {
        setCategories(catRes.data.data ?? []);
        // count events per category
        const events: Event[] = eventRes.data.data ?? [];
        const countByCat: Record<number, number> = {};
        events.forEach(ev => {
          countByCat[ev.categoryId] = (countByCat[ev.categoryId] || 0) + 1;
        });
        setEventsByCategory(countByCat);
      })
      .catch(() => setError("Greška pri dohvatanju podataka."))
      .finally(() => setLoading(false));
  }, []);

  const openAddForm = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError("");
    setEditing(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      if (editing) {
        // Edit category
        await axios.put(`/api/categories/${editing.id}`, form, { withCredentials: true });
      } else {
        // Add new
        await axios.post("/api/categories", form, { withCredentials: true });
      }
      // Refresh categories
      const catRes = await axios.get("/api/categories");
      setCategories(catRes.data.data ?? []);
      closeForm();
    } catch (err: any) {
      setFormError(
        err.response?.data?.error || "Došlo je do greške. Pokušajte ponovo."
      );
    }
  };

  const tryDeleteCategory = async (cat: Category) => {
    if (eventsByCategory[cat.id]) {
      alert("Nije dozvoljeno brisanje kategorije u kojoj ima događaja.");
      return;
    }
    if (!window.confirm(`Delete category: "${cat.name}"?`)) return;
    try {
      await axios.delete(`/api/categories/${cat.id}`, { withCredentials: true });
      setCategories(categories.filter(c => c.id !== cat.id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Greška pri brisanju.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Categories</h2>
      <button className={styles.addBtn} onClick={openAddForm}>Add new category</button>
      {loading ? <p>Loading...</p>
        : error ? <p className={styles.error}>{error}</p>
        : (
          <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditForm(cat)}>Edit</button>
                    <button
                      className={styles.actionBtn}
                      style={{ opacity: (eventsByCategory[cat.id] ? 0.5 : 1), cursor: (eventsByCategory[cat.id] ? "not-allowed" : "pointer") }}
                      onClick={() => tryDeleteCategory(cat)}
                      disabled={!!eventsByCategory[cat.id]}
                      title={eventsByCategory[cat.id] ? "Ne može da se obriše (postoje događaji)" : ""}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )
      }
      {/* Add/Edit Category Modal */}
      {showForm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>{editing ? "Izmena kategorije" : "Nova kategorija"}</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Name:</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleFormChange}
                required
              />
              <label>Description:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                required
              />
              {formError && <div className={styles.error}>{formError}</div>}
              <div className={styles.modalActions}>
                <button type="submit" className={styles.actionBtn}>
                  {editing ? "Save changes" : "Add"}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdminPage;
