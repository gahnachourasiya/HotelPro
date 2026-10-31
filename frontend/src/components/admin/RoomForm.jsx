import { useState } from "react";

const empty = {
  roomNumber: "",
  capacity: "",
  rent: "",
  type: "deluxe",
  description: "",
  photos: ["", "", ""],
};

// Used for both "Add a New Room" and "Edit room".
export default function RoomForm({ initial, onSubmit, submitLabel, busy }) {
  const [form, setForm] = useState(() => {
    if (!initial) return empty;
    const photos = [...(initial.photos || []), "", "", ""].slice(0, 3);
    return { ...initial, photos };
  });

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const setPhoto = (i, value) =>
    setForm((f) => ({ ...f, photos: f.photos.map((p, idx) => (idx === i ? value : p)) }));

  const handle = (e) => {
    e.preventDefault();
    onSubmit({
      roomNumber: Number(form.roomNumber),
      capacity: Number(form.capacity),
      rent: Number(form.rent),
      type: form.type,
      description: form.description,
      photos: form.photos.map((p) => p.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handle}>
      <div className="rf-row">
        <div>
          <label className="rf-label" htmlFor="roomNumber">Room Number</label>
          <input id="roomNumber" type="number" min="1" className="rf-input" placeholder="Room Number"
            value={form.roomNumber} onChange={(e) => set("roomNumber", e.target.value)} required />
        </div>
        <div>
          <label className="rf-label" htmlFor="capacity">Max. Capacity</label>
          <input id="capacity" type="number" min="1" className="rf-input" placeholder="No. of people"
            value={form.capacity} onChange={(e) => set("capacity", e.target.value)} required />
        </div>
        <div>
          <label className="rf-label" htmlFor="rent">Room Rent</label>
          <input id="rent" type="number" min="1" className="rf-input" placeholder="Rent per day"
            value={form.rent} onChange={(e) => set("rent", e.target.value)} required />
        </div>
      </div>

      <div className="rf-section">
        <label className="rf-label">Room Photos</label>
        <div className="rf-stack">
          {form.photos.map((p, i) => (
            <input key={i} className="rf-input" placeholder={`Image ${i + 1} URL`}
              value={p} onChange={(e) => setPhoto(i, e.target.value)} />
          ))}
        </div>
      </div>

      <div className="rf-section">
        <label className="rf-label">Room Type</label>
        <div className="radio-row">
          <label>
            <input type="radio" name="type" checked={form.type === "deluxe"} onChange={() => set("type", "deluxe")} />
            Delux
          </label>
          <label>
            <input type="radio" name="type" checked={form.type === "standard"} onChange={() => set("type", "standard")} />
            Non-Delux
          </label>
        </div>
      </div>

      <div className="rf-section">
        <label className="rf-label" htmlFor="description">Room Description</label>
        <textarea id="description" className="rf-input" value={form.description}
          onChange={(e) => set("description", e.target.value)} required />
      </div>

      <div className="center">
        <button className="btn-mdb btn-mdb-lg" disabled={busy}>
          {busy ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
