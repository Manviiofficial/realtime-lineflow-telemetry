import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import welcomeLogo from "../assets/welcome logo.png";
import HighchartsSystemLoad from "../components/HighchartsSystemLoad";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// Disable Highcharts context menu by setting exporting.enabled: false
// import TelemetrySection from "../components/TelemetrySection";
import Select from "react-select";
import "../styles/components.css";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "User";
  const user = { name: username, avatar: welcomeLogo };
  const [activeTab, setActiveTab] = useState("overview");
  const [activeNavbar, setActiveNavbar] = useState("dashboard");

  // Line selection state
  const lineOptions = [
    { value: '', label: 'Select Line' },
    ...Array.from({ length: 100 }, (_, i) => ({
      value: `LINE-${i + 1}`,
      label: `Line ${i + 1}`,
    }))
  ];
  const [selectedLine, setSelectedLine] = useState({ value: '', label: 'Select Line' });

  // Live stats and chart data
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [telemetryData, setTelemetryData] = useState([]);
  // Add state for showing/hiding the custom data table and pagination
  const [showDataTable, setShowDataTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8; // Adjust as needed for your screen size

  // Generate deterministic mock data for each line
  function getMockLineData(idx) {
    // Use idx to generate unique but consistent data for each line
    return {
      stats: [
        {
          title: "Total System Load",
          value: (2000 + idx * 10 + (idx * 7) % 1000).toLocaleString() + " MW",
          trend: (idx % 2 === 0 ? "↑ " : "↓ ") + ((idx * 3.1) % 10).toFixed(1) + "% from yesterday",
          trendType: idx % 2 === 0 ? "up" : "down",
        },
        {
          title: "Average Frequency",
          value: (49.8 + (idx * 0.03) % 0.6).toFixed(2) + " Hz",
          trend: "↗ Within norms",
          trendType: "stable",
        },
        {
          title: "Peak Demand",
          value: (2200 + idx * 10 + (idx * 13) % 500).toLocaleString() + " MW",
          trend: (idx % 2 === 1 ? "↑ " : "↓ ") + ((idx * 2.7) % 10).toFixed(1) + "% from peak",
          trendType: idx % 2 === 1 ? "up" : "down",
        },
        {
          title: "Active Alerts",
          value: (idx % 7).toString(),
          trend: idx % 3 === 0 ? "↓ " + (idx % 4) + " resolved" : "No active alerts",
          trendType: idx % 3 === 0 ? "down" : "stable",
        },
      ],
      chartData: Array.from({ length: 24 }, (_, i) => {
        const hour = (i < 10 ? "0" : "") + i + ":00";
        return {
          hour,
          load: 800 + idx * 5 + (i * idx) % 100,
        };
      }),
      telemetryData: [
        { label: "location", value: `Lat: ${(20 + idx * 0.5).toFixed(2)}, Lon: ${(75 + idx * 0.7).toFixed(2)}` },
        { label: "lineLength", value: `${(100 + idx * 1.2).toFixed(1)} km` },
        { label: "lineType", value: ["HVAC", "HVDC"][idx % 2] },
        { label: "region", value: ["North", "South", "East", "West", "Central"][idx % 5] },
        { label: "Voltage", value: (220 + (idx % 10) + (idx * 2) % 10) + " kV" },
        { label: "Current", value: (100 + (idx * 3) % 50).toString() + " A" },
        { label: "Power", value: (1000 + idx * 10 + (idx * 8) % 800).toLocaleString() + " MW" },
        { label: "Frequency", value: (49.8 + (idx * 0.04) % 0.4).toFixed(2) + " Hz" },
        { label: "Alerts", value: (idx % 7).toString() },
        // Metrics
        { label: "efficiency", value: (90 + (idx * 0.7) % 8).toFixed(2) + " %" },
        { label: "energyTransferred", value: (100000 + (idx * 1234) % 50000).toLocaleString() + " kWh" },
        { label: "losses", value: ((idx * 1.7) % 50).toFixed(2) + " MW" },
        { label: "uptime", value: (95 + (idx * 0.9) % 5).toFixed(2) + " %" },
        // Monitoring Fields
        { label: "alertStatus", value: ["None", "High Voltage", "Overload", "Fault"][idx % 4] },
        { label: "lastAlertTime", value: new Date(Date.now() - (idx * 1234567) % 86400000).toLocaleString() },
        { label: "faultDetected", value: idx % 7 === 0 ? "Yes" : "No" },
        { label: "temperature", value: (30 + (idx * 1.1) % 15).toFixed(1) + " °C" },
        { label: "vibrationLevel", value: ((idx * 0.9) % 10).toFixed(2) + " mm/s" },
      ],
    };
  }

  useEffect(() => {
    // When a line is selected, update all data to match that line
    let idx = selectedLine.value ? parseInt(selectedLine.value.split("-")[1], 10) : 0;
    const mock = getMockLineData(idx);
    setStats(mock.stats);
    setChartData(mock.chartData);
    setTelemetryData(mock.telemetryData);
  }, [selectedLine]);

  const telemetryFilters = [
    "Core Electrical Fields",
    {
      label: "Line Metadata",
      suboptions: ["location", "lineLength", "lineType", "region"],
    },
    "Monitoring Fields",
    { label: "📊 Metrics", suboptions: ["efficiency", "energyTransferred", "losses", "uptime"] },
  ];
  const [selectedFilter, setSelectedFilter] = useState("Core Electrical Fields");
  const [selectedLocationSub, setSelectedLocationSub] = useState("location");

  // Mock line summary data
  function getLineSummary(line) {
    // Replace with backend data as needed
    const idx = parseInt(line.value.split("-")[1], 10);
    return {
      operationalStatus: idx % 2 === 0 ? "Operational" : "Maintenance",
      powerUsage: 1000 + idx * 10 + Math.round(Math.random() * 100),
      voltage: 220 + (idx % 10),
      frequency: (49.8 + Math.random() * 0.4).toFixed(2),
      alerts: idx % 5,
    };
  }
  const lineSummary = getLineSummary(selectedLine);

  // Chart data for yesterday's power usage for selected line
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    // Only update if a valid line is selected
    if (!selectedLine.value) {
      setLineChartData([]);
      return;
    }
    const idx = parseInt(selectedLine.value.split("-")[1], 10);
    // Simulate 24 hours of yesterday's power usage for the selected line
    const data = Array.from({ length: 24 }, (_, i) => {
      const hour = (i < 10 ? "0" : "") + i + ":00";
      return {
        hour,
        usage: 800 + idx * 5 + Math.round(Math.random() * 100),
      };
    });
    setLineChartData(data);
  }, [selectedLine]);

  // Synchronize navbar with tab
  useEffect(() => {
    if (activeTab === "telemetry") {
      setActiveNavbar("single-line");
    } else if (activeTab === "overview") {
      setActiveNavbar("dashboard");
    }
    // Add more cases if you have more tabs/routes
  }, [activeTab]);

  React.useEffect(() => {
    // Check for ?tab=telemetry in URL
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "telemetry") {
      setActiveTab("telemetry");
    }
  }, [location.search]);

  return (
    <div
      className="flex flex-col relative transition-colors duration-500 bg-gradient-to-br from-blue-50 to-white"
      style={{
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Header: user info (left), navbar + logout (right) */}
      <header className="flex flex-row items-center justify-between px-4 py-2 bg-white/70 shadow-md z-10 backdrop-blur border-b border-gray-200 w-full gap-2 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-12 w-12 rounded-full border-4 border-blue-300 bg-white shadow-lg shrink-0"
            style={{
              boxShadow: "0 6px 24px #b6c6e6, 0 2px 8px #0002",
            }}
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
            if (key === "dashboard") {
              setActiveTab("overview");
              navigate("/dashboard"); // Ensure navigation to dashboard route
            } else if (key === "single-line") {
              setActiveTab("telemetry");
              navigate("/home"); // Ensure navigation to single-line route
            }
            // Optionally, handle other navbar keys if needed
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
      {/* Line selection controls (below navbar) */}
      <div className="flex flex-row justify-between items-center w-full px-6 py-3 bg-transparent">
        <div className="w-1/2 flex justify-start">
          <div className="px-6 py-3 rounded-xl bg-blue-50 text-blue-900 font-bold shadow-md border border-blue-200 text-left w-full mr-4 transition-all duration-200">
            {selectedLine.value ? `Selected Line: ${selectedLine.label}` : 'Selected Line: None'}
          </div>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="w-full">
            <Select
              options={lineOptions}
              value={selectedLine.value ? selectedLine : null}
              onChange={setSelectedLine}
              className="text-sm w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 48,
                  borderRadius: 16,
                  boxShadow: '0 2px 8px #b6c6e6',
                  borderColor: '#b6c6e6',
                  paddingLeft: 8,
                  paddingRight: 8,
                  color: 'black',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: 16,
                  boxShadow: '0 6px 24px #b6c6e6',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'black',
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  backgroundColor: state.isSelected ? '#e0e7ff' : base.backgroundColor,
                }),
                input: (base) => ({
                  ...base,
                  color: 'black',
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'black',
                }),
              }}
              placeholder="Select Line..."
            />
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <nav className="nav-tabs flex justify-center gap-2 md:gap-4 mt-2">
        {/* Removed Telemetry tab button */}
      </nav>
      {/* Main dashboard area */}
      <main className="flex-1 flex flex-col items-center w-full h-full overflow-auto px-2 md:px-4 py-2">
        {/* Overview Section */}
        <section
          id="overviewSection"
          className={`dashboard-section active`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Line summary grid and chart side by side */}
          <div className="w-full flex flex-col lg:flex-row mb-6 h-96">
            <div className="stats-grid-2x2 w-full lg:w-1/3 h-full p-4">
              <div className="stat-card info-card">
                <div className="info-item accent text-lg font-bold">⚡ {lineSummary.powerUsage} MW</div>
                <div className="info-item">Power Usage</div>
                <div className="info-item text-sm text-blue-600">Yesterday</div>
              </div>
              <div className="stat-card info-card">
                <div className="info-item accent text-lg font-bold">🔋 {lineSummary.voltage} kV</div>
                <div className="info-item">Voltage</div>
                <div className="info-item text-sm text-blue-600">Current</div>
              </div>
              <div className="stat-card info-card">
                <div className="info-item accent text-lg font-bold">⏲️ {selectedLine.value ? `${lineSummary.frequency} Hz` : 'None'}</div>
                <div className="info-item">Frequency</div>
                <div className="info-item text-sm text-blue-600">Current</div>
              </div>
              <div className="stat-card info-card">
                <div className="info-item accent text-lg font-bold">🧰 {lineSummary.operationalStatus}</div>
                <div className="info-item">Maintenance</div>
                <div className="info-item text-sm text-blue-600">Alerts: {lineSummary.alerts}</div>
              </div>
            </div>
            {/* Line power usage chart */}
            <div className="w-full lg:w-2/3 h-full p-4 flex flex-col justify-center items-center">
              <div className="chart-container-equal w-full h-full flex flex-col items-center" style={{ width: '100%' }}>
                <div className="chart-title">Yesterday's Power Usage ({selectedLine.value ? selectedLine.label : 'None'})</div>
                <div className="chart-wrapper h-full flex items-center justify-center" style={{ width: '100%', maxWidth: '100%' }}>
                  {selectedLine.value && lineChartData && lineChartData.length > 0 ? (
                    <>
                      <div className="w-full flex-1" style={{ minHeight: 0, minWidth: 0, height: '180px', maxHeight: '180px', width: '100%', maxWidth: '100%' }}>
                        <HighchartsReact
                          key={selectedLine.value || 'no-line'}
                          highcharts={Highcharts}
                          containerProps={{ style: { width: '100%', height: '100%' } }}
                          options={{
                            chart: { type: 'line', height: 180, width: null, backgroundColor: '#f8fafc', style: { borderRadius: 12 } },
                            title: { text: null },
                            xAxis: {
                              categories: lineChartData.map(d => d.hour),
                              title: { text: 'Hour' },
                              labels: { style: { color: '#1976d2', fontWeight: 600 } },
                              tickInterval: 2,
                            },
                            yAxis: {
                              title: { text: 'Power Usage (MW)' },
                              labels: { style: { color: '#1976d2', fontWeight: 600 } },
                              gridLineColor: '#e0e7ef',
                            },
                            series: [{
                              name: selectedLine.label,
                              data: lineChartData.map(d => d.usage),
                              color: '#1976d2',
                              marker: { enabled: true, radius: 3 },
                            }],
                            credits: { enabled: false },
                            legend: { enabled: false },
                            tooltip: { valueSuffix: ' MW' },
                            plotOptions: {
                              line: { dataLabels: { enabled: false }, enableMouseTracking: true },
                            },
                            responsive: {
                              rules: [{
                                condition: { maxWidth: 700 },
                                chartOptions: { chart: { height: 180 } },
                              }],
                            },
                            exporting: { enabled: false, menuItemDefinitions: {}, buttons: { contextButton: { enabled: false } } },
                            navigation: { buttonOptions: { enabled: false } },
                          }}
                        />
                      </div>
                      {/* Show Data Table button removed as requested */}
                      {showDataTable && (
                        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <table className="custom-data-table" style={{ color: '#1976d2', width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #b6c6e6', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <thead>
                              <tr>
                                <th style={{ background: '#e3edfa', fontWeight: 'bold', border: '1px solid #e0e7ef', padding: '6px 12px' }}>Hour</th>
                                <th style={{ background: '#e3edfa', fontWeight: 'bold', border: '1px solid #e0e7ef', padding: '6px 12px' }}>Power Usage (MW)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lineChartData.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage).map((row, idx) => (
                                <tr key={idx}>
                                  <td style={{ border: '1px solid #e0e7ef', padding: '6px 12px', textAlign: 'center' }}>{row.hour}</td>
                                  <td style={{ border: '1px solid #e0e7ef', padding: '6px 12px', textAlign: 'center' }}>{row.usage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* Pagination Controls */}
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              style={{ marginRight: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid #b6c6e6', background: currentPage === 1 ? '#e0e7ef' : '#f8fafc', color: '#1976d2', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                              Prev
                            </button>
                            <span style={{ fontWeight: 'bold', color: '#1976d2', margin: '0 8px' }}>
                              Page {currentPage} / {Math.ceil(lineChartData.length / rowsPerPage)}
                            </span>
                            <button
                              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(lineChartData.length / rowsPerPage), p + 1))}
                              disabled={currentPage === Math.ceil(lineChartData.length / rowsPerPage)}
                              style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid #b6c6e6', background: currentPage === Math.ceil(lineChartData.length / rowsPerPage) ? '#e0e7ef' : '#f8fafc', color: '#1976d2', cursor: currentPage === Math.ceil(lineChartData.length / rowsPerPage) ? 'not-allowed' : 'pointer' }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 text-center py-12">No data to display. Select a line to view yesterday's power usage.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Telemetry Preview full width */}
          <div className="w-full mb-6">
            <div className="flex gap-2 mb-3 justify-center flex-wrap">
              {telemetryFilters.map((f) => {
                if (typeof f === "string") {
                  let label = f;
                  let icon = null;
                  if (f === "Core Electrical Fields") icon = "🔌 ";
                  if (f === "Monitoring Fields") icon = "⚠️ ";
                  return (
                    <button
                      key={f}
                      className={`telemetry-filter px-3 py-1 rounded-lg font-semibold border ${selectedFilter === f ? "bg-blue-100 text-blue-800 border-blue-400" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"} transition`}
                      onClick={() => setSelectedFilter(f)}
                    >
                      {icon}{label}
                    </button>
                  );
                } else if (typeof f === "object" && f.label === "Line Metadata") {
                  return (
                    <button
                      key="Line Metadata"
                      className={`telemetry-filter px-3 py-1 rounded-lg font-semibold border ${selectedFilter === "Line Metadata" ? "bg-blue-100 text-blue-800 border-blue-400" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"} transition`}
                      onClick={() => setSelectedFilter("Line Metadata")}
                    >
                      📍Line Metadata
                    </button>
                  );
                } else if (typeof f === "object" && f.label === "📊 Metrics") {
                  return (
                    <button
                      key="📊 Metrics"
                      className={`telemetry-filter px-3 py-1 rounded-lg font-semibold border ${selectedFilter === "📊 Metrics" ? "bg-blue-100 text-blue-800 border-blue-400" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"} transition`}
                      onClick={() => setSelectedFilter("📊 Metrics")}
                    >
                      📊 Metrics
                    </button>
                  );
                }
                return null;
              })}
            </div>
            <div className="telemetry-grid grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
              {(() => {
                if (selectedFilter === "Core Electrical Fields") {
                  const cardSpecs = [
                    { label: "Voltage", title: "Line voltage" },
                    { label: "Current", title: "Current flow" },
                    { label: "Power", title: "Real power" },
                    { label: "Frequency", title: "Operating frequency" },
                  ];
                  return cardSpecs.map((spec) => {
                    let value = "None";
                    if (selectedLine.value) {
                      const d = telemetryData.find((item) => String(item.label).toLowerCase() === spec.label.toLowerCase());
                      if (d) value = d.value;
                    }
                    return (
                      <div className="telemetry-card info-card" key={spec.label}>
                        <div className="info-item font-bold">{spec.title}</div>
                        <div className="info-item accent text-lg">{value}</div>
                      </div>
                    );
                  });
                } else if (selectedFilter === "Line Metadata") {
                  return ["location", "lineLength", "lineType", "region"].map((sub) => {
                    let value = "None";
                    if (selectedLine.value) {
                      const d = telemetryData.find((d) => d.label === sub);
                      if (d) value = d.value;
                    }
                    return (
                      <div className="telemetry-card info-card" key={sub}>
                        <div className="info-item font-bold">{sub.charAt(0).toUpperCase() + sub.slice(1)}</div>
                        <div className="info-item accent text-lg">{value}</div>
                      </div>
                    );
                  });
                } else if (selectedFilter === "Monitoring Fields") {
                  const monitoringFields = [
                    { label: "alertStatus", title: "Status" },
                    { label: "faultDetected", title: "Fault Detected" },
                    { label: "temperature", title: "Temperature" },
                    { label: "vibrationLevel", title: "Vibration Level" },
                  ];
                  return monitoringFields.map((field, i) => {
                    let value = "None";
                    if (selectedLine.value) {
                      const d = telemetryData.find((item) => String(item.label).toLowerCase() === String(field.label).toLowerCase());
                      if (d) value = d.value;
                    }
                    return (
                      <div className="telemetry-card info-card" key={field.label}>
                        <div className="info-item font-bold">{field.title}</div>
                        <div className="info-item accent text-lg">{value}</div>
                      </div>
                    );
                  });
                } else if (selectedFilter === "📊 Metrics") {
                  const metrics = [
                    { label: "efficiency", title: "Efficiency" },
                    { label: "energyTransferred", title: "Energy Transferred" },
                    { label: "losses", title: "Losses" },
                    { label: "uptime", title: "Uptime" },
                  ];
                  return metrics.map((metric) => {
                    let value = "None";
                    if (selectedLine.value) {
                      const d = telemetryData.find((item) => String(item.label).toLowerCase() === metric.label.toLowerCase());
                      if (d) value = d.value;
                    }
                    return (
                      <div className="telemetry-card info-card" key={metric.label}>
                        <div className="info-item font-bold">{metric.title}</div>
                        <div className="info-item accent text-lg">{value}</div>
                      </div>
                    );
                  });
                } else {
                  let value = "None";
                  if (selectedLine.value) {
                    const d = telemetryData.find((d) => d.label === selectedFilter);
                    if (d) value = d.value;
                  }
                  return (
                    <div className="telemetry-card info-card">
                      <div className="info-item font-bold">{selectedFilter}</div>
                      <div className="info-item accent text-lg">{value}</div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center text-gray-400 dark:text-gray-500 text-sm py-3 bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-700 mt-auto backdrop-blur rounded-t-2xl w-full">
        &copy; {new Date().getFullYear()} GRID-INDIA (POSOCO). All rights
        reserved.
      </footer>
    </div>
  );
}
