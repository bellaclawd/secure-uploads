import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LifeBuoy, Link2, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SUPPORT_URL, REPO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support options for SecureUploads.ca, including project links, issue reporting, and documentation pages.",
};

const supportCards = [
  {
    title: "Product questions",
    description:
      "Start with the FAQ if you want clarity around file expiry, passwords, one-time links, or maximum upload size.",
    href: "/faq",
    label: "Read the FAQ",
  },
  {
    title: "Trust and security questions",
    description:
      "Use the security page for the actual trust model, supported protections, and the situations where you should pre-encrypt files yourself.",
    href: "/security",
    label: "Open security details",
  },
  {
    title: "Report an issue",
    description:
      "If you hit a bug or need to share product feedback, use the project issue tracker so the problem can be reproduced and triaged.",
    href: SUPPORT_URL,
    label: "Open issue tracker",
    external: true,
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 lg:py-20">
      <section className="rounded-[32px] border border-border/70 bg-card/82 p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-primary">
          <LifeBuoy className="h-4 w-4" />
          Support
        </div>
        <div className="mt-5 max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Need help, context, or a place to report an issue?
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            SecureUploads keeps the app surface small, so the best support path
            depends on what you need: answers, trust details, or bug reporting.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {supportCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[28px] border border-border/70 bg-card/82 p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold tracking-tight">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {card.description}
            </p>
            {card.external ? (
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-5 rounded-full border-border/70 bg-background/80 px-4"
                )}
              >
                {card.label}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <Link
                href={card.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-5 rounded-full border-border/70 bg-background/80 px-4"
                )}
              >
                {card.label}
              </Link>
            )}
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-[32px] border border-border/70 bg-slate-950 p-8 text-slate-50 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.7)]">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-red-200">
              <ShieldCheck className="h-4 w-4" />
              Open project links
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Prefer to inspect the project directly?
            </h2>
            <p className="text-sm leading-7 text-slate-300">
              SecureUploads.ca is backed by a public project repository. If you
              need deployment context, issue history, or implementation details,
              start there.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-12 rounded-full px-6 text-base"
              )}
            >
              <Link2 className="mr-2 h-4 w-4" />
              View repository
            </a>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full px-6 text-base"
              )}
            >
              Start an upload
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
