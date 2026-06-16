/** @format */
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  FiSearch,
  FiChevronDown,
  FiUserPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBarChart2,
  FiDollarSign,
  FiSliders,
  FiBell,
  FiEye,
} from "react-icons/fi";

const CustomerPage = () => {
  // Customer data state
  const [customers, setCustomers] = useState([
    {
      id: 1,
      initials: "SM",
      name: "Sophia Martinez",
      email: "sophia.m@email.com",
      phone: "+1 (555) 012-3456",
      orders: 24,
      totalSpent: "$486.50",
      lastVisit: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      initials: "JD",
      name: "James Doe",
      email: "james.d@email.com",
      phone: "+1 (555) 987-6543",
      orders: 12,
      totalSpent: "$210.00",
      lastVisit: "1 day ago",
      status: "Active",
    },
    {
      id: 3,
      initials: "AW",
      name: "Alice Walker",
      email: "alice.w@email.com",
      phone: "+1 (555) 456-7890",
      orders: 5,
      totalSpent: "$85.50",
      lastVisit: "3 days ago",
      status: "Inactive",
    },
    {
      id: 4,
      initials: "MR",
      name: "Michael Ross",
      email: "michael.r@email.com",
      phone: "+1 (555) 123-4567",
      orders: 45,
      totalSpent: "$1,200.00",
      lastVisit: "5 hours ago",
      status: "Active",
    },
    {
      id: 5,
      initials: "SJ",
      name: "Sarah Jenkins",
      email: "sarah.j@email.com",
      phone: "+1 (555) 222-3333",
      orders: 8,
      totalSpent: "$140.20",
      lastVisit: "1 week ago",
      status: "Active",
    },
    {
      id: 6,
      initials: "RT",
      name: "Robert Taylor",
      email: "robert.t@email.com",
      phone: "+1 (555) 444-5555",
      orders: 31,
      totalSpent: "$890.75",
      lastVisit: "2 weeks ago",
      status: "Inactive",
    },
    {
      id: 7,
      initials: "EL",
      name: "Emma Larson",
      email: "emma.l@email.com",
      phone: "+1 (555) 666-7777",
      orders: 19,
      totalSpent: "$345.60",
      lastVisit: "1 month ago",
      status: "Active",
    },
    {
      id: 8,
      initials: "DW",
      name: "David Wright",
      email: "david.w@email.com",
      phone: "+1 (555) 888-9999",
      orders: 2,
      totalSpent: "$45.00",
      lastVisit: "2 months ago",
      status: "Inactive",
    },
    {
      id: 9,
      initials: "PL",
      name: "Patricia Lee",
      email: "patricia.l@email.com",
      phone: "+1 (555) 000-1111",
      orders: 56,
      totalSpent: "$2,100.25",
      lastVisit: "Just now",
      status: "Active",
    },
    {
      id: 10,
      initials: "KH",
      name: "Kevin Harris",
      email: "kevin.h@email.com",
      phone: "+1 (555) 111-2222",
      orders: 14,
      totalSpent: "$320.00",
      lastVisit: "1 day ago",
      status: "Active",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [popupState, setPopupState] = useState(null); // 'viewDetails', 'addCustomer', or 'editProfile'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null); // Customer to view details

  // Filter states
  const [filterStatus, setFilterStatus] = useState("All");
  const [minSpend, setMinSpend] = useState("");
  const [maxSpend, setMaxSpend] = useState("");
  const [minOrders, setMinOrders] = useState("");
  const [maxOrders, setMaxOrders] = useState("");
  const [dateRange, setDateRange] = useState("all");

  // Header editable state
  const [restaurantName, setRestaurantName] = useState(() => {
    return localStorage.getItem("restaurantName") || "Bella Italia Restaurant";
  });
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem("adminInfo");
    return saved ? JSON.parse(saved) : { name: "Admin", role: "Administrator" };
  });

  const [addCustomerData, setAddCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const [customerHistory, setCustomerHistory] = useState(() => {
    const stored = localStorage.getItem("customerHistory");
    return stored ? JSON.parse(stored) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock user data for header
  const user = {
    name: "Admin User",
    avatar: "https://via.placeholder.com/40",
    email: "admin@example.com",
  };

  // Helper function to parse total spent
  const parseTotalSpent = (totalSpentStr) => {
    return parseFloat(totalSpentStr.toString().replace(/[^0-9.-]+/g, ""));
  };

  // Filter customers based on search, status, spend, orders, and date
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || customer.status === filterStatus;

    const spentAmount = parseTotalSpent(customer.totalSpent);
    const matchesMinSpend =
      minSpend === "" || spentAmount >= parseFloat(minSpend);
    const matchesMaxSpend =
      maxSpend === "" || spentAmount <= parseFloat(maxSpend);

    const matchesMinOrders =
      minOrders === "" || customer.orders >= parseInt(minOrders);
    const matchesMaxOrders =
      maxOrders === "" || customer.orders <= parseInt(maxOrders);

    let matchesDateRange = true;
    if (dateRange !== "all") {
      const lastVisit = customer.lastVisit.toLowerCase();
      switch (dateRange) {
        case "today":
          matchesDateRange =
            lastVisit.includes("hour") || lastVisit === "just now";
          break;
        case "week":
          matchesDateRange =
            lastVisit.includes("hour") ||
            lastVisit.includes("day") ||
            lastVisit.includes("week") ||
            lastVisit === "just now" ||
            lastVisit === "yesterday";
          break;
        case "month":
          matchesDateRange =
            lastVisit.includes("hour") ||
            lastVisit.includes("day") ||
            lastVisit.includes("week") ||
            lastVisit.includes("month") ||
            lastVisit === "just now" ||
            lastVisit === "yesterday";
          break;
        case "inactive":
          matchesDateRange =
            lastVisit.includes("month") ||
            lastVisit.includes("months") ||
            lastVisit === "2 months ago";
          break;
        default:
          matchesDateRange = true;
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMinSpend &&
      matchesMaxSpend &&
      matchesMinOrders &&
      matchesMaxOrders &&
      matchesDateRange
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / itemsPerPage),
  );
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to first page if search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filterStatus,
    minSpend,
    maxSpend,
    minOrders,
    maxOrders,
    dateRange,
  ]);

  // Dynamic Stat calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;

  const totalSpentAll = customers.reduce((sum, c) => {
    const num = parseTotalSpent(c.totalSpent);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const avgSpend = totalCustomers === 0 ? 0 : totalSpentAll / totalCustomers;

  const newThisMonth = customers.filter(
    (c) =>
      c.lastVisit.includes("hour") ||
      c.lastVisit.includes("day") ||
      c.lastVisit === "Just now" ||
      c.lastVisit === "Yesterday",
  ).length;

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers.toString(),
      subtext: "Based on current data",
      subtextClass: "text-gray-500",
    },
    {
      label: "Recently Active",
      value: newThisMonth.toString(),
      subtext: "Visited recently",
      subtextClass: "text-gray-500",
    },
    {
      label: "Active Customers",
      value: activeCustomers.toString(),
      subtext: `${Math.round((activeCustomers / totalCustomers) * 100 || 0)}% of total`,
      subtextClass: "text-gray-500",
    },
    {
      label: "Avg. Spend",
      value: `$${avgSpend.toFixed(2)}`,
      subtext: "Across all customers",
      subtextClass: "text-gray-500",
    },
  ];

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus("All");
    setMinSpend("");
    setMaxSpend("");
    setMinOrders("");
    setMaxOrders("");
    setDateRange("all");
    setSearchQuery("");
    setShowFilterModal(false);
  };

  // Edit handlers
  const handleEditClick = (customer) => {
    setEditFormData({ ...customer });
    setPopupState("editProfile");
  };

  const handleSaveClick = () => {
    setCustomers(
      customers.map((c) => (c.id === editFormData.id ? editFormData : c)),
    );
    setPopupState(null);
    setEditFormData({});
    // Update view customer if it's the same one
    if (viewCustomer && viewCustomer.id === editFormData.id) {
      setViewCustomer(editFormData);
    }
  };

  const handleCancelClick = () => {
    setPopupState(null);
    setEditFormData({});
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
      setActiveDropdownId(null);
      if (viewCustomer && viewCustomer.id === id) {
        setViewCustomer(null);
        setPopupState(null);
      }
    }
  };

  const handleAddCustomer = () => {
    setAddCustomerData({ name: "", email: "", phone: "", status: "Active" });
    setPopupState("addCustomer");
  };

  const handleSaveNewCustomer = () => {
    if (!addCustomerData.name.trim()) {
      alert("Please enter a name.");
      return;
    }

    const initials = addCustomerData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const newCustomer = {
      id: Date.now(),
      initials: initials || "CU",
      name: addCustomerData.name.trim(),
      email: addCustomerData.email.trim(),
      phone: addCustomerData.phone.trim(),
      orders: 0,
      totalSpent: "$0.00",
      lastVisit: "Just now",
      status: addCustomerData.status,
    };

    setCustomers([newCustomer, ...customers]);
    setPopupState(null);
    setAddCustomerData({ name: "", email: "", phone: "", status: "Active" });
  };

  const handleInputChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  // Handle view customer details
  const handleViewDetails = (customer) => {
    setViewCustomer(customer);
    setPopupState("viewDetails");
  };

  // Generate recent orders based on selected customer
  const generateRecentOrders = (customer) => {
    if (!customer || !customer.id) return [];
    const seed = parseInt(customer.id) || 1;
    const orderCount = Math.min(4, Math.max(0, customer.orders || 0));

    if (orderCount === 0) return [];

    return Array.from({ length: orderCount }).map((_, i) => ({
      id: `#ORD-${(10000 + seed * 10 + i).toString().slice(-5)}`,
      date: `Jun ${Math.max(1, 28 - ((i * seed) % 28))}, 2025`,
      amount: `$${(((seed * 15 + i * 12.5) % 150) + 15).toFixed(2)}`,
      status: i % 3 === 0 && seed % 2 !== 0 ? "Refunded" : "Completed",
    }));
  };

  const dynamicRecentOrders = viewCustomer
    ? generateRecentOrders(viewCustomer)
    : [];

  // Loyalty Points calculation
  const selectedSpentNum = viewCustomer
    ? parseTotalSpent(viewCustomer.totalSpent)
    : 0;
  const loyaltyPoints = Math.floor(selectedSpentNum * 10);
  const nextTierPoints = 3000;
  const progressPercentage = Math.min(
    100,
    (loyaltyPoints / nextTierPoints) * 100,
  );

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterStatus !== "All") count++;
    if (minSpend !== "" || maxSpend !== "") count++;
    if (minOrders !== "" || maxOrders !== "") count++;
    if (dateRange !== "all") count++;
    if (searchQuery !== "") count++;
    return count;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - Fixed at top */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                Customers
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative hidden sm:block w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-red-400 focus:outline-none text-black placeholder-gray-400"
              />
            </div>

            <button className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-xl cursor-pointer">
              <FiBell className="text-xl" />
            </button>

            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Full Width Layout - No Sidebar */}
          <div className="w-full">
            {/* Customers List */}
            <div className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-gray-500 text-sm">
                    Manage your restaurant customers and their details
                  </p>
                </div>
                <button
                  onClick={handleAddCustomer}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-red-200">
                  <FiUserPlus className="w-4 h-4" />
                  Add Customer
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-800 font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className={`text-xs ${stat.subtextClass}`}>
                      {stat.subtext}
                    </p>
                  </div>
                ))}
              </div>

              {/* Filters - Sort button removed */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                <div className="relative w-full max-w-sm">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex bg-gray-100 p-0.5 rounded-lg mr-2">
                    <button
                      onClick={() => setFilterStatus("All")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterStatus === "All" ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus("Active")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterStatus === "Active" ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                      Active
                    </button>
                    <button
                      onClick={() => setFilterStatus("Inactive")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterStatus === "Inactive" ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                      Inactive
                    </button>
                  </div>

                  {/* More Filters Button with Badge */}
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="relative flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FiSliders className="w-4 h-4" />
                    More Filters
                    {getActiveFilterCount() > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </button>

                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1">
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto mb-6">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 tracking-wider">
                    <div>CUSTOMER</div>
                    <div>CONTACT</div>
                    <div>ORDERS</div>
                    <div>TOTAL SPENT</div>
                    <div>LAST VISIT</div>
                    <div>STATUS</div>
                    <div className="text-right">ACTIONS</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {currentCustomers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No customers found matching your filters
                      </div>
                    ) : (
                      currentCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className={`grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm shrink-0">
                              {customer.initials}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm truncate">
                              {customer.name}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 truncate">
                              {customer.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {customer.phone}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {customer.orders}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {customer.totalSpent}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.lastVisit}
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${customer.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                              {customer.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(customer);
                              }}
                              className="p-1.5 text-blue-400 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                              title="View Details">
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(customer);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                              title="Edit">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(customer.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Delete">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            <div className="relative inline-block text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(
                                    activeDropdownId === customer.id
                                      ? null
                                      : customer.id,
                                  );
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                                title="More options">
                                <FiMoreHorizontal className="w-4 h-4" />
                              </button>
                              {activeDropdownId === customer.id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                  <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdownId(null);
                                        alert("Duplicate feature coming soon!");
                                      }}
                                      className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                      role="menuitem">
                                      Duplicate
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdownId(null);
                                        alert("Export feature coming soon!");
                                      }}
                                      className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                      role="menuitem">
                                      Export Data
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500">
                <p>
                  Showing{" "}
                  {filteredCustomers.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}
                  -
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCustomers.length,
                  )}{" "}
                  of {filteredCustomers.length} customers
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed text-gray-300" : "hover:bg-gray-50 text-gray-600"}`}>
                    {"<"}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === pageNum ? "bg-red-600 text-white font-medium shadow-sm" : "hover:bg-gray-50 text-gray-600"}`}>
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed text-gray-300" : "hover:bg-gray-50 text-gray-600"}`}>
                    {">"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer*/}
        <footer className="py-4 text-center text-xs text-gray-400 shrink-0 border-t border-gray-200/50 bg-gray-50 w-full z-10">
          &copy; 2026 QR Order Restaurant All rights reserved.
        </footer>
      </div>

      {/* More Filters Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FiSliders className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900 text-lg">
                  More Filters
                </h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Total Spend Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiDollarSign className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Total Spend Range
                  </label>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      value={minSpend}
                      onChange={(e) => setMinSpend(e.target.value)}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      value={maxSpend}
                      onChange={(e) => setMaxSpend(e.target.value)}
                      placeholder="Any"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Order Count Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                  Order Count
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Min Orders
                    </label>
                    <input
                      type="number"
                      value={minOrders}
                      onChange={(e) => setMinOrders(e.target.value)}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">
                      Max Orders
                    </label>
                    <input
                      type="number"
                      value={maxOrders}
                      onChange={(e) => setMaxOrders(e.target.value)}
                      placeholder="Any"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Last Visit Range */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                  Last Visit
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDateRange("all")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      dateRange === "all"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    All Time
                  </button>
                  <button
                    onClick={() => setDateRange("today")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      dateRange === "today"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    Today
                  </button>
                  <button
                    onClick={() => setDateRange("week")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      dateRange === "week"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setDateRange("month")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      dateRange === "month"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setDateRange("inactive")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      dateRange === "inactive"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    Inactive (30+ days)
                  </button>
                </div>
              </div>

              {getActiveFilterCount() > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    Active filters: {getActiveFilterCount()}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm shadow-red-200">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal - View Popup */}
      {popupState === "viewDetails" && viewCustomer && (
        <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <h3 className="font-bold text-gray-900 text-lg">
                Customer Details
              </h3>
              <button
                onClick={() => setPopupState(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-lg shadow-purple-200">
                  {viewCustomer.initials}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {viewCustomer.name}
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    viewCustomer.status === "Active"
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                  {viewCustomer.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMail className="text-gray-500" /> Contact Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{viewCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{viewCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Last visit: {viewCustomer.lastVisit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center border border-blue-200">
                  <div className="text-blue-600 font-bold text-2xl mb-1">
                    {viewCustomer.orders}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Total Orders
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 text-center border border-orange-200">
                  <div className="text-orange-600 font-bold text-2xl mb-1">
                    {viewCustomer.totalSpent}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">
                    Total Spent
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 text-lg">
                    Recent Orders
                  </h4>
                  <button className="text-xs text-red-600 font-medium hover:underline focus:outline-none">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {dynamicRecentOrders.length > 0 ? (
                    dynamicRecentOrders.map((order, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {order.id}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {order.amount}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium ${
                              order.status === "Completed"
                                ? "bg-green-50 text-green-600"
                                : "bg-purple-50 text-purple-600"
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic text-center py-8 bg-gray-50 rounded-xl">
                      No recent orders found.
                    </div>
                  )}
                </div>
              </div>

              {/* Customer History */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 text-lg">
                    Customer History
                  </h4>
                  <button
                    onClick={() => setCustomerHistory([])}
                    className="text-xs text-red-600 font-medium hover:underline focus:outline-none">
                    Clear
                  </button>
                </div>
                <div className="space-y-3">
                  {customerHistory.length > 0 ? (
                    customerHistory.map((item) => (
                      <div
                        key={item.id}
                        className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.email}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              item.status === "Active"
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last visit: {item.lastVisit}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic text-center py-8 bg-gray-50 rounded-xl">
                      No local customer history yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Loyalty Points */}
              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 text-white shadow-lg shadow-red-200 mb-6">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <FiBarChart2 className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Loyalty Points
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">
                    {loyaltyPoints.toLocaleString()}
                  </span>
                  <span className="text-sm opacity-80">pts</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-xs opacity-80 font-medium">
                  {Math.max(0, nextTierPoints - loyaltyPoints).toLocaleString()}{" "}
                  pts to Gold tier
                </p>
              </div>

              {/* Centered Edit Profile Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setPopupState(null);
                    handleEditClick(viewCustomer);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {popupState === "editProfile" && editFormData.id && (
        <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">
                Edit Customer Profile
              </h3>
              <button
                onClick={handleCancelClick}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) => handleInputChange(e, "email")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone || ""}
                    onChange={(e) => handleInputChange(e, "phone")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Orders
                  </label>
                  <input
                    type="number"
                    value={editFormData.orders || 0}
                    onChange={(e) => handleInputChange(e, "orders")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Spent
                  </label>
                  <input
                    type="text"
                    value={editFormData.totalSpent || "$0.00"}
                    onChange={(e) => handleInputChange(e, "totalSpent")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Visit
                </label>
                <input
                  type="text"
                  value={editFormData.lastVisit || ""}
                  onChange={(e) => handleInputChange(e, "lastVisit")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editFormData.status || "Active"}
                  onChange={(e) => handleInputChange(e, "status")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm shadow-red-200">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {popupState === "addCustomer" && (
        <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">
                Add New Customer
              </h3>
              <button
                onClick={() => setPopupState(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={addCustomerData.name}
                  onChange={(e) =>
                    setAddCustomerData({
                      ...addCustomerData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={addCustomerData.email}
                    onChange={(e) =>
                      setAddCustomerData({
                        ...addCustomerData,
                        email: e.target.value,
                      })
                    }
                    placeholder="e.g. john@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addCustomerData.phone}
                    onChange={(e) =>
                      setAddCustomerData({
                        ...addCustomerData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={addCustomerData.status}
                  onChange={(e) =>
                    setAddCustomerData({
                      ...addCustomerData,
                      status: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setPopupState(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveNewCustomer}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm shadow-red-200">
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
