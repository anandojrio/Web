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
  // Add other fields as needed
};

type Props = {
  event: Event;
  onView?: (id: number) => void;
};

const EventCard: React.FC<Props> = ({ event, onView }) => {
  return (
    <div className="event-card" style={{border: "1px solid #ccc", padding: 16, borderRadius: 8, margin: 8}}>
      <h2>{event.title}</h2>
      <p><strong>Datum:</strong> {new Date(event.eventDate).toLocaleString('sr-RS')}</p>
      <p><strong>Lokacija:</strong> {event.location}</p>
      <p><strong>Kategorija:</strong> {event.category?.name}</p>
      <p>
        <strong>Tagovi:</strong>{" "}
        {event.tags?.map(tag => tag.name).join(", ")}
      </p>
      <p>
        ❤️ {event.likeCount ?? 0}
        {" "}
        💔 {event.dislikeCount ?? 0}
      </p>
      <button onClick={() => onView?.(event.id)}>Detalji</button>
    </div>
  );
};

export default EventCard;
