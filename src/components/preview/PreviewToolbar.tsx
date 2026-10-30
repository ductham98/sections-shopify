"use client";

import React from "react";
import { Monitor, Smartphone, RotateCw, Copy, Check } from "lucide-react";
import { DeviceMode, DesktopViewportWidth, MobileViewportWidth, ViewportWidth } from "@/lib/preview/preview-types";

interface PreviewToolbarProps {
  device: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
  viewportWidth: ViewportWidth;
  onViewportWidthChange: (width: ViewportWidth) => void;
  scalePercent: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCopyCode: () => void;
  codeCopied: boolean;
}

const DESKTOP_PRESETS: Array<{ value: DesktopViewportWidth; label: string }> = [
  { value: "fit", label: "Fit" },
  { value: 1200, label: "1200px" },
  { value: 1440, label: "1440px" },
];

const MOBILE_PRESETS: Array<{ value: MobileViewportWidth; label: string }> = [
  { value: 375, label: "375px (SE)" },
  { value: 390, label: "390px (Pro)" },
  { value: 430, label: "430px (Max)" },
];

export function PreviewToolbar({
  device,
  onDeviceChange,
  viewportWidth,
  onViewportWidthChange,
  scalePercent,
  onRefresh,
  isRefreshing,
  onCopyCode,
  codeCopied,
}: PreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-white border-b border-[#E5E7EB] shrink-0 text-xs text-neutral-600 gap-3 flex-wrap">
      {/* Left: Device Mode Toggles */}
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80">
        <button
          onClick={() => {
            onDeviceChange("desktop");
            onViewportWidthChange("fit");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
            device === "desktop"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Desktop Storefront Preview"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        <button
          onClick={() => {
            onDeviceChange("mobile");
            onViewportWidthChange(390);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
            device === "mobile"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Mobile Storefront Preview"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Center: Viewport Presets & Zoom Info */}
      <div className="flex items-center gap-2">
        <span className="text-neutral-400 text-[11px] hidden md:inline">Viewport:</span>
        <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-lg border border-neutral-200/60">
          {device === "desktop"
            ? DESKTOP_PRESETS.map((p) => (
                <button
                  key={String(p.value)}
                  onClick={() => onViewportWidthChange(p.value)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                    viewportWidth === p.value
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {p.label}
                </button>
              ))
            : MOBILE_PRESETS.map((p) => (
                <button
                  key={String(p.value)}
                  onClick={() => onViewportWidthChange(p.value)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                    viewportWidth === p.value
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
        </div>

        {/* Zoom / Scale badge */}
        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono text-[11px] border border-neutral-200/60">
          {Math.round(scalePercent * 100)}%
        </span>
      </div>

      {/* Right: Refresh & Copy Code */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 font-medium transition active:scale-95 disabled:opacity-50 shadow-2xs"
          title="Reload preview template"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-neutral-900" : "text-neutral-500"}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          onClick={onCopyCode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition active:scale-95 shadow-2xs ${
            codeCopied
              ? "bg-emerald-600 text-white border border-emerald-600"
              : "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900"
          }`}
          title="Copy raw Liquid source code"
        >
          {codeCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
