import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import bgImage from "../assets/Background.jpeg";
import gridLogo from "../assets/grid-logo-india.png";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }
`;

export default function LoginPage({ onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername || !trimmedPassword) {
      onLogin("", "");
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:4000/loginme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });
      const result = await response.json();
      if (response.ok && result.status === 200) {
        // Store login state and username
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", trimmedUsername);
        onLogin(trimmedUsername, trimmedPassword);
      } else {
        onLogin("", "");
      }
    } catch (err) {
      onLogin("", "");
    }
  }

  return (
    <>
      <GlobalStyle />
      <StyledWrapper $bg={bgImage} $dark={darkMode}>
        {/* Dark mode toggle */}
        <button
          className="dark-toggle"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
        <div className="center-container">
          <form className={`form glass-card${darkMode ? " dark" : ""}`} onSubmit={handleSubmit}>
            <div id="heading">
              <img src={gridLogo} alt="GRID INDIA Logo" className="logo-img" />
              <h2 className="login-title">Welcome to Line flow </h2>
              <p className="login-subtitle">Please sign in to continue</p>
            </div>
            <div className="field">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
              </svg>
              <input
                autoComplete="off"
                placeholder="Username"
                className="input-field"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="field">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
              <input
                placeholder="Password"
                className="input-field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="btn">
              <button className="button1" type="submit">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            </div>
          </form>
        </div>
      </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg, $dark }) =>
    $dark
      ? `linear-gradient(135deg, rgba(35,37,38,0.7) 0%, rgba(65,67,69,0.7) 100%), url(${$bg}) center/cover no-repeat`
      : `linear-gradient(135deg, rgba(224,234,252,0.7) 0%, rgba(207,222,243,0.7) 100%), url(${$bg}) center/cover no-repeat`};
  background-size: cover;
  background-position: center;
  transition: background 0.5s;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    background: none;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .dark-toggle {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 100;
    padding: 0.5em 0.7em;
    border-radius: 50%;
    border: 1px solid #e0e0e0;
    background: rgba(255,255,255,0.7);
    color: #333;
    font-size: 1.2em;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }
  .dark-toggle:hover {
    background: #232526;
    color: #fff;
    border: 1px solid #414345;
  }
  .center-container {
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .form.glass-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 2.5em 2em 2em 2em;
    background: rgba(255,255,255,0.35);
    border-radius: 30px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(12px);
    border: 1.5px solid rgba(255,255,255,0.18);
    transition: .4s;
    min-width: 340px;
    max-width: 90vw;
  }
  .form.glass-card.dark {
    background: rgba(36, 37, 38, 0.7);
    border: 1.5px solid rgba(60,60,60,0.18);
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25);
  }
  .form.glass-card:hover {
    transform: scale(1.03);
    border: 2px solid #b6c6e6;
  }
  #heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 1.5em 0 1em 0;
    color: #222;
    font-size: 1.2em;
    font-weight: 700;
    letter-spacing: 1px;
  }
  .logo-img {
    height: 70px;
    margin-bottom: 10px;
    margin-top: -10px;
    filter: drop-shadow(0 2px 8px #b6c6e6);
  }
  .login-title {
    font-size: 1.5em;
    font-weight: 700;
    color: #1976d2;
    margin-bottom: 0.2em;
    margin-top: 0.2em;
    letter-spacing: 1px;
  }
  .form.glass-card.dark .login-title {
    color: #e0eafc;
  }
  .login-subtitle {
    font-size: 1em;
    color: #555;
    margin-bottom: 0.5em;
  }
  .form.glass-card.dark .login-subtitle {
    color: #b6c6e6;
  }
  .form.glass-card.dark #heading {
    color: #e0eafc;
  }
  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em 1em;
    border: none;
    outline: none;
    color: #222;
    background: rgba(255,255,255,0.7);
    box-shadow: 0 2px 8px rgba(31, 38, 135, 0.08) inset;
    margin-bottom: 0.7em;
    transition: background 0.3s;
    width: 100%;
    max-width: 320px;
  }
  .form.glass-card.dark .field {
    background: rgba(36, 37, 38, 0.8);
    color: #e0eafc;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12) inset;
  }
  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: #888;
    transition: fill 0.3s;
  }
  .form.glass-card.dark .input-icon {
    fill: #e0eafc;
  }
  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #222;
    font-size: 1em;
    padding: 0.2em 0.5em;
    transition: color 0.3s;
  }
  .form.glass-card.dark .input-field {
    color: #e0eafc;
  }
  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 1em;
    width: 100%;
  }
  .button1 {
    padding: 0.5em 2.2em;
    border-radius: 12px;
    border: none;
    outline: none;
    font-weight: 600;
    font-size: 1.1em;
    background: linear-gradient(135deg, #4fc3f7 0%, #1976d2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(31, 38, 135, 0.12);
    transition: background 0.3s, transform 0.2s;
  }
  .button1:hover {
    background: linear-gradient(135deg, #1976d2 0%, #4fc3f7 100%);
    transform: scale(1.04);
  }
  .form.glass-card.dark .button1 {
    background: linear-gradient(135deg, #232526 0%, #414345 100%);
    color: #e0eafc;
  }
  .form.glass-card.dark .button1:hover {
    background: linear-gradient(135deg, #414345 0%, #232526 100%);
  }
  .error-message {
    color: #ff4d4f;
    text-align: center;
    font-weight: 600;
    margin-top: 8px;
    font-size: 1em;
    letter-spacing: 0.5px;
  }
`;