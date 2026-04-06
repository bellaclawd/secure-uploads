import { NextRequest, NextResponse } from "next/server";
import { getFileBySlug, markDownloaded, softDelete, FileRecord } from "@/lib/db";
import { readFile } from "@/lib/storage";
import bcrypt from "bcryptjs";
import { checkRateLimit, clearRateLimit } from "@/lib/rate-limit";

function serveFile(file: FileRecord, data: Buffer): NextResponse {
  markDownloaded(file.slug);
  softDelete(file.slug);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mime_type,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.original_name)}"`,
      "Content-Length": file.size.toString(),
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const file = getFileBySlug(slug);
  if (!file) {
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 }
    );
  }

  // Password-protected files cannot be downloaded via GET
  if (file.password_hash) {
    return NextResponse.json(
      { error: "This file requires a password" },
      { status: 401 }
    );
  }

  const data = readFile(file.storage_key);
  if (!data) {
    softDelete(slug);
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 }
    );
  }

  return serveFile(file, data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const file = getFileBySlug(slug);
  if (!file) {
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 }
    );
  }

  // If no password required, serve directly
  if (!file.password_hash) {
    const data = readFile(file.storage_key);
    if (!data) {
      softDelete(slug);
      return NextResponse.json(
        { error: "File not found or expired" },
        { status: 404 }
      );
    }
    return serveFile(file, data);
  }

  // Extract password from request body
  let password: string;
  try {
    const body = await request.json();
    password = body.password || "";
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 401 }
    );
  }

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateCheck = checkRateLimit(slug, ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const isValid = await bcrypt.compare(password, file.password_hash);
  if (!isValid) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  clearRateLimit(slug, ip);

  const data = readFile(file.storage_key);
  if (!data) {
    softDelete(slug);
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 }
    );
  }

  return serveFile(file, data);
}
