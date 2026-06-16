import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiUserCheck,
  FiClock,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

const INITIAL_STAFF = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@qorder.com",
    phone: "+1 (555) 201-4401",
    role: "Manager",
    shift: "Morning (6AM – 2PM)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "James Rodriguez",
    email: "james.rodriguez@qorder.com",
    phone: "+1 (555) 201-4402",
    role: "Chef",
    shift: "Morning (6AM – 2PM)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily.chen@qorder.com",
    phone: "+1 (555) 201-4403",
    role: "Waiter",
    shift: "Evening (2PM – 10PM)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Michael Thompson",
    email: "michael.thompson@qorder.com",
    phone: "+1 (555) 201-4404",
    role: "Bartender",
    shift: "Evening (2PM – 10PM)",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Priya Sharma",
    email: "priya.sharma@qorder.com",
    phone: "+1 (555) 201-4405",
    role: "Host",
    shift: "Morning (6AM – 2PM)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@qorder.com",
    phone: "+1 (555) 201-4406",
    role: "Sous Chef",
    shift: "Evening (2PM – 10PM)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Olivia Martinez",
    email: "olivia.martinez@qorder.com",
    phone: "+1 (555) 201-4407",
    role: "Waiter",
    shift: "Night (10PM – 6AM)",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Ryan O'Connor",
    email: "ryan.oconnor@qorder.com",
    phone: "+1 (555) 201-4408",
    role: "Cashier",
    shift: "Morning (6AM – 2PM)",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&auto=format&fit=crop&q=80",
  },
];

const ROLES = ["Manager", "Chef", "Sous Chef", "Waiter", "Bartender", "Host", "Cashier"];
const SHIFTS = ["Morning (6AM – 2PM)", "Evening (2PM – 10PM)", "Night (10PM – 6AM)"];
const STATUS_OPTIONS = ["All Status", "Active", "On Leave", "Inactive"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "On Leave":
      return "bg-yellow-100 text-yellow-700";
    case "Inactive":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function StaffsPage() {
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: "" });

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("Waiter");
  const [formShift, setFormShift] = useState(SHIFTS[0]);
  const [formStatus, setFormStatus] = useState("Active");
  const [formAvatar, setFormAvatar] = useState("");

  const loadStaff = () => {
    if (!localStorage.getItem("mock_db_staff")) {
      localStorage.setItem("mock_db_staff", JSON.stringify(INITIAL_STAFF));
    }
    const stored = JSON.parse(localStorage.getItem("mock_db_staff") || "[]");
    setStaffList(stored);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "Active").length;
    const onLeave = staffList.filter((s) => s.status === "On Leave").length;
    return { total, active, onLeave };
  }, [staffList]);

  const filteredStaff = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return staffList.filter((staff) => {
      const matchesSearch =
        !query ||
        staff.name.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query) ||
        staff.phone.toLowerCase().includes(query) ||
        staff.role.toLowerCase().includes(query) ||
        staff.shift.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" || staff.status === statusFilter;

      const matchesRole =
        roleFilter === "All Roles" || staff.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staffList, searchQuery, statusFilter, roleFilter]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("Waiter");
    setFormShift(SHIFTS[0]);
    setFormStatus("Active");
    setFormAvatar("");
    setFormError("");
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormPhone(staff.phone);
    setFormRole(staff.role);
    setFormShift(staff.shift);
    setFormStatus(staff.status);
    setFormAvatar(staff.avatar || "");
    setFormError("");
    setIsDrawerOpen(true);
  };

  const handleView = (staff) => {
    setViewingStaff(staff);
  };

  const handleDelete = (id, name) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Staff name is required");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      setFormError("A valid email address is required");
      return;
    }

    const defaultAvatar =
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

    if (editingStaff) {
      const updated = staffList.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: formName.trim(),
              email: formEmail.trim(),
              phone: formPhone.trim(),
              role: formRole,
              shift: formShift,
              status: formStatus,
              avatar: formAvatar || defaultAvatar,
            }
          : s
      );
      localStorage.setItem("mock_db_staff", JSON.stringify(updated));
      setStaffList(updated);
    } else {
      const nextId = staffList.reduce((max, s) => (s.id > max ? s.id : max), 0) + 1;
      const newStaff = {
        id: nextId,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        shift: formShift,
        status: formStatus,
        avatar: formAvatar || defaultAvatar,
      };
      const updated = [...staffList, newStaff];
      localStorage.setItem("mock_db_staff", JSON.stringify(updated));
      setStaffList(updated);
    }

    setIsDrawerOpen(false);
    resetForm();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between gap-4 sticky top-0 z-40 shrink-0 shadow-sm">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-none tracking-tight">Staffs</h1>
            <p className="text-xs text-gray-400 mt-1 font-semibold hidden sm:block">
              Manage your restaurant staff members
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-48 sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="h-10 bg-[#e50914] hover:bg-red-700 text-white px-4 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <FiPlus className="text-base" />
              <span className="hidden sm:inline">Add Staff</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Staff</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h2>
                </div>
                <FiUsers className="text-red-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Staff</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</h2>
                  <p className="text-green-600 text-xs font-semibold mt-1">
                    {stats.total > 0
                      ? `${Math.round((stats.active / stats.total) * 100)}% of team`
                      : "No staff yet"}
                  </p>
                </div>
                <FiUserCheck className="text-red-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">On Leave</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.onLeave}</h2>
                  <p className="text-yellow-600 text-xs font-semibold mt-1">Currently unavailable</p>
                </div>
                <FiClock className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase mr-1">
                <FiFilter className="text-sm" /> Filter
              </span>
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "text-gray-500 border border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                {roleFilter}
                <FiChevronDown className="text-gray-400" />
              </button>
              {showRoleDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      setRoleFilter("All Roles");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    All Roles
                  </button>
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Contact</th>
                    <th className="py-4 px-6 text-left">Role</th>
                    <th className="py-4 px-6 text-left">Shift</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                        {searchQuery || statusFilter !== "All Status" || roleFilter !== "All Roles"
                          ? "No staff members match your search or filters"
                          : "No staff members found. Add your first staff member."}
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                            <span className="font-semibold text-gray-900">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{staff.email}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{staff.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-medium">{staff.shift}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(staff.status)}`}
                          >
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleView(staff)}
                              title="View"
                              className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition"
                            >
                              <FiEye className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(staff)}
                              title="Edit"
                              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition"
                            >
                              <FiEdit2 className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(staff.id, staff.name)}
                              title="Delete"
                              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredStaff.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/30">
                <p className="text-xs text-gray-500 font-medium">
                  Showing {filteredStaff.length} of {staffList.length} staff member
                  {staffList.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-500 font-medium shrink-0">
          © 2026 QR Order Restaurant All rights reserved.
        </footer>
      </div>

      {/* View Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setViewingStaff(null)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-6 relative z-10 transform transition-all scale-100 duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-lg text-gray-900">Staff Details</h3>
              <button
                onClick={() => setViewingStaff(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={viewingStaff.avatar}
                alt={viewingStaff.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-red-50/50 shadow-md mb-3"
              />
              <h4 className="text-xl font-bold text-gray-900">{viewingStaff.name}</h4>
              <span
                className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(viewingStaff.status)}`}
              >
                {viewingStaff.status}
              </span>
            </div>
            <div className="space-y-3 text-sm bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between py-2 border-b border-gray-100/50">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="font-semibold text-gray-900">{viewingStaff.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100/50">
                <span className="text-gray-500 font-medium">Phone</span>
                <span className="font-semibold text-gray-900">{viewingStaff.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100/50">
                <span className="text-gray-500 font-medium">Role</span>
                <span className="font-semibold text-gray-900">{viewingStaff.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Shift</span>
                <span className="font-semibold text-gray-900">{viewingStaff.shift}</span>
              </div>
            </div>
            <button
              onClick={() => setViewingStaff(null)}
              className="w-full mt-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsDrawerOpen(false)} />
          <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl flex flex-col p-6 relative z-10 max-h-[90vh] overflow-y-auto transform transition-all scale-100 duration-300 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-bold text-lg text-gray-900">
                {editingStaff ? "Edit Staff Member" : "Add New Staff"}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-gray-500" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter staff name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@restaurant.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Shift</label>
                <select
                  value={formShift}
                  onChange={(e) => setFormShift(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  {SHIFTS.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Avatar URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-gray-50/30"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#e50914] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {editingStaff ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all scale-100 duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6 mx-auto text-[#e50914]">
              <FiTrash2 className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Remove Staff Member</h3>
            <p className="text-gray-600 text-base text-center mb-8 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-gray-900">"{deleteConfirm.name}"</span> from the staff list? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
                className="flex-1 py-3 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold rounded-2xl text-base transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = staffList.filter((s) => s.id !== deleteConfirm.id);
                  localStorage.setItem("mock_db_staff", JSON.stringify(updated));
                  setStaffList(updated);
                  setDeleteConfirm({ isOpen: false, id: null, name: "" });
                }}
                className="flex-1 py-3 bg-[#e50914] hover:bg-red-700 text-white font-bold rounded-2xl text-base transition-all shadow-md cursor-pointer"
              >
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
