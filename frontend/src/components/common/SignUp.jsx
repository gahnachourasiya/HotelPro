import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api.js";
import { errMsg, roleLabel } from "../../utils.js";
import AuthIllustration from "./AuthIllustration.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: "",
    adminCode: "",
  });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef(null);

  // Close the SELECT USER menu when clicking elsewhere
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const pick = (userType) => {
    setForm({ ...form, userType, adminCode: "" });
    setOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.userType) return toast.error("Please select the user type");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setBusy(true);
    try {
      const { name, email, password, phone, userType, adminCode } = form;
      await api.post("/auth/signup", { name, email, password, phone, userType, adminCode });
      toast.success("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(errMsg(error, "Could not create account"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-grid">
      <div className="auth-art">
        <AuthIllustration />
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <h1 className="auth-title">Register for the Account</h1>
        <input className="field" name="name" placeholder="Full Name"
          value={form.name} onChange={onChange} required />
        <input className="field" type="email" name="email" placeholder="Email Address"
          value={form.email} onChange={onChange} required />
        <input className="field" type="password" name="password" placeholder="Password"
          value={form.password} onChange={onChange} required minLength={6} />
        <input className="field" type="tel" name="phone" placeholder="Enter Mobile no."
          value={form.phone} onChange={onChange} required
          pattern="\+?[0-9]{10,13}" title="10 to 13 digits" />

        <div className="mdb-dropdown" ref={menuRef}>
          <button type="button" className="btn-mdb" onClick={() => setOpen((o) => !o)}>
            {form.userType ? roleLabel(form.userType) : "Select user"}
            <span className="caret" />
          </button>
          {open && (
            <ul className="mdb-menu">
              <li><button type="button" onClick={() => pick("customer")}>Ordinary</button></li>
              <li><button type="button" onClick={() => pick("admin")}>Admin</button></li>
            </ul>
          )}
        </div>

        {form.userType === "admin" && (
          <input className="field" type="password" name="adminCode"
            placeholder="Admin access code" value={form.adminCode}
            onChange={onChange} required />
        )}

        <div>
          <button className="btn-mdb btn-mdb-lg" disabled={busy}>
            {busy ? "Registering..." : "Register"}
          </button>
        </div>
        <p className="auth-switch">
          Had an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
