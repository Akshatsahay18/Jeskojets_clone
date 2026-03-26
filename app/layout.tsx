import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Jetclone",
  description: "A cinematic luxury aviation experience built with Next.js, Lenis, Framer Motion, and canvas sequences."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
