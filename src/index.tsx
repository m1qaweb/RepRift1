// /src/index.ts - Main entry point of the application.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css"; // Import Tailwind CSS

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
