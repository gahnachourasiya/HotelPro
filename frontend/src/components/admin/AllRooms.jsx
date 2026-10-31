import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import { CURRENCY, typeLabel, errMsg } from "../../utils.js";
import RoomForm from "./RoomForm.jsx";

// The reference screen has no Edit / Delete column. Set this to false to match it exactly.
const SHOW_ROOM_ACTIONS = true;

export default function AllRooms({ version, onChange }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((error) => toast.error(errMsg(error, "Could not load rooms")))
      .finally(() => setLoading(false));
  }, [version]);

  const remove = async (room) => {
    if (!window.confirm(`Delete room ${room.roomNumber}?`)) return;
    try {
      await api.delete(`/rooms/${room._id}`);
      toast.success("Room deleted");
      onChange();
    } catch (error) {
      toast.error(errMsg(error, "Could not delete room"));
    }
  };

  const save = async (data) => {
    setBusy(true);
    try {
      await api.put(`/rooms/${editing._id}`, data);
      toast.success("Room updated");
      setEditing(null);
      onChange();
    } catch (error) {
      toast.error(errMsg(error, "Could not update room"));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-center">Loading rooms...</p>;

  return (
    <>
      <div className="panel-card">
        <div className="panel-head head-blue">
          <h2>Hotel Room Booking History</h2>
          <small>Total Rooms: {rooms.length}</small>
        </div>
        <div className="panel-body">
          <div className="table-scroll">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Number</th>
                  <th>Capacity</th>
                  <th>Rent / Day</th>
                  <th>Type</th>
                  <th>Description</th>
                  {SHOW_ROOM_ACTIONS && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan={SHOW_ROOM_ACTIONS ? 7 : 6} className="text-center">
                      No rooms yet. Use the Add Room tab.
                    </td>
                  </tr>
                )}
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td className="id">{r._id}</td>
                    <td>{r.roomNumber}</td>
                    <td>{r.capacity}</td>
                    <td>{CURRENCY} {r.rent}</td>
                    <td><span className="pill pill-success">{typeLabel(r.type)}</span></td>
                    <td>{r.description}</td>
                    {SHOW_ROOM_ACTIONS && (
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn-small-primary" onClick={() => setEditing(r)}>Edit</button>
                          <button type="button" className="btn-small-danger" onClick={() => remove(r)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <>
          <div className="modal d-block" role="dialog" aria-modal="true" onClick={() => setEditing(null)}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit room {editing.roomNumber}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setEditing(null)} />
                </div>
                <div className="modal-body">
                  <RoomForm initial={editing} onSubmit={save} submitLabel="Save changes" busy={busy} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop-dim" />
        </>
      )}
    </>
  );
}
