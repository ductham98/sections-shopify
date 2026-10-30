import fs from "fs";
import path from "path";
import { SECTIONS_METADATA, SectionMeta } from "@/data/sections-meta";
import { renderLiquidToHtml } from "./liquid-preview";

export interface SectionItem extends SectionMeta {
  code: string;
  lineCount: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  previewHtml: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function getAllSections(): Promise<SectionItem[]> {
  const sectionsDir = path.join(process.cwd(), "sections");

  const results = await Promise.all(
    SECTIONS_METADATA.map(async (meta) => {
      const filePath = path.join(sectionsDir, meta.filename);
      let code = "";
      let lineCount = 0;
      let fileSizeBytes = 0;
      let previewHtml = "";

      try {
        if (fs.existsSync(filePath)) {
          code = fs.readFileSync(filePath, "utf-8");
          lineCount = code.split("\n").length;
          fileSizeBytes = Buffer.byteLength(code, "utf-8");
          previewHtml = await renderLiquidToHtml(code, meta.filename);
        } else {
          code = `<!-- File ${meta.filename} not found in sections/ -->`;
          previewHtml = `<div style="padding:20px;color:#999;">Section ${meta.filename} not found.</div>`;
        }
      } catch (err) {
        console.error(`Error reading ${meta.filename}:`, err);
        code = `<!-- Error reading ${meta.filename} -->`;
        previewHtml = `<div style="padding:20px;color:#ef4444;">Error reading section.</div>`;
      }

      return {
        ...meta,
        plan: meta.plan || "free",
        code,
        lineCount,
        fileSizeBytes,
        fileSizeFormatted: formatBytes(fileSizeBytes),
        previewHtml,
      };
    })
  );

  return results;
}
