import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

type Event = {
  id: number;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  category?: { id: number; name: string } | null;
};

const NajposecenijiPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events/most-viewed")
      .then(res => res.json())
      .then(data => {
        setEvents(data.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Najposećeniji događaji</h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : events.length ? (
        <div className={styles.eventList}>
          {events.map(ev => (
            <div key={ev.id} className={styles.eventCard}>
              <Link to={`/dogadjaj/${ev.id}`} className={styles.eventTitle}>
                {ev.title}
              </Link>
              <div className={styles.eventMeta}>
                {ev.category?.name && (
                  <span className={styles.eventCategory}>{ev.category.name}</span>
                )}
                <span className={styles.eventDate}>
                  {new Date(ev.createdAt).toLocaleString("sr-RS")}
                </span>
                <span style={{ marginLeft: 12 }}>
                  👁️ {ev.views} pregleda
                </span>
              </div>
              <div className={styles.eventDesc}>
                {ev.description.length > 120
                  ? ev.description.substring(0, 120) + "..."
                  : ev.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          color: "#EBC61D",
          background: "#232622",
          textAlign: "center",
          margin: "42px auto 0 auto",
          fontSize: "1.18em",
          padding: "18px 0 19px 0",
          borderRadius: 11,
          boxShadow: "0 2px 14px #0008, 0 1px 6px #EBC61D22",
          maxWidth: "480px",
          letterSpacing: "0.03em"
        }}>
          Nema događaja.
        </div>
      )}
    </div>
  );
};

export default NajposecenijiPage;
