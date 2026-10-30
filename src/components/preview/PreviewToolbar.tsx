"use client";

import React from "react";
import { Monitor, Smartphone, RotateCw, Copy, Check } from "lucide-react";
import { DeviceMode, PresentationMode } from "@/lib/preview/preview-types";

interface PreviewToolbarProps {
  device: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
  presentationMode: PresentationMode;
  onPresentationModeChange: (mode: PresentationMode) => void;
  viewportWidth: number;
  onViewportWidthChange: (width: number) => void;
  scalePercent: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCopyCode: () => void;
  codeCopied: boolean;
}

export function PreviewToolbar({
  device,
  onDeviceChange,
  presentationMode,
  onPresentationModeChange,
  viewportWidth,
  onViewportWidthChange,
  scalePercent,
  onRefresh,
  isRefreshing,
  onCopyCode,
  codeCopied,
}: PreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-white border-b border-[#E5E7EB] shrink-0 text-xs text-neutral-600 gap-3 flex-wrap select-none">
      {/* Left: Device Mode Toggles */}
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80">
        <button
          onClick={() => onDeviceChange("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
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
          onClick={() => onDeviceChange("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
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

      {/* Center: Mode Toggles (Overview / Full Size) + Viewport width presets + Scale badge */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Mode Toggles */}
        <div className="flex items-center gap-1 bg-neutral-100/90 p-1 rounded-lg border border-neutral-200/80">
          <button
            onClick={() => onPresentationModeChange("overview")}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              presentationMode === "overview"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
            title="Overview: Auto-fit complete section into workspace without scrolling"
          >
            Overview
          </button>
          <button
            onClick={() => onPresentationModeChange("full")}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              presentationMode === "full"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
            title="Full Size: Inspect at 100% actual dimensions with scrolling"
          >
            Full Size
          </button>
        </div>

        {/* Viewport Width Presets */}
        <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-lg border border-neutral-200/60">
          {device === "desktop" ? (
            <>
              <button
                onClick={() => onViewportWidthChange(1200)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  viewportWidth === 1200
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="1200px Desktop Viewport"
              >
                1200px
              </button>
              <button
                onClick={() => onViewportWidthChange(1440)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  viewportWidth === 1440
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="1440px Wide Desktop Viewport"
              >
                1440px
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onViewportWidthChange(375)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  viewportWidth === 375
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="375px Compact Mobile"
              >
                375px
              </button>
              <button
                onClick={() => onViewportWidthChange(390)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  viewportWidth === 390
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="390px Standard Mobile"
              >
                390px
              </button>
              <button
                onClick={() => onViewportWidthChange(430)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  viewportWidth === 430
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                title="430px Large Mobile"
              >
                430px
              </button>
            </>
          )}
        </div>

        {/* Scale Indicator */}
        <span
          className="px-2 py-1 rounded bg-neutral-100 text-neutral-600 font-mono text-[11px] border border-neutral-200/80 font-medium"
          title={`Current rendering scale: ${Math.round(scalePercent * 100)}%`}
        >
          {Math.round(scalePercent * 100)}%
        </span>
      </div>

      {/* Right: Refresh & Copy Code */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 font-medium transition active:scale-95 disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Reload preview template"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-neutral-900" : "text-neutral-500"}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          onClick={onCopyCode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition active:scale-95 shadow-2xs cursor-pointer ${
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
