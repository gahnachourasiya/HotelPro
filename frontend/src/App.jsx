import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./auth.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import Home from "./components/common/Home.jsx";
import About from "./components/common/About.jsx";
import Login from "./components/common/Login.jsx";
import SignUp from "./components/common/SignUp.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import UserHome from "./components/user/UserHome.jsx";
import BookingHistory from "./components/user/BookingHistory.jsx";
import AdminHome from "./components/admin/AdminHome.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <main className="content">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Customer only */}
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute role="customer">
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute role="customer">
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />

              {/* Admin only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminHome />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}
