import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Authenticationpage/Login";
import SignUpPage from "./Authenticationpage/SignUp";
import DashboardPage from "./Admindashborad/Dashboard";
import MenuPage from "./Admindashborad/Menu";
import OrdersPage from "./Admindashborad/Orders";
import TablesPage from "./Admindashborad/Tables";
import InventoryPage from "./Admindashborad/Inventory";
import CustomersPage from "./Admindashborad/Customers";
import StaffsPage from "./Admindashborad/Staffs";
import ReportsPage from "./Admindashborad/Reports";
import SettingsPage from "./Admindashborad/Settings";

function ProtectedRoute({ children }) {
  const user = sessionStorage.getItem("user") || localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  // Auto-restore session from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", savedUser);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <TablesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staffs"
          element={
            <ProtectedRoute>
              <StaffsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}