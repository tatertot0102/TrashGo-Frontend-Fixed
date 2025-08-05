import { useEffect, useRef, useState } from "react";

export default function useController(onAction) {
  const [controllerState, setControllerState] = useState({ buttons: [], axes: [] });
  const rafRef = useRef(null);

  useEffect(() => {
    const loop = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        setControllerState({ buttons: gp.buttons, axes: gp.axes });

        let command = null;

        // Movement with D-Pad
        if (gp.buttons[12].pressed) command = "move_forward";   // Up
        else if (gp.buttons[13].pressed) command = "move_backward"; // Down
        else if (gp.buttons[14].pressed) command = "turn_left"; // Left
        else if (gp.buttons[15].pressed) command = "turn_right"; // Right

        // Ramp & Pickup
        else if (gp.buttons[0].pressed) command = "lower_ramp"; // X
        else if (gp.buttons[1].pressed) command = "raise_ramp"; // O
        else if (gp.buttons[2].pressed) command = "pickup_trash_sequence"; // Square
        else if (gp.buttons[3].pressed) command = "stop_motors"; // Triangle

        // Emergency Stop
        else if (gp.buttons[6].pressed && gp.buttons[7].pressed) command = "emergency_stop";

        if (command) onAction(command);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onAction]);

  return controllerState;
}
