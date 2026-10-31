import { useState } from "react";
import AllBookings from "./AllBookings.jsx";
import AllRooms from "./AllRooms.jsx";
import AddRoom from "./AddRoom.jsx";
import AllUsers from "./AllUsers.jsx";

const TABS = [
  { key: "bookings", label: "All Bookings" },
  { key: "rooms", label: "All Rooms" },
  { key: "add", label: "Add Room" },
  { key: "users", label: "All User" },
];

export default function AdminHome() {
  const [tab, setTab] = useState("bookings");
  const [version, setVersion] = useState(0); // bump to reload the lists
  const refresh = () => setVersion((v) => v + 1);

  return (
    <div className="admin-panel">
      <div className="mdb-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`mdb-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "bookings" && <AllBookings version={version} onChange={refresh} />}
      {tab === "rooms" && <AllRooms version={version} onChange={refresh} />}
      {tab === "add" && (
        <AddRoom
          onAdded={() => {
            refresh();
            setTab("rooms");
          }}
        />
      )}
      {tab === "users" && <AllUsers version={version} />}
    </div>
  );
}
