"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { UploadSuccess } from "@/components/upload-success";
import { formatFileSize } from "@/lib/format";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  EXPIRATION_OPTIONS,
  SLUG_PATTERN,
  SLUG_MIN_LENGTH,
  SLUG_MAX_LENGTH,
  SITE_URL,
} from "@/lib/constants";

type UploadState = "idle" | "uploading" | "success" | "error";

interface UploadResult {
  slug: string;
  originalName: string;
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [expiration, setExpiration] = useState(7);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`);
      return;
    }
    setFile(f);
    setError("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (!file) return;

    // Validate slug if provided
    if (slug) {
      if (slug.length < SLUG_MIN_LENGTH) {
        setError(`Custom URL must be at least ${SLUG_MIN_LENGTH} characters.`);
        return;
      }
      if (slug.length > SLUG_MAX_LENGTH) {
        setError(`Custom URL must be at most ${SLUG_MAX_LENGTH} characters.`);
        return;
      }
      if (!SLUG_PATTERN.test(slug)) {
        setError(
          "Custom URL can only contain letters, numbers, hyphens, and underscores."
        );
        return;
      }
    }

    setError("");
    setState("uploading");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiration", expiration.toString());
    if (slug) formData.append("slug", slug);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setResult({ slug: data.slug, originalName: data.originalName });
          setState("success");
        } else {
          setError(data.error || "Upload failed.");
          setState("error");
        }
      } catch {
        setError("Upload failed. Please try again.");
        setState("error");
      }
    });

    xhr.addEventListener("error", () => {
      setError("Network error. Please try again.");
      setState("error");
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  };

  const reset = () => {
    setFile(null);
    setSlug("");
    setExpiration(7);
    setState("idle");
    setProgress(0);
    setError("");
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (state === "success" && result) {
    return <UploadSuccess slug={result.slug} originalName={result.originalName} onReset={reset} />;
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : file
              ? "border-border bg-muted/30"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-muted-foreground" />
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="ml-2 rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-base font-medium">
              Drop a file here or click to browse
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Max file size: {MAX_FILE_SIZE_LABEL}
            </p>
          </>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Expiration */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Expires after</Label>
          <div className="flex gap-2">
            {EXPIRATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setExpiration(opt.value)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  expiration === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">
            Custom URL{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <div className="flex items-center gap-0 rounded-lg border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring/50">
            <span className="bg-muted px-3 py-2 text-sm text-muted-foreground border-r border-input whitespace-nowrap">
              {SITE_URL}/
            </span>
            <Input
              id="slug"
              placeholder="my-secret-file"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none"
              disabled={state === "uploading"}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty for a random URL. Letters, numbers, hyphens and
            underscores only.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Progress */}
      {state === "uploading" && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {/* Upload button */}
      <Button
        onClick={handleUpload}
        disabled={!file || state === "uploading"}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {state === "uploading" ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
