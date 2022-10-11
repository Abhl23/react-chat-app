import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import "./styles/index.scss";
import App from "./components/App";
import { AuthProvider } from "./providers/AuthProvider";
import { ChatProvider } from "./providers/ChatProvider";
import { ToastProvider } from "react-toast-notifications";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={5000}
        placement="top-right"
      >
        <AuthProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  </React.StrictMode>
);
