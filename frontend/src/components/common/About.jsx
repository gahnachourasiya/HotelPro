export default function About() {
  return (
    <div className="container my-5" style={{ maxWidth: 800 }}>
      <h1 className="h3 mb-3">About HotelPro</h1>
      <p>
        HotelPro is a hotel room booking system built with the MERN stack (MongoDB, Express,
        React, Node.js). Customers can register, search rooms by date, book a stay and cancel it.
        Administrators manage rooms, bookings and registered users.
      </p>
      <h2 className="h5 mt-4">How it works</h2>
      <ul>
        <li>Create an account and log in.</li>
        <li>Choose check-in and check-out dates to see available rooms.</li>
        <li>Book a room. The price is calculated per night.</li>
        <li>View or cancel your bookings from My Bookings.</li>
      </ul>
    </div>
  );
}
