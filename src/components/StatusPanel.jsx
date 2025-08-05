import React from "react";
import { Battery, Trash2, AlertTriangle, Circle } from "lucide-react";

const StatusPanel = ({
  isConnected,
  robotName,
  currentTask,
  rampPosition,
  emergencyActive,
  batteryLevel,
  binLevel
}) => {
  const batteryColor =
    batteryLevel > 50 ? "text-green-400" : batteryLevel > 25 ? "text-yellow-400" : "text-red-500";

  const binColor =
    binLevel < 70 ? "text-green-400" : binLevel < 90 ? "text-yellow-400" : "text-red-500";

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg border-b border-gray-700">
      {/* Left Side: Connection + Name */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Circle
            className={`${
              isConnected ? "text-green-500 animate-pulse" : "text-red-500 animate-pulse"
            }`}
            size={14}
            fill={isConnected ? "green" : "red"}
          />
          <span
            className={`ml-2 font-bold text-lg transition-colors duration-500 ${
              isConnected ? "text-green-400" : "text-red-400"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <span className="text-gray-400 text-sm">| Robot:</span>
        <span className="font-semibold">{robotName}</span>
      </div>

      {/* Middle: Task */}
      <div className="hidden md:flex items-center space-x-6">
        <div>
          <span className="text-gray-400 text-sm">Task:</span>{" "}
          <span
            className="font-semibold text-blue-400 transition-all duration-500"
            key={currentTask} // re-render for animation
          >
            {currentTask}
          </span>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Ramp:</span>{" "}
          <span
            className={`font-bold transition-colors duration-500 ${
              rampPosition === "down" ? "text-green-400" : "text-blue-400"
            }`}
          >
            {rampPosition.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Right: System Indicators */}
      <div className="flex items-center space-x-6">
        {/* Battery */}
        <div className="flex items-center">
          <Battery size={18} className={`${batteryColor} mr-1`} />
          <span className={`text-sm ${batteryColor}`}>{batteryLevel}%</span>
        </div>
        {/* Bin */}
        <div className="flex items-center">
          <Trash2 size={18} className={`${binColor} mr-1`} />
          <span className={`text-sm ${binColor}`}>{binLevel}%</span>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencyActive && (
        <div className="absolute top-0 left-0 w-full bg-red-700 text-white text-center py-2 animate-pulse font-bold">
          <AlertTriangle className="inline-block mr-2" size={18} />
          EMERGENCY STOP ACTIVATED
        </div>
      )}
    </div>
  );
};

export default StatusPanel;
