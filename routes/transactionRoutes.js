import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Add
router.post("/", authMiddleware, async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user.id
  });
  res.json(transaction);
});

// Get with filters + pagination
router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, limit = 5, search, category } = req.query;

  let query = { user: req.user.id };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) query.category = category;

  const transactions = await Transaction.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ date: -1 });

  const total = await Transaction.countDocuments(query);

  res.json({ transactions, total });
});

// Update
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Dashboard Summary
router.get("/summary/dashboard", authMiddleware, async (req, res) => {
  const totalExpense = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const categoryBreakdown = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);

  const recent = await Transaction.find({ user: req.user.id })
    .sort({ date: -1 })
    .limit(5);

  res.json({
    total: totalExpense[0]?.total || 0,
    categoryBreakdown,
    recent
  });
});

export default router;
