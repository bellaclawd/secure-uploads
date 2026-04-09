import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderLock,
  KeyRound,
  Link2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UploadCloud,
} from "lucide-react";
import { UploadForm } from "@/components/upload-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroHighlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "One link, one download",
    description: "Links stop working after a successful download or when time runs out.",
    icon: Link2,
  },
  {
    title: "Optional password gate",
    description: "Protect the link with a separate password for higher-confidence sharing.",
    icon: KeyRound,
  },
  {
    title: "No account detours",
    description: "Send a secure handoff without sign-ups, inbox capture, or extra admin.",
    icon: Sparkles,
  },
];

const workflow = [
  {
    step: "01",
    title: "Upload a single file",
    description:
      "Drag in the file, choose an expiry window, and add a custom slug or password if you want tighter control.",
  },
  {
    step: "02",
    title: "Share the clean download link",
    description:
      "Send the link by email, chat, or text. If the file matters, send the password in a separate channel.",
  },
  {
    step: "03",
    title: "Let the link retire itself",
    description:
      "After the first successful download or the chosen expiration time, the link stops working automatically.",
  },
];

const trustPillars: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Plain-English security promises",
    description:
      "SecureUploads protects files in transit, supports password-protected links, and never pretends to be client-side zero-knowledge encryption when it is not.",
    icon: ShieldCheck,
  },
  {
    title: "Built for high-trust handoffs",
    description:
      "Contracts, tax slips, onboarding docs, proofs, and client deliverables all benefit from links that disappear after the job is done.",
    icon: FolderLock,
  },
  {
    title: "Small surface area, less friction",
    description:
      "The product stays focused on one task: deliver a file fast, clearly, and with enough control to feel confident sharing it.",
    icon: UploadCloud,
  },
  {
    title: "Recipient flow stays clean",
    description:
      "Recipients land on a download page with the essentials only: file details, password prompt if needed, and a clear one-time download action.",
    icon: ScanSearch,
  },
];

const securityNotes: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Protected in transit",
    description: "Uploads and downloads happen over HTTPS, so the file is not sent in plaintext over the network.",
    icon: LockKeyhole,
  },
  {
    title: "Passwords are hashed",
    description: "If you add a password, the server stores a hash rather than keeping the raw password around.",
    icon: KeyRound,
  },
  {
    title: "Files do not linger by default",
    description: "Expiry timers and one-time download behavior keep the service aligned with temporary delivery instead of permanent storage.",
    icon: TimerReset,
  },
];

const faqPreview = [
  {
    question: "Is this client-side end-to-end encrypted?",
    answer:
      "No. SecureUploads provides private links, HTTPS transport, optional passwords, and automatic expiry. If you need zero-knowledge protection, encrypt the file before uploading it.",
  },
  {
    question: "What happens after someone downloads the file?",
    answer:
      "The link is designed to stop working after the first successful download. If no one downloads it, it stays available until the expiry window ends.",
  },
  {
    question: "Do recipients need an account?",
    answer:
      "No. The recipient gets a direct download page. If you enabled a password, they only need the password and the link.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
      <section className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              Premium private file handoffs without the account friction
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Share sensitive files with clarity, control, and less stress.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Upload one file, generate a clean download link, add an optional
                password, and let the link retire itself after the first
                successful download or when its timer ends.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground">
              One-time links
            </span>
            <span className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground">
              Optional password
            </span>
            <span className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground">
              250 MB max upload
            </span>
            <span className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground">
              No account required
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#upload"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full px-6 text-base"
              )}
            >
              Start a secure transfer
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link
              href="/security"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-border/70 bg-card/80 px-6 text-base"
              )}
            >
              Read the security model
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border/70 bg-card/82 p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div id="upload" className="relative lg:pt-4">
          <div className="absolute inset-x-8 top-8 -z-10 h-56 rounded-full bg-primary/18 blur-3xl" />
          <div className="rounded-[32px] border border-border/70 bg-card/90 p-1 shadow-[0_28px_90px_-52px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/50 bg-background/95 p-6 sm:p-8">
              <div className="mb-6 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Start a secure transfer
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Send the file without making people work for it.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    One file per link. Add an optional password, choose how long
                    the link should live, and hand it off with cleaner
                    expectations.
                  </p>
                </div>
              </div>
              <UploadForm />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 space-y-8 sm:mt-24">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A short, deliberate workflow for files that should not hang around.
          </h2>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            The product is intentionally narrow: upload, share, and let the
            link expire. That focus is part of what makes it feel calm.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {workflow.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-border/70 bg-card/82 p-6 shadow-sm"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:mt-24 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-border/70 bg-slate-950 p-8 text-slate-50 shadow-[0_28px_80px_-50px_rgba(2,6,23,0.8)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-200/90">
              Security, explained plainly
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Stronger trust comes from specific language, not bigger claims.
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              SecureUploads is designed for temporary delivery with honest
              controls: HTTPS in transit, optional passwords, one-time links,
              and automatic expiry. For true zero-knowledge workflows, encrypt
              the file before you upload it.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {securityNotes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-red-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <Link
            href="/security"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "mt-8 inline-flex h-12 rounded-full px-6 text-base"
            )}
          >
            Explore the trust center
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustPillars.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border/70 bg-card/82 p-6 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-20 space-y-8 lg:mt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              FAQs
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The questions people ask before they trust a file-sharing tool.
            </h2>
          </div>
          <Link
            href="/faq"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full border-border/70 bg-card/80 px-6 text-base"
            )}
          >
            View all FAQs
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {faqPreview.map((item) => (
            <div
              key={item.question}
              className="rounded-3xl border border-border/70 bg-card/82 p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
