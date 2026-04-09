import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFileBySlug } from "@/lib/db";
import { DownloadCard } from "@/components/download-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Secure download link",
    description:
      "Private temporary download link for a file shared through SecureUploads.ca.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        noimageindex: true,
      },
    },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const file = getFileBySlug(slug);

  if (!file) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16 lg:py-20">
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
