"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { DeviceMode, PresentationMode } from "@/lib/preview/preview-types";
import { DeviceFrame } from "./DeviceFrame";

interface PreviewCanvasProps {
  html: string;
  device: DeviceMode;
  presentationMode: PresentationMode;
  viewportWidth: number;
  onScaleChange: (scale: number) => void;
  refreshKey: number;
}

export function PreviewCanvas({
  html,
  device,
  presentationMode,
  viewportWidth,
  onScaleChange,
  refreshKey,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(500);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1200, height: 800 });

  // Monitor available workspace dimensions via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasDimensions({ width, height });
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure iframe content height directly from contentDocument
  const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        const root = doc.getElementById("shopify-section-preview-root") || doc.body;
        const measured = Math.max(
          root.scrollHeight,
          root.offsetHeight,
          doc.body.scrollHeight,
          doc.body.offsetHeight
        );
        if (measured >= 20) {
          setContentHeight(measured);
        }
      }
    } catch {
      // Fallback in case of cross-origin isolation
    }
  }, []);

  // Reset and re-measure whenever HTML changes
  useEffect(() => {
    // Initial check
    measureIframeHeight();
    const timer1 = setTimeout(measureIframeHeight, 100);
    const timer2 = setTimeout(measureIframeHeight, 400);
    const timer3 = setTimeout(measureIframeHeight, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [html, measureIframeHeight, refreshKey]);

  // Listen to postMessage from iframe for dynamic height changes (accordion toggle, tabs, etc.)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "shopify-preview-height" &&
        typeof event.data.height === "number" &&
        event.data.height >= 20
      ) {
        setContentHeight(event.data.height);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Target internal CSS viewport
  const targetWidth =
    device === "mobile"
      ? (viewportWidth >= 300 && viewportWidth <= 500 ? viewportWidth : 390)
      : (viewportWidth >= 1000 ? viewportWidth : 1200);

  // Available workspace space with comfortable 32–48px whitespace margins
  const paddingX = canvasDimensions.width < 640 ? 32 : 80;
  const paddingY = canvasDimensions.width < 640 ? 32 : 80;
  const availW = Math.max(canvasDimensions.width - paddingX, 280);
  const availH = Math.max(canvasDimensions.height - paddingY, 200);

  const currentHeight = Math.max(contentHeight, 44);
  const mobileScreenHeight = Math.min(Math.max(currentHeight, 120), 740);

  // Intelligent Showcase Fit-to-View Scale calculation
  let scale = 1.0;

  if (device === "mobile") {
    const frameW = targetWidth + 16;
    const frameH = mobileScreenHeight + 16;

    if (presentationMode === "fit") {
      const scaleX = availW / frameW;
      const scaleY = availH / frameH;
      const rawScale = Math.min(scaleX, scaleY, 1.0);
      scale = Math.round(rawScale * 100) / 100;
    } else {
      scale = 1.0;
    }
  } else {
    // Desktop Section Showcase
    if (presentationMode === "fit") {
      const scaleX = availW / targetWidth;
      const scaleY = currentHeight > 0 ? availH / currentHeight : 1.0;

      // In showcase mode: scale down to fit width, and scale down for tall sections with a sensible floor of 0.65
      const effectiveHeightScale = Math.max(scaleY, 0.65);
      const rawScale = Math.min(scaleX, effectiveHeightScale, 1.0);
      scale = Math.round(rawScale * 100) / 100;
    } else {
      scale = 1.0;
    }
  }

  // Notify toolbar of current zoom percentage
  useEffect(() => {
    onScaleChange(scale);
  }, [scale, onScaleChange]);

  // Scaled dimensions that the layout box will physically occupy
  const scaledDesktopW = Math.round(targetWidth * scale);
  const scaledDesktopH = Math.round(currentHeight * scale);
  const scaledMobileW = Math.round((targetWidth + 16) * scale);
  const scaledMobileH = Math.round((mobileScreenHeight + 16) * scale);

  // Check if content exceeds available height to switch from vertical center to top-alignment (prevent clipping top)
  const isTallerThanCanvas =
    device === "mobile"
      ? scaledMobileH > availH
      : scaledDesktopH > availH;

  return (
    <div
      ref={containerRef}
      className="preview-canvas flex-1 w-full bg-[#F1F2F4] overflow-auto p-4 sm:p-8 lg:p-10 flex"
    >
      <div
        className="preview-stage w-full min-h-full flex flex-col items-center m-auto transition-all duration-200"
        style={{
          justifyContent: isTallerThanCanvas ? "flex-start" : "center",
        }}
      >
        {device === "mobile" ? (
          /* Scaled Mobile Device Frame */
          <div
            className="preview-content relative transition-all duration-200"
            style={{
              width: `${scaledMobileW}px`,
              height: `${scaledMobileH}px`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: `${targetWidth + 16}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <DeviceFrame width={targetWidth}>
                <div
                  className="w-full relative bg-white overflow-hidden"
                  style={{
                    height: `${mobileScreenHeight}px`,
                    overflowY: "auto",
                  }}
                >
                  <iframe
                    key={`iframe-m-${refreshKey}-${targetWidth}`}
                    ref={iframeRef}
                    srcDoc={html}
                    title="Shopify Mobile Preview"
                    onLoad={measureIframeHeight}
                    className="w-full h-full border-0 bg-white block"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </DeviceFrame>
            </div>
          </div>
        ) : (
          /* Scaled Desktop Showcase Canvas */
          <div
            className="preview-content relative transition-all duration-200"
            style={{
              width: `${scaledDesktopW}px`,
              height: `${scaledDesktopH}px`,
              flexShrink: 0,
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-sm border border-neutral-300/80 bg-white"
              style={{
                width: `${targetWidth}px`,
                height: `${currentHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <iframe
                key={`iframe-d-${refreshKey}-${targetWidth}-${presentationMode}`}
                ref={iframeRef}
                srcDoc={html}
                title="Shopify Desktop Preview"
                onLoad={measureIframeHeight}
                className="w-full h-full border-0 bg-white block"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
