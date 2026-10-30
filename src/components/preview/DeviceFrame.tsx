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
      <div className="relative rounded-[32px] p-2 bg-neutral-900 shadow-2xl ring-1 ring-neutral-800">
        {/* Screen Container */}
        <div className="relative rounded-[24px] overflow-hidden bg-white w-full border border-neutral-800/20">
          {children}
        </div>
      </div>
    </div>
  );
}
