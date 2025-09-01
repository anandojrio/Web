/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/EventsAdminPage.module.css";
import EventCard from "../components/EventCard";

type EventItem = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
  category?: { id: number; name: string };
  tags?: { id: number; name: string }[];
  maxCapacity?: number;
  likeCount?: number;
  dislikeCount?: number;
};

type Category = { id: number; name: string };

const PAGE_SIZE = 10;

const EventsAdminPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    categoryId: "",
    tags: "",
    maxCapacity: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadEventsAndCategories(pageNum: number) {
    setLoading(true);
    try {
      const [evRes, catRes] = await Promise.all([
        axios.get(`/api/events?page=${pageNum}&limit=${PAGE_SIZE}&sort=createdAt:desc`, { withCredentials: true }),
        axios.get("/api/categories", { withCredentials: true })
      ]);
      const eventsData = evRes.data.data ?? [];
      setEvents(eventsData.map((e: any) => ({
        ...e,
        eventDate: e.eventDate || e.date,
        tags: e.tags ?? [],
        category: e.category ?? undefined,
      })));
      setTotalPages(evRes.data.totalPages ?? 1);
      setCategories(catRes.data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventsAndCategories(page);
    // eslint-disable-next-line
  }, [page]);

  function openCreateForm() {
    setEditing(null);
    setForm({
      title: "", description: "", eventDate: "", location: "", categoryId: "", tags: "", maxCapacity: ""
    });
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(ev: EventItem) {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description,
      eventDate: ev.eventDate ? ev.eventDate.slice(0, 16) : "",
      location: ev.location,
      categoryId: ev.category?.id ? String(ev.category.id) : "",
      tags: (ev.tags || []).map(t => t.name).join(", "),
      maxCapacity: ev.maxCapacity ? String(ev.maxCapacity) : ""
    });
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormError("");
    setEditing(null);
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      const payload = {
        ...form,
        categoryId: parseInt(form.categoryId),
        tags: form.tags.split(/[,;|-]/).map(t => t.trim()).filter(Boolean),
        maxCapacity: form.maxCapacity ? parseInt(form.maxCapacity) : undefined
      };
      if (editing) {
        await axios.put(`/api/events/${editing.id}`, payload, { withCredentials: true });
      } else {
        await axios.post("/api/events", payload, { withCredentials: true });
      }
      await loadEventsAndCategories(page);
      closeForm();
    } catch (err: any) {
      setFormError(err.response?.data?.error || "Greška u unosu.");
    }
  }

  async function deleteEvent(ev: EventItem) {
    if (!window.confirm(`Obriši događaj "${ev.title}" i sve komentare?`)) return;
    try {
      await axios.delete(`/api/events/${ev.id}`, { withCredentials: true });
      await loadEventsAndCategories(page);
    } catch (err: any) {
      alert(err.response?.data?.error || "Greška pri brisanju.");
    }
  }

  return (
    <div className={styles.container}>
      <h2>Events</h2>
      <button
  className={`${styles.primaryButton} ${styles.addEventBtn}`} onClick={openCreateForm}>Add new event</button>
      {loading ? (<p>Loading...</p>
      ) : (
        <>
          <div className={styles.cardGrid}>
            {events.map(ev => (
              <div key={ev.id} className={styles.cardWithActions}>
                <EventCard event={ev}>
                  <div className={styles.eventCardActions}>
                    <button className={styles.primaryButton} onClick={() => openEditForm(ev)}>Edit</button>
                    <button className={styles.primaryButton} onClick={() => deleteEvent(ev)}>Delete</button>
                  </div>
                </EventCard>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.primaryButton}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt; Last
            </button>
            <span>{page} / {totalPages}</span>
            <button
              className={styles.primaryButton}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next &gt;
            </button>
          </div>
        </>
      )}
      {showForm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>{editing ? "Edit event" : "New event"}</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Name:</label>
              <input name="title" value={form.title} onChange={handleFormChange} required />
              <label>description:</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} required />
              <label>Event date & time:</label>
              <input name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleFormChange} required />
              <label>Location:</label>
              <input name="location" value={form.location} onChange={handleFormChange} required />
              <label>Category:</label>
              <select name="categoryId" value={form.categoryId} onChange={handleFormChange} required>
                <option value="">-- Choose --</option>
                {categories.map(cat => (
                  <option value={cat.id} key={cat.id}>{cat.name}</option>
                ))}
              </select>
              <label>Tags (seperate with comma, povlakom ili ; ):</label>
              <input name="tags" value={form.tags} onChange={handleFormChange} placeholder="sport, open-air" />
              <label>Max capacity (optional):</label>
              <input name="maxCapacity" type="number" min={1} value={form.maxCapacity} onChange={handleFormChange} />
              {formError && <div className={styles.error}>{formError}</div>}
              <div className={styles.modalActions}>
                <button type="submit" className={styles.primaryButton}>{editing ? "Sačuvaj" : "Dodaj"}</button>
                <button type="button" className={styles.primaryButton} onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdminPage;
