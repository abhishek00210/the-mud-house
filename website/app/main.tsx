import React from "react";
import { createRoot } from "react-dom/client";
import { loadSite } from "../cms/client";
import "./globals.css";
import "../cms/public.css";

const root = createRoot(document.getElementById("root")!);
async function boot() {
  root.render(<div className="cms-service-offline" role="status"><p>Opening The Mud House…</p></div>);
  try {
    if (/^\/admin(?:\/|$)/.test(window.location.pathname)) {
      const { default: AdminApp } = await import("./admin/AdminApp");
      root.render(<React.StrictMode><AdminApp /></React.StrictMode>);
      return;
    }
    await loadSite();
    const { default: Home } = await import("./page");
    root.render(<React.StrictMode><Home /></React.StrictMode>);
  } catch (error) {
    root.render(<main className="cms-service-offline"><h1>We’ll be right with you.</h1><p>{error instanceof Error ? error.message : "The hotel service is unavailable. Please try again."}</p><button onClick={() => void boot()}>Try again</button></main>);
  }
}
void boot();
