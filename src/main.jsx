import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Note: intentionally NOT wrapped in <React.StrictMode> — StrictMode double-
// invokes effects in dev, which would run the first-load demo seeding twice.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
