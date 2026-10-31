import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import BookingCard from "../common/BookingCard.jsx";
import { errMsg } from "../../utils.js";

export default function AllBookings({ version, onChange }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/bookings")
      .then((res) => setBookings(res.data))
      .catch((error) => toast.error(errMsg(error, "Could not load bookings")))
      .finally(() => setLoading(false));
  }, [version]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      onChange();
    } catch (error) {
      toast.error(errMsg(error, "Could not cancel"));
    }
  };

  if (loading) return <p className="text-center">Loading bookings...</p>;

  return (
    <>
      <h1 className="page-heading">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} canCancel onCancel={cancel} />
          ))}
        </div>
      )}
      <p className="total-line">Total Bookings: {bookings.length}</p>
    </>
  );
}
