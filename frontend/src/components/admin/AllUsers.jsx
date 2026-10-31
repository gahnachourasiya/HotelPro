import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api.js";
import { roleLabel, errMsg } from "../../utils.js";

export default function AllUsers({ version }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((error) => toast.error(errMsg(error, "Could not load users")))
      .finally(() => setLoading(false));
  }, [version]);

  if (loading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="panel-card">
      <div className="panel-head head-dark">
        <h2>All Registered Users</h2>
        <small>Total Users: {users.length}</small>
      </div>
      <div className="panel-body">
        <div className="table-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="id">{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`pill ${u.userType === "admin" ? "pill-success" : "pill-primary"}`}>
                      {roleLabel(u.userType)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
