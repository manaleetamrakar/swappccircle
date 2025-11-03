import React from "react";

function Homepage({ onEnter }) {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>Welcome to SwapCircle</h1>
      <p>
        A community-based platform to swap clothes, books, and accessories — no money, just good vibes ✨
      </p>
      <button onClick={onEnter} style={{ backgroundColor: "#3b82f6" }}>
        Get Started
      </button>
    </div>
  );
}

export default Homepage;
