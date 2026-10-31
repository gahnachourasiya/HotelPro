import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <small>© {new Date().getFullYear()} All rights reserved.</small>
      <Link to="/about">About</Link>
    </footer>
  );
}
