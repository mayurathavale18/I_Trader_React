import { useState, useEffect } from "react";
import "./App.css";
import { useStockBot } from "./hooks/useStockBot";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/Card";
import { Select } from "./components/ui/Select";
import { SVGS } from "@lib/assets";
import PositionGainsChart from "@components/ui/PositionalGainsChart";
// Sample stock data
const stockOptions = [
  { value: "Apple", label: "Apple Inc. (AAPL)" },
  { value: "Microsoft", label: "Microsoft Corporation (MSFT)" },
  { value: "Google", label: "Google (GOOGL)" },
  { value: "Netflix", label: "Netflix (NFLX)" },
  { value: "Tesla", label: "Tesla Inc. (TSLA)" },
  { value: "Nvidia", label: "NVIDIA (NVDA)" },
];

function App() {
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { states, trainModel, backtestModel, startTrading, forceExit } =
    useStockBot();

  // Check if any action is currently loading
  const isLoading =
    states.train.loading ||
    states.backtest.loading ||
    states.trade.loading ||
    states.forceExit.loading;

  // Get the final portfolio value from backtest response
  const finalPortfolioValue = states.backtest.response?.final_portfolio_value;

  // Format portfolio value with commas and 2 decimal places
  const formatCurrency = (value: number | undefined) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Get the most recent message to display
  const getStatusMessage = () => {
    if (states.forceExit.message) return states.forceExit.message;
    if (states.train.message) return states.train.message;
    if (states.backtest.message) return states.backtest.message;
    if (states.trade.message) return states.trade.message;
    return selectedStock
      ? `Selected: ${selectedStock}`
      : "Please select a stock";
  };

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme class to document on theme change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    console.log("final_porfolio_value : ", finalPortfolioValue);
  }, [finalPortfolioValue]);

  const handleTrain = async () => {
    if (!selectedStock) return;
    await trainModel(selectedStock);
  };

  const handleBacktest = async () => {
    if (!selectedStock) return;
    await backtestModel(selectedStock);
  };

  const handleTrade = async () => {
    if (!selectedStock) return;
    await startTrading(selectedStock);
  };

  const handleForceExit = async () => {
    if (!selectedStock) return;
    await forceExit(selectedStock);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-b from-gray-100 to-white text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode
            ? "bg-slate-950 border-slate-700"
            : "bg-white border-gray-200"
        } shadow-lg border-b`}
      >
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`h-10 w-10 rounded-lg ${
                  isDarkMode ? "bg-blue-600" : "bg-blue-500"
                } flex items-center justify-center text-white`}
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1  0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg> */}
                <img
                  src={SVGS.iTraderIconComp}
                  width={28}
                  height={28}
                  alt="icon"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                iTrader
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`text-sm md:text-base ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-semibold`}
              >
                Trading Bot Platform
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-slate-700 text-yellow-300 hover:bg-slate-600"
                    : "bg-gray-200 text-slate-800 hover:bg-gray-300"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Algorithmic Trading Bot
          </h2>
          <p
            className={`text-lg md:text-xl ${
              isDarkMode ? "text-blue-300" : "text-blue-600"
            } max-w-3xl mx-auto opacity-80`}
          >
            Train, backtest, and deploy AI-powered trading strategies with ease
          </p>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Control Panel */}
          <Card
            className={`lg:col-span-4 ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-300"
            } shadow-xl rounded-xl`}
          >
            <div className="p-2">
              <h3 className="text-xl font-semibold mb-6 px-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Control Panel
              </h3>

              <div className="space-y-6 p-2">
                <div>
                  <label
                    htmlFor="stock-select"
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    Select Stock to Trade
                  </label>
                  <Select
                    id="stock-select"
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                    className={`${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    <option value="">Choose a stock...</option>
                    {stockOptions.map((stock) => (
                      <option key={stock.value} value={stock.value}>
                        {stock.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Portfolio Value Card */}
                {finalPortfolioValue && (
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600"
                        : "bg-blue-50 border-blue-200"
                    } border rounded-lg p-4 mb-4`}
                  >
                    <h4
                      className={`text-sm font-medium mb-1 ${
                        isDarkMode ? "text-blue-300" : "text-blue-800"
                      }`}
                    >
                      Final Portfolio Value
                    </h4>
                    <div className="flex items-baseline">
                      <span
                        className={`text-2xl font-bold ${
                          finalPortfolioValue > 10000
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatCurrency(finalPortfolioValue)}
                      </span>
                      <span
                        className={`ml-2 text-xs ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        after backtest
                      </span>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        finalPortfolioValue > 10000
                          ? isDarkMode
                            ? "text-green-400"
                            : "text-green-600"
                          : isDarkMode
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    >
                      {finalPortfolioValue > 10000
                        ? `+${(
                            ((finalPortfolioValue - 10000) / 10000) *
                            100
                          ).toFixed(2)}% from initial $10,000`
                        : `-${(
                            ((10000 - finalPortfolioValue) / 10000) *
                            100
                          ).toFixed(2)}% from initial $10,000`}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleTrain}
                    disabled={!selectedStock || isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-blue-100/70 transition-colors flex items-center justify-center font-medium"
                  >
                    {states.train.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Training Model...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                        </svg>
                        Train Model
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleBacktest}
                    disabled={!selectedStock || isLoading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 disabled:text-purple-100/70 transition-colors flex items-center justify-center font-medium"
                  >
                    {states.backtest.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Backtesting...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Backtest Model
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleTrade}
                    disabled={!selectedStock || isLoading}
                    className={`w-full py-3 ${
                      states.trade.loading
                        ? "bg-yellow-600"
                        : states.trade.message && !states.trade.error
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } transition-colors flex items-center justify-center font-medium`}
                  >
                    {states.trade.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : states.trade.message && !states.trade.error ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Stop Trading
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Start Trading
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleForceExit}
                    disabled={!selectedStock || isLoading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:text-red-100/70 transition-colors flex items-center justify-center font-medium"
                  >
                    {states.forceExit.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing Exit...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 011-1h1a1 1 0 110 2H9v3a1 1 0 11-2 0v-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Force Exit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            <Card
              className={`${
                isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-300"
              } shadow-xl rounded-xl overflow-hidden`}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Stock Performance
                </h3>

                {selectedStock ? (
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border p-2`}
                  >
                    <div className="flex justify-between items-center mb-4 p-2">
                      <div>
                        <h4 className="font-bold text-lg">
                          {stockOptions.find((s) => s.value === selectedStock)
                            ?.label || selectedStock}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          Real-time trading data
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            isLoading
                              ? "bg-yellow-400"
                              : states.trade.message && !states.trade.error
                              ? "bg-green-400 animate-pulse"
                              : isDarkMode
                              ? "bg-slate-400"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <p className="text-sm font-medium">
                          {isLoading
                            ? "Processing"
                            : states.trade.message && !states.trade.error
                            ? "Trading"
                            : "Idle"}
                        </p>
                      </div>
                    </div>

                    {/* Position Gains Chart replacing the placeholder */}
                    <PositionGainsChart
                      selectedStock={selectedStock}
                      isDarkMode={isDarkMode}
                    />

                    {/* Chart Legend and Stats */}
                    <div className="mt-4 flex flex-wrap gap-4 justify-between px-2">
                      <div
                        className={`${
                          isDarkMode ? "bg-slate-800" : "bg-white"
                        } p-3 rounded-lg shadow-sm flex-1 min-w-[120px]`}
                      >
                        <p
                          className={`text-xs uppercase font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Today's Gain
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            Math.random() > 0.5
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {(Math.random() * 5 - 2.5).toFixed(2)}%
                        </p>
                      </div>

                      <div
                        className={`${
                          isDarkMode ? "bg-slate-800" : "bg-white"
                        } p-3 rounded-lg shadow-sm flex-1 min-w-[120px]`}
                      >
                        <p
                          className={`text-xs uppercase font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Period High
                        </p>
                        <p className="text-lg font-bold text-green-500">
                          +{(Math.random() * 3 + 1).toFixed(2)}%
                        </p>
                      </div>

                      <div
                        className={`${
                          isDarkMode ? "bg-slate-800" : "bg-white"
                        } p-3 rounded-lg shadow-sm flex-1 min-w-[120px]`}
                      >
                        <p
                          className={`text-xs uppercase font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Period Low
                        </p>
                        <p className="text-lg font-bold text-red-500">
                          -{(Math.random() * 2 + 0.5).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-64 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border border-dashed`}
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p
                        className={
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        }
                      >
                        Select a stock to view performance data
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Status Card */}
            <Card
              className={`${
                isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-300"
              } shadow-xl rounded-xl overflow-hidden`}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  System Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border ${
                      states.train.error ? "border-red-500" : ""
                    } p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Model Training
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          states.train.loading
                            ? "bg-yellow-400"
                            : states.train.error
                            ? "bg-red-500"
                            : states.train.message
                            ? "bg-green-500"
                            : isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm truncate">
                      {states.train.loading
                        ? "Training in progress..."
                        : states.train.message
                        ? states.train.message
                        : "Ready to train"}
                    </p>
                  </div>

                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border ${
                      states.backtest.error ? "border-red-500" : ""
                    } p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Backtesting
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          states.backtest.loading
                            ? "bg-yellow-400"
                            : states.backtest.error
                            ? "bg-red-500"
                            : states.backtest.message
                            ? "bg-green-500"
                            : isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm truncate">
                      {states.backtest.loading
                        ? "Backtesting in progress..."
                        : states.backtest.message
                        ? states.backtest.message
                        : "Ready to backtest"}
                    </p>
                  </div>

                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border ${
                      states.trade.error ? "border-red-500" : ""
                    } p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Trading Status
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          states.trade.loading
                            ? "bg-yellow-400"
                            : states.trade.error
                            ? "bg-red-500"
                            : states.trade.message
                            ? "bg-green-500 animate-pulse"
                            : isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm truncate">
                      {states.trade.loading
                        ? "Processing trading request..."
                        : states.trade.message
                        ? states.trade.message
                        : "Ready to trade"}
                    </p>
                  </div>

                  <div
                    className={`${
                      isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-gray-100 border-gray-300"
                    } rounded-lg border ${
                      states.forceExit.error ? "border-red-500" : ""
                    } p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Force Exit
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          states.forceExit.loading
                            ? "bg-yellow-400"
                            : states.forceExit.error
                            ? "bg-red-500"
                            : states.forceExit.message
                            ? "bg-green-500"
                            : isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm truncate">
                      {states.forceExit.loading
                        ? "Processing exit request..."
                        : states.forceExit.message
                        ? states.forceExit.message
                        : "Ready for emergency exit"}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 p-4 ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-gray-100 border-gray-300"
                  } rounded-lg border`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    Latest Status
                  </h4>
                  <p className="text-sm">{getStatusMessage()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${
          isDarkMode
            ? "bg-slate-950 border-slate-800 text-slate-400"
            : "bg-gray-900 border-gray-800 text-gray-300"
        } mt-20 py-8 border-t`}
      >
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="font-medium">
            i-Trader Bot &copy; {new Date().getFullYear()} - Final Year BE
            Project
          </p>
          <p
            className={`mt-2 text-xs ${
              isDarkMode ? "text-slate-500" : "text-gray-400"
            }`}
          >
            i-Trader powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
