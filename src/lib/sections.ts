import fs from "fs";
import path from "path";
import { SECTIONS_METADATA, SectionMeta } from "@/data/sections-meta";

export interface SectionItem extends SectionMeta {
  code: string;
  lineCount: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getAllSections(): SectionItem[] {
  const sectionsDir = path.join(process.cwd(), "sections");

  return SECTIONS_METADATA.map((meta) => {
    const filePath = path.join(sectionsDir, meta.filename);
    let code = "";
    let lineCount = 0;
    let fileSizeBytes = 0;

    try {
      if (fs.existsSync(filePath)) {
        code = fs.readFileSync(filePath, "utf-8");
        lineCount = code.split("\n").length;
        fileSizeBytes = Buffer.byteLength(code, "utf-8");
      } else {
        code = `<!-- File ${meta.filename} not found in sections/ -->`;
      }
    } catch (err) {
      console.error(`Error reading ${meta.filename}:`, err);
      code = `<!-- Error reading ${meta.filename} -->`;
    }

    return {
      ...meta,
      code,
      lineCount,
      fileSizeBytes,
      fileSizeFormatted: formatBytes(fileSizeBytes),
    };
  });
}

export function getSectionById(id: string): SectionItem | undefined {
  const sections = getAllSections();
  return sections.find((s) => s.id === id);
}
