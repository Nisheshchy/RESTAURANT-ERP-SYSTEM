const prisma = require("../../config/prisma");

// ── Get all active tables ───────────────────────────────────
const getAllTables = async () => {
  return prisma.restaurantTable.findMany({
    where:   { is_active: true },
    orderBy: [{ floor: "asc" }, { table_number: "asc" }],
  });
};

// ── Get single table ────────────────────────────────────────
const getTableById = async (id) => {
  const table = await prisma.restaurantTable.findUnique({ where: { id } });
  if (!table) throw new Error("Table not found.");
  return table;
};

// ── Create table ────────────────────────────────────────────
const createTable = async ({ table_number, capacity, floor }) => {
  const exists = await prisma.restaurantTable.findUnique({ where: { table_number } });
  if (exists) throw new Error(`Table number ${table_number} already exists.`);
  return prisma.restaurantTable.create({
    data: { table_number, capacity, floor: floor || "Ground" },
  });
};

// ── Update table ────────────────────────────────────────────
const updateTable = async (id, data) => {
  await getTableById(id);
  return prisma.restaurantTable.update({ where: { id }, data });
};

// ── Update status only ──────────────────────────────────────
const updateStatus = async (id, status) => {
  const allowed = ["available", "occupied", "reserved"];
  if (!allowed.includes(status)) throw new Error("Invalid status.");
  return prisma.restaurantTable.update({ where: { id }, data: { status } });
};

// ── Deactivate (soft delete) ────────────────────────────────
const deleteTable = async (id) => {
  await getTableById(id);
  return prisma.restaurantTable.update({ where: { id }, data: { is_active: false } });
};

module.exports = { getAllTables, getTableById, createTable, updateTable, updateStatus, deleteTable };