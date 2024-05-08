"use client";

import Link from "next/link";
import "./styles.css";
import { useEffect, useState } from "react";
import { APIError, UserPayload } from "@/types/types";

export default () => {
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [apiErrors, setApiErrors] = useState<APIError[]>([]);

  useEffect(() => {
    document.title = "Login | Todo App";

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
          window.location.href = "/";
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
    }
  });

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const submit = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    if (!email.value) {
      setEmailValid(false);
    }

    if (!password.value) {
      setPasswordValid(false);
    }

    if (!email.value || !password.value) {
      return;
    }

    fetch("http://localhost:3001/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    }).then(async (res) => {
      if (res.ok) {
        const { user } = (await res.json()) as { user: UserPayload };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.accessToken);
        window.location.href = "/";
      } else {
        const { errors } = (await res.json()) as {
          errors: {
            [key: string]: APIError[] | APIError;
          };
        };

        let errList: APIError[] = [];
        Object.keys(errors).forEach((key: string) => {
          errList = errList.concat(errors[key]);
        });

        setApiErrors(errList);
      }
    });
  };

  return (
    <main>
      <div className="form">
        <h1>Login</h1>
        {apiErrors.length > 0 ? (
          <ul className="errors center">
            {apiErrors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        ) : null}
        <form>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onInput={onEmailChange}
            className={`${emailValid ? "" : "invalid"}`}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onInput={onPasswordChange}
            className={`${passwordValid ? "" : "invalid"}`}
            required
          />
          <a className="submit" onClick={submit}>
            Login
          </a>
        </form>
        <div className="links">
          <Link href={"/register"}>
            <p>Don't have an account?</p>
          </Link>
        </div>
      </div>
    </main>
  );
};
