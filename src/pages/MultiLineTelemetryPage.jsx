import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsFullScreen from "highcharts/modules/full-screen";
import mockTelemetry from "../data/mockTelemetry";
import welcomeLogo from "../assets/welcome logo.png";
import { useNavigate } from "react-router-dom";

// Robust Highcharts module initialization for ESM/CJS compatibility
if (typeof HighchartsExporting === "function") HighchartsExporting(Highcharts);
else if (HighchartsExporting && typeof HighchartsExporting.default === "function") HighchartsExporting.default(Highcharts);

if (typeof HighchartsExportData === "function") HighchartsExportData(Highcharts);
else if (HighchartsExportData && typeof HighchartsExportData.default === "function") HighchartsExportData.default(Highcharts);

if (typeof HighchartsAccessibility === "function") HighchartsAccessibility(Highcharts);
else if (HighchartsAccessibility && typeof HighchartsAccessibility.default === "function") HighchartsAccessibility.default(Highcharts);

if (typeof HighchartsFullScreen === "function") HighchartsFullScreen(Highcharts);
else if (HighchartsFullScreen && typeof HighchartsFullScreen.default === "function") HighchartsFullScreen.default(Highcharts);

// Use the same line options style as TelemetrySection
const lineOptions = Array.from({ length: 100 }, (_, i) => ({
  value: `LINE-${i + 1}`,
  label: `LINE-${i + 1}`,
}));

export default function MultiLineTelemetryPage() {
  // State initialized as empty (no persistence)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [lines, setLines] = useState([]);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState([]);
  const [activeNavbar, setActiveNavbar] = useState("multi-line");
  const [showT1Table, setShowT1Table] = useState(false);
  const [showT2Table, setShowT2Table] = useState(false);
  const navigate = useNavigate();

  // Generate and combine data for all selected lines
  useEffect(() => {
    if (showGraph && fromDate && toDate && lines.length > 0) {
      let combined = [];
      lines.forEach((line) => {
        const lineData = mockTelemetry(fromDate, toDate, line.value).map((d) => ({
          ...d,
          line: line.value,
        }));
        combined = combined.concat(lineData);
      });
      setData(combined);
    }
  }, [fromDate, toDate, lines, showGraph]);



  // Get unique sorted time categories
  const categories = Array.from(new Set(data.map((d) => d.time))).sort();

  // Prepare series for T1 and T2 (for individual charts)
  const getSeries = (type) =>
    lines.map((line) => ({
      name: line.label,
      data: categories.map((time) => {
        const found = data.find((d) => d.line === line.value && d.time === time);
        // Use T1 and T2 from mockTelemetry, fallback to 0 if missing
        return found ? (type === "T1" ? (found.T1 ?? 0) : (found.T2 ?? 0)) : 0;
      }),
    }));

  // Prepare combined series for both T1 and T2 for all lines (for the data table)
  const getCombinedSeries = () => {
    const t1Series = lines.map((line) => ({
      name: `${line.label} T1`,
      data: categories.map((time) => {
        const found = data.find((d) => d.line === line.value && d.time === time);
        return found ? (found.T1 ?? 0) : 0;
      }),
    }));
    const t2Series = lines.map((line) => ({
      name: `${line.label} T2`,
      data: categories.map((time) => {
        const found = data.find((d) => d.line === line.value && d.time === time);
        return found ? (found.T2 ?? 0) : 0;
      }),
    }));
    return [...t1Series, ...t2Series];
  };

  // Custom table renderer for T1 or T2 only
  function singleTypeTableCustom(type) {
    const series = getSeries(type);
    // 1 for Date+Time, rest for each line
    const colCount = 1 + series.length;
    // Each column min 120px, max 180px
    const minWidth = Math.max(400, colCount * 120);
    let html = `<style>
      .highcharts-data-table, .highcharts-data-table * {
        color: #1976d2 !important;
        font-family: inherit !important;
      }
      .highcharts-data-table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
        width: 100% !important;
        margin: 12px 0 !important;
        font-size: 13px !important;
        background: #fff !important;
        border-radius: 8px !important;
        overflow-x: auto !important;
        overflow-y: auto !important;
        box-shadow: 0 2px 8px #0001 !important;
        table-layout: auto !important;
        display: block !important;
        max-width: 100%;
        max-height: 400px;
        min-width: ${minWidth}px !important;
      }
      .highcharts-data-table th, .highcharts-data-table td {
        border: 1px solid #b6c6e6 !important;
        padding: 10px 16px !important;
        text-align: center !important;
        min-width: 120px !important;
        max-width: 180px !important;
        vertical-align: middle !important;
      }
      .highcharts-data-table th {
        background: #1976d2 !important;
        color: #fff !important;
        font-weight: 700 !important;
        letter-spacing: 0.5px !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 2 !important;
      }
      .highcharts-data-table tr:nth-child(even) td {
        background: #f3f7fa !important;
      }
      .highcharts-data-table tr:nth-child(odd) td {
        background: #fff !important;
      }
      .highcharts-data-table tr:hover td {
        background: #e3f0fd !important;
      }
      .highcharts-data-table thead {
        box-shadow: 0 2px 4px #0001 !important;
      }
      .highcharts-data-table tbody tr:last-child td {
        border-bottom: 2px solid #1976d2 !important;
      }
      @media (max-width: 700px) {
        .highcharts-data-table th, .highcharts-data-table td {
          font-size: 11px !important;
          padding: 6px 4px !important;
        }
      }
    </style>`;
    html += `<div style="overflow-x:auto; width:100%"><table class="highcharts-data-table" style="min-width:${minWidth}px"><thead><tr>`;
    html += '<th>Date+Time</th>';
    series.forEach((s) => {
      html += `<th>${s.name}</th>`;
    });
    html += '</tr></thead><tbody>';
    categories.forEach((cat, i) => {
      html += `<tr><td>${cat}</td>`;
      series.forEach((s) => {
        html += `<td>${s.data[i]}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  // Chart options for T1 and T2, with custom data table
  const chartOptions = (type, title) => ({
    chart: {
      type: "line",
      height: 320,
      zoomType: "x",
      panning: true,
      panKey: "shift",
    },
    title: { text: title },
    xAxis: {
      categories,
      title: { text: "Date+Time" },
      crosshair: true,
      labels: { rotation: 0 }, // Make X-axis labels straight
    },
    yAxis: { title: { text: type + " Value" } },
    series: getSeries(type),
    credits: { enabled: false },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueSuffix: " kW",
    },
    legend: { enabled: true },
    accessibility: { enabled: true },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "downloadCSV",
            "downloadXLS",
            "separator",
            "printChart",
          ],
        },
      },
    },
    navigation: { buttonOptions: { enabled: true } },
    plotOptions: {
      series: {
        allowPointSelect: true,
        showInLegend: true,
        animation: true,
      },
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: { legend: { enabled: false } },
        },
      ],
    },
    exportData: {
      tableCustom: () => singleTypeTableCustom(type),
    },
  });

  // Validate date range and selection
  function handleConfirm() {
    if (!fromDate || !toDate || lines.length === 0) {
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
    setConfirm(false);
  }

  function handleReset() {
    // Do not clear fromDate, toDate, or lines (preserve them in the UI)
    setError("");
    setConfirm(false);
    setShowGraph(false);
    setData([]);
    setShowT1Table(false);
    setShowT2Table(false);
  }

  return (
    <div className="flex flex-col relative transition-colors duration-500 min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navbar fixed at the top */}
      <header className="flex flex-row items-center justify-between px-4 py-2 bg-white/70 dark:bg-gray-900/70 shadow-md z-10 backdrop-blur border-b border-gray-200 dark:border-gray-700 w-full gap-2 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={welcomeLogo}
            alt="User Avatar"
            className="h-12 w-12 rounded-full border-4 border-blue-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg shrink-0"
            style={{
              boxShadow:
                "0 6px 24px #b6c6e6, 0 2px 8px #0002",
            }}
          />
          <div className="truncate">
            <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 dark:text-blue-200 drop-shadow truncate">
              Welcome, User!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 font-medium truncate">
              GRID-INDIA Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Navbar active={activeNavbar} setActive={(key) => {
  setActiveNavbar(key);
  if (key === "dashboard") {
    navigate("/dashboard");
  } else if (key === "single-line") {
    navigate("/home");
  } else if (key === "multi-line") {
    if (window.location.pathname !== "/multi-line") {
      navigate("/multi-line");
    }
  }
}} />
          <button
            className="ml-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition text-sm md:text-base"
            onClick={() => window.location.href = '/login'}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center w-full h-full overflow-auto px-2 md:px-4 py-2">
        <div className="w-full flex flex-col items-center py-2 bg-transparent">
          <div className="w-full max-w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 px-2 md:px-4 py-4 flex flex-col items-center">
            {/* Heading */}
            <h2
              className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-200 mb-2 mt-2 tracking-wide text-center"
              style={{ letterSpacing: "0.5px" }}
            >
              Multi-Line Visualization
            </h2>
            {/* Filter Inputs */}
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  From Date
                </label>
                <input
                  type="date"
                  className="rounded border px-2 py-1 text-blue-500 text-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={showGraph}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  To Date
                </label>
                <input
                  type="date"
                  className="rounded border px-2 py-1 text-blue-500 text-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={showGraph}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-1/3">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Line Names
                </label>
                <Select
                  options={lineOptions}
                  value={lines}
                  onChange={setLines}
                  isMulti
                  isSearchable
                  placeholder="Select lines..."
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
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#e0f2fe",
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
                  You selected{" "}
                  <b>
                    {fromDate}
                    {" - "}
                    {toDate}
                  </b>
                  {" for lines: "}
                  {lines.map((l) => (
                    <b key={l.value}>{l.label} </b>
                  ))}
                  . Continue?
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
              <div className="w-full bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">X-axis:</span> Date + Time (5-min
                    intervals).{" "}
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
                <div className="flex flex-col md:flex-row gap-6 w-full items-stretch" style={{ color: '#1976d2' }}>
                  <div className="flex-1">
                    {/* T1 Chart/Table Toggle */}
                    {!showT1Table ? (
                      <>
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={chartOptions("T1", "T1 Comparison Across Lines")}
                        />
                        <button
                          className="mt-2 px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs"
                          onClick={() => setShowT1Table(true)}
                        >
                          View Data Table
                        </button>
                      </>
                    ) : (
                      <div
                        className="mt-2 cursor-pointer"
                        onClick={() => setShowT1Table(false)}
                        title="Click anywhere on the table to return to the chart"
                        dangerouslySetInnerHTML={{ __html: singleTypeTableCustom("T1") }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    {/* T2 Chart/Table Toggle */}
                    {!showT2Table ? (
                      <>
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={chartOptions("T2", "T2 Comparison Across Lines")}
                        />
                        <button
                          className="mt-2 px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs"
                          onClick={() => setShowT2Table(true)}
                        >
                          View Data Table
                        </button>
                      </>
                    ) : (
                      <div
                        className="mt-2 cursor-pointer"
                        onClick={() => setShowT2Table(false)}
                        title="Click anywhere on the table to return to the chart"
                        dangerouslySetInnerHTML={{ __html: singleTypeTableCustom("T2") }}
                      />
                    )}
                  </div>
                </div>
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
    </div>
  );
}
