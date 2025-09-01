import React from "react";
import { Link } from "react-router-dom";
import homeStyles from "../styles/HomePage.module.css";

type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  likeCount?: number;
  dislikeCount?: number;
  category?: { id: number; name: string };
  tags?: { id: number; name: string }[];
  author?: { firstName: string; lastName: string };
};

type Props = {
  event: Event;
  children?: React.ReactNode; // For admin-specific buttons (Izmeni/Obriši)
};

const EventCard: React.FC<Props> = ({ event, children }) => (
  <div className={homeStyles.eventCard}>
    <Link to={`/dogadjaj/${event.id}`} className={homeStyles.eventTitle}>
      {event.title}
    </Link>
    <div className={homeStyles.eventMeta}>
      {event.category && (
        <span className={homeStyles.eventCategory}>{event.category.name}</span>
      )}
      <span className={homeStyles.eventDate}>
        {new Date(event.eventDate).toLocaleString("sr-RS")}
      </span>
    </div>
    <div className={homeStyles.eventDesc}>
      {event.description?.length > 0 ? event.description : ""}
    </div>
    <div className={homeStyles.eventMeta}>
      <strong>Location:</strong> {event.location}
    </div>
    {event.tags && event.tags.length > 0 && (
      <div style={{ margin: "5px 0" }}>
        <strong>Tags:</strong> {event.tags.map(tag => tag.name).join(", ")}
      </div>
    )}
    <div className={homeStyles.eventMeta}>
      <span style={{ color: "#EF5050" }}>❤️ {event.likeCount ?? 0}</span>
      <span style={{ color: "#EBC61D", marginLeft: 15 }}>
        💔 {event.dislikeCount ?? 0}
      </span>
    </div>
    {children}
  </div>
);

export default EventCard;
