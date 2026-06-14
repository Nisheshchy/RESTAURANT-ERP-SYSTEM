import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiGrid, 
  FiClipboard, 
  FiBookOpen, 
  FiPackage, 
  FiUsers, 
  FiUserCheck, 
  FiBarChart2, 
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiGrid className="text-xl" /> },
    { name: "Orders", path: "/orders", icon: <FiClipboard className="text-xl" /> },
    { name: "Tables", path: "/tables", icon: <MdOutlineTableRestaurant className="text-xl" /> },
    { name: "Menu", path: "/menu", icon: <FiBookOpen className="text-xl" /> },
    { name: "Inventory", path: "/inventory", icon: <FiPackage className="text-xl" /> },
    { name: "Customers", path: "/customers", icon: <FiUsers className="text-xl" /> },
    { name: "Staffs", path: "/staffs", icon: <FiUserCheck className="text-xl" /> },
    { name: "Reports", path: "/reports", icon: <FiBarChart2 className="text-xl" /> },
    { name: "Settings", path: "/settings", icon: <FiSettings className="text-xl" /> }
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0 overflow-y-auto hidden md:flex">
      {/* Top Section */}
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e50914] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            <span className="text-sm tracking-tighter">QR</span>
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900 leading-none">QR Order</div>
            <div className="text-[10px] text-gray-400 font-semibold tracking-wider">RESTAURANT</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                  isActive
                    ? "bg-[#e50914] text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 mt-8">
        {/* Upgrade Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-100/40 rounded-full blur-xl"></div>
          {/* Crown badge */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#e50914] mb-3">
            👑
          </div>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Unlock advanced reports, inventory alerts, and more.
          </p>
          <button 
            onClick={() => alert("Premium upgrade checkout is coming soon!")}
            className="w-full py-2 bg-[#e50914] hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all"
          >
            Upgrade Now
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 transition-all text-sm font-semibold cursor-pointer text-left"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
}
