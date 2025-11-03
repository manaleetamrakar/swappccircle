import React from "react";
import "./App.css";

function Home({ onStart }) {
  return (
    <div className="home">
      <h1>Welcome to SwapCircle</h1>
      <p>
        Trade your unused clothes, books, and accessories with others in your
        college community. Sustainable, simple, and money-free.
      </p>
      <button onClick={onStart}>Get Started</button>
    </div>
  );
}

export default Home;
