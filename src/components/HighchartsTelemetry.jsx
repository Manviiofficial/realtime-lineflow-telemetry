import React from "react";
import Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import accessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";

// Robust Highcharts module initialization for ESM/CJS compatibility
if (typeof exporting === "function") exporting(Highcharts);
else if (exporting && typeof exporting.default === "function") exporting.default(Highcharts);

if (typeof exportData === "function") exportData(Highcharts);
else if (exportData && typeof exportData.default === "function") exportData.default(Highcharts);

if (typeof accessibility === "function") accessibility(Highcharts);
else if (accessibility && typeof accessibility.default === "function") accessibility.default(Highcharts);

export default function HighchartsTelemetry({ data }) {
  // Custom table renderer for T1+T2 data
  function combinedTableCustom() {
    let html = `<style>
      .highcharts-data-table, .highcharts-data-table * {
        color: #1976d2 !important;
      }
      .highcharts-data-table {
        border-collapse: collapse;
        width: 100%;
        margin: 12px 0;
        font-size: 13px;
        background: #f8fafc;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px #0001;
      }
      .highcharts-data-table th, .highcharts-data-table td {
        border: 1px solid #d1e3f8;
        padding: 6px 10px;
        text-align: center;
      }
      .highcharts-data-table th {
        background: #1976d2;
        color: #fff !important;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .highcharts-data-table tr:nth-child(even) td {
        background: #e3f0fd;
      }
      .highcharts-data-table tr:hover td {
        background:rgb(40, 116, 179);
      }
    </style>`;
    html += '<table class="highcharts-data-table"><thead><tr>';
    html += '<th>Date+Time</th>';
    html += '<th>T1 (kW)</th>';
    html += '<th>T2 (kW)</th>';
    html += '</tr></thead><tbody>';
    data.forEach((row) => {
      html += `<tr><td>${row.time}</td><td>${row.T1}</td><td>${row.T2}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
  }

  const options = {
    chart: {
      type: "line",
      height: 360,
      zoomType: "x",
      panning: true,
      panKey: "shift",
    },
    title: { text: "Telemetry Data (kW)" },
    xAxis: {
      categories: data.map((d) => d.time),
      title: { text: "Date + Time" },
      labels: { style: { color: "#1976d2", fontWeight: 600 }, rotation: 0 },
      tickInterval: Math.ceil(data.length / 12),
    },
    yAxis: {
      title: { text: "Power (kW)" },
      min: 0,
      allowDecimals: false,
    },
    series: [
      {
        name: "T1",
        data: data.map((d) => d.T1),
        color: "#5c9ee0ff",
        marker: { enabled: false },
      },
      {
        name: "T2",
        data: data.map((d) => d.T2),
        color: "#0f69b3ff",
        marker: { enabled: false },
      },
    ],
    credits: { enabled: false },
    tooltip: {
      shared: true,
      valueSuffix: " kW",
      crosshairs: true,
      xDateFormat: "%Y-%m-%d %H:%M",
    },
    legend: { enabled: true },
    accessibility: { enabled: true },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
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
      tableCustom: combinedTableCustom,
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
