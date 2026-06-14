const { z }         = require("zod");
const authService   = require("./auth.service");

// ── Zod Schemas ────────────────────────────────────────────
const registerSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role:     z.enum(["admin","owner","manager","cashier","waiter","kitchen","inventory"]).optional(),
});

const loginSchema = z.object({
  email:    z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotSchema = z.object({
  email: z.email("Invalid email address"),
});

const resetSchema = z.object({
  token:    z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ── Register ───────────────────────────────────────────────
const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
  }
  try {
    const user = await authService.register(result.data);
    res.status(201).json({ success: true, message: "Account created successfully.", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Login ──────────────────────────────────────────────────
// Frontend Login.jsx sends { email, password } to POST /api/auth/login
const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
  }
  try {
    const data = await authService.login(result.data);
    res.status(200).json({ success: true, ...data });
    // Response: { success: true, token: "...", user: { id, name, email, role, ... } }
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// ── Forgot Password ────────────────────────────────────────
const forgotPassword = async (req, res) => {
  const result = forgotSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
  }
  try {
    await authService.forgotPassword(result.data);
    // Always return success to prevent email enumeration
    res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Reset Password ─────────────────────────────────────────
const resetPassword = async (req, res) => {
  const result = resetSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
  }
  try {
    await authService.resetPassword(result.data);
    res.status(200).json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Get Me ─────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, getMe };
