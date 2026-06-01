import React from "react";

export default function Dashboard() {
  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
      <p className="mb-4 text-gray-600">
        This is the dashboard area. Add widgets, charts, and KPIs here.
      </p>
      {/* Example placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-1">Power Usage</h2>
          <p className="text-2xl font-bold">1,234 MW</p>
        </div>
        <div className="bg-green-100 rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-1">Active Lines</h2>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
}