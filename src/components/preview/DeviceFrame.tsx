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
      style={{ width: `${width}px` }}
    >
      <div
        className="rounded-[4px] overflow-hidden"
        style={{ width: `${width}px` }}
      >
        {children}
      </div>
    </div>
  );
}
