import { UploadForm } from "@/components/upload-form";
import { Shield, Lock, Timer, UserX } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 sm:py-20">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Share files securely
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Upload a file and get a one-time download link. No account needed.
        </p>
      </div>
      <UploadForm />
      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">End-to-End Secure</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Timer className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Auto-Delete</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserX className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">No Account Required</p>
        </div>
      </div>
    </div>
  );
}
