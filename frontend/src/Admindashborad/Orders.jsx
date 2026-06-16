import React, { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import { 
  FiSearch, 
  FiBell, 
  FiChevronDown, 
  FiFilter, 
  FiX 
} from "react-icons/fi";

const MENU_ITEMS_POOL = [
  { name: "Margherita Pizza", price: 14.50, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=60&h=60&fit=crop" },
  { name: "Garlic Bread", price: 10.00, image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=60&h=60&fit=crop" },
];

const initialOrders = [
  { id: "#ORD-00128", table: 12, items: [{ ...MENU_ITEMS_POOL[0], qty: 1 }, { ...MENU_ITEMS_POOL[1], qty: 1 }], subtotal: 24.50, service: 0.00, tax: 1.72, total: 26.22, time: "2 min ago", paidAt: "2 min ago", status: "New", payment: "Paid", method: "Card" },
  { id: "#ORD-00127", table: 7, items: [{ ...MENU_ITEMS_POOL[0], qty: 1 }], subtotal: 18.00, service: 0.00, tax: 1.26, total: 19.26, time: "5 min ago", paidAt: "5 min ago", status: "New", payment: "Paid", method: "Card" },
  { id: "#ORD-00126", table: 3, items: [{ ...MENU_ITEMS_POOL[1], qty: 2 }], subtotal: 20.00, service: 0.00, tax: 1.40, total: 21.40, time: "8 min ago", paidAt: "8 min ago", status: "Preparing", payment: "Paid", method: "Card" },
  { id: "#ORD-00125", table: 5, items: [{ ...MENU_ITEMS_POOL[0], qty: 2 }], subtotal: 29.00, service: 0.00, tax: 2.03, total: 31.03, time: "12 min ago", paidAt: "12 min ago", status: "Ready", payment: "Paid", method: "Card" },
  { id: "#ORD-00124", table: 9, items: [{ ...MENU_ITEMS_POOL[0], qty: 1 }], subtotal: 14.50, service: 0.00, tax: 1.02, total: 15.52, time: "15 min ago", paidAt: "15 min ago", status: "Completed", payment: "Paid", method: "Card" },
  { id: "#ORD-00123", table: 2, items: [{ ...MENU_ITEMS_POOL[1], qty: 1 }], subtotal: 10.00, service: 0.00, tax: 0.70, total: 10.70, time: "20 min ago", paidAt: "20 min ago", status: "Cancelled", payment: "Paid", method: "Card" },
  { id: "#ORD-00122", table: 14, items: [{ ...MENU_ITEMS_POOL[0], qty: 1 }], subtotal: 14.50, service: 0.00, tax: 1.02, total: 15.52, time: "25 min ago", paidAt: "25 min ago", status: "New", payment: "Paid", method: "Card" },
  { id: "#ORD-00121", table: 11, items: [{ ...MENU_ITEMS_POOL[1], qty: 3 }], subtotal: 30.00, service: 0.00, tax: 2.10, total: 32.10, time: "30 min ago", paidAt: "30 min ago", status: "Preparing", payment: "Paid", method: "Card" },
];

const StatusBadge = ({ status }) => {
  const getBadgeStyles = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Preparing":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Ready":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Completed":
        return "bg-green-50 text-green-600 border border-green-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyles(status)}`}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = JSON.parse(sessionStorage.getItem("user") || '{"name":"Admin","role":"Administrator"}');

  // Calculate Tab Count Indicators dynamically based on state
  const counts = useMemo(() => {
    const defaultCounts = { All: orders.length, New: 0, Preparing: 0, Ready: 0, Completed: 0, Cancelled: 0 };
    orders.forEach(o => { if (defaultCounts[o.status] !== undefined) defaultCounts[o.status]++; });
    return defaultCounts;
  }, [orders]);

  // Filter logic based on tab select & search terms matching ID, table or items
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = !normalizedQuery || 
        order.id.toLowerCase().includes(normalizedQuery) ||
        String(order.table).includes(normalizedQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(normalizedQuery));
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Pagination calculation metrics
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    setShowActionsDropdown(false);
  };

  // Lifecycle stage progression action configuration 
  const getNextStatusAction = (status) => {
    switch(status) {
      case "New": return { label: "Start Preparing", next: "Preparing" };
      case "Preparing": return { label: "Mark as Ready", next: "Ready" };
      case "Ready": return { label: "Complete Order", next: "Completed" };
      default: return null;
    }
  };

  const currentAction = getNextStatusAction(selectedOrder?.status);

  return (
    <div className="flex w-full min-h-screen bg-gray-50/50 text-gray-800 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">Orders</h1>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Manage your restaurant orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative hidden sm:block w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, tables..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-red-400 focus:outline-none"
              />
            </div>

            <button className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-xl cursor-pointer">
              <FiBell className="text-xl" />
            </button>

            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="flex gap-2 mb-6 flex-wrap">
            {["All", "New", "Preparing", "Ready", "Completed", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-[#e50914] text-white shadow-md"
                    : "border border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>{tab}</span>
                <span className={activeTab === tab ? "text-red-100" : "text-gray-400"}>
                  ({counts[tab]})
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter active grid column results..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-red-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
              className="flex items-center gap-2 text-xs font-bold border border-gray-200 hover:bg-gray-50 rounded-xl px-4 py-2 cursor-pointer transition-all w-full sm:w-auto justify-center"
            >
              <FiFilter /> Reset Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main Order Grid Column */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                        <th className="py-4 px-6 text-left">Order ID</th>
                        <th className="py-4 px-6 text-left">Table</th>
                        <th className="py-4 px-6 text-left">Amount</th>
                        <th className="py-4 px-6 text-left">Payment</th>
                        <th className="py-4 px-6 text-left">Time</th>
                        <th className="py-4 px-6 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                      {paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                            No order sequences match criteria filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((order, idx) => {
                          const isSelected = selectedOrder?.id === order.id;
                          return (
                            <tr
                              key={order.id + "-" + idx}
                              onClick={() => { setSelectedOrder(order); setShowRightPanel(true); }}
                              className={`cursor-pointer hover:bg-gray-50/50 transition-colors ${
                                isSelected ? "bg-red-50/20" : ""
                              }`}
                            >
                              <td className="py-4 px-6 font-bold text-gray-900">{order.id}</td>
                              <td className="py-4 px-6 text-gray-500">Table {order.table}</td>
                              <td className="py-4 px-6 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                              <td className="py-4 px-6">
                                <span className="text-xs font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                                  {order.payment}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-400">{order.time}</td>
                              <td className="py-4 px-6">
                                <StatusBadge status={order.status} />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredOrders.length > 0 && (
                  <div className="border-t border-gray-50 p-4 flex items-center justify-between bg-gray-50/15">
                    <span className="text-xs text-gray-400 font-semibold">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="p-1.5 border rounded-lg text-gray-500 disabled:opacity-40"
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-7 h-7 rounded-lg border text-xs font-bold cursor-pointer ${
                            currentPage === i + 1
                              ? "bg-[#e50914] border-[#e50914] text-white"
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="p-1.5 border rounded-lg text-gray-500 disabled:opacity-40"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel Dynamic Summary Drawer */}
            {showRightPanel && selectedOrder && (
              <div className="w-full lg:w-96 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-gray-900">Order Details</span>
                  <button
                    onClick={() => setShowRightPanel(false)}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">{selectedOrder.id}</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                {/* Items list */}
                <div className="flex flex-col gap-4 pb-5 border-b border-gray-100 mb-5 max-h-60 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Quantity: {item.qty}</div>
                      </div>
                      <div className="font-bold text-sm text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Pricing */}
                <div className="flex flex-col gap-3 pb-5 border-b border-gray-100 mb-5 text-sm font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge (0%)</span>
                    <span className="text-gray-900">${selectedOrder.service.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%)</span>
                    <span className="text-gray-900">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-100 pt-3 mt-1">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-base text-red-600">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex flex-col gap-3 text-xs font-semibold text-gray-600">
                  <div className="font-bold text-gray-900 text-sm mb-1">Payment Details</div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-green-600 font-bold">{selectedOrder.payment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="text-gray-950">{selectedOrder.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid At</span>
                    <span className="text-gray-500 font-normal">{selectedOrder.paidAt}</span>
                  </div>
                </div>



                {/* Order Status Action Buttons */}
                <div className="flex flex-col gap-3 relative">
                  {currentAction ? (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, currentAction.next)}
                      className="w-full py-3 bg-[#e50914] hover:bg-red-700 text-white border-none rounded-xl text-xs font-bold cursor-pointer shadow-md transition-all text-center"
                    >
                      {currentAction.label}
                    </button>
                  ) : (
                    <div className="text-center py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 font-bold text-xs">
                      Order Cycle Complete
                    </div>
                  )}

                  <button
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    className="w-full py-2.5 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Change Status</span>
                    <FiChevronDown />
                  </button>

                  {/* Popover list to explicitly override status updates */}
                  {showActionsDropdown && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30">
                      {["New", "Preparing", "Ready", "Completed", "Cancelled"].map(statusOption => (
                        <button
                          key={statusOption}
                          onClick={() => handleStatusChange(selectedOrder.id, statusOption)}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-gray-50 cursor-pointer ${
                            selectedOrder.status === statusOption
                              ? "text-[#e50914] bg-red-50/30"
                              : "text-gray-600"
                          }`}
                        >
                          Set status to: {statusOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}