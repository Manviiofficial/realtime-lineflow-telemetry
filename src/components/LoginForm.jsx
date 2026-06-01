import React, { useState } from "react";

async function login(username, password) {
  const response = await fetch('http://127.0.0.1:4000/loginme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await response.json();
  if (response.ok) {
    alert("Login successful! Token: " + result.token);
  } else {
    alert("Login failed: " + result.message);
  }
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    login(username, password);
  };    

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 320, margin: '2rem auto', padding: 24, border: '1px solid #1976d2', borderRadius: 12}}>
      <h2 style={{color: '#1976d2'}}>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{width: '100%', marginBottom: 12, padding: 8}} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{width: '100%', marginBottom: 12, padding: 8}} />
      <button type="submit" style={{width: '100%', background: '#1976d2', color: '#fff', padding: 10, border: 'none', borderRadius: 6}}>Login</button>
    </form>
  );
}      
