import React from "react";
import Sidebar from "./Sidebar";
import { FiSearch, FiPlus } from "react-icons/fi";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
              <FiPlus /> Add Setting
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-500">Add your settings configuration content here</p>
          </div>
        </main>
      </div>
    </div>
  );
}
