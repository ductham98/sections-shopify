"use client";

import React from "react";

export type PreviewStatusType = "ready" | "compiling" | "error";

interface PreviewStatusProps {
  status: PreviewStatusType;
}

export function PreviewStatus({ status }: PreviewStatusProps) {
  if (status === "compiling") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>Compiling</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span>Rendering Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>Live Preview</span>
    </div>
  );
}

