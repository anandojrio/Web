// src/components/EventCard.tsx
import React from "react";

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
  onView?: (id: number) => void;
  children?: React.ReactNode; // For admin-specific buttons (Edit/Delete)
};

const EventCard: React.FC<Props> = ({ event, onView, children }) => (
  <div className="eventCard">
    <h2 className="eventTitle">{event.title}</h2>
    <div className="eventMeta">
      {event.category && (
        <span className="eventCategory">{event.category.name}</span>
      )}
      <span className="eventDate">
        {new Date(event.eventDate).toLocaleString("sr-RS")}
      </span>
    </div>
    <div className="eventDesc">{event.description}</div>
    <div className="eventMeta" style={{ margin: "10px 0 2px 0" }}>
      <strong>Lokacija:</strong> {event.location}
    </div>
    {event.tags && event.tags.length > 0 && (
      <div style={{ margin: "5px 0" }}>
        <strong>Tagovi:</strong> {event.tags.map(tag => tag.name).join(", ")}
      </div>
    )}
    <div className="eventMeta">
      <span style={{ color: "#EF5050" }}>❤️ {event.likeCount ?? 0}</span>
      <span style={{ color: "#EBC61D", marginLeft: 15 }}>
        💔 {event.dislikeCount ?? 0}
      </span>
    </div>
    <button className="eventCardBtn" onClick={() => onView?.(event.id)}>
      Detalji
    </button>
    {children}
  </div>
);

export default EventCard;
