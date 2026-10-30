"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SectionItem } from "@/lib/sections";
import { DeviceMode, ViewportWidth } from "@/lib/preview/preview-types";
import { compileSectionPreview } from "@/lib/preview/preview-compiler";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewCanvas } from "./PreviewCanvas";
import { PreviewError } from "./PreviewError";
import { PreviewStatusType } from "./PreviewStatus";

interface SectionPreviewModalProps {
  section: SectionItem | null;
  onClose: () => void;
  onCopySuccess: (title: string) => void;
}

interface DialogContentProps {
  section: SectionItem;
  onClose: () => void;
  onCopySuccess: (title: string) => void;
}

function SectionPreviewDialogContent({
  section,
  onClose,
  onCopySuccess,
}: DialogContentProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [viewportWidth, setViewportWidth] = useState<ViewportWidth>("fit");
  const [scalePercent, setScalePercent] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentHtml, setCurrentHtml] = useState<string>(section.previewHtml || "");
  const [status, setStatus] = useState<PreviewStatusType>("ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard shortcut: ESC closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Recompile / refresh preview
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setStatus("compiling");
    setErrorMessage(null);

    try {
      const res = await compileSectionPreview(section.code, {
        sectionId: section.filename.replace(/\.liquid$/, ""),
      });

      if (res.error) {
        setStatus("error");
        setErrorMessage(res.error);
      } else {
        setCurrentHtml(res.previewHtml);
        setStatus("ready");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus("error");
      setErrorMessage(msg);
    } finally {
      setRefreshKey((k) => k + 1);
      setTimeout(() => setIsRefreshing(false), 300);
    }
  }, [section]);

  // Copy Liquid source code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(section.code);
      setCodeCopied(true);
      onCopySuccess(section.title);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy Liquid code:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Dimmed Overlay */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Shell */}
      <div className="relative z-10 w-full h-full sm:w-[95vw] sm:h-[92vh] lg:w-[92vw] lg:max-w-[1500px] lg:h-[90vh] lg:max-h-[1000px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200">
        {/* A. Sticky Header */}
        <PreviewHeader
          section={section}
          status={status}
          onClose={onClose}
        />

        {/* B. Sticky Preview Toolbar */}
        <PreviewToolbar
          device={device}
          onDeviceChange={setDevice}
          viewportWidth={viewportWidth}
          onViewportWidthChange={setViewportWidth}
          scalePercent={scalePercent}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onCopyCode={handleCopyCode}
          codeCopied={codeCopied}
        />

        {/* C. Dedicated Scrollable Preview Workspace */}
        {errorMessage ? (
          <div className="flex-1 bg-[#F1F2F4] p-6 overflow-y-auto">
            <PreviewError
              message={errorMessage}
              onRetry={handleRefresh}
            />
          </div>
        ) : (
          <PreviewCanvas
            html={currentHtml}
            device={device}
            viewportWidth={viewportWidth}
            onScaleChange={setScalePercent}
            refreshKey={refreshKey}
          />
        )}
      </div>
    </div>
  );
}

export function SectionPreviewModal({
  section,
  onClose,
  onCopySuccess,
}: SectionPreviewModalProps) {
  if (!section) return null;

  return (
    <SectionPreviewDialogContent
      key={section.id}
      section={section}
      onClose={onClose}
      onCopySuccess={onCopySuccess}
    />
  );
}
