import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";

function Dashboard({ onLogout }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Item added!");
        setTitle("");
        setCategory("");
        setDescription("");
        fetchItems();
      } else {
        setMessage("❌ " + (data.error || "Failed to add item"));
      }
    } catch {
      setMessage("⚠️ Server error while adding item!");
    }
  };

  const requestSwap = async (itemId) => {
    const res = await fetch("http://127.0.0.1:5000/api/swap_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item_id: itemId }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>SwapCircle</h1>
        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </header>

      <form className="add-form" onSubmit={addItem}>
        <input
          placeholder="Item title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      {message && <p className="msg">{message}</p>}

      <input
        className="search"
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="item-grid">
        {items
          .filter(
            (i) =>
              i.title.toLowerCase().includes(search.toLowerCase()) ||
              i.category.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>{item.category}</span>
              <button onClick={() => requestSwap(item.id)}>Request Swap</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
