import { useEffect, useState } from "react";
import App from "./components/App";
import "./styles.css";
import { set } from "mongoose";

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

  return (
    <main>
      {isAuthenticated ? (
        <App />
      ) : (
        <div className="container noauth">
          <h2>Todo App</h2>
          <p>Please login to create todos</p>
        </div>
      )}
    </main>
  );
};
