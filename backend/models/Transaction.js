import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  amount: Number,
  category: String,
  date: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
