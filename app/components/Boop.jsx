"use client";

import React from "react";
import { animated } from "react-spring";

import useBoop from "@/app/hooks/use-boop";

const Boop = ({ children, boopConfig }) => {
  const [style, trigger] = useBoop(boopConfig);

  return (
    <animated.g onMouseEnter={trigger} style={style}>
      {children}
    </animated.g>
  );
};

export default Boop;
