import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// PositionGainsChart component to display performance over time
const PositionGainsChart = ({ selectedStock, isDarkMode }) => {
  const [positionData, setPositionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch position data from Alpaca
  const fetchPositionData = async () => {
    if (!selectedStock) return;

    try {
      setIsLoading(true);
      setError(null);

      // This would be replaced with actual alpaca-py API calls
      // For now, we'll simulate data for demo purposes
      const now = new Date();
      const simulatedData = generateSimulatedPositionData(selectedStock, now);

      setPositionData(simulatedData);
    } catch (err) {
      console.error("Error fetching position data:", err);
      setError("Failed to load position data");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate simulated position data for demonstration
  const generateSimulatedPositionData = (symbol, endTime) => {
    const data = [];
    const hours = 8; // 8 hours of data
    let lastValue = 0;

    for (let i = 0; i <= hours; i++) {
      const time = new Date(endTime);
      time.setHours(time.getHours() - (hours - i));

      // Create some random but somewhat realistic price movement
      // Start with 0% gain and progress to some final value
      let gainPct;

      if (i === 0) {
        gainPct = 0;
      } else {
        // Generate some volatility in the data
        const volatility = 0.2;
        const change = (Math.random() * 2 - 1) * volatility;
        gainPct = lastValue + change;

        // Add a trend based on the symbol (just for demo variety)
        if (symbol.includes("AAPL")) {
          gainPct += 0.1; // Trending up
        } else if (symbol.includes("MSFT")) {
          gainPct += 0.05; // Slightly trending up
        } else if (symbol.includes("GOOGL")) {
          gainPct -= 0.02; // Slightly trending down
        }
      }

      lastValue = gainPct;

      data.push({
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        gainPct: parseFloat(gainPct.toFixed(2)),
      });
    }

    return data;
  };

  // Effect to fetch data when the selected stock changes
  useEffect(() => {
    fetchPositionData();

    // Set up polling for real-time updates (every 1 minute)
    const intervalId = setInterval(fetchPositionData, 60000);

    return () => clearInterval(intervalId);
  }, [selectedStock]);

  // Format for tooltip values
  const formatGainPct = (value) => `${value}%`;

  // Colors based on theme
  const lineColor = isDarkMode ? "#60a5fa" : "#2563eb"; // blue-400 for dark, blue-600 for light
  const textColor = isDarkMode ? "#94a3b8" : "#64748b"; // slate-400 for dark, slate-500 for light

  if (isLoading && positionData.length === 0) {
    return (
      <div
        className={`h-64 flex items-center justify-center ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } rounded-lg`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
            Loading position data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`h-64 flex items-center justify-center ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } rounded-lg`}
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-500 font-medium">Error loading data</p>
          <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  // If we have position data, render the chart
  if (positionData.length > 0) {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={positionData}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#334155" : "#e2e8f0"}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: textColor, fontSize: 10 }}
              tickLine={{ stroke: textColor }}
              axisLine={{ stroke: textColor }}
            />
            <YAxis
              tickFormatter={formatGainPct}
              tick={{ fill: textColor, fontSize: 10 }}
              tickLine={{ stroke: textColor }}
              axisLine={{ stroke: textColor }}
            />
            <Tooltip
              formatter={formatGainPct}
              contentStyle={{
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                borderColor: isDarkMode ? "#475569" : "#cbd5e1",
                color: textColor,
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend
              wrapperStyle={{ bottom: -10, fontSize: 12, color: textColor }}
            />
            <Line
              type="monotone"
              dataKey="gainPct"
              name="Gain %"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 2 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Fallback when no data but not in loading state
  return (
    <div
      className={`h-64 flex items-center justify-center ${
        isDarkMode ? "bg-slate-800" : "bg-white"
      } rounded-lg`}
    >
      <div className="text-center p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-12 w-12 mx-auto ${
            isDarkMode ? "text-slate-600" : "text-gray-400"
          } mb-2`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
          No position data available
        </p>
      </div>
    </div>
  );
};

export default PositionGainsChart;
