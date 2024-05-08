import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js and TypeScript.",
  keywords: ["Todo App"],
  authors: [{ name: "Mehdi Safarzade", url: "https://mehdisafarzade.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
