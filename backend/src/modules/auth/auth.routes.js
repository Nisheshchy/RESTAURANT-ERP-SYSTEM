const express = require("express");
const router  = express.Router();
const { protect, allowRoles } = require("../../middleware/auth.middleware");
const ctrl = require("./auth.controller");

// Public routes
router.post("/register",       ctrl.register);        // POST /api/auth/register
router.post("/login",          ctrl.login);           // POST /api/auth/login  ← used by Login.jsx
router.post("/forgot-password", ctrl.forgotPassword); // POST /api/auth/forgot-password
router.post("/reset-password",  ctrl.resetPassword);  // POST /api/auth/reset-password

// Protected routes
router.get("/me", protect, ctrl.getMe);               // GET  /api/auth/me

module.exports = router;