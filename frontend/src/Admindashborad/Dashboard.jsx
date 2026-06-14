import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  FiSearch,
  FiTrendingUp,
  FiClipboard,
  FiDollarSign,
  FiAlertCircle,
  FiMoreVertical,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    sales: 2589.45,
    salesTrend: 11.35,
    orders: 128,
    ordersTrend: 8.7,
    activeTables: 18,
    totalTables: 32,
    occupancy: 56,
    netProfit: 1425.60,
    profitTrend: 12.1,
  });

  const [liveOrders] = useState([
    { id: "ORD-00128", table: "Table 10 - 1 hour", status: "New", items: 3, amount: "$35.80", time: "2 min ago" },
    { id: "ORD-00127", table: "Table 08 - 1 hour", status: "Preparing", items: 2, amount: "$45.80", time: "5 min ago" },
    { id: "ORD-00126", table: "Table 05 - 2.3 hours", status: "Ready", items: 1, amount: "$31.20", time: "12 min ago" },
    { id: "ORD-00125", table: "Table 03 - 2 hours", status: "New", items: 4, amount: "$67.90", time: "18 min ago" },
    { id: "ORD-00124", table: "Table 15 - 2 hours", status: "Preparing", items: 2, amount: "$19.40", time: "19 min ago" },
  ]);

  const [tableStatus] = useState([
    { number: "01", status: "available" },
    { number: "02", status: "occupied" },
    { number: "03", status: "occupied" },
    { number: "04", status: "available" },
    { number: "05", status: "occupied" },
    { number: "06", status: "reserved" },
    { number: "07", status: "available" },
    { number: "08", status: "occupied" },
    { number: "09", status: "available" },
    { number: "10", status: "available" },
    { number: "11", status: "occupied" },
    { number: "12", status: "reserved" },
    { number: "13", status: "available" },
    { number: "14", status: "available" },
    { number: "15", status: "occupied" },
    { number: "16", status: "available" },
    { number: "17", status: "available" },
    { number: "18", status: "available" },
    { number: "19", status: "occupied" },
    { number: "20", status: "available" },
    { number: "21", status: "available" },
    { number: "22", status: "occupied" },
    { number: "23", status: "available" },
    { number: "24", status: "available" },
  ]);

  const [lowStockAlerts] = useState([
    { item: "Parmesan Cheese", category: "Dairy", stock: "0.8 kg left", status: "low" },
    { item: "Chicken breast", category: "Meat", stock: "1.2 kg left", status: "low" },
    { item: "Olive Oil", category: "Oils", stock: "0.5 L left", status: "critical" },
    { item: "Cherry Tomatoes", category: "Vegetables", stock: "0.7 kg left", status: "reorder_soon" },
  ]);

  const [recentTransactions] = useState([
    { id: "ORD-00128", status: "completed", amount: "$24.50", type: "Payment received", time: "2 min ago" },
    { id: "ORD-00127", status: "completed", amount: "$45.80", type: "Payment received", time: "7 min ago" },
    { id: "ORD-00129", status: "refund", amount: "-$12.40", type: "Refund issued", time: "23 min ago" },
    { id: "ORD-00126", status: "completed", amount: "$31.20", type: "Payment received", time: "32 min ago" },
    { id: "ORD-00125", status: "completed", amount: "$67.90", type: "Payment received", time: "41 min ago" },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-red-100 text-red-700";
      case "Preparing": return "bg-yellow-100 text-yellow-700";
      case "Ready": return "bg-green-100 text-green-700";
      case "completed": return "text-green-600";
      case "refund": return "text-red-600";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTableStatusColor = (status) => {
    switch(status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getSalesChart = () => {
    return (
      <svg viewBox="0 0 400 100" className="w-full h-full">
        <polyline
          points="0,80 20,70 40,75 60,50 80,60 100,30 120,45 140,20 160,35 180,15 200,40 220,10 240,50 260,30 280,55 300,35 320,60 340,40 360,70 380,50"
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="220" cy="10" r="4" fill="#dc2626" />
        <text x="220" y="5" fontSize="10" fill="#dc2626" textAnchor="middle">$1,342</text>
      </svg>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, tables, menu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Today's Sales</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">${dashboardData.sales.toFixed(2)}</h2>
                  <p className="text-green-600 text-xs font-semibold mt-1">▲ {dashboardData.salesTrend}% vs yesterday</p>
                </div>
                <FiTrendingUp className="text-red-500 text-2xl" />
              </div>
              <div className="h-12">{getSalesChart()}</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Orders</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.orders}</h2>
                  <p className="text-green-600 text-xs font-semibold mt-1">▲ {dashboardData.ordersTrend}% vs yesterday</p>
                </div>
                <FiClipboard className="text-red-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Tables</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.activeTables} / {dashboardData.totalTables}</h2>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 w-20">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${dashboardData.occupancy}%` }}></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{dashboardData.occupancy}% occupancy</p>
                </div>
                <MdOutlineTableRestaurant className="text-red-500 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Net Profit</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">${dashboardData.netProfit.toFixed(2)}</h2>
                  <p className="text-green-600 text-xs font-semibold mt-1">▲ {dashboardData.profitTrend}% vs yesterday</p>
                </div>
                <FiDollarSign className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Sales Overview */}
            <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-900">Sales Overview</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">Today</button>
                <button className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full">This Week</button>
                <button className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full">This Month</button>
              </div>
              <div className="h-48">{getSalesChart()}</div>
            </div>

            {/* Customers & Staff Stats */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Customers</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">1,248</h2>
                    <p className="text-green-600 text-xs font-semibold mt-1">▲ 18.8% vs last 30 days</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Staffs</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">28</h2>
                    <p className="text-green-600 text-xs font-semibold mt-1">▲ 4.2% vs last 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Orders and Table Status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Live Orders */}
            <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-900">Live Orders</h2>
                <button className="text-red-500 text-sm font-semibold hover:text-red-700 flex items-center gap-1">
                  View All <FiChevronRight className="text-xs" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3 flex-1">
                      <img src="https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=40&h=40&fit=crop" alt="food" className="w-10 h-10 rounded" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.table}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(order.status)}`}>
                        {order.status === "New" && "🔴"}
                        {order.status === "Preparing" && "🟡"}
                        {order.status === "Ready" && "🟢"}
                        {" " + order.status}
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">{order.amount}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-900">Table Status</h2>
                <div className="flex gap-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Available</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span>Occupied</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Reserved</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {tableStatus.map((table) => (
                  <div
                    key={table.number}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-80 transition ${getTableStatusColor(table.status)}`}
                  >
                    {table.number}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Occupancy: {dashboardData.occupancy}%</p>
            </div>
          </div>

          {/* Low Stock & Recent Transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Low Stock Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FiAlertCircle className="text-orange-500" /> Low Stock Alerts
                </h2>
                <button className="text-red-500 text-sm font-semibold hover:text-red-700">View All</button>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={`https://images.unsplash.com/photo-${1567521694+idx}?w=40&h=40&fit=crop`} alt={alert.item} className="w-10 h-10 rounded" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{alert.item}</p>
                        <p className="text-xs text-gray-500">Category: {alert.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${alert.status === "critical" ? "text-red-600" : "text-orange-600"}`}>{alert.stock}</p>
                      <p className="text-xs text-gray-500">{alert.status === "critical" ? "Critical" : "Reorder soon"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-900">Recent Transactions</h2>
                <button className="text-red-500 text-sm font-semibold hover:text-red-700">View All</button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${transaction.status === "completed" ? "bg-green-500" : "bg-red-500"}`}>
                        {transaction.status === "completed" ? "✓" : "↩"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{transaction.type}</p>
                        <p className="text-xs text-gray-500">{transaction.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${getStatusColor(transaction.status)}`}>{transaction.amount}</p>
                      <p className="text-xs text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}