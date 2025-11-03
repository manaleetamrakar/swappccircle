import React, { useState } from "react";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "https://swapcircle.onrender.com/api/login"
      : "https://swapcircle.onrender.com/api/register";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      if (isLogin) {
        onLogin(data.access_token);
      } else {
        setMessage("✅ Registered successfully! Please log in.");
        setIsLogin(true);
      }
    } else {
      setMessage(data.message || data.error || "⚠️ Error occurred");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"} to SwapCircle</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      {message && <p className="message">{message}</p>}
      <button
        className="switch-btn"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create an account" : "Go to Login"}
      </button>
    </div>
  );
}

export default Login;
