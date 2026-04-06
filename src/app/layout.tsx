import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureUploads.ca - Temporary File Sharing",
  description:
    "Upload files instantly. Get a shareable link. Files auto-delete after expiration.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <header className="border-b border-border">
            <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-large.png"
                  alt="SecureUploads.ca"
                  width={140}
                  height={96}
                  className="h-10 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/whitelogo.png"
                  alt="SecureUploads.ca"
                  width={140}
                  height={96}
                  className="h-10 w-auto hidden dark:block"
                  priority
                />
              </Link>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
            <div className="mx-auto max-w-3xl px-4">
              Files are automatically deleted after expiration or first
              download.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
