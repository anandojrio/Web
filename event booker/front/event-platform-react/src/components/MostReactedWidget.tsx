import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMostReactedEvents } from "../api/events";
import styles from "../styles/MostReactedWidget.module.css";

type Event = {
  id: number;
  title: string;
  likeCount?: number;
  dislikeCount?: number;
};

const MostReactedWidget: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    getMostReactedEvents()
      .then(res => setEvents(res.data.data?.slice(0, 3) || []))
      .catch(() => setEvents([]));
  }, []);
  return (
    <aside className={styles.widget}>
      <div className={styles.title}>Most reactions</div>
      <ul className={styles.list}>
        {events.map(ev =>
          <li key={ev.id} className={styles.item}>
            <Link to={`/dogadjaj/${ev.id}`} className={styles.link}>
              {ev.title}
            </Link>
            <span className={styles.counts}>
              <span className={styles.like}>❤️ {ev.likeCount ?? 0}</span>
              <span className={styles.dislike}>💔 {ev.dislikeCount ?? 0}</span>
            </span>
          </li>
        )}
        {events.length === 0 &&
          <li className={styles.loading}>Nema podataka</li>
        }
      </ul>
    </aside>
  );
};

export default MostReactedWidget;
