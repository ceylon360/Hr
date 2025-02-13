import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
import { disablePerformanceMonitoring } from "./utils/performanceUtils";

// Disable performance monitoring before initializing Tempo
disablePerformanceMonitoring();

// Initialize Tempo with performance observer disabled and error handling
TempoDevtools.init({
  performance: {
    disabled: true,
  },
  errorHandler: (error) => {
    console.warn("Tempo error:", error);
    return false; // Prevent default error handling
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
