import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteMetadata } from "@/lib/site";
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
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: "SecureUploads.ca | Private, one-time file sharing",
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  alternates: {
    canonical: "/",
  },
  applicationName: siteMetadata.name,
  category: "technology",
  keywords: [
    "secure file sharing",
    "one-time download link",
    "temporary file upload",
    "password protected file sharing",
    "private upload",
  ],
  openGraph: {
    title: "SecureUploads.ca | Private, one-time file sharing",
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: siteMetadata.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureUploads.ca | Private, one-time file sharing",
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
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
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <div className="relative isolate flex min-h-full flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(174,34,52,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.12),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,246,242,0.92))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(235,99,117,0.28),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(248,250,252,0.08),_transparent_30%),linear-gradient(180deg,_rgba(17,24,39,1),_rgba(9,12,20,1))]" />
            <div className="pointer-events-none absolute inset-x-0 top-32 -z-10 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
