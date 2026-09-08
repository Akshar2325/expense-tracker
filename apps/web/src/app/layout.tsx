import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Expense Tracker",
  description: "Production-grade personal finance management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-body font-sans">
        {children}
      </body>
    </html>
  );
}
