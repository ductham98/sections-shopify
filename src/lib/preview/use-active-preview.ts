"use client";

import { useState, useCallback, useRef } from "react";
import { DiscoveredSectionMeta } from "@/lib/section-discovery";
import { DeviceMode, PresentationMode } from "./preview-types";
import { compileSectionPreview } from "./preview-compiler";
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
    viewportWidth: 1200,
    scale: 1,
    compiledHtml: null,
    isRefreshing: false,
  });

  // Track active request ID to prevent race conditions during rapid switching
  const activeRequestIdRef = useRef<number>(0);

  /**
   * Opens the preview for a selected section, canceling any previous compilation.
   * Resets to default Overview mode with default viewport width.
   */
  const openPreview = useCallback(async (section: DiscoveredSectionMeta) => {
    const currentRequestId = ++activeRequestIdRef.current;

    // Immediately switch active section and set loading state with Overview as default
    setState((prev) => ({
      ...prev,
      section,
      code: null,
      status: "loading",
      compiledHtml: previewHtmlCache.get(section.id) || null,
      error: undefined,
      device: "desktop",
      presentationMode: "overview",
      viewportWidth: 1200,
      scale: 1,
    }));

    try {
      // 1. Fetch raw Liquid code on demand
      const code = await fetchSectionCode(section.id);

      // Check if this request is still active
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      // 2. Check if we have cached compiled HTML for this section
      const cached = previewHtmlCache.get(section.id);
      if (cached) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: cached,
          status: "ready",
          error: undefined,
        }));
        return;
      }

      // 3. Compile Liquid to isolated HTML
      const result = await compileSectionPreview(code, { sectionId: section.id });

      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      if (result.error) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
          status: "error",
          error: result.error,
        }));
      } else {
        previewHtmlCache.set(section.id, result.previewHtml);
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
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

  /**
   * Closes and completely disposes of the active preview iframe and its DOM resources.
   */
  const closePreview = useCallback(() => {
    activeRequestIdRef.current++;
    setState({
      section: null,
      code: null,
      status: "idle",
      device: "desktop",
      presentationMode: "overview",
      viewportWidth: 1200,
      scale: 1,
      compiledHtml: null,
      error: undefined,
      isRefreshing: false,
    });
  }, []);

  /**
   * Refreshes the active preview by clearing the cache and recompiling.
   */
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

      const result = await compileSectionPreview(code, { sectionId: section.id });
      if (activeRequestIdRef.current !== currentRequestId) return;

      if (result.error) {
        setState((prev) => ({
          ...prev,
          code,
          compiledHtml: result.previewHtml,
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
      presentationMode: "overview",
      viewportWidth: device === "mobile" ? 390 : 1200,
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
