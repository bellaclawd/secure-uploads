export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
export const MAX_FILE_SIZE_LABEL = "500 MB";

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 64;
export const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

export const EXPIRATION_OPTIONS = [
  { label: "1 day", value: 1 },
  { label: "1 week", value: 7 },
  { label: "1 month", value: 30 },
] as const;

export const SITE_NAME = "SecureUploads";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://secureuploads.ca";
