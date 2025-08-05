import Draggable from "react-draggable";
import { motion } from "framer-motion";

export default function ControllerOverlay({ controllerState, onClose }) {
  const { buttons = [], axes = [] } = controllerState || {};
  const isPressed = (i) => !!buttons[i]?.pressed;

  const leftStickX = (axes[0] || 0) * 40;
  const leftStickY = (axes[1] || 0) * 40;
  const rightStickX = (axes[2] || 0) * 40;
  const rightStickY = (axes[3] || 0) * 40;

  return (
    <Draggable>
      <motion.div
        className="fixed top-20 left-20 bg-slate-800 p-6 rounded-lg shadow-xl w-[380px] z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Controller Overlay</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {!buttons.length ? (
          <p className="text-gray-400">Waiting for controller...</p>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <Trigger label="L2" active={isPressed(6)} />
              <Trigger label="R2" active={isPressed(7)} />
            </div>
            <div className="flex justify-between mb-6">
              <ButtonBar label="L1" active={isPressed(4)} />
              <ButtonBar label="R1" active={isPressed(5)} />
            </div>

            <div className="flex justify-between">
              <Joystick x={leftStickX} y={leftStickY} color="bg-blue-400" />
              <DiamondButtons active={buttons} />
              <Joystick x={rightStickX} y={rightStickY} color="bg-red-400" />
            </div>
          </>
        )}
      </motion.div>
    </Draggable>
  );
}

function Joystick({ x, y, color }) {
  return (
    <div className="relative w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
      <motion.div
        className={`w-10 h-10 ${color} rounded-full`}
        style={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      />
    </div>
  );
}

function Trigger({ label, active }) {
  return (
    <motion.div
      className="w-20 h-6 rounded bg-gray-600 flex items-center justify-center"
      animate={{ backgroundColor: active ? "#f87171" : "#4b5563" }}
    >
      {label}
    </motion.div>
  );
}

function ButtonBar({ label, active }) {
  return (
    <motion.div
      className="w-16 h-4 rounded bg-gray-600 flex items-center justify-center text-xs"
      animate={{ backgroundColor: active ? "#60a5fa" : "#4b5563" }}
    >
      {label}
    </motion.div>
  );
}

function DiamondButtons({ active }) {
  return (
    <div className="relative w-32 h-32">
      <DiamondButton label="△" active={active[3]?.pressed} top="0" left="50%" />
      <DiamondButton label="□" active={active[2]?.pressed} top="50%" left="0" />
      <DiamondButton label="○" active={active[1]?.pressed} top="50%" left="100%" />
      <DiamondButton label="✕" active={active[0]?.pressed} top="100%" left="50%" />
    </div>
  );
}

function DiamondButton({ label, active, top, left }) {
  return (
    <motion.div
      className="absolute w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-white font-bold"
      style={{ top: `calc(${top} - 20px)`, left: `calc(${left} - 20px)` }}
      animate={{ backgroundColor: active ? "#34d399" : "#374151", scale: active ? 1.2 : 1 }}
    >
      {label}
    </motion.div>
  );
}
