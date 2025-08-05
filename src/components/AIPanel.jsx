import React, { useState, useEffect } from "react";
import { Brain, Eye } from "lucide-react";

export default function AIPanel() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [confidence, setConfidence] = useState(0.7);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    if (aiEnabled) {
      const interval = setInterval(() => {
        const classes = ["Recycling", "Landfill", "Not Trash"];
        const randomClass = classes[Math.floor(Math.random() * classes.length)];
        setDetections((prev) => [
          { id: Date.now(), label: randomClass, confidence: (Math.random() * 0.3 + 0.6).toFixed(2) },
          ...prev.slice(0, 4)
        ]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [aiEnabled]);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Brain className="mr-2" size={20} /> AI Vision
        </h3>
        <button
          onClick={() => setAiEnabled(!aiEnabled)}
          className={`px-3 py-1 rounded ${aiEnabled ? "bg-green-600" : "bg-slate-600"}`}
        >
          {aiEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Confidence Slider */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Confidence Threshold: {Math.round(confidence * 100)}%</label>
        <input
          type="range"
          min="0.5"
          max="0.95"
          step="0.05"
          value={confidence}
          onChange={(e) => setConfidence(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Detection History */}
      <h4 className="text-sm font-semibold mb-2 flex items-center">
        <Eye size={16} className="mr-1" /> Recent Detections
      </h4>
      <ul className="space-y-1 text-sm">
        {detections.length > 0 ? (
          detections.map((d) => (
            <li key={d.id} className="flex justify-between border-b border-slate-700 pb-1">
              <span>{d.label}</span>
              <span>{Math.round(d.confidence * 100)}%</span>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No detections yet.</p>
        )}
      </ul>
    </div>
  );
}