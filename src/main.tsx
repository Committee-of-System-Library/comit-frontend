import { StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { posthog } from "posthog-js";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import { queryClient } from "@/shared/api/query-client";
import "./index.css";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  capture_pageview: false,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
