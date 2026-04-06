import { NextRequest, NextResponse } from "next/server";
import { getFileBySlug, markDownloaded, softDelete } from "@/lib/db";
import { readFile } from "@/lib/storage";

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

  const data = readFile(file.storage_key);
  if (!data) {
    softDelete(slug);
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 }
    );
  }

  // Mark as downloaded and soft delete (one-time download)
  markDownloaded(slug);
  softDelete(slug);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mime_type,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.original_name)}"`,
      "Content-Length": file.size.toString(),
      "Cache-Control": "no-store",
    },
  });
}
