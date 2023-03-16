import * as React from "react";
import { useSpring, animated } from "react-spring";

export default function Boop({ rotation = 0, timing = 150, children }) {
  const [isBooped, setIsBooped] = React.useState(false);

  const style = useSpring({
    display: "inline-block",
    transform: isBooped ? `rotate(${rotation}deg)` : "rotate(0deg)",
    config: {
      tension: 300,
      friction: 10
    }
  });

  React.useEffect(() => {
    if (!isBooped) {
      return;
    }
    const boopTimeout = setTimeout(() => {
      setIsBooped(false);
    }, timing);

    return () => clearTimeout(boopTimeout);
  }, [isBooped, timing]);

  const trigger = () => setIsBooped(true);

  return (
    <animated.span onMouseEnter={trigger} style={style}>
      {children}
    </animated.span>
  );
}
