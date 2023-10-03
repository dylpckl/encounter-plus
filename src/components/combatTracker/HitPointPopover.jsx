"use client";
import { forwardRef } from "react";

const HitPointPopover = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute -right-5 w-12 bg-red-300"
    >
      aaaaaa
    </div>
  );
});

export default HitPointPopover;
