"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Clock3,
  Copy,
  Link2,
  Lock,
  Share2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/format";

interface UploadSuccessProps {
  slug: string;
  originalName: string;
  hasPassword: boolean;
  expiresAt: number;
  onReset: () => void;
}

export function UploadSuccess({
  slug,
  originalName,
  hasPassword,
  expiresAt,
  onReset,
}: UploadSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const fullUrl = `${SITE_URL}/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareLink = async () => {
    if (!("share" in navigator)) {
      await copyToClipboard();
      return;
    }

    try {
      await navigator.share({
        title: "SecureUploads.ca file link",
        text: `Download ${originalName}`,
        url: fullUrl,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
        <ShieldCheck className="h-4 w-4" />
        Link ready to share
      </div>

      <div className="flex flex-col gap-5 rounded-[28px] border border-border/70 bg-card/72 p-6 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12">
          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your secure link is live.
          </h2>
          <p className="text-sm text-muted-foreground">{originalName}</p>
        </div>

        <div className="grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">One-time delivery</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The link retires after the first successful download.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">Expires automatically</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Available until {formatDate(expiresAt)} if no one downloads it first.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">
              {hasPassword ? "Password required" : "Link-only access"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {hasPassword
                ? "Share the password separately from the link."
                : "Anyone with the link can open the download page."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-border/70 bg-card/72 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Share this link
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-2xl border border-border/70 bg-background px-3 py-3 text-sm font-mono">
            {fullUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="h-12 shrink-0 rounded-2xl px-4"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={shareLink}
            variant="secondary"
            className="h-12 rounded-full px-5 text-base"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {shared ? "Shared" : "Share link"}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="h-12 rounded-full px-5 text-base"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload another file
          </Button>
        </div>
      </div>

      {hasPassword && (
        <div className="rounded-[24px] border border-amber-500/30 bg-amber-50 px-4 py-4 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
          <Lock className="mr-1.5 inline h-4 w-4" />
          This file is password protected. Deliver the password in a separate
          message or channel so the link and secret do not travel together.
        </div>
      )}

      <p className="text-xs leading-6 text-muted-foreground">
        This result stays visible in this browser tab until you upload another
        file, so you can safely refresh and still grab the link again.
      </p>
    </div>
  );
}
