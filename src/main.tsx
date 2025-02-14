import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
import { disablePerformanceMonitoring } from "./utils/performanceUtils";

// Initialize Tempo with performance monitoring disabled
TempoDevtools.init({
  performance: {
    disabled: true,
    observer: false,
  },
  errorHandler: (error) => {
    // Only log critical errors
    if (error?.message?.includes("PerformanceServerTiming")) {
      return false;
    }
    console.warn("Tempo error:", error);
    return false;
  },
});

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
