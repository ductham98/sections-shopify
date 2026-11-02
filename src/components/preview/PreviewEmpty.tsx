"use client";

import React from "react";
import { Layout } from "lucide-react";

export function PreviewEmpty() {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 bg-[#F1F2F4] text-neutral-400">
      <Layout className="w-10 h-10 mb-2 stroke-[1.5] text-neutral-300" />
      <p className="text-xs font-medium text-neutral-500">No section selected</p>
      <p className="text-[11px] text-neutral-400">Choose a section from the library to preview.</p>
    </div>
  );
}

