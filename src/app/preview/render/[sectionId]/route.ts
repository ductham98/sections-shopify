import { SectionSourceManager } from "@/lib/preview/source-manager";
import { compileSectionPreview } from "@/lib/preview/preview-compiler";
import { DatasetId } from "@/lib/preview/mock-data/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  const url = new URL(request.url);

  const dataset = (url.searchParams.get("dataset") as DatasetId) || "general";
  const limitParam = url.searchParams.get("limit");
  const productLimit = limitParam ? parseInt(limitParam, 10) : undefined;

  let settingsOverrides: Record<string, unknown> = {};
  const settingsParam = url.searchParams.get("settings");
  if (settingsParam) {
    try {
      settingsOverrides = JSON.parse(decodeURIComponent(settingsParam));
    } catch {
      // Ignore malformed override JSON
    }
  }

  // 1. Retrieve original Liquid source code via SectionSourceManager
  const liquidSource = await SectionSourceManager.getSource(sectionId);

  if (!liquidSource) {
    const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Section Not Found</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #4b5563; }
    .box { text-align: center; padding: 40px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    h2 { color: #111827; margin: 0 0 8px 0; font-size: 18px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Section "${sectionId}" not found</h2>
    <p>Ensure the file <code>sections/${sectionId}.liquid</code> exists in the repository.</p>
  </div>
</body>
</html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 2. Compile standalone preview document
  const result = await compileSectionPreview(liquidSource, {
    sectionId,
    datasetId: dataset,
    productLimit,
    overrides: {
      settings: settingsOverrides,
    },
  });

  return new Response(result.previewHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "SAMEORIGIN",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}

