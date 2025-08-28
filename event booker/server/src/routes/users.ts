import { Router, Request, Response } from "express";
import { User } from "../models/User"; // adjust path as needed
import { authenticate, requireAdmin } from "../middleware/auth"; // you likely already have these
import bcrypt from "bcrypt";


const router = Router();

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get("/", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "role", "isActive"]
 // Add/remove fields as needed
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

/**
 * PUT /api/users/:id
 * Admin edits any user (first name, last name, email, role, isActive, password)
 */
router.put("/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Update only allowed fields if present
    if (typeof firstName === "string") user.firstName = firstName;
    if (typeof lastName === "string") user.lastName = lastName;
    if (typeof email === "string") user.email = email;
    if (typeof role === "string" && (role === "admin" || role === "event creator")) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;

    // If password present and not empty, set new hash
    if (typeof password === "string" && password.trim().length > 0) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Edit user error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

/**
 * DELETE /api/users/:id
 * Admin deletes a user by ID
 */
router.delete("/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting the only admin or self-deleting admin (optional security)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(403).json({ success: false, error: "Admins cannot be deleted." });
    }

    await user.destroy();
    res.json({ success: true, message: "User deleted." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

/**
 * PATCH /api/users/:id/status
 * Admin can activate or deactivate a user.
 */
router.patch("/:id/status", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(403).json({ success: false, error: "Admins cannot be deactivated." });
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, error: "Invalid isActive value." });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Patch user status error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

router.post("/", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, role, password, isActive = true } = req.body;

    if (!firstName || !lastName || !email || !role || !password) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }
    if (!["admin", "event creator"].includes(role)) {
      return res.status(400).json({ success: false, error: "Role must be 'admin' or 'event creator'." });
    }

    // email unique check goes here if not handled by DB
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      isActive,
      password: hash
    });

    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, error: "Email already in use." });
    }
    console.error("Add user error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});


export default router;
