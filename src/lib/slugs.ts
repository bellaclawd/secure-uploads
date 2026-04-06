import crypto from "crypto";
import { SLUG_PATTERN, SLUG_MIN_LENGTH, SLUG_MAX_LENGTH } from "./constants";
import { slugExists } from "./db";

export function validateSlug(slug: string): string | null {
  if (slug.length < SLUG_MIN_LENGTH) {
    return `Slug must be at least ${SLUG_MIN_LENGTH} characters`;
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return `Slug must be at most ${SLUG_MAX_LENGTH} characters`;
  }
  if (!SLUG_PATTERN.test(slug)) {
    return "Slug can only contain letters, numbers, hyphens, and underscores";
  }
  return null;
}

export function generateSlug(): string {
  for (let i = 0; i < 10; i++) {
    const slug = crypto.randomBytes(6).toString("base64url").slice(0, 8);
    if (!slugExists(slug)) return slug;
  }
  // Extremely unlikely fallback
  return crypto.randomBytes(12).toString("base64url").slice(0, 16);
}

export function isSlugAvailable(slug: string): boolean {
  return !slugExists(slug);
}
