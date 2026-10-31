import { fmtDate, inr, typeLabel } from "../../utils.js";

// One booking, used on the customer "My Bookings" page and in the admin "All Bookings" tab.
export default function BookingCard({ booking, canCancel, onCancel }) {
  const booked = booking.status === "booked";
  return (
    <div className="booking-card">
      <h5 className="booking-title">
        {typeLabel(booking.roomType)} Room
        <span className={`status-badge ${booked ? "is-booked" : "is-cancelled"}`}>
          {booking.status.toUpperCase()}
        </span>
      </h5>
      <p><b>Booking ID:</b> {booking._id}</p>
      <p>
        <b>From:</b> {fmtDate(booking.fromdate)}
        <span className="sep">|</span>
        <b>To:</b> {fmtDate(booking.todate)}
      </p>
      <p><b>Total Amount:</b> {inr(booking.totalAmount)}</p>
      <p><b>Customer Phone:</b> {booking.phone}</p>
      {booked && canCancel && (
        <div className="booking-actions">
          <button type="button" className="btn-cancel" onClick={() => onCancel(booking._id)}>
            Cancel booking
          </button>
        </div>
      )}
    </div>
  );
}
