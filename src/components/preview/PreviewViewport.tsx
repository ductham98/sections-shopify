"use client";

import React, { useRef, useEffect } from "react";
import { ViewportPreset } from "@/lib/preview/preview-types";
import { DatasetId } from "@/lib/preview/mock-data/types";

interface PreviewViewportProps {
  sectionId: string;
  viewportWidth: number;
  viewportPreset: ViewportPreset;
  contentHeight: number;
  refreshKey: number;
  selectedDataset?: DatasetId;
  productLimit?: number;
  settingsOverrides?: Record<string, unknown>;
  onHeightMeasured?: (height: number) => void;
  fallbackHtml?: string;
}

export function PreviewViewport({
  sectionId,
  viewportWidth,
  viewportPreset,
  contentHeight,
  refreshKey,
  selectedDataset = "general",
  productLimit,
  settingsOverrides,
  onHeightMeasured,
  fallbackHtml,
}: PreviewViewportProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = viewportPreset === "mobile" || viewportPreset === "small-mobile";

  // Measure content height from iframe directly on load and whenever refreshed
  const measureDirect = React.useCallback(() => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        const root = doc.getElementById("shopify-section-preview-root") || doc.body;
        const measured = Math.max(
          root.scrollHeight,
          root.offsetHeight,
          doc.body.scrollHeight,
          doc.body.offsetHeight,
          doc.documentElement.scrollHeight
        );
        if (measured >= 20 && onHeightMeasured) {
          onHeightMeasured(measured);
        }
      }
    } catch {
      // Handled gracefully via postMessage listener in parent
    }
  }, [onHeightMeasured]);

  useEffect(() => {
    measureDirect();
    const t1 = setTimeout(measureDirect, 100);
    const t2 = setTimeout(measureDirect, 400);
    const t3 = setTimeout(measureDirect, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [refreshKey, sectionId, measureDirect]);

  // Construct iframe URL with dataset, product limit, and settings overrides
  const queryParams = new URLSearchParams();
  queryParams.set("v", String(refreshKey));
  if (selectedDataset && selectedDataset !== "general") {
    queryParams.set("dataset", selectedDataset);
  }
  if (productLimit && productLimit !== 8) {
    queryParams.set("limit", String(productLimit));
  }
  if (settingsOverrides && Object.keys(settingsOverrides).length > 0) {
    queryParams.set("settings", encodeURIComponent(JSON.stringify(settingsOverrides)));
  }

  const iframeSrc = `/preview/render/${sectionId}?${queryParams.toString()}`;

  return (
    <div
      className={`preview-viewport relative bg-white transition-[box-shadow] duration-200 ${
        isMobile
          ? "rounded-[24px] shadow-2xl border border-neutral-300"
          : "rounded-md shadow-sm border border-neutral-300/80"
      }`}
      style={{
        width: `${viewportWidth}px`,
        minWidth: `${viewportWidth}px`,
        maxWidth: `${viewportWidth}px`,
        overflow: "hidden",
      }}
    >
      {/* Mobile Chassis Frame (Top Notch, Speaker, Time) */}
      {isMobile && (
        <div className="w-full h-6 bg-neutral-100/95 border-b border-neutral-200 flex items-center justify-between px-6 text-[10px] text-neutral-500 font-medium select-none shrink-0">
          <span>9:41</span>
          <div className="w-16 h-3 bg-neutral-300/80 rounded-full" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
          </div>
        </div>
      )}

      {/* Sandboxed Iframe Container */}
      <div
        className="w-full relative bg-white overflow-hidden"
        style={{
          height: `${Math.max(contentHeight, 100)}px`,
        }}
      >
        <iframe
          key={`preview-iframe-${sectionId}-${refreshKey}`}
          ref={iframeRef}
          src={iframeSrc}
          srcDoc={fallbackHtml || undefined}
          title={`Shopify Section Preview - ${sectionId}`}
          onLoad={measureDirect}
          className="w-full h-full border-0 bg-white block"
          sandbox="allow-scripts allow-same-origin"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
