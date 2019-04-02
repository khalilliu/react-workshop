import React from "react";
import { useSpring, animated } from "react-spring";
import { useWindowSize } from "react-use";
import d3Ease from "d3-ease";
import "./01.css";

const trans = x => `translateX(${x}px)`;

const Card = ({ collapsed, index, handleClick, isAbove, column }) => {
  const [props, set] = useSpring(() => ({ x: 0 }));
  console.log(column);
  React.useEffect(
    () => {
      set({
        x: collapsed ? (column ? 170 : 110) : 0,
        config: {
          mass: 1,
          tension: 210,
          friction: 20
        }
      });
    },
    [collapsed, column]
  );

  return (
    <animated.div
      className="card"
      onClick={() => {
        handleClick(index);
      }}
      style={{
        margin: column ? `20px` : `10px`,
        zIndex: collapsed ? (isAbove ? 1 : -1) : 0,
        background: index === 1 ? "red" : "green",
        transform: props.x.interpolate(x =>
          column ? `translateX(${-index * x}px)` : `translateY(${-index * x}px)`
        )
      }}
    />
  );
};

const AnimateCards = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isAbove, setAbove] = React.useState(1);
  const { width, height } = useWindowSize();

  const handleCardClick = index => {
    setAbove(index);
    setCollapsed(!collapsed);
  };

  return (
    <div className="cards-board">
      <div className="card-container">
        {[-1, 1].map(item => (
          <Card
            key={item}
            isAbove={item === isAbove}
            column={width > 770}
            handleClick={index => handleCardClick(index)}
            collapsed={collapsed}
            index={item}
          />
        ))}
      </div>
      <button className="button" onClick={() => setCollapsed(!collapsed)}>
        click me
      </button>
    </div>
  );
};

AnimateCards.title = `Animate Cards`;

export default AnimateCards;
