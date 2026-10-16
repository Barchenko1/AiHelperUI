import React, { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

export default function LoginSection({ code, setCode, token, setToken }) {
  async function login(username, password) {
    const response = await fetch(apiUrl("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username,
        password
      })
    });
    if (!response.ok) throw new Error("Login failed");
    saveSession(await response.json());
  }

  // Another browser joins the same session with the verification code shown after login.
  async function joinWithCode(verificationCode) {
    const response = await fetch(apiUrl("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: verificationCode })
    });
    if (!response.ok) throw new Error("Code not valid or expired");
    saveSession(await response.json());
  }

  useEffect(() => {
    if (!code) return;
    fetch(apiUrl("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code })
    })
      .then(response => (response.ok ? response.json().then(saveSession) : clearSession()))
      .catch(() => {}); // server unreachable: keep the saved session, the status light shows the problem
  }, []);

  function saveSession({ code, token, expiresAt }) {
    setCode(code);
    setToken(token);
    const usersession = {
      code,
      token,
      expiresAt
    }
    localStorage.setItem("usersession", JSON.stringify(usersession));
  }

  async function logout() {
    const headers = {};
    if (code) headers["X-Auth-Code"] = code;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch(apiUrl("/logout"), { method: "POST", headers });
    clearSession();
  }

  function clearSession() {
    setCode("");
    setToken("");
    localStorage.removeItem("usersession");
  }

  const LoginForm = ({onLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form onSubmit={e => { e.preventDefault(); onLogin(username, password).catch(alert); }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        <button>Login</button>
      </form>
    );
  };

  const CodeForm = ({onJoin}) => {
    const [verificationCode, setVerificationCode] = useState("");
    return (
      <form onSubmit={e => { e.preventDefault(); onJoin(verificationCode).catch(alert); }}>
        <input value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
               placeholder="verification code" inputMode="numeric" />
        <button>Join with code</button>
      </form>
    );
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      {token ? 
        <div>
          Logged with code: <code>{code}</code>
          <span style={{ marginLeft: 8 }}>
            <button onClick={logout}>Logout</button>
          </span>
        </div> 
        : <>
            <LoginForm onLogin={login} />
            <CodeForm onJoin={joinWithCode} />
          </>
      }
    </div>
  );
}
