import React, { useState, useRef, useEffect } from "react";
import CameraFeed from "./components/CameraFeed";
import StatusPanel from "./components/StatusPanel";
import ControlPanel from "./components/ControlPanel";
import ActivityLog from "./components/ActivityLog";
import AIPanel from "./components/AIPanel";
import useController from "./hooks/useController";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [robotIP, setRobotIP] = useState("192.168.1.100");
  const [robotPort, setRobotPort] = useState("8080");
  const [activityLog, setActivityLog] = useState([]);
  const [cameraUrl, setCameraUrl] = useState("");
  const [lastCommand, setLastCommand] = useState("");

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
  };

  const disconnectRobot = () => {
    if (wsRef.current) wsRef.current.close();
  };

  const sendCommand = (command, params = {}) => {
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addActivity("Robot not connected", "error");
      return;
    }
    wsRef.current.send(JSON.stringify({ command, params }));
    addActivity(`Command: ${command}`);
  };

  const controllerState = useController((action) => {
    sendCommand(action);
    setLastCommand(action);
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
      <header className="flex justify-between items-center p-4 bg-slate-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">TrashBot Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          <CameraFeed cameraUrl={cameraUrl} isConnected={isConnected} />
        </div>
        <div className="space-y-6">
          <StatusPanel
            isConnected={isConnected}
            robotIP={robotIP}
            setRobotIP={setRobotIP}
            robotPort={robotPort}
            setRobotPort={setRobotPort}
            connectToRobot={connectToRobot}
            disconnectRobot={disconnectRobot}
            controllerConnected={!!controllerState.buttons.length}
            lastCommand={lastCommand}
          />
          <ControlPanel sendCommand={sendCommand} />
          <AIPanel /> {/* AI Panel here */}
          <ActivityLog logs={activityLog} />
        </div>
      </div>
    </div>
  );
}