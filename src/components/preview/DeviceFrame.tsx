"use client";

import React from "react";

interface DeviceFrameProps {
  children: React.ReactNode;
  width: number;
}

export function DeviceFrame({ children, width }: DeviceFrameProps) {
  return (
    <div
      className="mx-auto transition-all duration-300 relative"
      style={{ width: `${width}px` }}
    >
      {/* Sleek Minimalist Mobile Chassis (Clean bezel without obstructing content) */}
      <div className="relative rounded-[4px] bg-neutral-900 shadow-2xl ">
        {/* Screen Container */}
        <div className="relative rounded-[4px] overflow-hidden bg-white w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
