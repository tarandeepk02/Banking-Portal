// Auto-set auth token for development
if (process.env.NODE_ENV === 'development' && !localStorage.getItem('authToken')) {
    localStorage.setItem('authToken', 'dev-token-123');
  }


import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";

const root = createRoot(document.getElementById("react-container"));
root.render(<App />);
