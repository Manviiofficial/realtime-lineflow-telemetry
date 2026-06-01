import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Example data for 24-hour system load trend
const defaultData = [
  { hour: "00:00", load: 1800 },
  { hour: "01:00", load: 1750 },
  { hour: "02:00", load: 1700 },
  { hour: "03:00", load: 1680 },
  { hour: "04:00", load: 1650 },
  { hour: "05:00", load: 1700 },
  { hour: "06:00", load: 1850 },
  { hour: "07:00", load: 2000 },
  { hour: "08:00", load: 2200 },
  { hour: "09:00", load: 2350 },
  { hour: "10:00", load: 2400 },
  { hour: "11:00", load: 2450 },
  { hour: "12:00", load: 2500 },
  { hour: "13:00", load: 2480 },
  { hour: "14:00", load: 2460 },
  { hour: "15:00", load: 2440 },
  { hour: "16:00", load: 2420 },
  { hour: "17:00", load: 2400 },
  { hour: "18:00", load: 2380 },
  { hour: "19:00", load: 2360 },
  { hour: "20:00", load: 2340 },
  { hour: "21:00", load: 2320 },
  { hour: "22:00", load: 2300 },
  { hour: "23:00", load: 2250 }
];

export default function SystemLoadChart({ liveData }) {
  const [showTable, setShowTable] = useState(false);
  const data = liveData && Array.isArray(liveData) ? liveData : defaultData;
  return (
    <div style={{ width: '100vw', maxWidth: '100vw', overflowX: 'auto', position: 'relative' }}>
      {/* Chart/Table Toggle Button */}
      <button
        onClick={() => setShowTable((v) => !v)}
        style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
        className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 shadow transition flex items-center gap-1"
        aria-label={showTable ? 'Show Chart' : 'Show Data Table'}
      >
        {showTable ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>
            <span className="sr-only">Show Chart</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="sr-only">Show Data Table</span>
          </>
        )}
      </button>
      {/* Chart Description */}
      <div className="text-xs text-gray-500 mb-2 mt-2" style={{paddingRight: '110px'}}>
        <span className="font-semibold">X-axis:</span> Hour of the day (24h format). <span className="font-semibold">Y-axis:</span> System Load (MW).
      </div>
      {/* Chart or Table */}
      {!showTable ? (
        <ResponsiveContainer width="100vw" height={260}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ee" />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#8884d8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#8884d8' }} domain={[1600, 2600]} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e3e8ee' }} />
            <Line type="monotone" dataKey="load" stroke="#1976d2" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="overflow-x-auto mt-2 table-data-lightblue"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowTable(false)}
          title="Click anywhere to close table and return to graph"
        >
          <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg bg-white">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 border-b border-gray-200">Hour</th>
                <th className="px-3 py-2 border-b border-gray-200">System Load (MW)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="px-3 py-1 border-b border-gray-100">{row.hour}</td>
                  <td className="px-3 py-1 border-b border-gray-100">{row.load}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
