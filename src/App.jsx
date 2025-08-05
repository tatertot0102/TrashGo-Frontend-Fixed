import React, { useState, useRef, useEffect } from "react";
import CameraFeed from "./components/CameraFeed";
import StatusPanel from "./components/StatusPanel";
import ControlPanel from "./components/ControlPanel";
import ActivityLog from "./components/ActivityLog";
import AIPanel from "./components/AIPanel";
import useController from "./hooks/useController";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [robotIP, setRobotIP] = useState("192.168.50.80");
  const [robotPort, setRobotPort] = useState("8080");
  const [activityLog, setActivityLog] = useState([]);
  const [cameraUrl, setCameraUrl] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [currentTask, setCurrentTask] = useState("Idle");
  const [rampPosition, setRampPosition] = useState("up");
  const [emergencyActive, setEmergencyActive] = useState(false);

  const wsRef = useRef(null);

  const addActivity = (msg, type = "info") => {
    setActivityLog((prev) => [
      { msg, type, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  };

  const connectToRobot = () => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(`ws://${robotIP}:${robotPort}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setCameraUrl(`http://${robotIP}:${parseInt(robotPort) + 1}/video_feed`);
      addActivity("Connected to robot", "success");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setCameraUrl("");
      addActivity("Disconnected", "error");
    };

    ws.onerror = () => addActivity("Connection failed", "error");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) setCurrentTask(data.status);
        if (data.ramp) setRampPosition(data.ramp);
        if (data.emergency) setEmergencyActive(data.emergency);
      } catch (e) {
        console.error("Invalid message:", e);
      }
    };
  };

  const disconnectRobot = () => {
    if (wsRef.current) wsRef.current.close();
  };

  const mapCommandToTask = (command) => {
    switch (command) {
      case "move_forward":
        return "Moving Forward";
      case "move_backward":
        return "Moving Backward";
      case "turn_left":
        return "Turning Left";
      case "turn_right":
        return "Turning Right";
      case "stop_motors":
        return "Idle";
      case "toggle_ramp":
        return rampPosition === "up" ? "Lowering Ramp" : "Raising Ramp";
      case "pickup_trash_sequence":
        return "Picking Up Trash";
      case "emergency_stop":
        return "Emergency Stop";
      default:
        return currentTask;
    }
  };

  const sendCommand = (command, params = {}) => {
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addActivity("Robot not connected", "error");
      return;
    }

    // Send command
    wsRef.current.send(JSON.stringify({ command, params }));
    addActivity(`Command: ${command}`);
    setLastCommand(command);

    // UI updates
    const newTask = mapCommandToTask(command);
    setCurrentTask(newTask);

    if (command === "toggle_ramp") {
      setRampPosition((prev) => (prev === "up" ? "down" : "up"));
    }

    if (command === "emergency_stop") {
      setEmergencyActive(true);
      setTimeout(() => setEmergencyActive(false), 4000); // Auto-hide after 4s
    }
  };

  const controllerState = useController((action) => {
    sendCommand(action);
    setCurrentTask(mapCommandToTask(action));
  });

  useEffect(() => {
    const blockKeys = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", blockKeys);
    return () => window.removeEventListener("keydown", blockKeys);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ✅ Status Panel */}
      <StatusPanel
        isConnected={isConnected}
        robotName="TBot-01"
        currentTask={currentTask}
        rampPosition={rampPosition}
        emergencyActive={emergencyActive}
      />

      {/* ✅ Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Camera */}
        <div className="lg:col-span-2 space-y-6">
          <CameraFeed cameraUrl={cameraUrl} isConnected={isConnected} />
        </div>

        {/* Right: Control + Info */}
        <div className="space-y-6">
          {/* Connection Box */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-bold text-white mb-3">Connection</h2>
            <div className="flex flex-col space-y-3">
              <input
                className="p-2 rounded bg-gray-700 text-white"
                value={robotIP}
                onChange={(e) => setRobotIP(e.target.value)}
                placeholder="Robot IP"
              />
              <input
                className="p-2 rounded bg-gray-700 text-white"
                value={robotPort}
                onChange={(e) => setRobotPort(e.target.value)}
                placeholder="Port"
              />
              {!isConnected ? (
                <button
                  onClick={connectToRobot}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={disconnectRobot}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          <ControlPanel sendCommand={sendCommand} />
          <AIPanel />
          <ActivityLog logs={activityLog} />
        </div>
      </div>
    </div>
  );
}