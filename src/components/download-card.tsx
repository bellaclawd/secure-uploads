"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ShieldCheck, Lock, Clock } from "lucide-react";
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
  createdAt,
  expiresAt,
  hasPassword,
}: DownloadCardProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const now = Math.floor(Date.now() / 1000);
  const hoursRemaining = Math.max(0, Math.floor((expiresAt - now) / 3600));

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
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
    } catch {
      setError("Network error. Please try again.");
      setDownloading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="space-y-6 text-center pt-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold break-all">{originalName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatFileSize(size)}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uploaded</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expires</span>
            <span>{formatDate(expiresAt)}</span>
          </div>
        </div>

        {hoursRemaining <= 24 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Expires in{" "}
              {hoursRemaining < 1
                ? "less than an hour"
                : `${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          This file will be deleted after download.
        </p>

        {hasPassword ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>This file is password protected</span>
            </div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordDownload()}
              disabled={downloading}
            />
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button
              onClick={handlePasswordDownload}
              disabled={downloading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {downloading ? (
                "Downloading..."
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Unlock & Download
                </>
              )}
            </Button>
          </div>
        ) : (
          <a
            href={`/api/download/${slug}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full h-12 text-base font-medium"
            )}
          >
            <Download className="mr-2 h-5 w-5" />
            Download
          </a>
        )}
      </CardContent>
    </Card>
  );
}
