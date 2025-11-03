import React from "react";
import "./App.css";

function Navbar({ onLogout }) {
  return (
    <div className="navbar">
      <h2>SwapCircle</h2>
      <button
        onClick={onLogout}
        style={{
          background: "white",
          color: "#2563eb",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "500",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
