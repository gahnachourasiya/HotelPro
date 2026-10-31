import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import { errMsg } from "../../utils.js";
import RoomForm from "./RoomForm.jsx";

export default function AddRoom({ onAdded }) {
  const [busy, setBusy] = useState(false);

  const submit = async (room) => {
    setBusy(true);
    try {
      await api.post("/rooms", room);
      toast.success("Room added successfully");
      onAdded();
    } catch (error) {
      toast.error(errMsg(error, "Could not add room"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel-card add-room-card">
      <div className="panel-head head-blue">
        <h2>Add a New Room</h2>
      </div>
      <div className="panel-body">
        <RoomForm onSubmit={submit} submitLabel="Add Room" busy={busy} />
      </div>
    </div>
  );
}
