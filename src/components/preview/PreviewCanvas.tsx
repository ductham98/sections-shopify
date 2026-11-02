"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ViewportPreset, VIEWPORT_PRESETS } from "@/lib/preview/preview-types";
import { DatasetId } from "@/lib/preview/mock-data/types";
import { PreviewViewport } from "./PreviewViewport";

export interface PreviewCanvasProps {
  sectionId: string;
  viewportPreset: ViewportPreset;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isFitToView: boolean;
  refreshKey: number;
  selectedDataset?: DatasetId;
  productLimit?: number;
  settingsOverrides?: Record<string, unknown>;
  fallbackHtml?: string;
}

export function PreviewCanvas({
  sectionId,
  viewportPreset,
  zoom,
  onZoomChange,
  isFitToView,
  refreshKey,
  selectedDataset,
  productLimit,
  settingsOverrides,
  fallbackHtml,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(600);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1200, height: 700 });

  // Current simulated viewport width
  const viewportWidth = VIEWPORT_PRESETS[viewportPreset].width;

  // Measure workspace canvas container dimensions
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const ro = new ResizeObserver((entries) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setCanvasDimensions({ width, height });
          }
        }
      });
    });

    ro.observe(el);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // Listen to postMessage from sandboxed iframe for dynamic height changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "shopify-preview-dimensions" &&
        typeof event.data.height === "number" &&
        event.data.height >= 20
      ) {
        setContentHeight(event.data.height);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Compute optimal Fit-to-View zoom
  const computeFitZoom = useCallback(
    (targetW: number, containerW: number) => {
      const availW = Math.max(containerW - 64, 300);
      if (targetW <= availW) {
        return 1.0;
      }
      const raw = availW / targetW;
      const floored = Math.floor(raw * 100) / 100;
      return Math.max(Math.min(floored, 1.5), 0.25);
    },
    []
  );

  // Recalculate zoom when Fit-to-view is active or container / viewport changes
  useEffect(() => {
    if (isFitToView) {
      const idealZoom = computeFitZoom(viewportWidth, canvasDimensions.width);
      onZoomChange(idealZoom);
    }
  }, [isFitToView, viewportWidth, canvasDimensions.width, computeFitZoom, onZoomChange]);

  const handleHeightMeasured = useCallback((measured: number) => {
    if (measured >= 20) {
      setContentHeight(measured);
    }
  }, []);

  // Physical layout dimensions for the display wrapper
  const displayW = Math.round(viewportWidth * zoom);
  const displayH = Math.round(contentHeight * zoom);

  return (
    <div
      ref={containerRef}
      className="preview-canvas flex-1 w-full min-h-0 bg-[#F1F2F4] p-4 sm:p-8 overflow-y-auto overflow-x-hidden preview-scrollbar flex flex-col items-center"
    >
      <div
        className="preview-stage w-full flex flex-col items-center transition-all duration-150"
        style={{
          minHeight: "100%",
          margin: contentHeight * zoom < canvasDimensions.height - 80 ? "auto 0" : "0",
        }}
      >
        {/* Physical layout wrapper that reserves exact scaled dimensions */}
        <div
          className="preview-display-wrapper relative shrink-0 transition-[width,height] duration-150"
          style={{
            width: `${displayW}px`,
            height: `${displayH}px`,
          }}
        >
          {/* Scaled sandboxed iframe container */}
          <div
            className="preview-scaled-box absolute top-0 left-0"
            style={{
              width: `${viewportWidth}px`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            <PreviewViewport
              sectionId={sectionId}
              viewportWidth={viewportWidth}
              viewportPreset={viewportPreset}
              contentHeight={contentHeight}
              refreshKey={refreshKey}
              selectedDataset={selectedDataset}
              productLimit={productLimit}
              settingsOverrides={settingsOverrides}
              onHeightMeasured={handleHeightMeasured}
              fallbackHtml={fallbackHtml}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
