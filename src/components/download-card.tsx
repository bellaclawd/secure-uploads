"use client";

import { buttonVariants } from "@/components/ui/button";
import { Download, File } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DownloadCardProps {
  slug: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: number;
  expiresAt: number;
}

export function DownloadCard({
  slug,
  originalName,
  size,
  createdAt,
  expiresAt,
}: DownloadCardProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <File className="h-8 w-8 text-muted-foreground" />
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

      <p className="text-xs text-muted-foreground">
        This file will be deleted after download.
      </p>

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
    </div>
  );
}
