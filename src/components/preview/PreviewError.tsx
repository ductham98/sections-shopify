"use client";

import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";

interface PreviewErrorProps {
  message: string;
  onRetry: () => void;
}

export function PreviewError({ message, onRetry }: PreviewErrorProps) {
  return (
    <div className="max-w-xl mx-auto my-12 p-6 rounded-xl border border-red-200 bg-red-50 text-red-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-red-900">
            Preview Rendering Issue
          </h3>
          <p className="mt-1 text-xs text-red-700 leading-relaxed font-mono bg-white/70 p-3 rounded border border-red-100 overflow-x-auto">
            {message}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition active:scale-[0.98]"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Rendering</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

