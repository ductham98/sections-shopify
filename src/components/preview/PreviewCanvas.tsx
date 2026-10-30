"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { DeviceMode, ViewportWidth } from "@/lib/preview/preview-types";
import { DeviceFrame } from "./DeviceFrame";

interface PreviewCanvasProps {
  html: string;
  device: DeviceMode;
  viewportWidth: ViewportWidth;
  onScaleChange: (scale: number) => void;
  refreshKey: number;
}

export function PreviewCanvas({
  html,
  device,
  viewportWidth,
  onScaleChange,
  refreshKey,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(600);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  // Measure container width for responsive scaling if target width > available width
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Listen to postMessage from iframe for dynamic height
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "shopify-preview-height" && typeof event.data.height === "number") {
        if (event.data.height > 50) {
          setContentHeight(event.data.height + 30);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Compute actual target width and scale factor
  let targetWidthPx: number;
  let isFitMode = false;

  if (device === "mobile") {
    targetWidthPx = typeof viewportWidth === "number" ? viewportWidth : 390;
  } else {
    if (viewportWidth === "fit") {
      isFitMode = true;
      targetWidthPx = Math.max(containerWidth - 48, 320);
    } else {
      targetWidthPx = typeof viewportWidth === "number" ? viewportWidth : 1200;
    }
  }

  // Calculate fit scale if canvas container is smaller than target viewport (e.g. 1440px on a 1200px laptop screen)
  const availableCanvasWidth = Math.max(containerWidth - (device === "mobile" ? 48 : 48), 300);
  const scale = (!isFitMode && targetWidthPx > availableCanvasWidth)
    ? availableCanvasWidth / targetWidthPx
    : 1;

  useEffect(() => {
    onScaleChange(scale);
  }, [scale, onScaleChange]);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full bg-[#F1F2F4] overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col items-center min-h-[400px]"
    >
      {device === "mobile" ? (
        <DeviceFrame width={targetWidthPx}>
          <div
            className="w-full relative bg-white overflow-hidden"
            style={{
              height: `${Math.max(contentHeight, 620)}px`,
              maxHeight: "75vh",
              overflowY: "auto",
            }}
          >
            <iframe
              key={`iframe-m-${refreshKey}-${targetWidthPx}`}
              ref={iframeRef}
              srcDoc={html}
              title="Shopify Mobile Preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </DeviceFrame>
      ) : (
        /* Desktop Storefront Canvas */
        <div
          className="relative transition-all duration-200 mx-auto my-2"
          style={{
            width: isFitMode ? "100%" : `${targetWidthPx * scale}px`,
            maxWidth: "100%",
          }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-sm border border-neutral-300/80 bg-white"
            style={{
              width: isFitMode ? "100%" : `${targetWidthPx}px`,
              transform: isFitMode ? "none" : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              key={`iframe-d-${refreshKey}-${targetWidthPx}-${isFitMode ? "fit" : "fixed"}`}
              ref={iframeRef}
              srcDoc={html}
              title="Shopify Desktop Preview"
              className="w-full border-0 bg-white block"
              style={{
                height: `${Math.max(contentHeight, 520)}px`,
                minHeight: "520px",
              }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
}

