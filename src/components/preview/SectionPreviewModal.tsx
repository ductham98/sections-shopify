"use client";

import React, { useState, useEffect } from "react";
import { ActivePreviewState } from "@/lib/preview/use-active-preview";
import { fetchSectionCode } from "@/lib/section-client";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewWorkspace } from "./PreviewWorkspace";
import { PreviewStatusType } from "./PreviewStatus";

export interface SectionPreviewModalProps {
  isOpen: boolean;
  state: ActivePreviewState;
  onClose: () => void;
  onRefresh: () => void;
  onDeviceChange?: (device: "desktop" | "mobile") => void;
  onPresentationModeChange?: (mode: "overview" | "full") => void;
  onViewportWidthChange?: (width: number) => void;
  onScaleChange?: (scale: number) => void;
  onCopySuccess: (title: string) => void;
}

export function SectionPreviewModal({
  isOpen,
  state,
  onClose,
  onRefresh,
  onCopySuccess,
}: SectionPreviewModalProps) {
  const [codeCopied, setCodeCopied] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Keyboard shortcut: ESC closes modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Copy Liquid source code
  const handleCopyCode = async () => {
    if (!state.section) return;
    try {
      const code = state.code || (await fetchSectionCode(state.section.id));
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      onCopySuccess(state.section.title);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy Liquid code:", err);
    }
  };

  if (!isOpen || !state.section) {
    return null;
  }

  const statusType: PreviewStatusType =
    state.status === "loading"
      ? "compiling"
      : state.status === "error"
      ? "error"
      : "ready";

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
          section={state.section}
          status={statusType}
          onClose={onClose}
        />

        {/* B. Sandboxed Iframe Preview Workspace with Preview Inspector */}
        <PreviewWorkspace
          sectionId={state.section.id}
          sectionTitle={state.section.title}
          filename={state.section.filename}
          status={statusType}
          schema={state.schema}
          dependencyAnalysis={state.dependencyAnalysis}
          html={state.compiledHtml}
          error={state.error}
          isRefreshing={state.isRefreshing || state.status === "loading"}
          onRefresh={onRefresh}
          onCopyCode={handleCopyCode}
          codeCopied={codeCopied}
        />
      </div>
    </div>
  );
}
