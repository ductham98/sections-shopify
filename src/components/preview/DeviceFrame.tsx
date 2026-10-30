"use client";

import React from "react";

interface DeviceFrameProps {
  children: React.ReactNode;
  width: number;
}

export function DeviceFrame({ children, width }: DeviceFrameProps) {
  return (
    <div
      className="transition-all duration-200 relative"
      style={{ width: `${width + 16}px` }}
    >
      {/* Sleek Minimalist Mobile Chassis */}
      <div className="rounded-[36px] p-2 bg-neutral-900 shadow-xl ring-1 ring-neutral-800">
        {/* Screen Container with exact viewport width */}
        <div
          className="rounded-[28px] overflow-hidden bg-white border border-neutral-800/20"
          style={{ width: `${width}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
