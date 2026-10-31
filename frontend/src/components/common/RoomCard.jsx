import { useState } from "react";
import { inr, typeLabel } from "../../utils.js";

// Card used on the customer dashboard and the home page.
// Pass onLearnMore to show the LEARN MORE button.
export default function RoomCard({ room, onLearnMore }) {
  const [broken, setBroken] = useState(false);
  const photo = room.photos && room.photos[0];

  return (
    <div className="mdb-card">
      {photo && !broken ? (
        <img
          className="mdb-card-img"
          src={photo}
          alt={`Room ${room.roomNumber}`}
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="mdb-card-img" />
      )}
      <div className="mdb-card-body">
        <h5 className="mdb-card-title">Room Type: {typeLabel(room.type)}</h5>
        <p className="mdb-card-line">
          Room Capacity: {room.capacity} {room.capacity === 1 ? "Person" : "People"}
        </p>
        <p className="mdb-card-line">Rent: {inr(room.rent)} per day</p>
        <p className="mdb-card-line">Type: {typeLabel(room.type)}</p>
        <p className="mdb-card-line">Description: {room.description}</p>
        {onLearnMore && (
          <div className="mdb-card-actions">
            <button type="button" className="btn-mdb" onClick={() => onLearnMore(room)}>
              Learn more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
