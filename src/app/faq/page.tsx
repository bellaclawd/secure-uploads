import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about SecureUploads.ca, including password protection, expiry, file size, and security limits.",
};

const faqs = [
  {
    question: "Do recipients need an account?",
    answer:
      "No. Recipients only need the download link. If you enabled password protection, they also need the password you shared separately.",
  },
  {
    question: "What happens after someone downloads the file?",
    answer:
      "The link is designed to stop working after the first successful download. If no one downloads it, it remains available until the selected expiry window ends.",
  },
  {
    question: "Is SecureUploads client-side end-to-end encrypted?",
    answer:
      "No. SecureUploads uses HTTPS transport, optional passwords, and temporary links. If your workflow requires zero-knowledge encryption, encrypt the file yourself before uploading it.",
  },
  {
    question: "Can I choose a custom URL?",
    answer:
      "Yes. If the slug is available, you can choose your own URL path using letters, numbers, hyphens, and underscores.",
  },
  {
    question: "How large can uploads be?",
    answer:
      "The current limit is 250 MB per upload.",
  },
  {
    question: "Can I upload multiple files at once?",
    answer:
      "Not right now. SecureUploads creates one file per link to keep the flow clean and predictable.",
  },
  {
    question: "Should I always add a password?",
    answer:
      "For sensitive documents, yes. The best practice is to share the link and the password in different channels.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 lg:py-20">
      <section className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm font-medium text-primary">
          <HelpCircle className="h-4 w-4" />
          Frequently asked questions
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Clear answers before you upload or share anything important.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          The product is intentionally simple, so the questions usually come
          down to trust and timing. Here are the answers users ask for most.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[28px] border border-border/70 bg-card/82 p-6 shadow-sm open:bg-background/90"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </section>

      <section className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/security"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 rounded-full border-border/70 bg-card/80 px-6 text-base"
          )}
        >
          Read the security page
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 rounded-full px-6 text-base"
          )}
        >
          Start an upload
        </Link>
      </section>
    </div>
  );
}
