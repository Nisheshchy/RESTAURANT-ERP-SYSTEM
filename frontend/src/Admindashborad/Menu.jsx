import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { 
  FiSearch, 
  FiBell, 
  FiChevronDown, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiPlus, 
  FiX,
  FiGrid,
  FiUploadCloud,
  FiMenu
} from "react-icons/fi";
import { MdOutlineFastfood, MdLocalCafe, MdOutlineSoupKitchen, MdCake, MdOutlineLunchDining } from "react-icons/md";

export default function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State variables
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [sortOption, setSortOption] = useState("Sort: Newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);

  // Add / Edit Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [drawerTab, setDrawerTab] = useState("details");
  
  // Drawer form fields
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Starters");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("0.00");
  const [itemTaxRate, setItemTaxRate] = useState(8);
  const [itemAvailability, setItemAvailability] = useState(true);
  const [itemFeatured, setItemFeatured] = useState(false);
  const [itemImage, setItemImage] = useState("");
  
  const [formError, setFormError] = useState("");

  // Load menu data and stats from local storage
  const loadMenuData = () => {
    setLoading(true);
    setError("");
    try {
      // Seed data if not exists
      if (!localStorage.getItem("mock_db_menu")) {
        const initialMenu = [
          {
            id: 1,
            name: "Classic Italian Bruschetta",
            category: "Starters",
            description: "Toasted artisan bread topped with diced tomatoes, fresh basil, garlic, and extra virgin olive oil.",
            price: 8.50,
            taxRate: 8,
            availability: true,
            featured: true,
            image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340000000
          },
          {
            id: 2,
            name: "Garlic Herb Bread",
            category: "Starters",
            description: "Freshly baked baguette smothered in garlic butter, fresh parsley, and melted mozzarella cheese.",
            price: 6.00,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340100000
          },
          {
            id: 3,
            name: "Chicken Caesar Salad",
            category: "Starters",
            description: "Crispy romaine lettuce tossed in caesar dressing, garlic croutons, and freshly grated parmesan.",
            price: 12.50,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340200000
          },
          {
            id: 4,
            name: "Spaghetti Carbonara",
            category: "Mains",
            description: "Creamy traditional Roman pasta with crispy guanciale, pecorino cheese, and fresh egg yolk.",
            price: 16.50,
            taxRate: 8,
            availability: true,
            featured: true,
            image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340300000
          },
          {
            id: 5,
            name: "Margherita Pizza",
            category: "Mains",
            description: "Authentic sourdough crust topped with San Marzano tomato sauce, fresh mozzarella, and fresh basil.",
            price: 14.00,
            taxRate: 8,
            availability: true,
            featured: true,
            image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340400000
          },
          {
            id: 6,
            name: "Classic Beef Burger",
            category: "Mains",
            description: "Grilled Angus beef patty, cheddar, lettuce, tomato, and house burger sauce in a brioche bun.",
            price: 15.00,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340500000
          },
          {
            id: 7,
            name: "Fresh Mint Mojito",
            category: "Drinks",
            description: "Refreshing cocktail with white rum, fresh mint leaves, lime juice, simple syrup, and club soda.",
            price: 6.50,
            taxRate: 8,
            availability: true,
            featured: true,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340600000
          },
          {
            id: 8,
            name: "Double Shot Espresso",
            category: "Drinks",
            description: "Rich, intense espresso brewed from our specialty dark roast Italian coffee beans.",
            price: 3.50,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1510972527409-cef1b77350f6?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340700000
          },
          {
            id: 9,
            name: "Iced Caramel Macchiato",
            category: "Drinks",
            description: "Chilled milk marked with espresso, sweetened with vanilla syrup, and drizzled with caramel sauce.",
            price: 4.50,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340800000
          },
          {
            id: 10,
            name: "Classic Italian Tiramisu",
            category: "Desserts",
            description: "Espresso-dipped ladyfingers layered with whipped mascarpone cream and dusted with cocoa powder.",
            price: 8.00,
            taxRate: 8,
            availability: true,
            featured: true,
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718340900000
          },
          {
            id: 11,
            name: "Chocolate Lava Cake",
            category: "Desserts",
            description: "Warm chocolate cake with a molten liquid chocolate center, served with vanilla bean ice cream.",
            price: 7.50,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718341000000
          },
          {
            id: 12,
            name: "Strawberry Panna Cotta",
            category: "Desserts",
            description: "Creamy vanilla custard topped with a sweet strawberry coulis and fresh mint.",
            price: 9.00,
            taxRate: 8,
            availability: true,
            featured: false,
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60",
            createdAt: 1718341100000
          }
        ];
        localStorage.setItem("mock_db_menu", JSON.stringify(initialMenu));
      }

      let menu = JSON.parse(localStorage.getItem("mock_db_menu") || "[]");

      // Apply Filter by category
      if (activeCategory && activeCategory !== "All Items") {
        menu = menu.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());
      }

      // Apply Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        menu = menu.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
        );
      }

      // Apply Sorting
      if (sortOption === "Price: Low to High") {
        menu.sort((a, b) => a.price - b.price);
      } else if (sortOption === "Price: High to Low") {
        menu.sort((a, b) => b.price - a.price);
      } else {
        menu.sort((a, b) => b.createdAt - a.createdAt);
      }

      const totalMatching = menu.length;

      // Apply Pagination
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedItems = menu.slice(startIndex, startIndex + rowsPerPage);

      setItems(paginatedItems);
      setTotalItemsCount(totalMatching);

      // Dynamically calculate statistics
      const fullMenu = JSON.parse(localStorage.getItem("mock_db_menu") || "[]");
      const computedStats = {
        menuStats: {
          totalItems: { value: fullMenu.length, change: 8 },
          activeCategories: { value: 4 },
          outOfStock: { value: fullMenu.filter(item => !item.availability).length, change: -10 },
          featuredItems: { value: fullMenu.filter(item => item.featured).length, change: 2 }
        }
      };
      setStats(computedStats);

    } catch (err) {
      console.error("Error loading menu data", err);
      setError("Unable to load menu data from local storage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, [searchQuery, activeCategory, sortOption, currentPage, rowsPerPage]);

  const handleToggleAvailability = (id, currentVal) => {
    try {
      const fullMenu = JSON.parse(localStorage.getItem("mock_db_menu") || "[]");
      const updatedMenu = fullMenu.map(item => item.id === id ? { ...item, availability: !currentVal } : item);
      localStorage.setItem("mock_db_menu", JSON.stringify(updatedMenu));
      loadMenuData();
    } catch (err) {
      console.error("Error toggling availability", err);
      alert("Could not update availability status.");
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingItem(null);
    setItemName("");
    setItemCategory("Starters");
    setItemDescription("");
    setItemPrice("0.00");
    setItemTaxRate(8);
    setItemAvailability(true);
    setItemFeatured(false);
    setItemImage("");
    setFormError("");
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemPrice(item.price.toFixed(2));
    setItemTaxRate(item.taxRate);
    setItemAvailability(item.availability);
    setItemFeatured(item.featured);
    setItemImage(item.image);
    setFormError("");
    setIsDrawerOpen(true);
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const fullMenu = JSON.parse(localStorage.getItem("mock_db_menu") || "[]");
        const filteredMenu = fullMenu.filter(item => item.id !== id);
        localStorage.setItem("mock_db_menu", JSON.stringify(filteredMenu));
        const totalPages = Math.ceil(filteredMenu.length / rowsPerPage) || 1;
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        } else {
          loadMenuData();
        }
      } catch (err) {
        console.error("Error deleting item", err);
        alert("Failed to delete the item.");
      }
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormError("");

    if (!itemName.trim()) {
      setFormError("Item name is required");
      return;
    }
    if (isNaN(parseFloat(itemPrice)) || parseFloat(itemPrice) < 0) {
      setFormError("Price must be a valid positive number");
      return;
    }

    try {
      const fullMenu = JSON.parse(localStorage.getItem("mock_db_menu") || "[]");
      
      if (editingItem) {
        const updatedMenu = fullMenu.map(item => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              name: itemName,
              category: itemCategory,
              description: itemDescription,
              price: parseFloat(itemPrice),
              taxRate: parseInt(itemTaxRate) || 8,
              availability: itemAvailability,
              featured: itemFeatured,
              image: itemImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            };
          }
          return item;
        });
        localStorage.setItem("mock_db_menu", JSON.stringify(updatedMenu));
      } else {
        const nextId = fullMenu.reduce((max, item) => item.id > max ? item.id : max, 0) + 1;
        const newItem = {
          id: nextId,
          name: itemName,
          category: itemCategory,
          description: itemDescription,
          price: parseFloat(itemPrice),
          taxRate: parseInt(itemTaxRate) || 8,
          availability: itemAvailability,
          featured: itemFeatured,
          image: itemImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
          createdAt: Date.now()
        };
        fullMenu.push(newItem);
        localStorage.setItem("mock_db_menu", JSON.stringify(fullMenu));
      }

      setIsDrawerOpen(false);
      loadMenuData();
    } catch (err) {
      console.error("Error saving item", err);
      setFormError("Failed to save menu item");
    }
  };

  const user = JSON.parse(sessionStorage.getItem("user") || '{"name":"Admin","role":"Administrator"}');

  if (loading && items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-[#e50914]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-500 font-medium text-sm">Loading restaurant menu...</span>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalItemsCount / rowsPerPage) || 1;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalItemsCount);

  return (
    <div className="flex w-full min-h-screen bg-gray-50/50 text-gray-800 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">Menu</h1>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Manage your restaurant menu items</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative hidden sm:block w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
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
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Total Items</div>
                <div className="text-2xl font-bold text-gray-900">{stats.menuStats.totalItems.value}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Active Categories</div>
                <div className="text-2xl font-bold text-gray-900">{stats.menuStats.activeCategories.value}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Out of Stock</div>
                <div className="text-2xl font-bold text-red-600">{stats.menuStats.outOfStock.value}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Featured Items</div>
                <div className="text-2xl font-bold text-gray-900">{stats.menuStats.featuredItems.value}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {[
                { name: "All Items", icon: <FiGrid /> },
                { name: "Starters", icon: <MdOutlineSoupKitchen /> },
                { name: "Mains", icon: <MdOutlineLunchDining /> },
                { name: "Drinks", icon: <MdLocalCafe /> },
                { name: "Desserts", icon: <MdCake /> }
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeCategory === cat.name
                      ? "border border-[#e50914] text-[#e50914] bg-red-50/45"
                      : "border border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenAddDrawer}
              className="flex items-center gap-2 text-xs font-bold bg-[#e50914] hover:bg-red-700 text-white rounded-xl px-4 py-2 cursor-pointer shadow-md"
            >
              <FiPlus />
              Add Item
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                    <th className="py-4 px-6 text-left">Item</th>
                    <th className="py-4 px-6 text-left">Category</th>
                    <th className="py-4 px-6 text-left">Price</th>
                    <th className="py-4 px-6 text-left">Availability</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">
                        No menu items found
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <p className="text-xs text-gray-400">{item.description.substring(0, 40)}...</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.availability)}
                            className={`w-10 h-5.5 rounded-full transition-colors cursor-pointer relative flex items-center ${
                              item.availability ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            <span className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${
                              item.availability ? "translate-x-5.5" : "translate-x-0.5"
                            }`} />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditDrawer(item)}
                              className="p-1.5 text-gray-400 hover:text-[#e50914] bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <FiEdit2 className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer"
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

            {totalItemsCount > 0 && (
              <div className="border-t border-gray-50 p-4 flex items-center justify-between bg-gray-50/15">
                <span className="text-xs text-gray-400 font-semibold">
                  Showing {startRow} to {endRow} of {totalItemsCount}
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
        </main>

        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="flex-1" onClick={() => setIsDrawerOpen(false)}></div>
            
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h3 className="font-bold text-base">
                  {editingItem ? "Edit Menu Item" : "Add New Item"}
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 flex-1">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full border px-3 py-2 rounded-xl text-sm focus:border-red-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Category *</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded-xl text-sm bg-white"
                  >
                    {["Starters", "Mains", "Drinks", "Desserts"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
                  <textarea
                    placeholder="Enter description"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    rows="3"
                    className="w-full border px-3 py-2 rounded-xl text-sm focus:border-red-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="w-full border pl-8 pr-3 py-2 rounded-xl text-sm focus:border-red-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4 mt-auto">
                  <label className="text-xs font-semibold text-gray-700">Available</label>
                  <button
                    type="button"
                    onClick={() => setItemAvailability(!itemAvailability)}
                    className={`w-10 h-5.5 rounded-full transition-colors cursor-pointer relative flex items-center ${
                      itemAvailability ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${
                      itemAvailability ? "translate-x-5.5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t justify-end">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-2 border rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#e50914] hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}