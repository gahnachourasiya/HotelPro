import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth.jsx";
import { BRAND_PUBLIC, BRAND_USER } from "../../utils.js";

// Three looks, as in the reference screens:
//  visitors  -> light bar, "RoomsForUse", Home / Login / SignUp
//  customer  -> light bar, "SB Hotel",    Hi / My Bookings / Logout
//  admin     -> purple-blue gradient bar, "RoomsForUse", Hi / Logout
export default function Navbar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (session && session.role === "admin") {
    return (
      <nav className="nav-gradient">
        <Link to="/admin" className="brand-white">{BRAND_PUBLIC}</Link>
        <div className="nav-links-white">
          <span>Hi, {session.user.name}</span>
          <button type="button" className="link-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    );
  }

  if (session) {
    return (
      <nav className="nav-light">
        <Link to="/rooms" className="brand-light">{BRAND_USER}</Link>
        <div className="nav-links-light">
          <span>Hi, {session.user.name}</span>
          <Link to="/bookings">My Bookings</Link>
          <button type="button" className="link-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-light">
      <Link to="/" className="brand-light">{BRAND_PUBLIC}</Link>
      <div className="nav-links-light">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">SignUp</Link>
      </div>
    </nav>
  );
}
