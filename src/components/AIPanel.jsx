import React, { useState, useEffect } from "react";
import { Brain, Eye, ToggleRight, ToggleLeft } from "lucide-react";

const mockClasses = ["Plastic Bottle", "Can", "Paper", "Cardboard", "Unknown"];

export default function AIPanel() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [autoSort, setAutoSort] = useState(false);
  const [currentDetection, setCurrentDetection] = useState(null);
  const [stats, setStats] = useState({ recycling: 0, landfill: 0, total: 0 });

  // Simulate detections when AI is on
  useEffect(() => {
    let interval;
    if (aiEnabled) {
      interval = setInterval(() => {
        const detectedClass = mockClasses[Math.floor(Math.random() * mockClasses.length)];
        const confidence = (Math.random() * 0.4 + 0.6).toFixed(2); // 60-100%
        setCurrentDetection({ class: detectedClass, confidence });
        setStats((prev) => ({
          recycling: prev.recycling + (detectedClass === "Plastic Bottle" || detectedClass === "Can" ? 1 : 0),
          landfill: prev.landfill + (detectedClass === "Unknown" ? 1 : 0),
          total: prev.total + 1,
        }));
      }, 3000);
    } else {
      setCurrentDetection(null);
    }
    return () => clearInterval(interval);
  }, [aiEnabled]);

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="text-blue-400" size={20} />
          <h2 className="text-lg font-bold">AI Vision</h2>
        </div>
        <button
          onClick={() => setAiEnabled(!aiEnabled)}
          className="flex items-center text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          {aiEnabled ? (
            <>
              <ToggleRight className="text-green-400 mr-1" size={18} /> ON
            </>
          ) : (
            <>
              <ToggleLeft className="text-gray-400 mr-1" size={18} /> OFF
            </>
          )}
        </button>
      </div>

      {/* Current Detection */}
      {aiEnabled ? (
        <>
          {currentDetection ? (
            <div className="mb-4">
              <p className="text-sm text-gray-300">Current Detection:</p>
              <p className="text-lg font-bold">{currentDetection.class}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${currentDetection.confidence * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Confidence: {(currentDetection.confidence * 100).toFixed(0)}%
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Scanning...</p>
          )}

          {/* Auto-Sort */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Auto-Sort:</span>
            <button
              onClick={() => setAutoSort(!autoSort)}
              className={`w-12 h-6 rounded-full transition-colors ${
                autoSort ? "bg-green-500" : "bg-gray-600"
              } flex items-center p-1`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  autoSort ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-600 pt-3 text-sm">
            <p>Recycling: {stats.recycling}</p>
            <p>Landfill: {stats.landfill}</p>
            <p className="text-blue-400 font-bold">Total Processed: {stats.total}</p>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm italic">AI Vision Disabled</p>
      )}
    </div>
  );
}