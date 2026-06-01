import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import welcomeLogo from "../assets/welcome logo.png";
import "../styles/components.css";


// Mock data for 100 lines with all details from HomePage.jsx
const generateLines = () =>
  Array.from({ length: 100 }, (_, i) => ({
    line: `Line ${i + 1}`,
    voltage: 220 + (i % 10),
    power: 1000 + i * 10 + Math.round(Math.random() * 100),
    frequency: (49.8 + Math.random() * 0.4).toFixed(2),
    alerts: i % 5,
    status: i % 2 === 0 ? "Operational" : "Maintenance",
    // Extra fields from HomePage.jsx telemetryData
    location: `Lat: ${(20 + i * 0.5).toFixed(2)}, Lon: ${(75 + i * 0.7).toFixed(2)}`,
    lineLength: `${(100 + i * 1.2).toFixed(1)} km`,
    lineType: ["HVAC", "HVDC"][i % 2],
    region: ["North", "South", "East", "West", "Central"][i % 5],
    current: (100 + (i * 3) % 50).toString() + " A",
    efficiency: (90 + (i * 0.7) % 8).toFixed(2) + " %",
    energyTransferred: (100000 + (i * 1234) % 50000).toLocaleString() + " kWh",
    losses: ((i * 1.7) % 50).toFixed(2) + " MW",
    uptime: (95 + (i * 0.9) % 5).toFixed(2) + " %",
    alertStatus: ["None", "High Voltage", "Overload", "Fault"][i % 4],
    lastAlertTime: new Date(Date.now() - (i * 1234567) % 86400000).toLocaleString(),
    faultDetected: i % 7 === 0 ? "Yes" : "No",
    temperature: (30 + (i * 1.1) % 15).toFixed(1) + " °C",
    vibrationLevel: ((i * 0.9) % 10).toFixed(2) + " mm/s",
  }));

const allLines = generateLines();

const columns = [
  { key: "line", label: "Line" },
  { key: "voltage", label: "Voltage (kV)" },
  { key: "power", label: "Power (MW)" },
  { key: "frequency", label: "Frequency (Hz)" },
  { key: "alerts", label: "Alerts" },
  { key: "status", label: "Status" },
  // Extra fields from HomePage.jsx telemetryData
  { key: "location", label: "Location" },
  { key: "lineLength", label: "Line Length" },
  { key: "lineType", label: "Line Type" },
  { key: "region", label: "Region" },
  { key: "current", label: "Current" },
  { key: "efficiency", label: "Efficiency" },
  { key: "energyTransferred", label: "Energy Transferred" },
  { key: "losses", label: "Losses" },
  { key: "uptime", label: "Uptime" },
  { key: "alertStatus", label: "Alert Status" },
  { key: "lastAlertTime", label: "Last Alert Time" },
  { key: "faultDetected", label: "Fault Detected" },
  { key: "temperature", label: "Temperature" },
  { key: "vibrationLevel", label: "Vibration Level" },
];


export default function DetailsPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const user = { name: username, avatar: welcomeLogo };
  const [activeNavbar, setActiveNavbar] = useState("details");
  const [search, setSearch] = useState("");
  // Remove sortKey and sortDir, always sort by line number
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterLineType, setFilterLineType] = useState("");
  const [alertsFilter, setAlertsFilter] = useState("");
  const [alertStatusFilter, setAlertStatusFilter] = useState("");
  const [faultDetectedFilter, setFaultDetectedFilter] = useState("");
  const [voltageFilter, setVoltageFilter] = useState("");
  const pageSize = 4;

  // Filtering, searching, sorting
  const filtered = useMemo(() => {
    let data = allLines;
    if (search) {
      const searchStr = search.toLowerCase();
      if (searchStr.length > 0) {
        data = data.filter((row) => {
          return Object.entries(row).some(([key, v]) => {
            let valStr = String(v).replace(/,/g, '').toLowerCase();
            // Special handling for 'line' column: match on digits only
            if (key === 'line') {
              const digits = valStr.replace(/\D/g, '');
              const searchDigits = searchStr.replace(/\D/g, '');
              if (searchDigits && !isNaN(Number(searchDigits))) {
                return digits.includes(searchDigits);
              }
            }
            return valStr.includes(searchStr);
          });
        });
      }
    }
    if (filterStatus) {
      data = data.filter((row) => row.status === filterStatus);
    }
    if (filterRegion) {
      data = data.filter((row) => row.region === filterRegion);
    }
    if (filterLineType) {
      data = data.filter((row) => row.lineType === filterLineType);
    }
    if (voltageFilter !== "") {
      data = data.filter((row) => String(row.voltage) === voltageFilter);
    }
    if (alertsFilter !== "") {
      data = data.filter((row) => String(row.alerts) === alertsFilter);
    }
    if (alertStatusFilter !== "") {
      data = data.filter((row) => row.alertStatus === alertStatusFilter);
    }
    if (faultDetectedFilter !== "") {
      data = data.filter((row) => row.faultDetected === faultDetectedFilter);
    }
    // Always sort by line number for pagination
    data = [...data].sort((a, b) => {
      const numA = parseInt(a.line.replace(/\D/g, ""), 10);
      const numB = parseInt(b.line.replace(/\D/g, ""), 10);
      return numA - numB;
    });
    return data;
  }, [search, filterStatus, filterRegion, filterLineType, voltageFilter, alertsFilter, alertStatusFilter, faultDetectedFilter]);
            <select
              value={voltageFilter}
              onChange={e => {
                setVoltageFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900"
            >
              <option value="">All Voltages</option>
              {Array.from(new Set(allLines.map(l => l.voltage))).sort((a, b) => a - b).map(voltage => (
                <option key={voltage} value={voltage}>{voltage}</option>
              ))}
            </select>

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    // Sorting is disabled for all columns
    return;
  };

  return (
    <div className="flex flex-col relative transition-colors duration-500 bg-gradient-to-br from-blue-50 to-white" style={{ width: "100vw", height: "100vh", minWidth: "100vw", minHeight: "100vh", maxWidth: "100vw", maxHeight: "100vh", overflow: "hidden" }}>
      {/* Header: user info (left), navbar + logout (right) */}
      <header className="flex flex-row items-center justify-between px-4 py-2 bg-white/70 shadow-md z-10 backdrop-blur border-b border-gray-200 w-full gap-2 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-12 w-12 rounded-full border-4 border-blue-300 bg-white shadow-lg shrink-0"
            style={{ boxShadow: "0 6px 24px #b6c6e6, 0 2px 8px #0002" }}
          />
          <div className="truncate">
            <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 drop-shadow truncate">
              Welcome, {user.name}!
            </h1>
            <p className="text-sm text-gray-500 font-medium truncate">
              GRID-INDIA Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Navbar active={activeNavbar} setActive={(key) => {
            setActiveNavbar(key);
            if (key === "dashboard") navigate("/dashboard");
            else if (key === "single-line") navigate("/home");
            else if (key === "multi-line") navigate("/multi-line");
            else if (key === "details") navigate("/details");
          }} />
          <button
            className="ml-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition text-sm md:text-base"
            onClick={() => navigate("/login")}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center w-full h-full px-0 md:px-0 py-2" style={{overflow: 'hidden'}}>
        <section className="details-page p-4 w-full text-blue-900" style={{height: '100%'}}>
          <h2 className="text-2xl font-bold mb-4">Details of Lines</h2>
          <div className="flex flex-wrap gap-2 mb-4 items-center w-full">
            <input
              type="text"
              placeholder="Search (multi-term, all columns)..."
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setPage(1);
                if (val === "") {
                  setSortKey("line");
                  setSortDir("asc");
                }
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 placeholder-gray-400 flex-grow"
              style={{ minWidth: 120 }}
            />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Status</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={filterRegion}
              onChange={(e) => {
                setFilterRegion(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Regions</option>
              {Array.from(new Set(allLines.map(l => l.region))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={filterLineType}
              onChange={(e) => {
                setFilterLineType(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Line Types</option>
              {Array.from(new Set(allLines.map(l => l.lineType))).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={alertsFilter}
              onChange={e => {
                setAlertsFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Alerts</option>
              {Array.from(new Set(allLines.map(l => l.alerts))).sort((a, b) => a - b).map(alert => (
                <option key={alert} value={alert}>{alert}</option>
              ))}
            </select>
            <select
              value={voltageFilter}
              onChange={e => {
                setVoltageFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Voltages</option>
              {Array.from(new Set(allLines.map(l => l.voltage))).sort((a, b) => a - b).map(voltage => (
                <option key={voltage} value={voltage}>{voltage}</option>
              ))}
            </select>
            <select
              value={alertStatusFilter}
              onChange={e => {
                setAlertStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Alert Status</option>
              {Array.from(new Set(allLines.map(l => l.alertStatus))).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={faultDetectedFilter}
              onChange={e => {
                setFaultDetectedFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120 }}
            >
              <option value="">All Fault Detected</option>
              {Array.from(new Set(allLines.map(l => l.faultDetected))).map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            {/* Page filter box to jump to any page */}
            <select
              value={page}
              onChange={e => setPage(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm shadow text-blue-900 flex-grow"
              style={{ minWidth: 120, maxWidth: 160 }}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>Page {i + 1}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg shadow w-full flex" style={{height: 'calc(100vh - 290px)', minHeight: 200, background: '#fff', overflow: 'hidden'}}>
            <table className="w-full bg-white border border-gray-200 text-gray-700" style={{tableLayout: 'fixed', width: '100%'}}>
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  {columns.map((col) => (
                    col.key === "line"
                      ? (
                          <th
                            key={col.key}
                            className="px-2 py-2 border-b font-semibold bg-blue-200 text-blue-900 shadow text-xs md:text-sm"
                            style={{wordBreak: 'break-word', whiteSpace: 'normal'}}
                          >
                            {col.label}
                          </th>
                        )
                      : (
                          <th
                            key={col.key}
                            className="px-2 py-2 border-b font-semibold bg-blue-50 text-blue-900 text-xs md:text-sm"
                            style={{wordBreak: 'break-word', whiteSpace: 'normal'}}
                          >
                            {col.label}
                          </th>
                        )
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  paged.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      {columns.map((col) => (
                        <td key={col.key} className="px-2 py-2 border-b text-center text-xs md:text-sm" style={{wordBreak: 'break-word', whiteSpace: 'normal'}}>
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 mb-8">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded border bg-blue-100 text-blue-800 font-semibold disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 rounded border bg-blue-100 text-blue-800 font-semibold disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center text-gray-400 dark:text-gray-500 text-sm py-3 bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-700 mt-auto backdrop-blur rounded-t-2xl w-full">
        &copy; {new Date().getFullYear()} GRID-INDIA (POSOCO). All rights reserved.
      </footer>
    </div>
  );
}
