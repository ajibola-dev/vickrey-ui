import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vickrey Auction — Arcium",
  description: "Trustless sealed-bid Vickrey auction. Encrypted bids, MPC settlement, no trusted auctioneer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}