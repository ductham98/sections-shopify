"use client";

const codeCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Fetches the raw Liquid source code for a section on demand, with in-memory caching.
 */
export async function fetchSectionCode(sectionId: string): Promise<string> {
  if (codeCache.has(sectionId)) {
    return codeCache.get(sectionId)!;
  }

  if (pendingRequests.has(sectionId)) {
    return pendingRequests.get(sectionId)!;
  }

  const promise = (async () => {
    try {
      const res = await fetch(`/api/sections/${encodeURIComponent(sectionId)}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch section source (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      if (!data.code) {
        throw new Error("No Liquid code returned from API");
      }
      codeCache.set(sectionId, data.code);
      return data.code;
    } finally {
      pendingRequests.delete(sectionId);
    }
  })();

  pendingRequests.set(sectionId, promise);
  return promise;
}

/**
 * Manually invalidate cached section source (useful when refreshing in dev mode).
 */
export function invalidateSectionCode(sectionId?: string): void {
  if (sectionId) {
    codeCache.delete(sectionId);
  } else {
    codeCache.clear();
  }
}

