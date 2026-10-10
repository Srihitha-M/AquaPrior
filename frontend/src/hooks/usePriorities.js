import { useEffect, useState } from "react";
import { fetchPriorities } from "../api/client";

const DEBOUNCE_MS = 250;

// status: "loading" | "success" | "error"
export function usePriorities(capacity) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    // Keep the previous data visible while the next request loads.
    setState((prev) => ({ ...prev, status: "loading", error: null }));

    const timer = setTimeout(async () => {
      try {
        const data = await fetchPriorities(capacity, controller.signal);
        setState({ status: "success", data, error: null });
      } catch (err) {
        if (err.name === "AbortError") return;
        setState((prev) => ({ ...prev, status: "error", error: err }));
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [capacity, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}