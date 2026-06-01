
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import welcomeLogo from "../assets/welcome logo.png";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import HighchartsTelemetry from "../components/HighchartsTelemetry";

// Generate 100 line names
const lineOptions = Array.from({ length: 100 }, (_, i) => ({
  value: `LINE-${i + 1}`,
  label: `LINE-${i + 1}`,
}));

// Generate mock telemetry data for demo
function generateTelemetryData(fromDate, toDate) {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diff = Math.floor((end - start) / (1000 * 60 * 5)); // 5-min intervals
  const points = Math.max(1, diff + 1);
  const data = [];
  const baseT1 = 950 + Math.random() * 150;
  const baseT2 = 850 + Math.random() * 150;
  const ampT1 = 80 + Math.random() * 120;
  const ampT2 = 60 + Math.random() * 100;
  const phaseT2 = Math.random() * Math.PI;
  const freqT1 = 2 * Math.PI / points;
  const freqT2 = 2 * Math.PI / (points * (0.8 + Math.random() * 0.4));
  for (let i = 0; i < points; i++) {
    const time = new Date(start.getTime() + i * 5 * 60 * 1000);
    const noiseT1 = Math.random() * 40 - 20;
    const trendT1 = Math.sin(i * freqT1 + Math.random()) * ampT1;
    const spikeT1 = Math.random() > 0.99 ? Math.random() * 120 : 0;
    const noiseT2 = Math.random() * 40 - 20;
    const sawtooth = ((i % Math.round(points / 12)) / Math.round(points / 12)) * ampT2 - ampT2 / 2;
    const trendT2 = Math.sin(i * freqT2 + phaseT2) * (ampT2 / 2) + sawtooth;
    const spikeT2 = Math.random() > 0.985 ? Math.random() * 100 : 0;
    data.push({
      time: time.toLocaleString("en-GB", { hour12: false }),
      T1: Math.round(baseT1 + trendT1 + noiseT1 + spikeT1),
      T2: Math.round(baseT2 + trendT2 + noiseT2 + spikeT2),
    });
  }
  return data;
}


export default function SingleLinePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const user = { name: username, avatar: welcomeLogo };
  const [activeNavbar, setActiveNavbar] = useState("single-line");

  // State preservation using localStorage (only while on the page)
  const [fromDate, setFromDate] = useState(() => localStorage.getItem("single_fromDate") || "");
  const [toDate, setToDate] = useState(() => localStorage.getItem("single_toDate") || "");
  const [line, setLine] = useState(() => {
    const saved = localStorage.getItem("single_line");
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);


  // No need for didInit or extra effect; useState initializers handle first load

  // Persist state to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("single_fromDate", fromDate);
  }, [fromDate]);
  useEffect(() => {
    localStorage.setItem("single_toDate", toDate);
  }, [toDate]);
  useEffect(() => {
    localStorage.setItem("single_line", JSON.stringify(line));
  }, [line]);

  // On unmount, clear state from localStorage
  useEffect(() => {
    return () => {
      localStorage.removeItem("single_fromDate");
      localStorage.removeItem("single_toDate");
      localStorage.removeItem("single_line");
    };
  }, []);

  useEffect(() => {
    if (showGraph && fromDate && toDate && line) {
      setData(generateTelemetryData(fromDate, toDate));
    }
  }, [fromDate, toDate, line, showGraph]);

  function handleConfirm() {
    if (!fromDate || !toDate || !line) {
      setError("Please select all fields.");
      return;
    }
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    if (d2 < d1) {
      setError("To Date must be after From Date.");
      return;
    }
    if ((d2 - d1) / (1000 * 60 * 60 * 24) > 366) {
      setError("Maximum date range is 1 year. Please select a shorter range.");
      return;
    }
    setError("");
    setConfirm(true);
  }

  function handleShowGraph() {
    setShowGraph(true);
    setShowTable(false);
    setConfirm(false);
  }

  function handleReset() {
    setError("");
    setConfirm(false);
    setShowGraph(false);
    setShowTable(false);
    setData([]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header and Navbar */}
      <header className="flex flex-row items-center justify-between px-4 py-2 bg-white/70 shadow-md z-10 backdrop-blur border-b border-gray-200 w-full gap-2 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <img src={user.avatar} alt="User Avatar" className="h-12 w-12 rounded-full border-4 border-blue-300 bg-white shadow-lg shrink-0" style={{ boxShadow: "0 6px 24px #b6c6e6, 0 2px 8px #0002" }} />
          <div className="truncate">
            <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 drop-shadow truncate">Welcome, {user.name}!</h1>
            <p className="text-sm text-gray-500 font-medium truncate">GRID-INDIA Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Navbar active={activeNavbar} setActive={(key) => {
            setActiveNavbar(key);
            if (key === "dashboard") navigate("/dashboard");
            else if (key === "single-line") navigate("/single-line");
          }} />
          <button className="ml-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition text-sm md:text-base" onClick={() => navigate("/login")} aria-label="Logout">Logout</button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full h-full overflow-auto px-0 md:px-0 py-2">
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          <div className="w-full bg-white/90 rounded-2xl shadow-xl border border-blue-100 px-4 md:px-8 py-4 flex flex-col items-center">
            {/* Heading */}
            <h2 className="text-lg md:text-xl font-bold text-blue-900 mb-2 mt-2 tracking-wide text-center" style={{ letterSpacing: "0.5px" }}>
              Single Line Visualization
            </h2>
            {/* Filter Inputs */}
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700">From Date</label>
                <input
                  type="date"
                  className="rounded border px-2 py-1 text-blue-500 text-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={showGraph}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700">To Date</label>
                <input
                  type="date"
                  className="rounded border px-2 py-1 text-blue-500 text-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={showGraph}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700">Line Name</label>
                <Select
                  options={lineOptions}
                  value={line}
                  onChange={setLine}
                  isSearchable
                  placeholder="Select line..."
                  maxMenuHeight={180}
                  isDisabled={showGraph}
                  styles={{
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      color: "#3b82f6",
                      borderColor: "#3b82f6",
                      minHeight: 32,
                      fontSize: 14,
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#3b82f6",
                      fontSize: 14,
                    }),
                    input: (base) => ({ ...base, color: "#3b82f6", fontSize: 14 }),
                    option: (base, state) => ({
                      ...base,
                      color: "#3b82f6",
                      backgroundColor: state.isFocused ? "#e0f2fe" : "#fff",
                      fontSize: 14,
                    }),
                  }}
                />
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-600 font-semibold text-xs mb-2">{error}</div>
            )}
            {/* Confirmation Step */}
            {confirm && !showGraph && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex flex-col items-center gap-2 mb-2">
                <div className="text-xs text-blue-900 font-medium">
                  You selected <b>{fromDate}</b> to <b>{toDate}</b> for line: <b>{line?.label}</b>. Continue?
                </div>
                <div className="flex gap-3 mt-1">
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs"
                    onClick={handleShowGraph}
                  >
                    Yes, show graph
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 text-xs"
                    onClick={handleReset}
                  >
                    No, re-enter
                  </button>
                </div>
              </div>
            )}
            {/* Show Graph/Table */}
            {showGraph && (
              <div className="w-full bg-white/80 rounded-xl shadow p-4 border border-gray-200 mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">X-axis:</span> Date + Time (5-min intervals).{" "}
                    <span className="font-semibold">Y-axis:</span> Power (kW).
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 shadow transition flex items-center gap-1 ml-2"
                      aria-label="Reset Graph"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="sr-only">Reset</span>
                    </button>
                  </div>
                </div>
                {/* Chart/Table Toggle */}
                {!showTable ? (
                  <>
                    <HighchartsTelemetry data={data} />
                    <button
                      className="mt-2 px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs"
                      onClick={() => setShowTable(true)}
                    >
                      View Data Table
                    </button>
                  </>
                ) : (
                  <div
                    className="overflow-x-auto mt-2 table-data-lightblue cursor-pointer"
                    onClick={() => setShowTable(false)}
                    title="Click anywhere on the table to return to the chart"
                  >
                    <style>{`
                      .telemetry-table th, .telemetry-table td {
                        padding: 8px 16px;
                        text-align: center;
                        min-width: 120px;
                        max-width: 180px;
                      }
                      .telemetry-table th {
                        background: #1976d2;
                        color: #fff;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                      }
                      .telemetry-table tr:nth-child(even) td {
                        background: #f3f7fa;
                      }
                      .telemetry-table tr:nth-child(odd) td {
                        background: #fff;
                      }
                      .telemetry-table tr:hover td {
                        background: #e3f0fd;
                      }
                      .telemetry-table {
                        border-collapse: separate;
                        border-spacing: 0;
                        width: 100%;
                        font-size: 13px;
                        background: #fff;
                        color: #1976d2 !important;
                        border-radius: 8px;
                        overflow: auto;
                        box-shadow: 0 2px 8px #0001;
                        table-layout: auto;
                      }
                      .telemetry-table th, .telemetry-table td {
                        border: 1px solid #b6c6e6;
                      }
                    `}</style>
                    <table className="telemetry-table">
                      <thead>
                        <tr>
                          <th>Date+Time</th>
                          <th>T1 (kW)</th>
                          <th>T2 (kW)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, i) => (
                          <tr key={i}>
                            <td>{row.time}</td>
                            <td>{row.T1}</td>
                            <td>{row.T2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {/* Show Confirm Button if not confirmed and not showing graph */}
            {!confirm && !showGraph && (
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 mt-2 text-xs"
                onClick={handleConfirm}
              >
                Confirm Selection
              </button>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 dark:text-gray-500 text-sm py-3 bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-700 mt-auto backdrop-blur rounded-t-2xl w-full">
        &copy; {new Date().getFullYear()} GRID-INDIA (POSOCO). All rights reserved.
      </footer>
    </div>
  );
}
