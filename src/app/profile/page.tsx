"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import { UserInformation } from "@/types/types";

export default () => {
  const [details, setDetails] = useState<{
    email: string;
    todoCount: number;
  }>();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3001/v1/@me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (res.ok) {
          const data: { user: UserInformation } = await res.json();
          setDetails({
            email: data.user.email,
            todoCount: data.user.todoList.length,
          });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      });
    }
  }, []);

  if (!details) return;

  return (
    <main>
      <div className="profile">
        <div className="profile-header">
          <h1>Profile</h1>
        </div>
        <div className="profile-content">
          <div className="profile-info">
            <p>
              <span>Email:</span> {details.email}
            </p>
            <p>
              <span>Total todo:</span> {details.todoCount}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
