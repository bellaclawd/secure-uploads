import type { Metadata } from "next";
import Link from "next/link";
import { Database, EyeOff, LockKeyhole, Mailbox, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Plain-language privacy explanation for SecureUploads.ca, including what data is stored while links are active.",
};

const privacySections = [
  {
    title: "What SecureUploads stores while a link is active",
    icon: Database,
    points: [
      "The file itself",
      "Original filename, MIME type, and file size",
      "The chosen slug or generated link identifier",
      "Created-at and expires-at timestamps",
      "A password hash if you set a password",
    ],
  },
  {
    title: "What the product does not ask for",
    icon: Mailbox,
    points: [
      "No account registration",
      "No newsletter signup or lead capture",
      "No marketing trackers or ad scripts in the app UI",
      "No forced recipient login",
    ],
  },
  {
    title: "What happens after download or expiry",
    icon: EyeOff,
    points: [
      "The link stops working after the first successful download or when the timer ends",
      "Deleted and expired files are queued for cleanup from storage",
      "The product is designed for temporary delivery rather than permanent retention",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
      <section className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" />
          Privacy at a glance
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          A simple privacy model for temporary file delivery.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          SecureUploads is intentionally lightweight. It does not require user
          accounts, collect marketing leads, or keep files around like a cloud
          drive. It stores only what is needed to deliver the file until the
          link expires or is downloaded.
        </p>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {privacySections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className="rounded-[28px] border border-border/70 bg-card/82 p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.points.map((point) => (
                  <li key={point} className="text-sm leading-7 text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="mt-16 rounded-[32px] border border-border/70 bg-card/82 p-8 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground">
              <LockKeyhole className="h-4 w-4 text-primary" />
              Plain-language reminder
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              The product does not replace local encryption for the highest-risk files.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Privacy here comes from temporary delivery, clean link behavior,
              optional passwords, and a small product surface area. If you need
              zero-knowledge storage, encrypt the file before upload and share
              the decryption method separately.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/security"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-border/70 bg-background/80 px-6 text-base"
              )}
            >
              Security details
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full px-6 text-base"
              )}
            >
              Upload a file
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
