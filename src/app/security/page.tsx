import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  TimerReset,
  TriangleAlert,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Plain-language security overview for SecureUploads.ca, including protections, limits, and recommended sharing practices.",
};

const protections = [
  {
    title: "HTTPS for uploads and downloads",
    description:
      "Files are transferred over HTTPS rather than being sent in plaintext across the network.",
    icon: LockKeyhole,
  },
  {
    title: "Optional password protection",
    description:
      "You can require a password before the file is downloaded. Passwords are stored as hashes instead of raw plaintext.",
    icon: KeyRound,
  },
  {
    title: "One-time links and expiry timers",
    description:
      "Links are designed for temporary delivery: they stop working after the first successful download or when the chosen timer ends.",
    icon: TimerReset,
  },
  {
    title: "Private file lookup behavior",
    description:
      "Download pages are marked not to be indexed by search engines, and password attempts are rate-limited.",
    icon: ScanSearch,
  },
];

const limits = [
  "SecureUploads is not client-side end-to-end encrypted. If you need zero-knowledge protection, encrypt the file yourself before uploading it.",
  "Anyone with the link can access the download page unless you also set a password.",
  "The service is designed for one file per upload and temporary delivery, not shared folders or permanent archival storage.",
  "Once a file is downloaded or expires, it is not recoverable through the product interface.",
];

const recommendations = [
  "Add a password for anything sensitive and send that password in a separate channel.",
  "Use custom slugs only when you need a memorable link. Otherwise, leave the slug blank for a generated one.",
  "If the file is highly sensitive or regulated, encrypt it locally before uploading and communicate the decryption method out-of-band.",
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-border/70 bg-slate-950 p-8 text-slate-50 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.7)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-red-200">
            <ShieldCheck className="h-4 w-4" />
            Trust Center
          </div>
          <div className="mt-5 space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">
              Security promises, written like a product owner instead of a slogan machine.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              SecureUploads.ca is built to make temporary file delivery feel
              safer and calmer. The trust model is straightforward: HTTPS in
              transit, optional passwords, one-time download behavior, and
              automatic expiry. It does not claim client-side zero-knowledge
              encryption.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 text-red-200" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Important limit</h2>
                <p className="text-sm leading-6 text-slate-300">
                  If your use case requires end-to-end encryption where the
                  server cannot ever read the file contents, you should encrypt
                  the file locally before you upload it here.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {protections.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[28px] border border-border/70 bg-card/82 p-6 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </section>
      </div>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border/70 bg-card/82 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Limits you should understand before uploading
          </h2>
          <ul className="mt-5 space-y-4">
            {limits.map((item) => (
              <li key={item} className="flex gap-3">
                <TriangleAlert className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/82 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recommended sharing workflow
          </h2>
          <ul className="mt-5 space-y-4">
            {recommendations.map((item) => (
              <li key={item} className="flex gap-3">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full px-6 text-base"
              )}
            >
              Start an upload
            </Link>
            <Link
              href="/privacy"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-border/70 bg-background/80 px-6 text-base"
              )}
            >
              Read the privacy page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
