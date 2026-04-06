import { NextRequest, NextResponse } from "next/server";
import { getCleanableFiles, hardDeleteFile } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function POST(request: NextRequest) {
  // Simple auth for cron - check for secret or allow localhost
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expired = getCleanableFiles();
  let cleaned = 0;

  for (const file of expired) {
    try {
      deleteFile(file.storage_key);
      hardDeleteFile(file.id);
      cleaned++;
    } catch (error) {
      console.error(`Failed to cleanup file ${file.id}:`, error);
    }
  }

  return NextResponse.json({ cleaned, total: expired.length });
}
