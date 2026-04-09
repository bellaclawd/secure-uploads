"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Clock3,
  Download,
  FileDown,
  Lock,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DownloadCardProps {
  slug: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: number;
  expiresAt: number;
  hasPassword: boolean;
}

export function DownloadCard({
  slug,
  originalName,
  size,
  mimeType,
  createdAt,
  expiresAt,
  hasPassword,
}: DownloadCardProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handlePasswordDownload = async () => {
    if (!password.trim()) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setDownloading(true);

    try {
      const response = await fetch(`/api/download/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Download failed");
        setDownloading(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = originalName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setDownloading(false);
    } catch {
      setError("Network error. Please try again.");
      setDownloading(false);
    }
  };

  return (
    <Card className="rounded-[32px] border border-border/70 bg-card/90 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.55)] backdrop-blur-sm">
      <CardContent className="space-y-8 px-6 pt-8 pb-6 sm:px-8">
        <div className="space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure download link
          </div>
          <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-primary/10">
            <FileDown className="h-9 w-9 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to download
            </h1>
            <p className="break-all text-base font-medium text-foreground">
              {originalName}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(size)} • {mimeType || "Unknown file type"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Download className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">One successful download</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Once the file is downloaded, the link is meant to stop working.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">Automatic expiry</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              If the file is not downloaded first, the link ends at the expiry time below.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">
              {hasPassword ? "Password protected" : "Link access only"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {hasPassword
                ? "You will need the password from the sender before downloading."
                : "Anyone with this private link can download the file once."}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-background/70 p-5 text-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <TimerReset className="h-4 w-4 text-primary" />
            File timing
          </div>
          <div className="space-y-3">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Uploaded</span>
              <span className="text-right">{formatDate(createdAt)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Expires</span>
              <span className="text-right">{formatDate(expiresAt)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Download rule</span>
              <span className="text-right">First successful download only</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm leading-6 text-muted-foreground">
          This private link is intentionally temporary. Download the file now
          if you need it, because it will no longer be available after a
          successful download or once it expires.
        </p>

        {hasPassword ? (
          <div className="space-y-4 rounded-[28px] border border-border/70 bg-background/70 p-5">
            <div className="space-y-1">
              <Label htmlFor="download-password" className="text-sm font-semibold">
                Password
              </Label>
              <p className="text-xs leading-5 text-muted-foreground">
                Enter the password shared by the sender to unlock this one-time
                download.
              </p>
            </div>
            <Input
              id="download-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordDownload()}
              autoComplete="current-password"
              className="h-12 rounded-2xl bg-card/70"
              disabled={downloading}
            />
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}
            <Button
              onClick={handlePasswordDownload}
              disabled={downloading}
              className="h-12 w-full rounded-full text-base font-semibold"
              size="lg"
            >
              {downloading ? (
                "Downloading..."
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Unlock and download
                </>
              )}
            </Button>
          </div>
        ) : (
          <a
            href={`/api/download/${slug}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full rounded-full text-base font-semibold"
            )}
          >
            <Download className="mr-2 h-5 w-5" />
            Download now
          </a>
        )}

        <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Need to send a file back?
          </p>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full border-border/70 px-4"
            )}
          >
            Upload a file
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
