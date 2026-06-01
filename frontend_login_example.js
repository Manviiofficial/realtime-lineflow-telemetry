// This is a sample JavaScript code to call your Flask backend from the frontend (React or plain JS)
// It hashes the password using SHA-256 before sending, matching your backend's expectation.

async function login(username, password) {
  // Hash the password using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Send POST request to Flask backend
  const response = await fetch('http://127.0.0.1:5000/loginme', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: hashHex })
  });
  const result = await response.json();
  if (response.ok) {
    // Login successful, result contains user info and JWT token
    console.log('Login successful:', result);
    // Save token to localStorage or state as needed
  } else {
    // Login failed
    console.log('Login failed:', result.message);
  }
}

// Example usage:
// login('username', 'password');

// In a real React app, call login() on form submit with user input values.
