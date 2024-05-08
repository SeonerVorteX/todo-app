"use client";

import "./styles.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3001/v1/@me/verifyToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
    }
  }, []);

  const logout = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/v1/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        window.location.href = "/login";
      }
    });
  };

  return (
    <div className="container">
      <div className="nav-heading">
        <h3>
          <Link href="/#">Todo APP</Link>
        </h3>
      </div>

      <div className="nav-end">
        {isAuthenticated ? (
          <div className="buttons">
            <a className="btn tertiary-btn" onClick={logout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </a>
            <Link className="btn primary-btn" href="/profile">
              <i className="fa-solid fa-user"></i> Profile
            </Link>
          </div>
        ) : (
          <div className="buttons">
            <Link className="btn secondary-btn" href="/login">
              Login
            </Link>
            <Link className="btn primary-btn" href="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
