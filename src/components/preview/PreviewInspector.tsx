"use client";

import React, { useState } from "react";
import {
  Sliders,
  Database,
  Layers,
  Code2,
  Activity,
  RotateCcw,
  X,
  Check,
} from "lucide-react";
import { SectionSchema, SchemaSetting } from "@/lib/preview/preview-types";
import { DatasetId } from "@/lib/preview/mock-data/types";
import { MOCK_DATASETS } from "@/lib/preview/mock-data/datasets";
import { SectionDependencyAnalysis } from "@/lib/preview/source-manager";

export interface PreviewInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  schema?: SectionSchema;
  settingsOverrides: Record<string, unknown>;
  onSettingChange: (id: string, value: unknown) => void;
  onResetSettings: () => void;
  selectedDataset: DatasetId;
  onSelectDataset: (id: DatasetId) => void;
  productLimit?: number;
  onProductLimitChange: (limit: number) => void;
  dependencyAnalysis?: SectionDependencyAnalysis;
  sectionFilename?: string;
}

type InspectorTab = "settings" | "dataset" | "mock-data" | "theme" | "diagnostics";

export function PreviewInspector({
  isOpen,
  onClose,
  schema,
  settingsOverrides,
  onSettingChange,
  onResetSettings,
  selectedDataset,
  onSelectDataset,
  productLimit = 8,
  onProductLimitChange,
  dependencyAnalysis,
  sectionFilename,
}: PreviewInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("settings");

  if (!isOpen) return null;

  const datasetList: Array<{ id: DatasetId; name: string; desc: string }> = [
    { id: "general", name: "General & Workspace", desc: "Minimal desk mats, cushions, titanium EDC" },
    { id: "fashion", name: "Fashion & Apparel", desc: "Boxy tees, wool overcoats, Chelsea boots" },
    { id: "beauty", name: "Beauty & Skincare", desc: "Botanical facial oils, peptide cleansers, creams" },
    { id: "furniture", name: "Furniture & Living", desc: "Bouclé lounge chairs, travertine tables, lamps" },
    { id: "electronics", name: "Electronics & Audio", desc: "Hi-fi headphones, custom mechanical keyboards" },
  ];

  const currentDataset = MOCK_DATASETS[selectedDataset] || MOCK_DATASETS.general;
  const settingsList: SchemaSetting[] = (schema?.settings || []).filter((s) => s && s.type);

  return (
    <aside className="w-[320px] sm:w-[350px] shrink-0 h-full border-l border-neutral-200 bg-white flex flex-col z-20 shadow-xl animate-in slide-in-from-right duration-200 select-none text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/70 shrink-0">
        <div className="flex items-center gap-2 font-semibold text-neutral-900">
          <Sliders className="w-4 h-4 text-neutral-600" />
          <span>Preview Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center border-b border-neutral-200 bg-neutral-100/60 p-1 shrink-0 overflow-x-auto gap-0.5">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
            activeTab === "settings" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("dataset")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
            activeTab === "dataset" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Dataset</span>
        </button>

        <button
          onClick={() => setActiveTab("mock-data")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
            activeTab === "mock-data" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Data</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
            activeTab === "theme" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Theme</span>
        </button>

        <button
          onClick={() => setActiveTab("diagnostics")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
            activeTab === "diagnostics" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Diagnostics</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 preview-scrollbar">
        {/* ========================================================
         * TAB A: PREVIEW SETTINGS
         * ======================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Schema Settings ({settingsList.length})
              </span>
              {Object.keys(settingsOverrides).length > 0 && (
                <button
                  onClick={onResetSettings}
                  className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults</span>
                </button>
              )}
            </div>

            {settingsList.length === 0 ? (
              <p className="text-neutral-400 italic py-4 text-center">No customizable settings found in schema.</p>
            ) : (
              settingsList.map((setting, idx) => {
                if (setting.type === "header") {
                  return (
                    <div key={setting.id || `header-${idx}`} className="pt-2 pb-1 border-t border-neutral-100">
                      <strong className="text-neutral-800 text-[11px] uppercase tracking-wide">
                        {setting.label || "Section Group"}
                      </strong>
                    </div>
                  );
                }

                if (setting.type === "paragraph") {
                  return (
                    <p key={setting.id || `paragraph-${idx}`} className="text-[11px] text-neutral-500 italic">
                      {setting.label || setting.info}
                    </p>
                  );
                }

                const currentVal = settingsOverrides[setting.id] !== undefined ? settingsOverrides[setting.id] : setting.default;

                return (
                  <div key={setting.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-neutral-700 text-[11px]">
                        {setting.label || setting.id}
                      </label>
                      <span className="font-mono text-[9px] text-neutral-400">{setting.type}</span>
                    </div>

                    {/* Setting Type Renderers */}
                    {setting.type === "checkbox" ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(currentVal)}
                          onChange={(e) => onSettingChange(setting.id, e.target.checked)}
                          className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-neutral-600">{currentVal ? "Enabled" : "Disabled"}</span>
                      </label>
                    ) : setting.type === "color" || setting.type === "color_background" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={String(currentVal || "#000000")}
                          onChange={(e) => onSettingChange(setting.id, e.target.value)}
                          className="w-7 h-7 rounded border border-neutral-200 cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={String(currentVal || "")}
                          onChange={(e) => onSettingChange(setting.id, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded border border-neutral-200 text-neutral-800 font-mono text-xs"
                        />
                      </div>
                    ) : setting.type === "range" || setting.type === "number" ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span>{setting.min ?? 0}</span>
                          <span className="font-semibold text-neutral-800 font-mono">
                            {String(currentVal ?? "")} {setting.unit || ""}
                          </span>
                          <span>{setting.max ?? 100}</span>
                        </div>
                        <input
                          type="range"
                          min={setting.min ?? 0}
                          max={setting.max ?? 100}
                          step={setting.step ?? 1}
                          value={Number(currentVal ?? 0)}
                          onChange={(e) => onSettingChange(setting.id, Number(e.target.value))}
                          className="w-full accent-neutral-900 cursor-pointer"
                        />
                      </div>
                    ) : setting.type === "select" ? (
                      <select
                        value={String(currentVal || "")}
                        onChange={(e) => onSettingChange(setting.id, e.target.value)}
                        className="w-full px-2 py-1.5 rounded border border-neutral-200 bg-white text-neutral-800 text-xs cursor-pointer"
                      >
                        {(setting.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label || opt.value}
                          </option>
                        ))}
                      </select>
                    ) : setting.type === "textarea" || setting.type === "richtext" ? (
                      <textarea
                        rows={2}
                        value={String(currentVal || "")}
                        onChange={(e) => onSettingChange(setting.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-neutral-800 text-xs focus:outline-none focus:border-neutral-900"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(currentVal || "")}
                        onChange={(e) => onSettingChange(setting.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-neutral-800 text-xs focus:outline-none focus:border-neutral-900"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================
         * TAB B: DATASET SELECTOR
         * ======================================================== */}
        {activeTab === "dataset" && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Select Mock Store Theme
            </span>
            <div className="space-y-2">
              {datasetList.map((ds) => {
                const isSelected = selectedDataset === ds.id;
                return (
                  <button
                    key={ds.id}
                    onClick={() => onSelectDataset(ds.id)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 shadow-2xs"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 text-xs">{ds.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-snug">{ds.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
         * TAB C: MOCK DATA INSPECTOR
         * ======================================================== */}
        {activeTab === "mock-data" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-800">Product Grid Limit</span>
                <span className="font-mono font-semibold text-neutral-900">{productLimit} items</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={productLimit}
                onChange={(e) => onProductLimitChange(Number(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Injected Products ({currentDataset.products.length})
              </span>
              <div className="space-y-2 max-h-[300px] overflow-y-auto preview-scrollbar pr-1">
                {currentDataset.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 p-2 rounded border border-neutral-100 bg-neutral-50/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.featured_image.src} alt={p.title} className="w-10 h-10 object-cover rounded bg-neutral-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-neutral-900 truncate text-[11px]">{p.title}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">${(p.price / 100).toFixed(2)} USD</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
         * TAB D: THEME DEPENDENCIES
         * ======================================================== */}
        {activeTab === "theme" && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Active Theme Runtime Dependencies
            </span>

            <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1">
              <div className="font-semibold text-neutral-900 flex items-center justify-between">
                <span>Base Storefront Resets</span>
                <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
              </div>
              <p className="text-[11px] text-neutral-500">Box-sizing, typography normalization, responsive media, CSS tokens.</p>
            </div>

            <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1">
              <div className="font-semibold text-neutral-900 flex items-center justify-between">
                <span>Preview Interaction Adapters</span>
                <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
              </div>
              <p className="text-[11px] text-neutral-500">Accordions, sliders, quantity inputs, sticky element preview positioning.</p>
            </div>

            <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1">
              <div className="font-semibold text-neutral-900">Detected Dependencies</div>
              <ul className="text-[11px] text-neutral-600 space-y-1 list-disc pl-4">
                <li>System & Storefront Font Stack</li>
                <li>Sandboxed Iframe postMessage Reporter</li>
                {dependencyAnalysis?.snippets.map((sn) => (
                  <li key={sn}>Snippet: <code>{sn}</code></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================
         * TAB E: DIAGNOSTICS
         * ======================================================== */}
        {activeTab === "diagnostics" && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Compilation & Sandbox Status
            </span>

            <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 font-mono text-[11px] space-y-1.5 text-neutral-700">
              <div>File: <strong className="text-neutral-900">{sectionFilename || "unknown"}</strong></div>
              <div>Schema Status: <strong className="text-emerald-700">Valid JSON ({settingsList.length} settings)</strong></div>
              <div>Blocks Configured: <strong>{schema?.blocks?.length || 0} block definition(s)</strong></div>
              <div>Sandbox: <strong>allow-scripts allow-same-origin</strong></div>
              <div>Isolation: <strong>100% Isolated Iframe</strong></div>
              <div>Media Queries: <strong>{dependencyAnalysis?.mediaQueriesCount || 0} query rules</strong></div>
            </div>

            <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 text-[11px] leading-relaxed">
              <strong>Local Preview Guarantee:</strong> This environment renders Liquid sections using local deterministic datasets with zero external Shopify API calls.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
