import React, { createContext, useContext, useState } from "react";

const LineContext = createContext();

export function useLineContext() {
  return useContext(LineContext);
}

export function LineProvider({ children }) {
  const [lineNames, setLineNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all line names (for search/autocomplete)
  async function fetchAllLineNames() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://www.lineflow.grid-india.in/get_all_line_names", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.SUCCESS) {
        setLineNames(Object.values(data.SUCCESS));
      } else {
        setError(data.Message || "Failed to fetch line names");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  }

  // Fetch single line data
  async function fetchSingleLineData(payload) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://www.lineflow.grid-inida.in/get_line_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError("Network error");
      setLoading(false);
      return null;
    }
  }

  // Fetch multi-line data
  async function fetchMultiLineData(payload) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://www.lineflow.grid-inida.in/get_multi_line_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError("Network error");
      setLoading(false);
      return null;
    }
  }

  return (
    <LineContext.Provider
      value={{
        lineNames,
        loading,
        error,
        fetchAllLineNames,
        fetchSingleLineData,
        fetchMultiLineData,
      }}
    >
      {children}
    </LineContext.Provider>
  );
}
