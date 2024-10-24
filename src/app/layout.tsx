import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Modals from "@/components/modals/modals";
import JotaiProvider from "@/providers/jotai-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import Sidebar from "@/components/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZapDesk",
  description:
    "All your conversations, files, and tools in one place. ZapDesk makes it easy to collaborate and get work done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <JotaiProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="zapDesk_theme_key"
                forcedTheme="dark"
              >
                {children}
                <Toaster />
                <Modals />
              </ThemeProvider>
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
