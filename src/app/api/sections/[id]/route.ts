import { NextResponse } from "next/server";
import { getGeneratedSectionSource } from "@/generated/sections-meta.generated";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. In development, read directly from disk for live hot updates
  if (process.env.NODE_ENV !== "production") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "sections", `${id}.liquid`);
      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, "utf-8");
        return NextResponse.json({ id, code });
      }
    } catch (err) {
      console.warn(`[api/sections/${id}] Dev fs read failed:`, err);
    }
  }

  // 2. Production: Use fast pre-generated embedded sources map
  const generatedCode = getGeneratedSectionSource(id);
  if (generatedCode) {
    return NextResponse.json({ id, code: generatedCode });
  }

  return NextResponse.json(
    { error: `Section ${id}.liquid not found` },
    { status: 404 }
  );
}
