import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProNPS",
  description: "Private feedback and loyalty metrics for service businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}

