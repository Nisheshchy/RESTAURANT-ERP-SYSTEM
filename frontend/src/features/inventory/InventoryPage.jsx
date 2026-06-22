import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid, FiClipboard, FiBookOpen, FiPackage, FiUsers,
  FiUserCheck, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
  FiAlertTriangle, FiTrendingDown, FiRefreshCw, FiList,
} from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";

// ═══════════════════════════════════════════════════════════════
// DATA SHAPE — mirrors PostgreSQL schema exactly
// When backend is ready, replace SAMPLE_* with API calls:
//   GET  /api/inventory/stock-items          → setItems()
//   POST /api/inventory/stock-items          → add item
//   PUT  /api/inventory/stock-items/:id      → edit item
//   DELETE /api/inventory/stock-items/:id    → soft-delete
//   POST /api/inventory/stock-transactions   → purchase / waste / adj
//   GET  /api/inventory/stock-transactions?stock_item_id=:id → history
// ═══════════════════════════════════════════════════════════════

const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Colombian Coffee Beans",
    category: "Beverages",
    sku: "BEV-CCB-001",
    quantity: 42,          // current_qty  in DB
    unit: "kg",
    reorderLevel: 10,      // reorder_level in DB
    costPerUnit: 1850,     // cost_per_unit in DB (for journal: Inventory Dr)
    supplier: "Arabica Imports Co.",
    isActive: true,        // soft-delete flag
  },
  {
    id: 2,
    name: "Butter Croissants",
    category: "Bakery",
    sku: "BAK-BTC-002",
    quantity: 60,
    unit: "pcs",
    reorderLevel: 25,
    costPerUnit: 110,
    supplier: "Le Petit Four",
    isActive: true,
  },
  {
    id: 3,
    name: "Whole Milk",
    category: "Dairy",
    sku: "DRY-WM-003",
    quantity: 5,
    unit: "L",
    reorderLevel: 15,
    costPerUnit: 125,
    supplier: "Green Pastures Dairy",
    isActive: true,
  },
  {
    id: 4,
    name: "Almond Milk",
    category: "Dairy",
    sku: "DRY-AM-004",
    quantity: 22,
    unit: "L",
    reorderLevel: 8,
    costPerUnit: 340,
    supplier: "Nutty Naturals",
    isActive: true,
  },
  {
    id: 5,
    name: "Espresso Cups",
    category: "Supplies",
    sku: "SUP-EC-005",
    quantity: 120,
    unit: "pcs",
    reorderLevel: 40,
    costPerUnit: 220,
    supplier: "Ceramico Ltd.",
    isActive: true,
  },
  {
    id: 6,
    name: "Chocolate Syrup",
    category: "Condiments",
    sku: "CON-CS-006",
    quantity: 0,
    unit: "btl",
    reorderLevel: 6,
    costPerUnit: 475,
    supplier: "Sweet Foundry",
    isActive: true,
  },
];

// Mirrors stock_transactions table rows
// type: "purchase" | "usage" | "waste" | "adjustment"
const SAMPLE_TRANSACTIONS = [
  { id: 1, stockItemId: 1, type: "purchase",    quantity: 20,  unitCost: 1850, notes: "Monthly restock",       createdBy: "Admin",   createdAt: "2025-06-10T09:00:00Z" },
  { id: 2, stockItemId: 1, type: "usage",       quantity: -5,  unitCost: null, notes: "Used for morning batch", createdBy: "System",  createdAt: "2025-06-11T07:30:00Z" },
  { id: 3, stockItemId: 3, type: "waste",       quantity: -2,  unitCost: null, notes: "Expired — spoilage",    createdBy: "Manager", createdAt: "2025-06-12T14:00:00Z" },
  { id: 4, stockItemId: 3, type: "adjustment",  quantity: 1,   unitCost: null, notes: "Stock count correction", createdBy: "Admin",   createdAt: "2025-06-13T10:00:00Z" },
  { id: 5, stockItemId: 6, type: "purchase",    quantity: 10,  unitCost: 475,  notes: "Emergency reorder",     createdBy: "Admin",   createdAt: "2025-06-14T11:00:00Z" },
  { id: 6, stockItemId: 6, type: "usage",       quantity: -10, unitCost: null, notes: "Auto-deducted from sale #ORD-0041", createdBy: "System", createdAt: "2025-06-15T13:00:00Z" },
];

const EMPTY_ITEM_FORM = {
  name: "", category: "", sku: "", quantity: 0,
  unit: "pcs", reorderLevel: 0, costPerUnit: 0, supplier: "",
};

const EMPTY_PURCHASE_FORM = {
  quantity: 0, unitCost: 0, notes: "",
};

const EMPTY_WASTE_FORM = {
  quantity: 0, reason: "spoilage", notes: "",
};

const EMPTY_ADJ_FORM = {
  quantity: 0, notes: "",
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const getStatus = (item) => {
  if (item.quantity <= 0)                 return "Out Of Stock";
  if (item.quantity <= item.reorderLevel) return "Low Stock";
  return "In Stock";
};

const STATUS_STYLES = {
  "In Stock":     { badge: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  "Low Stock":    { badge: "bg-amber-100 text-amber-800 ring-amber-200",       dot: "bg-amber-500"   },
  "Out Of Stock": { badge: "bg-rose-100 text-rose-700 ring-rose-200",          dot: "bg-rose-500"    },
};

const TX_STYLES = {
  purchase:   { label: "Purchase",   color: "bg-emerald-100 text-emerald-700", sign: "+" },
  usage:      { label: "Usage",      color: "bg-blue-100 text-blue-700",       sign: "-" },
  waste:      { label: "Waste",      color: "bg-rose-100 text-rose-700",       sign: "-" },
  adjustment: { label: "Adjustment", color: "bg-amber-100 text-amber-800",     sign: "±" },
};

const fmt      = (n) => `NPR ${Number(n).toLocaleString("en-NP")}`;
const fmtDate  = (iso) => new Date(iso).toLocaleDateString("en-NP", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// ═══════════════════════════════════════════════════════════════
// REUSABLE UI
// ═══════════════════════════════════════════════════════════════
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const Modal = ({ open, onClose, title, subtitle, children, size = "md" }) => {
  if (!open) return null;
  const sizeCls = size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeCls} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200`}>
        <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0 pr-2">
            <h3 className="truncate text-base font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close"
            className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
      </div>
    </div>
  );
};

const Field = ({ label, hint, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
    </div>
    {children}
    {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
  </div>
);

const inputCls =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20";

const selectCls =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20";

// ═══════════════════════════════════════════════════════════════
// SIDEBAR — shared nav (Desktop + Mobile)
// ═══════════════════════════════════════════════════════════════
const MENU_ITEMS = [
  { name: "Dashboard",  path: "/dashboard",  icon: <FiGrid className="text-xl" /> },
  { name: "Orders",     path: "/orders",     icon: <FiClipboard className="text-xl" /> },
  { name: "Tables",     path: "/tables",     icon: <MdOutlineTableRestaurant className="text-xl" /> },
  { name: "Menu",       path: "/menu",       icon: <FiBookOpen className="text-xl" /> },
  { name: "Inventory",  path: "/inventory",  icon: <FiPackage className="text-xl" /> },
  { name: "Customers",  path: "/customers",  icon: <FiUsers className="text-xl" /> },
  { name: "Staffs",     path: "/staffs",     icon: <FiUserCheck className="text-xl" /> },
  { name: "Reports",    path: "/reports",    icon: <FiBarChart2 className="text-xl" /> },
  { name: "Settings",   path: "/settings",   icon: <FiSettings className="text-xl" /> },
];

const SidebarInner = ({ onClose }) => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const current   = location.pathname;

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e50914] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            <span className="text-sm tracking-tighter">QR</span>
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900 leading-none">QR Order</div>
            <div className="text-[10px] text-gray-400 font-semibold tracking-wider">RESTAURANT</div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex flex-col gap-1.5">
          {MENU_ITEMS.map((item) => {
            const isActive = current === item.path;
            return (
              <Link key={item.name} to={item.path} onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                  isActive
                    ? "bg-[#e50914] text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-100/40 rounded-full blur-xl" />
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#e50914] mb-3">👑</div>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Unlock advanced reports, inventory alerts, and more.
          </p>
          <button
            onClick={() => alert("Premium upgrade checkout is coming soon!")}
            className="w-full py-2 bg-[#e50914] hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
            Upgrade Now
          </button>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 transition-all text-sm font-semibold text-left">
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const MobileSidebar = ({ open, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col p-6 transform transition-transform duration-300 lg:hidden ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button onClick={onClose} aria-label="Close menu"
        className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
        <FiX className="text-xl" />
      </button>
      <SidebarInner onClose={onClose} />
    </aside>
  </>
);

const DesktopSidebar = () => (
  <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col p-6 shrink-0 h-screen sticky top-0 overflow-y-auto">
    <SidebarInner onClose={() => {}} />
  </aside>
);

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function InventoryPage() {

  // ── Core state ──────────────────────────────────────────────
  const [items,        setItems]        = useState(SAMPLE_ITEMS);
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);

  // ── UI state ────────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All Items");
  const [drawerOpen,   setDrawerOpen]   = useState(false);

  // ── Modal targets ────────────────────────────────────────────
  const [addOpen,    setAddOpen]    = useState(false);
  const [editing,    setEditing]    = useState(null);   // item object
  const [viewing,    setViewing]    = useState(null);   // item object
  const [deleting,   setDeleting]   = useState(null);   // item object
  const [purchasing, setPurchasing] = useState(null);   // item object
  const [wasting,    setWasting]    = useState(null);   // item object
  const [adjusting,  setAdjusting]  = useState(null);   // item object
  const [history,    setHistory]    = useState(null);   // item object

  // ── Forms ────────────────────────────────────────────────────
  const [itemForm,     setItemForm]     = useState(EMPTY_ITEM_FORM);
  const [purchaseForm, setPurchaseForm] = useState(EMPTY_PURCHASE_FORM);
  const [wasteForm,    setWasteForm]    = useState(EMPTY_WASTE_FORM);
  const [adjForm,      setAdjForm]      = useState(EMPTY_ADJ_FORM);
  const [errors,       setErrors]       = useState({});

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const h  = (e) => { if (e.matches) setDrawerOpen(false); };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Derived counts ───────────────────────────────────────────
  const counts = useMemo(() => {
    let inStock = 0, low = 0, out = 0;
    items.filter(i => i.isActive).forEach((i) => {
      const s = getStatus(i);
      if (s === "In Stock")    inStock++;
      else if (s === "Low Stock") low++;
      else                        out++;
    });
    return { total: items.filter(i => i.isActive).length, inStock, low, out };
  }, [items]);

  // Low-stock alerts list
  const lowStockAlerts = useMemo(
    () => items.filter(i => i.isActive && getStatus(i) !== "In Stock"),
    [items]
  );

  // ── Filtered table list ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (!i.isActive) return false;
      if (statusFilter !== "All Items" && getStatus(i) !== statusFilter) return false;
      if (!q) return true;
      return `${i.name} ${i.category} ${i.sku} ${i.supplier}`.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);

  // ── Item CRUD ────────────────────────────────────────────────
  const openAdd = () => {
    setItemForm(EMPTY_ITEM_FORM);
    setErrors({});
    setAddOpen(true);
  };

  const openEdit = (item) => {
    const { id, isActive, ...rest } = item;
    setItemForm(rest);
    setErrors({});
    setEditing(item);
  };

  const validateItem = () => {
    const e = {};
    if (!itemForm.name.trim())     e.name     = "Required";
    if (!itemForm.category.trim()) e.category = "Required";
    if (!itemForm.sku.trim())      e.sku      = "Required";
    if (!itemForm.supplier.trim()) e.supplier = "Required";
    if (Number(itemForm.quantity)     < 0) e.quantity     = "Must be ≥ 0";
    if (Number(itemForm.reorderLevel) < 0) e.reorderLevel = "Must be ≥ 0";
    if (Number(itemForm.costPerUnit)  < 0) e.costPerUnit  = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if (!validateItem()) return;
    const newItem = {
      id: Date.now(),
      ...itemForm,
      quantity:     Number(itemForm.quantity),
      reorderLevel: Number(itemForm.reorderLevel),
      costPerUnit:  Number(itemForm.costPerUnit),
      isActive: true,
    };
    setItems((prev) => [newItem, ...prev]);
    // TODO: POST /api/inventory/stock-items → newItem
    setAddOpen(false);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    if (!validateItem()) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === editing.id
          ? { ...i, ...itemForm, quantity: Number(itemForm.quantity), reorderLevel: Number(itemForm.reorderLevel), costPerUnit: Number(itemForm.costPerUnit) }
          : i
      )
    );
    // TODO: PUT /api/inventory/stock-items/:id
    setEditing(null);
  };

  // Soft-delete: sets isActive = false (matches backend soft-delete pattern)
  const confirmDelete = () => {
    setItems((prev) => prev.map((i) => i.id === deleting.id ? { ...i, isActive: false } : i));
    // TODO: DELETE /api/inventory/stock-items/:id  (backend sets is_active = false)
    setDeleting(null);
  };

  // ── Stock Purchase (Phase 2) ─────────────────────────────────
  // Posts to stock_transactions with type="purchase"
  // Backend also: updates current_qty, posts Inventory Dr / Cash Cr journal
  const openPurchase = (item) => {
    setPurchaseForm(EMPTY_PURCHASE_FORM);
    setErrors({});
    setPurchasing(item);
  };

  const validatePurchase = () => {
    const e = {};
    if (Number(purchaseForm.quantity) <= 0) e.quantity = "Must be > 0";
    if (Number(purchaseForm.unitCost) < 0)  e.unitCost = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitPurchase = (e) => {
    e.preventDefault();
    if (!validatePurchase()) return;
    const qty = Number(purchaseForm.quantity);
    const cost = Number(purchaseForm.unitCost);

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) =>
        i.id === purchasing.id
          ? { ...i, quantity: i.quantity + qty, costPerUnit: cost > 0 ? cost : i.costPerUnit }
          : i
      )
    );

    // Log transaction locally (backend will generate this)
    const tx = {
      id: Date.now(),
      stockItemId: purchasing.id,
      type: "purchase",
      quantity: qty,
      unitCost: cost,
      notes: purchaseForm.notes || "Stock purchase",
      createdBy: "Admin", // TODO: pull from auth context
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    // TODO: POST /api/inventory/stock-transactions
    // Body: { stock_item_id, type: "purchase", quantity, unit_cost, notes }
    // Backend: increments current_qty, posts journal entry (Inventory 1020 Dr / Cash 1001 Cr)
    setPurchasing(null);
  };

  // ── Stock Waste / Write-off (Phase 2) ────────────────────────
  const openWaste = (item) => {
    setWasteForm(EMPTY_WASTE_FORM);
    setErrors({});
    setWasting(item);
  };

  const validateWaste = () => {
    const e = {};
    if (Number(wasteForm.quantity) <= 0)           e.quantity = "Must be > 0";
    if (Number(wasteForm.quantity) > wasting?.quantity) e.quantity = `Only ${wasting?.quantity} ${wasting?.unit} available`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitWaste = (e) => {
    e.preventDefault();
    if (!validateWaste()) return;
    const qty = Number(wasteForm.quantity);

    setItems((prev) =>
      prev.map((i) =>
        i.id === wasting.id ? { ...i, quantity: Math.max(0, i.quantity - qty) } : i
      )
    );

    const tx = {
      id: Date.now(),
      stockItemId: wasting.id,
      type: "waste",
      quantity: -qty,
      unitCost: null,
      notes: `[${wasteForm.reason}] ${wasteForm.notes}`,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    // TODO: POST /api/inventory/stock-transactions
    // Body: { stock_item_id, type: "waste", quantity: -qty, notes }
    // Backend: decrements current_qty, posts Waste Expense Dr / Inventory Cr
    setWasting(null);
  };

  // ── Stock Adjustment (Phase 2) ───────────────────────────────
  const openAdjust = (item) => {
    setAdjForm({ ...EMPTY_ADJ_FORM, quantity: item.quantity });
    setErrors({});
    setAdjusting(item);
  };

  const validateAdj = () => {
    const e = {};
    if (Number(adjForm.quantity) < 0)   e.quantity = "Must be ≥ 0";
    if (!adjForm.notes.trim())           e.notes    = "Reason is required for audit trail";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitAdj = (e) => {
    e.preventDefault();
    if (!validateAdj()) return;
    const newQty = Number(adjForm.quantity);
    const diff   = newQty - adjusting.quantity;

    setItems((prev) =>
      prev.map((i) => i.id === adjusting.id ? { ...i, quantity: newQty } : i)
    );

    const tx = {
      id: Date.now(),
      stockItemId: adjusting.id,
      type: "adjustment",
      quantity: diff,
      unitCost: null,
      notes: adjForm.notes,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    // TODO: POST /api/inventory/stock-transactions
    // Body: { stock_item_id, type: "adjustment", quantity: diff, notes }
    setAdjusting(null);
  };

  // ── Render helpers ───────────────────────────────────────────
  const renderItemFormFields = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Item Name" error={errors.name}>
        <input className={inputCls} value={itemForm.name}
          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
          placeholder="e.g. Espresso Beans" />
      </Field>
      <Field label="Category" error={errors.category}>
        <input className={inputCls} value={itemForm.category}
          onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
          placeholder="Beverages" />
      </Field>
      <Field label="SKU" error={errors.sku}>
        <input className={inputCls} value={itemForm.sku}
          onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
          placeholder="BEV-EB-099" />
      </Field>
      <Field label="Supplier" error={errors.supplier}>
        <input className={inputCls} value={itemForm.supplier}
          onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
          placeholder="Arabica Imports Co." />
      </Field>
      <Field label="Opening Quantity" error={errors.quantity}>
        <input type="number" min={0} className={inputCls} value={itemForm.quantity}
          onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} />
      </Field>
      <Field label="Unit" hint="kg / L / pcs / btl / dozen">
        <input className={inputCls} value={itemForm.unit}
          onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
          placeholder="kg" />
      </Field>
      <Field label="Cost Per Unit (NPR)" hint="Used for journal entries" error={errors.costPerUnit}>
        <input type="number" min={0} step="1" className={inputCls} value={itemForm.costPerUnit}
          onChange={(e) => setItemForm({ ...itemForm, costPerUnit: e.target.value })} />
      </Field>
      <Field label="Reorder Level" hint="Low-stock alert threshold" error={errors.reorderLevel}>
        <input type="number" min={0} className={inputCls} value={itemForm.reorderLevel}
          onChange={(e) => setItemForm({ ...itemForm, reorderLevel: e.target.value })} />
      </Field>
    </div>
  );

  const ModalFooter = ({ onCancel, submitLabel = "Save", danger = false }) => (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-5">
      <button type="button" onClick={onCancel}
        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
        Cancel
      </button>
      <button type="submit"
        className={`h-10 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition ${
          danger ? "bg-rose-600 hover:bg-rose-700" : "bg-red-600 hover:bg-red-700"
        }`}>
        {submitLabel}
      </button>
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar />
      <MobileSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">

        {/* ── Header ─────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setDrawerOpen(true)} aria-label="Open menu"
                className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 transition shrink-0">
                <FiMenu className="text-xl" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Inventory</h1>
                {lowStockAlerts.length > 0 && (
                  <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                    <FiAlertTriangle className="shrink-0" />
                    {lowStockAlerts.length} item{lowStockAlerts.length > 1 ? "s" : ""} need attention
                  </p>
                )}
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition shrink-0">
              A
            </div>
          </div>

          {/* Search + Add */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="h-9 sm:h-10 w-full rounded-lg border border-slate-200 bg-white pl-8 sm:pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20" />
            </div>
            <button onClick={openAdd}
              className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-lg bg-red-600 px-3 sm:px-4 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 shrink-0 whitespace-nowrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Item</span>
            </button>
          </div>
        </header>

        {/* ── Main ───────────────────────────────────────── */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">

          {/* ── Stat cards (clickable filter) ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total Items",  filterKey: "All Items",    value: counts.total,   tint: "from-red-500/10 to-red-500/0",         fg: "text-red-700",     ring: "ring-red-400"     },
              { label: "In Stock",     filterKey: "In Stock",     value: counts.inStock, tint: "from-emerald-500/10 to-emerald-500/0", fg: "text-emerald-700", ring: "ring-emerald-400" },
              { label: "Low Stock",    filterKey: "Low Stock",    value: counts.low,     tint: "from-amber-500/10 to-amber-500/0",     fg: "text-amber-700",   ring: "ring-amber-400"   },
              { label: "Out Of Stock", filterKey: "Out Of Stock", value: counts.out,     tint: "from-rose-500/10 to-rose-500/0",       fg: "text-rose-700",    ring: "ring-rose-400"    },
            ].map((c) => {
              const isActive = statusFilter === c.filterKey;
              return (
                <button key={c.label}
                  onClick={() => setStatusFilter(isActive ? "All Items" : c.filterKey)}
                  className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition text-left w-full
                    hover:-translate-y-0.5 hover:shadow-md cursor-pointer
                    ${isActive ? `ring-2 ${c.ring} border-transparent` : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.tint}`} />
                  <div className="relative">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{c.label}</p>
                    <p className={`mt-2 text-2xl font-semibold tracking-tight ${c.fg}`}>{c.value}</p>
                    {isActive && <p className="mt-1 text-[10px] text-slate-400">Click to clear</p>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Low-stock alert banner ── */}
          {lowStockAlerts.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
                <FiAlertTriangle /> Low / Out-of-Stock Alerts
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockAlerts.map((i) => (
                  <span key={i.id}
                    className={`text-[11px] rounded-full px-2.5 py-1 font-medium ring-1 ring-inset
                      ${getStatus(i) === "Out Of Stock"
                        ? "bg-rose-100 text-rose-700 ring-rose-200"
                        : "bg-amber-100 text-amber-800 ring-amber-200"}`}>
                    {i.name} — {i.quantity} {i.unit} left
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Inventory table ── */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-3 sm:p-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">{filtered.length}</span>
                {" "}of <span className="font-medium text-slate-700">{counts.total}</span> items
              </p>
              {statusFilter !== "All Items" && (
                <button onClick={() => setStatusFilter("All Items")}
                  className="text-[11px] font-medium text-red-600 hover:text-red-700 transition">
                  Clear filter ×
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FiPackage size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">No inventory items found.</p>
                  <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filter.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Stock Status</th>
                      <th className="px-4 py-3">Reorder Lvl</th>
                      <th className="px-4 py-3">Cost / Unit</th>
                      <th className="px-4 py-3">Stock Value</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 whitespace-nowrap">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.quantity} {item.unit} on hand</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.category}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{item.sku}</td>
                        <td className="px-4 py-3"><StatusBadge status={getStatus(item)} /></td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.reorderLevel} {item.unit}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{fmt(item.costPerUnit)}</td>
                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{fmt(item.costPerUnit * item.quantity)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* View */}
                            <button onClick={() => setViewing(item)} title="View details"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            {/* Purchase / Restock */}
                            <button onClick={() => openPurchase(item)} title="Add stock (purchase)"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                              </svg>
                            </button>
                            {/* Waste */}
                            <button onClick={() => openWaste(item)} title="Log waste / spoilage"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-amber-600 transition hover:bg-amber-50 hover:text-amber-700">
                              <FiTrendingDown size={15} />
                            </button>
                            {/* Adjustment */}
                            <button onClick={() => openAdjust(item)} title="Manual adjustment"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50 hover:text-blue-700">
                              <FiRefreshCw size={15} />
                            </button>
                            {/* History */}
                            <button onClick={() => setHistory(item)} title="Transaction history"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                              <FiList size={15} />
                            </button>
                            {/* Edit */}
                            <button onClick={() => openEdit(item)} title="Edit item"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            {/* Delete */}
                            <button onClick={() => setDeleting(item)} title="Delete item"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-600 transition hover:bg-rose-50 hover:text-rose-700">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="border-t border-gray-100 bg-white px-4 sm:px-6 py-3 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} QR Order Restaurant. All rights reserved.
        </footer>
      </div>

      {/* ════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════ */}

      {/* ── Add Item ── */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}
        title="Add Inventory Item" subtitle="Fill all fields. Cost per unit is used for journal entries." size="lg">
        <form onSubmit={submitAdd} className="space-y-5">
          {renderItemFormFields()}
          <ModalFooter onCancel={() => setAddOpen(false)} submitLabel="Save Item" />
        </form>
      </Modal>

      {/* ── Edit Item ── */}
      <Modal open={!!editing} onClose={() => setEditing(null)}
        title="Edit Inventory Item" subtitle="Changes are saved immediately to local state." size="lg">
        <form onSubmit={submitEdit} className="space-y-5">
          {renderItemFormFields()}
          <ModalFooter onCancel={() => setEditing(null)} submitLabel="Save Changes" />
        </form>
      </Modal>

      {/* ── View Item ── */}
      <Modal open={!!viewing} onClose={() => setViewing(null)}
        title={viewing?.name ?? ""} subtitle={viewing?.sku ?? ""}>
        {viewing && (
          <div className="space-y-4">
            <StatusBadge status={getStatus(viewing)} />
            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
              {[
                ["Category",      viewing.category],
                ["SKU",           viewing.sku],
                ["Quantity",      `${viewing.quantity} ${viewing.unit}`],
                ["Reorder Level", `${viewing.reorderLevel} ${viewing.unit}`],
                ["Cost / Unit",   fmt(viewing.costPerUnit)],
                ["Total Value",   fmt(viewing.costPerUnit * viewing.quantity)],
                ["Supplier",      viewing.supplier],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-2 px-4 py-2.5 text-sm">
                  <span className="text-slate-500 shrink-0">{k}</span>
                  <span className="truncate font-medium text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setViewing(null); setHistory(viewing); }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                View History
              </button>
              <button onClick={() => setViewing(null)}
                className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)}
        title="Delete inventory item?" size="sm">
        <p className="text-sm text-slate-600">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-900">{deleting?.name}</span>?{" "}
          The item will be archived (soft-deleted) and won't appear in the list.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button onClick={() => setDeleting(null)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={confirmDelete}
            className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700">
            Archive Item
          </button>
        </div>
      </Modal>

      {/* ── Stock Purchase / Restock ── */}
      <Modal open={!!purchasing} onClose={() => setPurchasing(null)}
        title={`Restock — ${purchasing?.name ?? ""}`}
        subtitle="This will increase stock qty and log a purchase transaction.">
        <form onSubmit={submitPurchase} className="space-y-4">
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-800">
            <span className="font-semibold">Current stock:</span> {purchasing?.quantity} {purchasing?.unit}
            <span className="ml-4 font-semibold">Journal entry:</span> Inventory Dr / Cash Cr
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`Quantity to Add (${purchasing?.unit})`} error={errors.quantity}>
              <input type="number" min={1} className={inputCls} value={purchaseForm.quantity}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })} />
            </Field>
            <Field label="Unit Cost (NPR)" hint="Leave 0 to keep existing cost" error={errors.unitCost}>
              <input type="number" min={0} className={inputCls} value={purchaseForm.unitCost}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, unitCost: e.target.value })} />
            </Field>
          </div>
          <Field label="Notes">
            <input className={inputCls} value={purchaseForm.notes}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
              placeholder="e.g. Monthly restock from supplier" />
          </Field>
          <ModalFooter onCancel={() => setPurchasing(null)} submitLabel="Confirm Purchase" />
        </form>
      </Modal>

      {/* ── Waste / Write-off ── */}
      <Modal open={!!wasting} onClose={() => setWasting(null)}
        title={`Log Waste — ${wasting?.name ?? ""}`}
        subtitle="This will decrease stock qty and log a waste transaction.">
        <form onSubmit={submitWaste} className="space-y-4">
          <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 text-xs text-rose-800">
            <span className="font-semibold">Current stock:</span> {wasting?.quantity} {wasting?.unit}
            <span className="ml-4 font-semibold">Journal:</span> Waste Expense Dr / Inventory Cr
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`Quantity to Write Off (${wasting?.unit})`} error={errors.quantity}>
              <input type="number" min={1} className={inputCls} value={wasteForm.quantity}
                onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })} />
            </Field>
            <Field label="Reason">
              <select className={selectCls} value={wasteForm.reason}
                onChange={(e) => setWasteForm({ ...wasteForm, reason: e.target.value })}>
                <option value="spoilage">Spoilage / Expiry</option>
                <option value="breakage">Breakage / Damage</option>
                <option value="theft">Theft / Loss</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <Field label="Notes / Details">
            <input className={inputCls} value={wasteForm.notes}
              onChange={(e) => setWasteForm({ ...wasteForm, notes: e.target.value })}
              placeholder="e.g. Found expired batch during morning check" />
          </Field>
          <ModalFooter onCancel={() => setWasting(null)} submitLabel="Log Waste" danger />
        </form>
      </Modal>

      {/* ── Manual Adjustment ── */}
      <Modal open={!!adjusting} onClose={() => setAdjusting(null)}
        title={`Manual Adjustment — ${adjusting?.name ?? ""}`}
        subtitle="Set the correct quantity after a stock count. Reason is required for audit trail.">
        <form onSubmit={submitAdj} className="space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
            <span className="font-semibold">Current recorded qty:</span> {adjusting?.quantity} {adjusting?.unit}
          </div>
          <Field label={`Actual Quantity (${adjusting?.unit})`} hint="Enter real counted value" error={errors.quantity}>
            <input type="number" min={0} className={inputCls} value={adjForm.quantity}
              onChange={(e) => setAdjForm({ ...adjForm, quantity: e.target.value })} />
          </Field>
          <Field label="Reason (required for audit)" error={errors.notes}>
            <input className={inputCls} value={adjForm.notes}
              onChange={(e) => setAdjForm({ ...adjForm, notes: e.target.value })}
              placeholder="e.g. Physical stock count on 15 Jun — corrected discrepancy" />
          </Field>
          <ModalFooter onCancel={() => setAdjusting(null)} submitLabel="Apply Adjustment" />
        </form>
      </Modal>

      {/* ── Transaction History ── */}
      <Modal open={!!history} onClose={() => setHistory(null)}
        title={`History — ${history?.name ?? ""}`}
        subtitle="All stock movements for this item" size="lg">
        {history && (() => {
          const txs = transactions.filter((t) => t.stockItemId === history.id);
          return txs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {txs.map((tx) => {
                const s = TX_STYLES[tx.type];
                const isPos = tx.quantity > 0;
                return (
                  <div key={tx.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${s.color}`}>
                      {s.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 truncate">{tx.notes || "—"}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{fmtDate(tx.createdAt)} · by {tx.createdBy}</p>
                    </div>
                    <div className={`shrink-0 text-sm font-semibold ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
                      {isPos ? "+" : ""}{tx.quantity} {history.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <div className="mt-4 flex justify-end">
          <button onClick={() => setHistory(null)}
            className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}