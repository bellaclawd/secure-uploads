import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LifeBuoy, Link2, ShieldCheck } from "lucide-react";
import { PRIMARY_NAV, REPO_URL, SUPPORT_URL } from "@/lib/site";

const guidanceLinks = [
  {
    href: "/",
    label: "Start an upload",
    description: "Create a one-time download link in seconds.",
  },
  {
    href: "/security",
    label: "Security model",
    description: "Read the exact protections and limits.",
  },
  {
    href: "/faq",
    label: "Questions answered",
    description: "Get clarity on expiry, passwords, and downloads.",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Image
            src="/brand-logo-transparent.png"
            alt="SecureUploads.ca"
            width={260}
            height={260}
            className="h-12 w-auto"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Honest security controls for fast file handoffs
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Share once, then let the link disappear.
            </h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              SecureUploads.ca is built for contracts, tax slips, onboarding
              documents, proofs, and other files that should be delivered
              quickly without lingering around forever.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Guidance
          </h3>
          <ul className="space-y-4 text-sm">
            {guidanceLinks.map((item) => (
              <li key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
                <p className="leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Support
          </h3>
          <div className="space-y-3 text-sm">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <LifeBuoy className="h-4 w-4" />
              Report an issue
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <Link2 className="h-4 w-4" />
              View the project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <p className="leading-6 text-muted-foreground">
              This app does not ask for accounts or marketing opt-ins. File
              links expire after their timer or first successful download.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SecureUploads.ca</p>
          <p>
            Built for private delivery, not permanent storage or client-side
            zero-knowledge encryption.
          </p>
        </div>
      </div>
    </footer>
  );
}
