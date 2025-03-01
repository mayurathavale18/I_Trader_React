import { useState } from "react";
import axios from "axios";

// Using a local proxy to avoid CORS issues
const API_BASE_URL = "/api";

interface ActionState {
  loading: boolean;
  message: string | null;
  response: any;
  error: boolean;
}

interface StockBotStates {
  train: ActionState;
  backtest: ActionState;
  trade: ActionState;
  forceExit: ActionState;
  [key: string]: ActionState; // Add index signature
}

interface ApiResponse {
  message: string;
  [key: string]: any; // Allow additional properties
}

interface ApiMessage {
  success: boolean;
  message: string;
}

export const useStockBot = () => {
  const [states, setStates] = useState<StockBotStates>({
    train: { loading: false, message: null, response: null, error: false },
    backtest: { loading: false, message: null, response: null, error: false },
    trade: { loading: false, message: null, response: null, error: false },
    forceExit: { loading: false, message: null, response: null, error: false },
  });

  async function callAPI(endpoint: string, stock: string): Promise<ApiMessage> {
    setStates((prev) => ({
      ...prev,
      [endpoint]: {
        ...prev[endpoint],
        loading: true,
        message: null,
        error: false,
      },
    }));

    try {
      const { data } = await axios.get<ApiResponse>(
        `${API_BASE_URL}/${endpoint}`,
        {
          params: { stock },
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          validateStatus: (status) => status < 500 // Accept any status code less than 500
        }
      );
      console.log(data);

      // Check if data is HTML (ngrok warning) instead of JSON
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      if (dataStr.includes('<!DOCTYPE html>')) {
        console.error('Received HTML from ngrok instead of JSON response');
        const ngrokUrlMatch = dataStr.match(/visit\s+([^,]+),\s+served/);
        const ngrokUrl = ngrokUrlMatch ? ngrokUrlMatch[1] : 'the ngrok URL';
        
        throw new Error(`Received HTML instead of JSON. This is likely due to ngrok's free tier limitations. 
        To fix this issue:
        1. Open ${ngrokUrl} directly in your browser and accept the warning
        2. Then try your request again`);
      }

      setStates((prev) => ({
        ...prev,
        [endpoint]: {
          loading: false,
          message: data.message || "Operation Successful",
          response: data || { message: "Operation Successful" },
          error: false,
        },
      }));

      return { success: true, message: data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || `Failed to ${endpoint} for ${stock}`;

      setStates((prev) => ({
        ...prev,
        [endpoint]: {
          loading: false,
          message: errorMessage,
          response: null,
          error: true,
        },
      }));

      return { success: false, message: errorMessage };
    }
  }

  return {
    states,
    trainModel: async (stock: string) => callAPI("train", stock),
    backtestModel: async (stock: string) => callAPI("backtest", stock),
    startTrading: async (stock: string) => callAPI("trade", stock),
    forceExit: async (stock: string) => callAPI("forceExit", stock),
  };
};