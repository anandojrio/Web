/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/EventDetailPage.module.css";

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type Author = { firstName: string; lastName: string };
type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  location: string;
  likeCount: number;
  dislikeCount: number;
  views: number;
  category: Category;
  tags: Tag[];
  author: Author;
  maxCapacity?: number | null;
};
type Comment = {
  id: number;
  authorName: string;
  text: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
};

const PAGE_SIZE = 10;

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id!);
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [similar, setSimilar] = useState<Event[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpCount, setRsvpCount] = useState<number>(0);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [alreadyRSVPed, setAlreadyRSVPed] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/events/${eventId}`)
      .then((res) => setEvent(res.data.data))
      .finally(() => setLoading(false));
    axios.get(`/api/events/${eventId}/similar`)
      .then((res) => setSimilar(res.data.data));
    axios.get(`/api/events/${eventId}/rsvps`)
      .then(res => {
        setRsvpCount(res.data.data.length);
        if (user) {
          setAlreadyRSVPed(res.data.data.some((rsvp: any) => rsvp.user.id === user.id));
        } else {
          setAlreadyRSVPed(false);
        }
      })
      .catch(() => {
        setRsvpCount(0);
        setAlreadyRSVPed(false);
      });
    fetchComments(commentsPage);
  }, [eventId, commentsPage, user]);

  function fetchComments(page: number) {
  axios.get(`/api/events/${eventId}/comments?page=${page}&limit=${PAGE_SIZE}`)
    .then(res => {
      setComments(res.data.data);
      setTotalCommentPages(res.data.totalPages || 1);
    });
}


  function handleReaction(type: "like" | "dislike") {
    axios.post(`/api/events/${eventId}/${type}`)
      .then(() => axios.get(`/api/events/${eventId}`))
      .then(res => setEvent(res.data.data));
  }

  function handleCommentReaction(id: number, type: "like" | "dislike") {
    axios.post(`/api/comments/${id}/${type}`)
      .then(() => fetchComments(commentsPage));
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    axios.post(`/api/events/${eventId}/comments`, { authorName, text: commentText })
      .then(() => {
        setCommentText("");
        setAuthorName("");
        fetchComments(1);
      });
  }

  // RSVP uses POST /api/events/${eventId}/rsvp
  function handleRSVP() {
    setRsvpLoading(true);
    axios.post(`/api/events/${eventId}/rsvp`)
      .then(() => {
        setRsvpStatus("Uspešno ste se prijavili!");
        setAlreadyRSVPed(true);
        setRsvpCount(val => val + 1);
      })
      .catch(res => {
        setRsvpStatus(res.response?.data?.error || "Greška pri prijavi.");
      })
      .finally(() => setRsvpLoading(false));
  }

  // Cancel RSVP uses DELETE /api/events/${eventId}/rsvp
  function handleCancelRSVP() {
    setRsvpLoading(true);
    axios.delete(`/api/events/${eventId}/rsvp`)
      .then(() => {
        setRsvpStatus("Prijava je uspešno otkazana.");
        setAlreadyRSVPed(false);
        setRsvpCount(val => Math.max(0, val - 1));
      })
      .catch(res => {
        setRsvpStatus(res.response?.data?.error || "Greška pri otkazivanju prijave.");
      })
      .finally(() => setRsvpLoading(false));
  }

  if (loading) return <div className={styles.container}>Učitavanje...</div>;
  if (!event) return <div className={styles.container}>Event not found.</div>;

  return (
    <div className={styles.pageGrid}>
      <div className={styles.leftColumn}>
        <div>
          <h1>{event.title}</h1>
          <p>
            <span className={styles.columnName}>Category:</span>
            <span className={styles.columnValue}>{event.category?.name}</span>
          </p>
          <p>
            <span className={styles.columnName}>Author:</span>
            <span className={styles.columnValue}>{event.author.firstName} {event.author.lastName}</span>
          </p>
          <p>
            <span className={styles.columnName}>Creation date:</span>
            <span className={styles.columnValue}>{new Date(event.createdAt).toLocaleString("sr-RS")}</span>
          </p>
          <p>
            <span className={styles.columnName}>Datum održavanja:</span>
            <span className={styles.columnValue}>{new Date(event.eventDate).toLocaleString("sr-RS")}</span>
          </p>
          <p>
            <span className={styles.columnName}>Location:</span>
            <span className={styles.columnValue}>{event.location}</span>
          </p>
          <p>
            <span className={styles.columnName}>Views:</span>
            <span className={styles.columnValue}>{event.views}</span>
          </p>
          <div>
            <span className={styles.columnName}>Tags:</span>
            {event.tags.map(tag => (
              <span key={tag.id} className={styles.columnValue}>
                <Link to={`/tags/${tag.id}`}>{tag.name}</Link>{" "}
              </span>
            ))}
          </div>
          <hr />
          <p className={styles.columnValue}>{event.description}</p>
        </div>
        <div className={styles.sectionSpacing}>
          <div className={styles.reactions}>
            <button onClick={() => handleReaction("like")}>❤️ {event.likeCount}</button>
            <button onClick={() => handleReaction("dislike")}>💔 {event.dislikeCount}</button>
          </div>
          {event.maxCapacity &&
            <div className={styles.rsvpSection}>
              <span className={styles.columnName}>Enrolled:</span>
              <span className={styles.columnValue}>{rsvpCount} / {event.maxCapacity}</span>
              {!user ? (
                <span className={styles.error} style={{ marginLeft: 17 }}>You have to be logged in</span>
              ) : alreadyRSVPed ? (
                <button
                  className={styles.primaryButton}
                  disabled={rsvpLoading}
                  onClick={handleCancelRSVP}
                >Cancel enrollment</button>
              ) : (
                <button
                  className={styles.primaryButton}
                  disabled={rsvpLoading || rsvpCount >= event.maxCapacity}
                  onClick={handleRSVP}
                >Enroll</button>
              )}
              {rsvpStatus && <span style={{ color: "var(--accent-gold)", marginLeft: 13 }}>{rsvpStatus}</span>}
            </div>
          }
        </div>
        <div className={styles.similarSection}>
          <h2>Read more...</h2>
          {similar.length === 0 && <p>No similar events.</p>}
          <ul>
            {similar.map(ev => (
              <li key={ev.id}>
                <Link to={`/dogadjaj/${ev.id}`}>{ev.title}</Link> – {ev.category?.name}, {new Date(ev.eventDate).toLocaleDateString("sr-RS")}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div>
          <h2>Comments</h2>
          <form onSubmit={submitComment}>
            <input
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Your name"
              required
            />
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Your comment"
              required
            />
            <button type="submit" className={styles.primaryButton}>Comment</button>
          </form>
          <div>
            {comments.map(comm => (
              <div key={comm.id} className={styles.comment}>
                <div>
                  <b>{comm.authorName}</b> <span>{new Date(comm.createdAt).toLocaleString("sr-RS")}</span>
                </div>
                <p>{comm.text}</p>
                <button className={styles.primaryButton} onClick={() => handleCommentReaction(comm.id, "like")}>👍 {comm.likeCount}</button>
                <button className={styles.primaryButton} onClick={() => handleCommentReaction(comm.id, "dislike")}>👎 {comm.dislikeCount}</button>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.primaryButton}
              disabled={commentsPage === 1}
              onClick={() => setCommentsPage(commentsPage - 1)}
            >
              Last
            </button>
            <span>{commentsPage} / {totalCommentPages}</span>
            <button
              className={styles.primaryButton}
              disabled={commentsPage === totalCommentPages}
              onClick={() => setCommentsPage(commentsPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
