import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageWrapper,
  headingClass,
  bodyText,
  errorClass,
  loadingClass,
} from "../styles/common";

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin-api/users`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsers(res.data.payload || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (email, currentStatus) => {
    const newStatus = !currentStatus;
    const confirmMsg = newStatus
      ? `Reactivate account for ${email}?`
      : `Suspend account for ${email}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/admin-api/user-status`,
        { email, isUserActive: newStatus },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message || "User status updated");
        // Update local state reactively
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.email === email ? { ...u, isUserActive: newStatus } : u
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Filter users based on search
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const role = (u.role || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query) || role.includes(query);
  });

  // Calculate aggregates for the dashboard statistics panel
  const totalUsers = users.length;
  const authorsCount = users.filter((u) => u.role === "author").length;
  const activeCount = users.filter((u) => u.isUserActive).length;
  const suspendedCount = totalUsers - activeCount;

  return (
    <div className={pageWrapper}>
      {/* HEADER SECTION */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
            {currentUser?.firstName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-[#6e6e73]">Admin Panel</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
          </div>
        </div>

        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition cursor-pointer font-medium"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-8 shadow-sm">
        <div className="sm:flex items-center justify-between mb-8">
          <div>
            <h3 className={headingClass}>User Management</h3>
            <p className={`${bodyText} text-sm mt-1`}>
              Manage and monitor registered authors and users. Toggle active state to suspend or restore accounts.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-full px-5 py-2 text-sm text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] w-72 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* STATISTICS PANEL */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">Total Accounts</p>
              <p className="text-3xl font-semibold text-[#1d1d1f] mt-1">{totalUsers}</p>
            </div>
            <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">Authors</p>
              <p className="text-3xl font-semibold text-[#1d1d1f] mt-1">{authorsCount}</p>
            </div>
            <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">Active Users</p>
              <p className="text-3xl font-semibold text-[#34c759] mt-1 flex items-center gap-2">
                {activeCount}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34c759]"></span>
                </span>
              </p>
            </div>
            <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">Suspended</p>
              <p className="text-3xl font-semibold text-[#ff3b30] mt-1 flex items-center gap-2">
                {suspendedCount}
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30]" />
              </p>
            </div>
          </div>
        )}

        {error && <p className={`${errorClass} mb-6`}>{error}</p>}

        {loading ? (
          <p className={loadingClass}>Loading users database...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-[#a1a1a6] py-12 text-sm">
            {users.length === 0 ? "No registered users or authors found." : "No matching users found."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8e8ed]">
                  <th className="pb-4 font-semibold text-[#1d1d1f] text-sm">Name</th>
                  <th className="pb-4 font-semibold text-[#1d1d1f] text-sm">Email</th>
                  <th className="pb-4 font-semibold text-[#1d1d1f] text-sm">Role</th>
                  <th className="pb-4 font-semibold text-[#1d1d1f] text-sm">Status</th>
                  <th className="pb-4 font-semibold text-[#1d1d1f] text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.email} className="border-b border-[#e8e8ed] hover:bg-[#f5f5f7]/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-[#1d1d1f]">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-4 text-sm text-[#6e6e73]">{u.email}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          u.role === "author"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.isUserActive
                            ? "bg-[#34c759]/10 text-[#248a3d]"
                            : "bg-[#ff3b30]/10 text-[#cc2f26]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isUserActive ? "bg-[#34c759]" : "bg-[#ff3b30]"
                          }`}
                        />
                        {u.isUserActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-right">
                      <button
                        onClick={() => toggleUserStatus(u.email, u.isUserActive)}
                        className={`text-xs px-4 py-1.5 rounded-full font-semibold transition cursor-pointer ${
                          u.isUserActive
                            ? "border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/10"
                            : "border border-[#34c759] text-[#34c759] hover:bg-[#34c759]/10"
                        }`}
                      >
                        {u.isUserActive ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;