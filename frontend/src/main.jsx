import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: "#ffffff",
              color: "#12181a",
              border: "1px solid #dcebe4",
              borderRadius: "14px",
              boxShadow: "0 8px 16px -4px rgb(18 24 26 / 0.1), 0 16px 32px -8px rgb(18 24 26 / 0.12)",
              fontSize: "14px",
              padding: "10px 14px",
            },
            success: { iconTheme: { primary: "#237a58", secondary: "#ffffff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#ffffff" } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
