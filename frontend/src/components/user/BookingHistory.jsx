import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import BookingCard from "../common/BookingCard.jsx";
import { today, errMsg } from "../../utils.js";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      toast.error(errMsg(error, "Could not load bookings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      load();
    } catch (error) {
      toast.error(errMsg(error, "Could not cancel"));
    }
  };

  if (loading) return <p className="text-center" style={{ marginTop: 60 }}>Loading bookings...</p>;

  return (
    <div className="container" style={{ maxWidth: 1485, padding: "30px 24px 50px" }}>
      <h1 className="page-heading">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              canCancel={b.fromdate.slice(0, 10) >= today()}
              onCancel={cancel}
            />
          ))}
        </div>
      )}
      <p className="total-line">Total Bookings: {bookings.length}</p>
    </div>
  );
}
