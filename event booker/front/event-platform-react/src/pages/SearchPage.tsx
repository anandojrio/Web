/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/EventsAdminPage.module.css";
import EventCard from "../components/EventCard";

const PAGE_SIZE = 10;

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query.length < 2) {
      setEvents([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    axios
      .get(`/api/events?q=${encodeURIComponent(query)}&page=${page}&limit=${PAGE_SIZE}`)
      .then(res => {
        setEvents(res.data.data ?? []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  return (
    <div className={styles.container}>
      <h2>Rezultati pretrage</h2>
      {loading ? (
        <p>Pretraga...</p>
      ) : (
        <>
          {events.length ? (
            <>
              <div className={styles.cardGrid}>
                {events.map((ev: any) => (
                  <div key={ev.id} className={styles.cardWithActions}>
                    <EventCard event={ev} />
                  </div>
                ))}
              </div>
              <div className={styles.pagination}>
                <button
                  className={styles.primaryButton}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  &lt; Prethodna
                </button>
                <span>{page} / {totalPages}</span>
                <button
                  className={styles.primaryButton}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Sledeća &gt;
                </button>
              </div>
            </>
          ) : (
            hasSearched && <p>Nema događaja koji odgovaraju ovoj pretrazi.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
