import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RegexTesterWrapper() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  const runTest = () => {
    try {
      setError("");
      const regex = new RegExp(pattern, flags);
      const result = [...testString.matchAll(regex)];
      setMatches(result);
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Regex Tester Tool
        </motion.h1>

        {/* Input Card */}
        <div className="rounded-2xl shadow-lg p-6 mb-6 bg-white">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Regex Pattern</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2"
                placeholder="e.g. \\b\\w+\\b"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Flags (g, i, m, etc.)</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2"
                placeholder="g"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Test String</label>
              <textarea
                rows={6}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2"
                placeholder="Enter text to test..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
              />
            </div>

            <button
              onClick={runTest}
              className="w-full py-2 rounded-lg font-medium shadow hover:opacity-90"
            >
              Run Test
            </button>

            {error && (
              <div className="text-red-500 text-sm">Error: {error}</div>
            )}
          </div>
        </div>

        {/* Result Card */}
        <div className="rounded-2xl shadow-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Matches</h2>

          {matches.length === 0 && !error && (
            <p className="text-gray-500">No matches found</p>
          )}

          <div className="space-y-3">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-xl border"
              >
                <p className="font-mono text-sm">
                  Match {index + 1}: {match[0]}
                </p>
                <p className="text-xs text-gray-500">
                  Index: {match.index}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
