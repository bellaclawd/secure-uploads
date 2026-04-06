"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Upload } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface UploadSuccessProps {
  slug: string;
  originalName: string;
  onReset: () => void;
}

export function UploadSuccess({
  slug,
  originalName,
  onReset,
}: UploadSuccessProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${SITE_URL}/${slug}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">File Uploaded!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {originalName}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs text-muted-foreground">Share this link:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-background px-3 py-2 text-sm font-mono">
            {fullUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This link will expire after the set time or after the first download.
      </p>

      <Button onClick={onReset} variant="outline" className="gap-2">
        <Upload className="h-4 w-4" />
        Upload Another File
      </Button>
    </div>
  );
}
