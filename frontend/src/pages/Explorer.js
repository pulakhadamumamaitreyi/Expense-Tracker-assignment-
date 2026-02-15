import { useEffect, useState } from "react";
import axios from "axios";

export default function Explorer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/transactions?search=${search}`,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    setTransactions(res.data.transactions);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <h2>Transaction Explorer</h2>
      <input placeholder="Search" onChange={e => setSearch(e.target.value)} />
      <button onClick={fetchData}>Search</button>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map(t => (
          <div key={t._id}>
            {t.title} - ₹{t.amount}
          </div>
        ))
      )}
    </div>
  );
}
