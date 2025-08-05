export default function ControlPanel({ sendCommand }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Controls</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => sendCommand("move_forward")}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-lg"
        >
          Forward
        </button>
        <button
          onClick={() => sendCommand("move_backward")}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-lg"
        >
          Backward
        </button>
        <button
          onClick={() => sendCommand("turn_left")}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          Left
        </button>
        <button
          onClick={() => sendCommand("turn_right")}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          Right
        </button>
        <button
          onClick={() => sendCommand("pickup_trash_sequence")}
          className="bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg col-span-2"
        >
          Pickup Trash
        </button>
        <button
          onClick={() => sendCommand("emergency_stop")}
          className="bg-red-700 hover:bg-red-800 p-3 rounded-lg col-span-2 animate-pulse"
        >
          EMERGENCY STOP
        </button>
      </div>
    </div>
  );
}
