import React from "react";
import { useSpring, animated } from "react-spring";

import "./02.css";

const Card = () => {
  // front side === true  backside === false
  const [flipped, setFlipped] = React.useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 0 : 1,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return (
    <div onClick={() => setFlipped(state => !state)} className="flip-card">
      <animated.div
        className="c back"
        style={{
          opacity,
          transform
        }}
      />
      <animated.div
        className="c front"
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform: transform.interpolate(t => `${t} rotateX(180deg)`)
        }}
      />
    </div>
  );
};

Card.title = "Flip Card";

export default Card;
