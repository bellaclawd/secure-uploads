import { notFound } from "next/navigation";
import { getFileBySlug } from "@/lib/db";
import { DownloadCard } from "@/components/download-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const file = getFileBySlug(slug);

  if (!file) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
      <DownloadCard
        slug={file.slug}
        originalName={file.original_name}
        size={file.size}
        mimeType={file.mime_type}
        createdAt={file.created_at}
        expiresAt={file.expires_at}
        hasPassword={!!file.password_hash}
      />
    </div>
  );
}
