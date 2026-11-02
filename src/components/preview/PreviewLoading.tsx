"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface PreviewLoadingProps {
  filename?: string;
}

export function PreviewLoading({ filename }: PreviewLoadingProps) {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 bg-[#F1F2F4] text-neutral-500">
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-neutral-200/80 shadow-xs">
        <Loader2 className="w-4 h-4 animate-spin text-neutral-700" />
        <span className="text-xs font-medium text-neutral-700">
          Compiling {filename ? filename : "section"} preview...
        </span>
      </div>
    </div>
  );
}

