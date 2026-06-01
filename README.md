# ⚡ React Telemetry Dashboard

## 🛠 Tech Stack

- **Frontend**: React (with Vite)
- **Styling**: TailwindCSS v3
- **Charting**: (e.g., Recharts or Chart.js)
- **Routing**: React Router
- **Backend**: Mocked telemetry data (no backend)

---

## 🎯 Project Objective

Build a front-end dashboard for visualizing telemetry (power usage) data from railway power lines.

### Key Features

1. **User Authentication**  
   - Login page with username/password match validation.
2. **Dashboard Visualization**  
   - Select date range and railway line
   - Fetch and display mock telemetry data
   - Power usage graph (kW vs Date/Time)

---

## 🖥 Application Flow

### 1. Login Page
- Input: username and password
- If correct, navigate to the dashboard
- Else, show an error message

### 2. Dashboard Page
- Inputs: From Date, To Date, Line Name (e.g., "Delhi–Kanpur", "Mumbai–Ahmedabad")
- Output: Graph showing kW usage over selected time period

---
