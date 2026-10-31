import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api.js";
import { useAuth } from "../../auth.jsx";
import { errMsg } from "../../utils.js";
import AuthIllustration from "./AuthIllustration.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}`);
      // Admins always land on the dashboard. Customers go back to where they were headed.
      if (data.user.userType === "admin") navigate("/admin", { replace: true });
      else navigate(location.state?.from?.pathname || "/rooms", { replace: true });
    } catch (error) {
      toast.error(errMsg(error, "Could not log in"));
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
        <h1 className="auth-title">Login for the Account</h1>
        <input
          className="field"
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="field"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button className="btn-mdb btn-mdb-lg" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </form>
    </div>
  );
}
