import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, FileX, ShieldAlert, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-xl space-y-6 rounded-[32px] border border-border/70 bg-card/85 p-8 text-center shadow-[0_28px_90px_-56px_rgba(15,23,42,0.55)] backdrop-blur-sm">
        <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-muted">
          <FileX className="h-9 w-9 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Link unavailable
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            This file link is no longer active.
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            The file may have already been downloaded, expired, or been removed.
            SecureUploads links are intentionally temporary and are not designed
            for long-term storage or retrieval.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full text-base"
            )}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload a file
          </Link>
          <Link
            href="/faq"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full border-border/70 bg-background/80 text-base"
            )}
          >
            Read the FAQ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
