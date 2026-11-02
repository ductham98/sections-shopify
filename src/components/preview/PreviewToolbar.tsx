"use client";

import React from "react";
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Copy,
  Check,
  Sliders,
} from "lucide-react";
import { ViewportPreset } from "@/lib/preview/preview-types";
import { PreviewStatus, PreviewStatusType } from "./PreviewStatus";

export interface PreviewToolbarProps {
  sectionTitle?: string;
  status: PreviewStatusType;
  viewportPreset: ViewportPreset;
  onViewportPresetChange: (preset: ViewportPreset) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToView: () => void;
  isFitToView: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCopyCode?: () => void;
  codeCopied?: boolean;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
  hasOverrides?: boolean;
}

export function PreviewToolbar({
  sectionTitle,
  status,
  viewportPreset,
  onViewportPresetChange,
  zoom,
  onZoomChange,
  onFitToView,
  isFitToView,
  onRefresh,
  isRefreshing,
  onCopyCode,
  codeCopied,
  isInspectorOpen,
  onToggleInspector,
  hasOverrides,
}: PreviewToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  const handleZoomOut = () => {
    const next = Math.max(Math.round((zoom - 0.1) * 10) / 10, 0.25);
    onZoomChange(next);
  };

  const handleZoomIn = () => {
    const next = Math.min(Math.round((zoom + 0.1) * 10) / 10, 1.5);
    onZoomChange(next);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-white border-b border-[#E5E7EB] shrink-0 text-xs text-neutral-600 gap-3 flex-wrap select-none">
      {/* Left: Section Title & Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        {sectionTitle && (
          <span className="font-semibold text-neutral-900 truncate max-w-[160px] sm:max-w-[220px]">
            {sectionTitle}
          </span>
        )}
        <PreviewStatus status={status} />
      </div>

      {/* Center: Viewport Presets */}
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/80">
        <button
          onClick={() => onViewportPresetChange("desktop")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
            viewportPreset === "desktop"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Desktop (1440px)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        <button
          onClick={() => onViewportPresetChange("laptop")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
            viewportPreset === "laptop"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Laptop (1280px)"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Laptop</span>
        </button>

        <button
          onClick={() => onViewportPresetChange("tablet")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
            viewportPreset === "tablet"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Tablet (768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tablet</span>
        </button>

        <button
          onClick={() => onViewportPresetChange("mobile")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
            viewportPreset === "mobile"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Mobile (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile</span>
        </button>

        <button
          onClick={() => onViewportPresetChange("small-mobile")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
            viewportPreset === "small-mobile"
              ? "bg-white text-neutral-900 shadow-2xs font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          title="Small Mobile (375px)"
        >
          <Smartphone className="w-3 h-3 text-neutral-400" />
          <span className="hidden sm:inline">Small Mobile</span>
        </button>
      </div>

      {/* Right: Inspector, Zoom controls, Refresh & Copy */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Inspector Toggle Button */}
        {onToggleInspector && (
          <button
            onClick={onToggleInspector}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              isInspectorOpen
                ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                : hasOverrides
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
            title="Open Preview Inspector (Customize schema settings, dataset, and mock data)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize</span>
            {hasOverrides && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />}
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.25}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 font-mono text-[11px] font-semibold text-neutral-700 min-w-[42px] text-center select-none">
            {zoomPercent}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 1.5}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fit to View Button */}
        <button
          onClick={onFitToView}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
            isFitToView
              ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
          title="Fit viewport cleanly inside workspace"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Fit to view</span>
        </button>

        {/* Refresh Preview */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-medium transition cursor-pointer active:scale-95 disabled:opacity-50"
          title="Recompile section preview"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-neutral-900" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Copy Code */}
        {onCopyCode && (
          <button
            onClick={onCopyCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer active:scale-95 shadow-2xs ${
              codeCopied
                ? "bg-emerald-600 text-white border border-emerald-600"
                : "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900"
            }`}
            title="Copy full original Liquid code"
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
        )}
      </div>
    </div>
  );
}
