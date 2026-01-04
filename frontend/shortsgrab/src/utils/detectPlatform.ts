import type { Platform } from "../types/platform";

export function detectPlatform(url: string): Platform {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/instagram\.com/.test(url)) return "instagram";
  if (/facebook\.com/.test(url)) return "facebook";

  // twitter/x explicitly treated as unknown
  return "unknown";
}
