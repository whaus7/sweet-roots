"use client";

import React from "react";
import { useSpring } from "react-spring";

export default function useBoop({
  x = 0,
  y = 0,
  rotation = 0,
  scaleX = 1,
  scaleY = 1,
  timing = 150,
  springConfig = {
    tension: 200,
    friction: 2,
  },
  transformOrigin = "center center",
}) {
  const [isBooped, setIsBooped] = React.useState(false);

  const style = useSpring({
    display: "inline-block",
    backfaceVisibility: "hidden",
    transformOrigin: transformOrigin, // TODO this needs to be a param
    transformBox: "fill-box",
    transform: isBooped
      ? `translate(${x}px, ${y}px)
         rotate(${rotation}deg)
         scale(${scaleX}, ${scaleY})`
      : `translate(${x}px, ${y}px)
         rotate(0deg)
         scale(${scaleX}, ${scaleY})`,

    config: springConfig,
  });

  React.useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timer = setTimeout(() => {
      setIsBooped(false);
    }, timing);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isBooped, timing]);

  const trigger = React.useCallback(() => {
    setIsBooped(true);
  }, []);

  return [style, trigger];
}
