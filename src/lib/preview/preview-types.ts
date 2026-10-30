export type DeviceMode = "desktop" | "mobile";
export type PresentationMode = "overview" | "full";

export type DesktopViewportWidth = 1200 | 1440;
export type MobileViewportWidth = 375 | 390 | 430;
export type ViewportWidth = DesktopViewportWidth | MobileViewportWidth | "fit";

export interface SchemaSetting {
  type: string;
  id: string;
  label?: string;
  default?: unknown;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  info?: string;
}

export interface SchemaBlockPreset {
  type: string;
  settings?: Record<string, unknown>;
}

export interface SchemaBlockDef {
  type: string;
  name: string;
  limit?: number;
  settings?: SchemaSetting[];
}

export interface SchemaPreset {
  name: string;
  category?: string;
  settings?: Record<string, unknown>;
  blocks?: SchemaBlockPreset[];
}

export interface SectionSchema {
  name?: string;
  tag?: string;
  class?: string;
  settings?: SchemaSetting[];
  blocks?: SchemaBlockDef[];
  presets?: SchemaPreset[];
  max_blocks?: number;
  [key: string]: unknown;
}

export interface CompiledPreviewResult {
  previewHtml: string;
  error?: string;
  schema?: SectionSchema;
  hasLiquid: boolean;
}

export interface PreviewEngineContext {
  sectionId?: string;
  device?: DeviceMode;
  overrides?: Record<string, unknown>;
}
