import React, { useState } from "react";

export default function LoginSection({ code, setCode, token, setToken }) {
  async function login(username, password) {
    const response = await fetch(`${process.env.REACT_APP_AI_API}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username,
        password
      })
    });
    if (!response.ok) throw new Error("Login failed");
    const { code, token, expiresAt } = await response.json();
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

    await fetch(`${process.env.REACT_APP_AI_API}/api/v1/logout`, { method: "POST", headers });
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

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      {token ? 
        <div>
          Logged with code: <code>{code}</code>
          <span style={{ marginLeft: 8 }}>
            <button onClick={logout}>Logout</button>
          </span>
        </div> 
        : <LoginForm onLogin={login} />
      }
    </div>
  );
}
