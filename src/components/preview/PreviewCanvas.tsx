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
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1200, height: 700 });

  // Monitor available workspace dimensions via ResizeObserver
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
      // Fallback in case of sandboxed isolation
    }
  }, []);

  // Trigger measurement on HTML change, iframe load, and interval fallbacks
  useEffect(() => {
    measureIframeHeight();
    const t1 = setTimeout(measureIframeHeight, 80);
    const t2 = setTimeout(measureIframeHeight, 300);
    const t3 = setTimeout(measureIframeHeight, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [html, measureIframeHeight, refreshKey]);

  // Listen to postMessage from iframe for dynamic height changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        (event.data.type === "shopify-preview-dimensions" || event.data.type === "shopify-preview-height") &&
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
      ? ([375, 390, 430].includes(viewportWidth) ? viewportWidth : 390)
      : (viewportWidth === 1440 ? 1440 : 1200);

  // Available workspace space from contentRect (inner dimensions inside padding, with a 6px safety margin)
  const availW = Math.max(canvasDimensions.width - 6, 280);
  const availH = Math.max(canvasDimensions.height - 6, 160);

  const sectionInternalHeight = Math.max(contentHeight, 40);

  // Calculate natural unscaled dimensions of the component to render
  const sectionW = device === "mobile" ? targetWidth + 16 : targetWidth;
  const sectionH = device === "mobile" ? sectionInternalHeight + 16 : sectionInternalHeight;

  // Scale calculation:
  // Overview: Fits entire section inside available canvas dimensions with no scrollbar
  // Full Size: 100% natural scale with vertical scrolling
  let scale = 1.0;
  if (presentationMode === "overview") {
    const scaleX = availW / sectionW;
    const scaleY = availH / sectionH;
    const rawScale = Math.min(scaleX, scaleY, 1.0);
    // Floor to 2 decimal places so visual size never exceeds availW or availH
    scale = Math.max(Math.floor(rawScale * 100) / 100, 0.1);
  } else {
    scale = 1.0;
  }

  // Notify parent/toolbar of current zoom percentage
  useEffect(() => {
    onScaleChange(scale);
  }, [scale, onScaleChange]);

  // Exact physical layout dimensions for the display wrapper
  const displayW = Math.round(sectionW * scale);
  const displayH = Math.round(sectionH * scale);

  // In Full Size mode, determine if content is taller than available height
  const isTallerThanCanvas = presentationMode === "full" && sectionH > availH;

  return (
    <div
      ref={containerRef}
      className={`preview-canvas flex-1 w-full min-h-0 bg-[#F1F2F4] p-4 sm:p-8 flex ${
        presentationMode === "overview"
          ? "preview-canvas--overview overflow-hidden items-center justify-center"
          : "preview-canvas--full overflow-y-auto overflow-x-hidden preview-scrollbar flex-col items-center"
      }`}
    >
      <div
        className="preview-stage w-full transition-all duration-200 flex flex-col items-center"
        style={{
          minHeight: presentationMode === "overview" ? "auto" : "100%",
          justifyContent: isTallerThanCanvas ? "flex-start" : "center",
          margin: presentationMode === "overview" ? "auto" : (isTallerThanCanvas ? "0 auto" : "auto"),
        }}
      >
        {device === "mobile" ? (
          /* Mobile Device Frame */
          <div
            className="preview-content relative transition-all duration-200"
            style={{
              width: `${displayW}px`,
              height: `${displayH}px`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: `${sectionW}px`,
                height: `${sectionH}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <DeviceFrame width={targetWidth}>
                <div
                  className="w-full relative bg-white overflow-hidden"
                  style={{
                    height: `${sectionInternalHeight}px`,
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
          /* Desktop Showcase Canvas */
          <div
            className="preview-content relative transition-all duration-200"
            style={{
              width: `${displayW}px`,
              height: `${displayH}px`,
              flexShrink: 0,
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-sm border border-neutral-300/80 bg-white"
              style={{
                width: `${targetWidth}px`,
                height: `${sectionInternalHeight}px`,
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
