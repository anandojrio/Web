import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";
import styles from "../styles/HomePage.module.css";
import MostReactedWidget from "../components/MostReactedWidget";

type Event = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  category?: { id: number; name: string } | null;
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(res => {
        setEvents(res.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <MostReactedWidget />
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Newest events</h1>
        {loading ? (
          <p>Loading...</p>
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
          <p>No events.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
