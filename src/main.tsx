import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress runtime error overlays — all errors are handled gracefully in-app
window.addEventListener("error", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
});
window.addEventListener("unhandledrejection", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
});

createRoot(document.getElementById("root")!).render(<App />);
