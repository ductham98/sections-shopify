"use client";

import React, { useState, useCallback } from "react";
import { ViewportPreset, SectionSchema } from "@/lib/preview/preview-types";
import { DatasetId } from "@/lib/preview/mock-data/types";
import { SectionDependencyAnalysis } from "@/lib/preview/source-manager";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewCanvas } from "./PreviewCanvas";
import { PreviewInspector } from "./PreviewInspector";
import { PreviewLoading } from "./PreviewLoading";
import { PreviewError } from "./PreviewError";
import { PreviewEmpty } from "./PreviewEmpty";
import { PreviewStatusType } from "./PreviewStatus";

export interface PreviewWorkspaceProps {
  sectionId?: string;
  sectionTitle?: string;
  filename?: string;
  status: PreviewStatusType;
  schema?: SectionSchema;
  dependencyAnalysis?: SectionDependencyAnalysis;
  html?: string | null;
  error?: string;
  isRefreshing?: boolean;
  onRefresh: () => void;
  onCopyCode?: () => void;
  codeCopied?: boolean;
}

export function PreviewWorkspace({
  sectionId,
  sectionTitle,
  filename,
  status,
  schema,
  dependencyAnalysis,
  html,
  error,
  isRefreshing = false,
  onRefresh,
  onCopyCode,
  codeCopied = false,
}: PreviewWorkspaceProps) {
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>("desktop");
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFitToView, setIsFitToView] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(1);

  // Preview Inspector State
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<DatasetId>("general");
  const [productLimit, setProductLimit] = useState<number>(8);
  const [settingsOverrides, setSettingsOverrides] = useState<Record<string, unknown>>({});

  const handleViewportPresetChange = useCallback((preset: ViewportPreset) => {
    setViewportPreset(preset);
    setIsFitToView(true); // Automatically fit on viewport switch
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    setIsFitToView(false); // Manual zoom disables fit-to-view
  }, []);

  const handleFitToView = useCallback(() => {
    setIsFitToView(true);
  }, []);

  const handleRefreshClick = useCallback(() => {
    setRefreshKey((k) => k + 1);
    onRefresh();
  }, [onRefresh]);

  const handleSettingChange = useCallback((id: string, value: unknown) => {
    setSettingsOverrides((prev) => ({
      ...prev,
      [id]: value,
    }));
    setRefreshKey((k) => k + 1);
  }, []);

  const handleResetSettings = useCallback(() => {
    setSettingsOverrides({});
    setRefreshKey((k) => k + 1);
  }, []);

  const handleSelectDataset = useCallback((id: DatasetId) => {
    setSelectedDataset(id);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleProductLimitChange = useCallback((limit: number) => {
    setProductLimit(limit);
    setRefreshKey((k) => k + 1);
  }, []);

  const hasOverrides = Object.keys(settingsOverrides).length > 0 || selectedDataset !== "general" || productLimit !== 8;

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col bg-white overflow-hidden">
      {/* Top Preview Toolbar */}
      <PreviewToolbar
        sectionTitle={sectionTitle}
        status={status}
        viewportPreset={viewportPreset}
        onViewportPresetChange={handleViewportPresetChange}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onFitToView={handleFitToView}
        isFitToView={isFitToView}
        onRefresh={handleRefreshClick}
        isRefreshing={isRefreshing}
        onCopyCode={onCopyCode}
        codeCopied={codeCopied}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen((open) => !open)}
        hasOverrides={hasOverrides}
      />

      {/* Main Preview Area: Canvas + Collapsible Inspector */}
      <div className="flex-1 w-full min-h-0 flex overflow-hidden relative">
        {status === "compiling" && !sectionId ? (
          <PreviewLoading filename={filename} />
        ) : status === "error" && error ? (
          <div className="flex-1 w-full min-h-0 bg-[#F1F2F4] p-6 overflow-y-auto preview-scrollbar">
            <PreviewError
              message={error}
              onRetry={handleRefreshClick}
            />
          </div>
        ) : sectionId ? (
          <PreviewCanvas
            sectionId={sectionId}
            viewportPreset={viewportPreset}
            zoom={zoom}
            onZoomChange={(z) => setZoom(z)}
            isFitToView={isFitToView}
            refreshKey={refreshKey}
            selectedDataset={selectedDataset}
            productLimit={productLimit}
            settingsOverrides={settingsOverrides}
            fallbackHtml={html || undefined}
          />
        ) : (
          <PreviewEmpty />
        )}

        {/* Collapsible Preview Inspector Panel */}
        {sectionId && (
          <PreviewInspector
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
            sectionId={sectionId}
            schema={schema}
            settingsOverrides={settingsOverrides}
            onSettingChange={handleSettingChange}
            onResetSettings={handleResetSettings}
            selectedDataset={selectedDataset}
            onSelectDataset={handleSelectDataset}
            productLimit={productLimit}
            onProductLimitChange={handleProductLimitChange}
            dependencyAnalysis={dependencyAnalysis}
            sectionFilename={filename}
          />
        )}
      </div>
    </div>
  );
}

