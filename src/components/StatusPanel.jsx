import React from "react";

export default function StatusPanel({
  isConnected,
  robotIP,
  setRobotIP,
  robotPort,
  setRobotPort,
  connectToRobot,
  disconnectRobot,
  controllerConnected,
  lastCommand,
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>

      {/* Robot Connection */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Robot Connection</span>
          <span
            className={`font-bold ${
              isConnected ? "text-green-400" : "text-red-400"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Controller Connection */}
        <div className="flex justify-between items-center">
          <span>Controller</span>
          <span
            className={`font-bold ${
              controllerConnected ? "text-green-400" : "text-red-400"
            }`}
          >
            {controllerConnected ? "Connected" : "Not Detected"}
          </span>
        </div>

        {/* Last Command */}
        <div className="flex justify-between items-center">
          <span>Last Command</span>
          <span className="text-blue-400 font-bold">
            {lastCommand || "None"}
          </span>
        </div>
      </div>

      {/* Connection Settings */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2">Connection Settings</h4>
        <div className="space-y-2">
          <input
            type="text"
            value={robotIP}
            onChange={(e) => setRobotIP(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
            placeholder="Robot IP"
          />
          <input
            type="text"
            value={robotPort}
            onChange={(e) => setRobotPort(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
            placeholder="Port"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {!isConnected ? (
            <button
              onClick={connectToRobot}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              Connect
            </button>
          ) : (
            <button
              onClick={disconnectRobot}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
