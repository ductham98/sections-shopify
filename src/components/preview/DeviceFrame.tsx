"use client";

import React from "react";

interface DeviceFrameProps {
  children: React.ReactNode;
  width: number;
}

export function DeviceFrame({ children, width }: DeviceFrameProps) {
  return (
    <div
      className="mx-auto my-4 transition-all duration-300 relative"
      style={{ width: `${width}px` }}
    >
      {/* Sleek Device Chassis */}
      <div className="relative rounded-[36px] p-2.5 bg-neutral-900 shadow-2xl ring-1 ring-neutral-800">
        {/* Subtle camera / dynamic island pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end pr-2.5">
          <div className="w-2 h-2 rounded-full bg-neutral-800 ring-1 ring-neutral-700/50" />
        </div>

        {/* Screen Bezel & Screen Container */}
        <div className="relative rounded-[28px] overflow-hidden bg-white w-full border border-neutral-800/20">
          {children}
        </div>

        {/* Subtle Bottom Home Bar */}
        <div className="pt-2 pb-0.5 flex justify-center">
          <div className="w-32 h-1 bg-neutral-600/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}

