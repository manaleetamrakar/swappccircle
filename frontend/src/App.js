import React, { useState } from "react";
import Homepage from "./Homepage";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("home");
  };

  if (isLoggedIn && page === "dashboard") return <Dashboard onLogout={handleLogout} />;
  if (page === "login") return <Login onLoginSuccess={handleLoginSuccess} />;
  
  return <Homepage onEnter={() => setPage("login")} />;
}

export default App;
