import { getGeneratedSectionSource } from "@/generated/sections-meta.generated";

export interface SectionDependencyAnalysis {
  snippets: string[];
  stylesheets: string[];
  hasScripts: boolean;
  hasSchema: boolean;
  mediaQueriesCount: number;
}

/**
 * Section Source Manager
 * Manages loading, caching, and inspecting original Shopify Liquid files.
 * Guarantees the source code is never altered or mutated during compilation.
 */
export class SectionSourceManager {
  private static cache = new Map<string, string>();

  /**
   * Retrieves the complete original Liquid source code for a section.
   */
  public static async getSource(sectionId: string): Promise<string | null> {
    const cleanId = sectionId.replace(/\.liquid$/, "");

    // 1. In development, read directly from filesystem for hot reloading
    if (process.env.NODE_ENV !== "production") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "sections", `${cleanId}.liquid`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          this.cache.set(cleanId, content);
          return content;
        }
      } catch (err) {
        console.warn(`[SectionSourceManager] Dev fs read error for ${cleanId}:`, err);
      }
    }

    // 2. Check memory cache
    if (this.cache.has(cleanId)) {
      return this.cache.get(cleanId)!;
    }

    // 3. Fallback to bundled pre-generated sources
    const bundled = getGeneratedSectionSource(cleanId);
    if (bundled) {
      this.cache.set(cleanId, bundled);
      return bundled;
    }

    return null;
  }

  /**
   * Generates a stable version / checksum string for cache invalidation.
   */
  public static getVersion(source: string): string {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      hash = (hash << 5) - hash + source.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Identifies snippets, stylesheets, scripts, and media queries in the source.
   */
  public static analyzeDependencies(source: string): SectionDependencyAnalysis {
    const snippets: string[] = [];
    const stylesheets: string[] = [];

    // Match {% render 'snippet' %} or {% include 'snippet' %}
    const snippetRegex = /{%\s*(?:render|include)\s*['"]([a-zA-Z0-9_\-]+)['"]/gi;
    let match: RegExpExecArray | null;
    while ((match = snippetRegex.exec(source)) !== null) {
      if (match[1] && !snippets.includes(match[1])) {
        snippets.push(match[1]);
      }
    }

    // Match <style> tags or {% stylesheet %}
    const styleCount = (source.match(/<style\b[^>]*>/gi) || []).length;
    const stylesheetTagCount = (source.match(/{%\s*stylesheet\s*%}/gi) || []).length;
    if (styleCount > 0 || stylesheetTagCount > 0) {
      stylesheets.push(`Inline styles (${styleCount + stylesheetTagCount} block(s))`);
    }

    const hasScripts = /<script\b|{%\s*javascript\s*%}/i.test(source);
    const hasSchema = /{%\s*schema\s*%}/i.test(source);
    const mediaQueriesCount = (source.match(/@media\b[^{]+/gi) || []).length;

    return {
      snippets,
      stylesheets,
      hasScripts,
      hasSchema,
      mediaQueriesCount,
    };
  }

  /**
   * Invalidate cached source
   */
  public static invalidate(sectionId: string): void {
    const cleanId = sectionId.replace(/\.liquid$/, "");
    this.cache.delete(cleanId);
  }
}

