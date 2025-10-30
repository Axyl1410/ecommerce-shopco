"use client";

import { useEffect, useState } from "react";

export default function TimeDisplay() {
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    // Create EventSource connection
    const eventSource = new EventSource("/api/sse/time");

    eventSource.onopen = () => {
      setStatus("connected");
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.time) {
        setTime(data.time);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setStatus("disconnected");
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Time</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <span className="text-sm capitalize text-gray-600">{status}</span>
        </div>
      </div>
      <p className="font-mono text-2xl text-gray-900">
        {time || "Connecting..."}
      </p>
    </div>
  );
}
