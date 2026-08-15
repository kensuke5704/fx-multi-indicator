import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vector JPY — FX Trend Monitor", description: "USD/JPY multi-indicator market-state dashboard" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
