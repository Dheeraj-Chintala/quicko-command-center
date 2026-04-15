import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root");
// #region agent log
fetch("http://127.0.0.1:7899/ingest/a1ec8467-4b16-48b8-9ae7-709fd1526de3", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "2a0541" },
  body: JSON.stringify({
    sessionId: "2a0541",
    location: "main.tsx:createRoot",
    message: "boot",
    data: { hasRoot: Boolean(rootEl) },
    timestamp: Date.now(),
    hypothesisId: "H3",
  }),
}).catch(() => {});
// #endregion

createRoot(rootEl!).render(<App />);
