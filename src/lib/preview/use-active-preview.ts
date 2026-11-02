"use client";

import { useState, useCallback, useRef } from "react";
import { DiscoveredSectionMeta } from "@/lib/section-discovery";
import { DeviceMode, PresentationMode, SectionSchema } from "./preview-types";
import { compileSectionPreview } from "./preview-compiler";
import { SectionSourceManager, SectionDependencyAnalysis } from "./source-manager";
import { extractSchema } from "./schema-engine";
import { fetchSectionCode, invalidateSectionCode } from "@/lib/section-client";

export type PreviewLifecycleStatus = "idle" | "loading" | "ready" | "error";

export interface ActivePreviewState {
  section: DiscoveredSectionMeta | null;
  code: string | null;
  status: PreviewLifecycleStatus;
  device: DeviceMode;
  presentationMode: PresentationMode;
  viewportWidth: number;
  scale: number;
  compiledHtml: string | null;
  schema?: SectionSchema;
  dependencyAnalysis?: SectionDependencyAnalysis;
  error?: string;
  isRefreshing: boolean;
}

const previewHtmlCache = new Map<string, string>();

export function useActivePreview() {
  const [state, setState] = useState<ActivePreviewState>({
    section: null,
    code: null,
    status: "idle",
    device: "desktop",
    presentationMode: "overview",
    viewportWidth: 1440,
    scale: 1,
    compiledHtml: null,
    isRefreshing: false,
  });

  const activeRequestIdRef = useRef<number>(0);

  /**
   * Opens preview for a section, analyzing schema and source.
   */
  const openPreview = useCallback(async (section: DiscoveredSectionMeta) => {
    const currentRequestId = ++activeRequestIdRef.current;

    setState((prev) => ({
      ...prev,
      section,
      code: null,
      status: "loading",
      compiledHtml: previewHtmlCache.get(section.id) || null,
      error: undefined,
      device: "desktop",
      presentationMode: "overview",
      viewportWidth: 1440,
      scale: 1,
    }));

    try {
      const code = await fetchSectionCode(section.id);
      if (activeRequestIdRef.current !== currentRequestId) return;

      const { schema } = extractSchema(code);
      const dependencyAnalysis = SectionSourceManager.analyzeDependencies(code);

      const cached = previewHtmlCache.get(section.id);
      if (cached) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: cached,
          schema: schema || undefined,
          dependencyAnalysis,
          status: "ready",
          error: undefined,
        }));
        return;
      }

      const result = await compileSectionPreview(code, { sectionId: section.id });
      if (activeRequestIdRef.current !== currentRequestId) return;

      if (result.error) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
          schema: schema || undefined,
          dependencyAnalysis,
          status: "error",
          error: result.error,
        }));
      } else {
        previewHtmlCache.set(section.id, result.previewHtml);
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
          schema: schema || undefined,
          dependencyAnalysis,
          status: "ready",
          error: undefined,
        }));
      }
    } catch (err: unknown) {
      if (activeRequestIdRef.current !== currentRequestId) return;
      const msg = err instanceof Error ? err.message : String(err);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: msg,
      }));
    }
  }, []);

  const closePreview = useCallback(() => {
    activeRequestIdRef.current++;
    setState({
      section: null,
      code: null,
      status: "idle",
      device: "desktop",
      presentationMode: "overview",
      viewportWidth: 1440,
      scale: 1,
      compiledHtml: null,
      error: undefined,
      isRefreshing: false,
    });
  }, []);

  const refreshPreview = useCallback(async () => {
    if (!state.section) return;

    const currentRequestId = ++activeRequestIdRef.current;
    const section = state.section;

    setState((prev) => ({ ...prev, isRefreshing: true, status: "loading", error: undefined }));
    invalidateSectionCode(section.id);
    previewHtmlCache.delete(section.id);

    try {
      const code = await fetchSectionCode(section.id);
      if (activeRequestIdRef.current !== currentRequestId) return;

      const { schema } = extractSchema(code);
      const dependencyAnalysis = SectionSourceManager.analyzeDependencies(code);

      const result = await compileSectionPreview(code, { sectionId: section.id });
      if (activeRequestIdRef.current !== currentRequestId) return;

      if (result.error) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
          schema: schema || undefined,
          dependencyAnalysis,
          status: "error",
          error: result.error,
          isRefreshing: false,
        }));
      } else {
        previewHtmlCache.set(section.id, result.previewHtml);
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
          schema: schema || undefined,
          dependencyAnalysis,
          status: "ready",
          error: undefined,
          isRefreshing: false,
        }));
      }
    } catch (err: unknown) {
      if (activeRequestIdRef.current !== currentRequestId) return;
      const msg = err instanceof Error ? err.message : String(err);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: msg,
        isRefreshing: false,
      }));
    }
  }, [state.section]);

  const setDevice = useCallback((device: DeviceMode) => {
    setState((prev) => ({
      ...prev,
      device,
      viewportWidth: device === "mobile" ? 390 : 1440,
    }));
  }, []);

  const setPresentationMode = useCallback((presentationMode: PresentationMode) => {
    setState((prev) => ({ ...prev, presentationMode }));
  }, []);

  const setViewportWidth = useCallback((viewportWidth: number) => {
    setState((prev) => ({ ...prev, viewportWidth }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, scale }));
  }, []);

  return {
    state,
    openPreview,
    closePreview,
    refreshPreview,
    setDevice,
    setPresentationMode,
    setViewportWidth,
    setScale,
  };
}
