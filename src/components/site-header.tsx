"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="min-w-0">
          <div className="min-w-0">
            <Image
              src="/brand-logo.png"
              alt="SecureUploads.ca"
              width={280}
              height={280}
              className="h-11 w-auto sm:h-12"
              priority
            />
            <p className="mt-1 pl-1 text-xs text-muted-foreground">
              Private, one-time file sharing
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full px-4 text-sm",
                  active && "bg-muted text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/security"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden rounded-full border-border/70 bg-card/70 px-4 sm:inline-flex"
            )}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Trust Center
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-border/70 md:hidden">
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full border border-transparent bg-card/60 px-4 text-sm whitespace-nowrap",
                  active && "border-border bg-muted text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
