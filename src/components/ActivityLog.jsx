import React from "react";

export default function ActivityLog({ logs }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg max-h-64 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
      {logs.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {logs.map((entry, i) => (
            <li key={i} className="flex justify-between border-b border-slate-700 pb-1">
              <span>{entry.time} - {entry.msg}</span>
              <span className={entry.type === "success" ? "text-green-400" : entry.type === "error" ? "text-red-400" : "text-blue-400"}>
                {entry.type}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No activity yet.</p>
      )}
    </div>
  );
}
