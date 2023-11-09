import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [activePage, setActivePage] = useState("home");

  React.useEffect(() => {
    const pathname = location.pathname.replace("/", "");
    setActivePage(pathname || "home");
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className={`nav-link ${activePage === "home" ? "active" : ""}`}>
        <Link to="/home">Home</Link>
      </div>
      <div className={`nav-link ${activePage === "about" ? "active" : ""}`}>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}
