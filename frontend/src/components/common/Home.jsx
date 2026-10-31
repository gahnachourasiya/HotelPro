import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../auth.jsx";
import RoomCard from "./RoomCard.jsx";

export default function Home() {
  const { session } = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data.slice(0, 3)))
      .catch(() => {}); // the preview is optional; stay quiet if the API is down
  }, []);

  const startLink = !session ? "/signup" : session.role === "admin" ? "/admin" : "/rooms";

  return (
    <>
      <section className="hero-band">
        <h1>Find your perfect stay</h1>
        <p>Browse rooms, pick your dates and book in a minute. Secure, simple and fast.</p>
        <Link to={startLink} className="btn-mdb btn-mdb-lg" style={{ textDecoration: "none" }}>
          {session ? "Go to dashboard" : "Get started"}
        </Link>
      </section>

      <section className="home-section">
        <h2 style={{ fontWeight: 400 }}>Featured rooms</h2>
      </section>
      {rooms.length === 0 ? (
        <p className="text-center">Rooms will appear here once the hotel adds them.</p>
      ) : (
        <div className="room-grid" style={{ marginTop: 10 }}>
          {rooms.map((r) => (
            <RoomCard key={r._id} room={r} />
          ))}
        </div>
      )}
      <div className="center" style={{ margin: "10px 0 50px" }}>
        <Link to={session ? "/rooms" : "/login"} className="btn-mdb" style={{ textDecoration: "none" }}>
          See all rooms and book
        </Link>
      </div>
    </>
  );
}
