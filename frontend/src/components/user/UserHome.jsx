import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api.js";
import RoomCard from "../common/RoomCard.jsx";
import RoomModal from "./RoomModal.jsx";
import { errMsg } from "../../utils.js";

// Customer dashboard: a grid of room cards. LEARN MORE opens the room
// with date pickers and the Book button.
export default function UserHome() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((error) => toast.error(errMsg(error, "Could not load rooms")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center" style={{ marginTop: 60 }}>Loading rooms...</p>;

  return (
    <>
      {rooms.length === 0 ? (
        <p className="text-center" style={{ marginTop: 60 }}>No rooms are available right now.</p>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onLearnMore={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <RoomModal
          room={selected}
          onClose={() => setSelected(null)}
          onBooked={() => {
            setSelected(null);
            navigate("/bookings");
          }}
        />
      )}
    </>
  );
}
