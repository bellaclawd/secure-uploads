import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const SITE_DESCRIPTION =
  "Private, one-time file sharing for sensitive documents. Upload one file, add an optional password, choose an expiry, and send a clean download link in seconds.";

export const SUPPORT_URL = "https://github.com/bellaclawd/secure-uploads/issues";
export const REPO_URL = "https://github.com/bellaclawd/secure-uploads";

export const PRIMARY_NAV = [
  { href: "/security", label: "Security" },
  { href: "/privacy", label: "Privacy" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
] as const;

export const PUBLIC_PAGES = [
  { href: "/", changeFrequency: "weekly", priority: 1 },
  { href: "/security", changeFrequency: "monthly", priority: 0.8 },
  { href: "/privacy", changeFrequency: "monthly", priority: 0.7 },
  { href: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { href: "/support", changeFrequency: "monthly", priority: 0.6 },
] as const;

export const siteMetadata = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};
