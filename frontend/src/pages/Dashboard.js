import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/transactions/summary/dashboard", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    }).then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Total Expense: ₹{data.total}</h2>

      <h3>Category Breakdown</h3>
      {data.categoryBreakdown.map(c => (
        <p key={c._id}>{c._id}: ₹{c.total}</p>
      ))}

      <h3>Recent Transactions</h3>
      {data.recent.map(t => (
        <p key={t._id}>{t.title} - ₹{t.amount}</p>
      ))}
    </div>
  );
}
