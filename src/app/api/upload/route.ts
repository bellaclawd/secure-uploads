import { NextRequest, NextResponse } from "next/server";
import { insertFile, slugExists, getCleanableFiles, hardDeleteFile } from "@/lib/db";
import { saveFile, deleteFile } from "@/lib/storage";
import { validateSlug, generateSlug } from "@/lib/slugs";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

function runCleanup() {
  try {
    const files = getCleanableFiles();
    for (const file of files) {
      try {
        deleteFile(file.storage_key);
        hardDeleteFile(file.id);
      } catch {
        // best-effort
      }
    }
  } catch {
    // never block an upload due to cleanup failure
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customSlug = (formData.get("slug") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";
    const expirationDays = parseInt(
      (formData.get("expiration") as string) || "7",
      10
    );

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_LABEL}` },
        { status: 400 }
      );
    }

    if (![1, 7, 30].includes(expirationDays)) {
      return NextResponse.json(
        { error: "Invalid expiration period" },
        { status: 400 }
      );
    }

    // Resolve slug
    let slug: string;
    if (customSlug) {
      const validationError = validateSlug(customSlug);
      if (validationError) {
        return NextResponse.json(
          { error: validationError },
          { status: 400 }
        );
      }
      if (slugExists(customSlug)) {
        return NextResponse.json(
          { error: "This URL is already taken. Please choose another." },
          { status: 409 }
        );
      }
      slug = customSlug;
    } else {
      slug = generateSlug();
    }

    // Hash password if provided
    let passwordHash: string | null = null;
    if (password) {
      if (password.length < 4) {
        return NextResponse.json(
          { error: "Password must be at least 4 characters" },
          { status: 400 }
        );
      }
      if (password.length > 128) {
        return NextResponse.json(
          { error: "Password must be at most 128 characters" },
          { status: 400 }
        );
      }
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Store file with UUID key to prevent path traversal
    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()
      : "";
    const storageKey = `${uuidv4()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    saveFile(storageKey, buffer);

    // Sanitize filename
    const originalName = file.name.replace(/[^\w.\-() ]/g, "_").slice(0, 255);

    const expiresAt =
      Math.floor(Date.now() / 1000) + expirationDays * 24 * 60 * 60;

    const record = insertFile(
      slug,
      originalName,
      file.type || "application/octet-stream",
      file.size,
      storageKey,
      expiresAt,
      passwordHash
    );

    // Non-blocking cleanup of expired/downloaded files on each upload
    setImmediate(runCleanup);

    return NextResponse.json({
      slug: record.slug,
      url: `/${record.slug}`,
      originalName: record.original_name,
      size: record.size,
      expiresAt: record.expires_at,
      hasPassword: !!passwordHash,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
