import { UploadForm } from "@/components/upload-form";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 sm:py-20">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Share files securely
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload a file and get a one-time download link. No account needed.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
