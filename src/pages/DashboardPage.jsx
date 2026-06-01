import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
        <p className="text-gray-700 text-base leading-relaxed mb-0">
          Welcome to the Dashboard! Here you can view real-time telemetry, system load, and detailed analytics for GRID-INDIA (POSOCO). Use the navigation to explore single-line and multi-line data, or view more details about the system.
        </p>
      </div>
    </div>
  );
}