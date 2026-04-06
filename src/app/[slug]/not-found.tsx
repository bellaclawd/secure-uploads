import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FileX, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">File not found</h2>
        <p className="mt-2 text-muted-foreground">
          This file has expired, been downloaded, or doesn&apos;t exist.
        </p>
      </div>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
      >
        <Upload className="h-4 w-4" />
        Upload a File
      </Link>
    </div>
  );
}
