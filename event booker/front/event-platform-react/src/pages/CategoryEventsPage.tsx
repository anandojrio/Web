import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

type Event = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  category?: { id: number; name: string } | null;
};

const PAGE_SIZE = 10;

const CategoryEventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories/${id}/events?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, page]);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Događaji u ovoj kategoriji</h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : events.length ? (
        <>
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
                </div>
                <div className={styles.eventDesc}>
                  {ev.description.length > 120
                    ? ev.description.substring(0, 120) + "..."
                    : ev.description}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.primaryButton}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prethodna
            </button>
            <span>{page} / {totalPages}</span>
            <button
              className={styles.primaryButton}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sledeća
            </button>
          </div>
        </>
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
          Nema događaja u ovoj kategoriji.
        </div>
      )}
    </div>
  );
};

export default CategoryEventsPage;
