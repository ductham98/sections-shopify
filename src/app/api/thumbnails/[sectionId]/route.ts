import { generateSectionThumbnail } from "@/lib/preview/screenshot-service";
import { loadAllThumbnailCache } from "@/lib/preview/thumbnail-cache";
import { SectionSourceManager } from "@/lib/preview/source-manager";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";

  const liquidSource = await SectionSourceManager.getSource(sectionId);
  if (!liquidSource) {
    return Response.json(
      { success: false, error: `Section '${sectionId}' not found.` },
      { status: 404 }
    );
  }

  // If not forcing regeneration, check existing cache
  if (!force) {
    const cache = loadAllThumbnailCache();
    const existing = cache[sectionId];
    if (existing && existing.status === "ready") {
      return Response.json({
        success: true,
        sectionId,
        reusedCache: true,
        thumbnail: existing,
      });
    }
  }

  try {
    const result = await generateSectionThumbnail({
      sectionId,
      liquidSource,
      force: true,
    });

    return Response.json({
      success: result.thumbnail.status === "ready",
      sectionId,
      reusedCache: result.reusedCache,
      durationMs: result.durationMs,
      thumbnail: result.thumbnail,
      warnings: result.warnings,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, sectionId, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  // POST behaves like force-refresh
  const { sectionId } = await params;
  const liquidSource = await SectionSourceManager.getSource(sectionId);

  if (!liquidSource) {
    return Response.json(
      { success: false, error: `Section '${sectionId}' not found.` },
      { status: 404 }
    );
  }

  try {
    const result = await generateSectionThumbnail({
      sectionId,
      liquidSource,
      force: true,
    });

    return Response.json({
      success: result.thumbnail.status === "ready",
      sectionId,
      reusedCache: false,
      durationMs: result.durationMs,
      thumbnail: result.thumbnail,
      warnings: result.warnings,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, sectionId, error: errorMsg },
      { status: 500 }
    );
  }
}

