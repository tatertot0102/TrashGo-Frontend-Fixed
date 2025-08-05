import { useEffect, useRef, useState } from "react";

export default function useController(onAction) {
  const [controllerState, setControllerState] = useState({ buttons: [], axes: [] });
  const rafRef = useRef(null);
  const prevPressed = useRef({});
  const lastMovementTime = useRef(0);
  const prevMovement = useRef("");

  useEffect(() => {
    const loop = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        setControllerState({ buttons: gp.buttons, axes: gp.axes });

        const now = Date.now();

        // D-Pad buttons
        const dpadUp = gp.buttons[12]?.pressed;
        const dpadDown = gp.buttons[13]?.pressed;
        const dpadLeft = gp.buttons[14]?.pressed;
        const dpadRight = gp.buttons[15]?.pressed;

        const x = gp.buttons[0]?.pressed;
        const circle = gp.buttons[1]?.pressed;
        const square = gp.buttons[2]?.pressed;
        const triangle = gp.buttons[3]?.pressed;
        const l2 = gp.buttons[6]?.pressed;
        const r2 = gp.buttons[7]?.pressed;

        // ✅ Movement: throttle to every 150ms
        let currentMovement = "";
        if (dpadUp) currentMovement = "move_forward";
        else if (dpadDown) currentMovement = "move_backward";
        else if (dpadLeft) currentMovement = "turn_left";
        else if (dpadRight) currentMovement = "turn_right";
        else currentMovement = "";

        if (currentMovement) {
          if (currentMovement !== prevMovement.current || now - lastMovementTime.current > 150) {
            onAction(currentMovement);
            lastMovementTime.current = now;
            prevMovement.current = currentMovement;
          }
        } else if (prevMovement.current !== "") {
          onAction("stop_motors");
          prevMovement.current = "";
        }

        // ✅ Debounce for single-action buttons
        const triggerOnPress = (name, pressed, cmd) => {
          if (pressed && !prevPressed.current[name]) {
            onAction(cmd);
          }
          prevPressed.current[name] = pressed;
        };

        triggerOnPress("x", x, "lower_ramp");
        triggerOnPress("circle", circle, "raise_ramp");
        triggerOnPress("square", square, "pickup_trash_sequence");
        triggerOnPress("triangle", triangle, "stop_motors");

        // ✅ Emergency stop
        if (l2 && r2 && !(prevPressed.current.l2 && prevPressed.current.r2)) {
          onAction("emergency_stop");
        }
        prevPressed.current.l2 = l2;
        prevPressed.current.r2 = r2;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onAction]);

  return controllerState;
}
