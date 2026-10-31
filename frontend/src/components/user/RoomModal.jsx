import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import { today, nightsBetween, inr, fmtDate, typeLabel, errMsg } from "../../utils.js";

// Room details + date selection + booking.
export default function RoomModal({ room, onClose, onBooked }) {
  const [dates, setDates] = useState({ fromdate: "", todate: "" });
  const [available, setAvailable] = useState(null); // null = not checked yet
  const [photo, setPhoto] = useState(0);
  const [busy, setBusy] = useState(false);

  const nights = dates.fromdate && dates.todate ? nightsBetween(dates.fromdate, dates.todate) : 0;
  const datesValid = nights >= 1;
  const photos = room.photos || [];

  // Ask the server whether this room is free for the chosen dates
  useEffect(() => {
    setAvailable(null);
    if (!datesValid) return undefined;
    let cancelled = false;
    api
      .get("/rooms", { params: { fromdate: dates.fromdate, todate: dates.todate } })
      .then((res) => {
        if (cancelled) return;
        const found = res.data.find((r) => r._id === room._id);
        setAvailable(Boolean(found) && found.available !== false);
      })
      .catch(() => !cancelled && setAvailable(null));
    return () => {
      cancelled = true;
    };
  }, [dates.fromdate, dates.todate, datesValid, room._id]);

  const book = async () => {
    setBusy(true);
    try {
      await api.post("/bookings", { roomid: room._id, ...dates });
      toast.success("Room booked successfully");
      onBooked();
    } catch (error) {
      toast.error(errMsg(error, "Could not book the room"));
      setAvailable(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Room {room.roomNumber} · {typeLabel(room.type)}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="row g-4">
                <div className="col-md-6">
                  {photos.length > 0 ? (
                    <>
                      <img src={photos[photo]} alt="" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 6 }} />
                      {photos.length > 1 && (
                        <div className="thumbs">
                          {photos.map((p, i) => (
                            <img key={p + i} src={p} alt="" className={i === photo ? "on" : ""} onClick={() => setPhoto(i)} />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mdb-card-img" style={{ height: 220 }} />
                  )}
                  <p className="mt-3 mb-1">Room Capacity: {room.capacity} {room.capacity === 1 ? "Person" : "People"}</p>
                  <p className="mb-1">Rent: {inr(room.rent)} per day</p>
                  <p className="mb-0">Description: {room.description}</p>
                </div>

                <div className="col-md-6">
                  <label className="rf-label" htmlFor="fromdate">Arrival date</label>
                  <input id="fromdate" type="date" className="rf-input" min={today()} value={dates.fromdate}
                    onChange={(e) => setDates({ ...dates, fromdate: e.target.value, todate: "" })} />
                  <label className="rf-label mt-3" htmlFor="todate">Departure date</label>
                  <input id="todate" type="date" className="rf-input" min={dates.fromdate || today()} value={dates.todate}
                    disabled={!dates.fromdate}
                    onChange={(e) => setDates({ ...dates, todate: e.target.value })} />

                  <div className="mt-4" style={{ minHeight: 84 }}>
                    {datesValid ? (
                      <>
                        <p className="mb-1">{fmtDate(dates.fromdate)} to {fmtDate(dates.todate)}</p>
                        <p className="mb-1">{nights} {nights === 1 ? "night" : "nights"} x {inr(room.rent)}</p>
                        <p className="mb-1"><b>Total Amount: {inr(nights * room.rent)}</b></p>
                        {available === true && <span className="status-badge is-booked" style={{ marginLeft: 0 }}>AVAILABLE</span>}
                        {available === false && <span className="status-badge is-cancelled" style={{ marginLeft: 0 }}>NOT AVAILABLE</span>}
                      </>
                    ) : (
                      <p className="mb-0">Choose your arrival and departure dates to see the price.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-mdb btn-mdb-outline" onClick={onClose}>Close</button>
              <button type="button" className="btn-mdb" onClick={book} disabled={busy || !datesValid || available !== true}>
                {busy ? "Booking..." : "Book now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop-dim" />
    </>
  );
}
