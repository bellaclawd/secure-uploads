"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  File,
  Link2,
  LockKeyhole,
  ShieldCheck,
  TimerReset,
  Upload,
  X,
} from "lucide-react";
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
  hasPassword: boolean;
  expiresAt: number;
}

const LAST_UPLOAD_KEY = "secureuploads:last-upload";

function readStoredUpload(): UploadResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(LAST_UPLOAD_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as UploadResult;
    if (!parsed?.slug || !parsed?.originalName) return null;
    return parsed;
  } catch {
    window.sessionStorage.removeItem(LAST_UPLOAD_KEY);
    return null;
  }
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [expiration, setExpiration] = useState(7);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugPrefix = SITE_URL.replace(/^https?:\/\//, "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedUpload = readStoredUpload();
      if (!storedUpload) return;
      setResult(storedUpload);
      setState("success");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleFile = useCallback((nextFile: File) => {
    if (nextFile.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`);
      return;
    }

    setFile(nextFile);
    setError("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (!file) return;

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
    if (password) formData.append("password", password);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          const uploadResult: UploadResult = {
            slug: data.slug,
            originalName: data.originalName,
            hasPassword: !!data.hasPassword,
            expiresAt: data.expiresAt,
          };

          setResult(uploadResult);
          setState("success");

          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(
              LAST_UPLOAD_KEY,
              JSON.stringify(uploadResult)
            );
          }
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
    setPassword("");
    setExpiration(7);
    setState("idle");
    setProgress(0);
    setError("");
    setResult(null);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(LAST_UPLOAD_KEY);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (state === "success" && result) {
    return (
      <UploadSuccess
        slug={result.slug}
        originalName={result.originalName}
        hasPassword={result.hasPassword}
        expiresAt={result.expiresAt}
        onReset={reset}
      />
    );
  }

  return (
    <div className="space-y-7">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onClick={() => !file && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (!file && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          file
            ? `Selected file ${file.name}. Press tab to reach the remove button.`
            : "Choose a file to upload"
        }
        aria-describedby="upload-dropzone-help"
        className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed p-8 text-center transition-all duration-200 ${
          dragOver
            ? "border-primary bg-primary/6 shadow-[0_20px_60px_-45px_var(--color-primary)]"
            : file
              ? "border-primary/25 bg-primary/5"
              : "border-border/80 bg-card/70 hover:border-primary/45 hover:bg-primary/4"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          aria-label="Choose a file to upload"
          onChange={(e) => {
            const nextFile = e.target.files?.[0];
            if (nextFile) handleFile(nextFile);
          }}
        />

        {file ? (
          <div className="w-full max-w-sm space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <File className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="break-all text-base font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              aria-label="Remove selected file"
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Choose a different file
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
              <Upload className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold tracking-tight">
              Drop a file here or click to browse
            </p>
            <p
              id="upload-dropzone-help"
              className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground"
            >
              Upload one file per link. Max size: {MAX_FILE_SIZE_LABEL}. For
              extra protection, add a password below and share it separately.
            </p>
          </>
        )}
      </div>

      <div className="grid gap-5">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Expires after</Label>
          <div className="grid grid-cols-3 gap-2">
            {EXPIRATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setExpiration(option.value)}
                aria-pressed={expiration === option.value}
                className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${
                  expiration === option.value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/70 bg-card/70 hover:border-primary/40 hover:bg-primary/4"
                }`}
              >
                <Clock className="mr-1 h-3.5 w-3.5 inline" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-semibold">
            Custom URL{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <div className="flex items-center gap-0 overflow-hidden rounded-2xl border border-input bg-card/70 focus-within:ring-2 focus-within:ring-ring/50">
            <span className="hidden border-r border-input bg-muted px-3 py-3 text-sm text-muted-foreground sm:inline-block">
              {SITE_URL}/
            </span>
            <span className="border-r border-input bg-muted px-3 py-3 text-sm text-muted-foreground sm:hidden">
              {slugPrefix}/
            </span>
            <Input
              id="slug"
              placeholder="my-secret-file"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-12 border-0 px-3 shadow-none focus-visible:ring-0"
              disabled={state === "uploading"}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty for a random URL. Letters, numbers, hyphens and
            underscores only.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password protection{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Set a password for this file"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="h-12 rounded-2xl bg-card/70"
            disabled={state === "uploading"}
          />
          <p className="text-xs text-muted-foreground">
            Recipients will need this password to download the file. Use at
            least 4 characters and send it separately from the link.
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-border/70 bg-card/72 p-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Link2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Controlled sharing</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              The link expires after{" "}
              {EXPIRATION_OPTIONS.find((option) => option.value === expiration)
                ?.label ?? "1 week"}{" "}
              or the first successful download.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Optional password gate</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {password
                ? "Recipients will need the password before they can download."
                : "Anyone with the link can download it. Add a password for sensitive files."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <TimerReset className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Temporary by default</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              SecureUploads is built for delivery, not permanent storage or
              account-based file management.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {state === "uploading" && (
        <div className="space-y-2 rounded-[28px] border border-border/70 bg-card/72 p-4">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            <span className="w-10 text-right text-sm font-medium tabular-nums text-muted-foreground">
              {progress}%
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground" aria-live="polite">
            Uploading and preparing your secure link...
          </p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || state === "uploading"}
        className="h-[3.25rem] w-full rounded-full text-base font-semibold"
        size="lg"
      >
        <ShieldCheck className="mr-2 h-5 w-5" />
        {state === "uploading" ? "Uploading..." : "Create secure link"}
      </Button>
    </div>
  );
}
