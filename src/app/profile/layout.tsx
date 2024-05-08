import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Profile | Todo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
