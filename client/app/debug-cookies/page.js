"use client";

import { useEffect, useState } from "react";

export default function DebugCookies() {
  const [cookies, setCookies] = useState("");

  useEffect(() => {
    // This will show all cookies accessible to JavaScript
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCookies(document.cookie || "No cookies found");
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Cookies</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="font-mono text-sm">
          <strong>Client-side cookies:</strong> {cookies}
        </p>
        <p className="mt-4 text-yellow-600">
          Note: httpOnly cookies won&apos;t show here (that&apos;s good for
          security!)
        </p>
      </div>
    </div>
  );
}
