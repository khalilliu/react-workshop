import React from "react";
import { useSpring, animated } from "react-spring";
import { useGesture } from "react-with-gesture";
import clamp from "lodash.clamp";
import "./03.css";

function Pull() {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));
  const bind = useGesture(({ down, delta, velocity }) => {
    velocity = clamp(velocity, 1, 8);
    set({
      xy: down ? delta : [0, 0],
      config: { mass: velocity, tension: 500 * velocity, friction: 50 }
    });
  });
  return (
    <animated.div
      className="circle"
      {...bind()}
      style={{
        transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`)
      }}
    />
  );
}

Pull.title = "Pull Circle";

export default Pull;
