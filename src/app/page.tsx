"use client";
import { useState } from "react";
import { Clock, Lock, ChevronRight, Shield, Zap } from "lucide-react";
import Link from "next/link";

const MOCK_AUCTIONS = [
  {
    id: "1",
    item: "Arc Genesis NFT #001",
    type: "vickrey",
    status: "open",
    minBid: 0.5,
    bidCount: 7,
    endsIn: "2h 14m",
    authority: "AWxa...iRFc",
  },
  {
    id: "2",
    item: "Solana Breakpoint 2025 Pass",
    type: "vickrey",
    status: "open",
    minBid: 1.0,
    bidCount: 12,
    endsIn: "5h 03m",
    authority: "GU3V...TCp",
  },
  {
    id: "3",
    item: "Private Token Allocation — Round A",
    type: "vickrey",
    status: "closed",
    minBid: 5.0,
    bidCount: 23,
    endsIn: "Ended",
    authority: "9K79...W1CZ",
  },
  {
    id: "4",
    item: "DeFi Protocol Governance Seat",
    type: "vickrey",
    status: "resolved",
    minBid: 2.0,
    bidCount: 9,
    endsIn: "Settled",
    authority: "AWxa...iRFc",
    winner: "5sbd...oE7Ey",
    clearingPrice: 3.2,
  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    open:     { cls: "badge-open",     label: "OPEN" },
    closed:   { cls: "badge-closed",   label: "CLOSED" },
    resolved: { cls: "badge-resolved", label: "RESOLVED" },
  };
  const { cls, label } = map[status] ?? map.open;
  return (
    <span className={cls} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 4 }}>
      {label}
    </span>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const filtered = MOCK_AUCTIONS.filter(a =>
    filter === "all" ? true : filter === "open" ? a.status === "open" : a.status === "resolved"
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-pitch-black)" }}>
      {/* Nav */}
      <nav style={{
        background: "var(--color-graphite)",
        borderBottom: "1px solid var(--color-charcoal-grey)",
        padding: "0 32px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={14} color="var(--color-aether-blue)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-porcelain)", letterSpacing: "-0.2px" }}>
            Vickrey
          </span>
          <span style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginLeft: 4 }}>
            on Arcium
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 12, color: "var(--color-storm-cloud)" }}>
            Devnet
          </span>
          <Link href="/create">
            <button className="btn-primary" style={{ padding: "6px 16px", fontSize: 13 }}>
              New Auction
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero strip */}
      <div style={{
        borderBottom: "1px solid var(--color-charcoal-grey)",
        padding: "40px 32px 32px",
        maxWidth: 960,
        margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 48 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "var(--color-porcelain)", letterSpacing: "-0.22px", lineHeight: 1.2, marginBottom: 12 }}>
              Trustless sealed-bid auctions.
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-storm-cloud)", lineHeight: 1.6, maxWidth: 480 }}>
              Bids stay encrypted inside Arcium&apos;s MXE until settlement. No auctioneer can see or manipulate them. The winner pays the second-highest bid — provably.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { icon: <Shield size={14} />, label: "No trusted auctioneer" },
              { icon: <Lock size={14} />, label: "Encrypted bids" },
              { icon: <Zap size={14} />, label: "MPC settlement" },
            ].map(({ icon, label }) => (
              <div key={label} className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--color-aether-blue)" }}>{icon}</span>
                <span style={{ fontSize: 12, color: "var(--color-storm-cloud)", whiteSpace: "nowrap" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auctions */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {(["all", "open", "resolved"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "var(--color-charcoal-grey)" : "transparent",
                color: filter === f ? "var(--color-porcelain)" : "var(--color-storm-cloud)",
                border: "1px solid",
                borderColor: filter === f ? "var(--color-muted-ash)" : "transparent",
                borderRadius: 6,
                padding: "5px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Auction cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(auction => (
            <Link key={auction.id} href={`/auction/${auction.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-muted-ash)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color-charcoal-grey)")}
              >
                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <StatusBadge status={auction.status} />
                    <span className="badge-vickrey" style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4 }}>
                      VICKREY
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-porcelain)", marginBottom: 6, letterSpacing: "-0.15px" }}>
                    {auction.item}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-fog-grey)" }}>
                    by <span className="mono">{auction.authority}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 32, flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 4 }}>Min bid</div>
                    <div className="mono" style={{ fontSize: 14, color: "var(--color-porcelain)" }}>
                      {auction.minBid} SOL
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 4 }}>Bids</div>
                    <div className="mono" style={{ fontSize: 14, color: "var(--color-porcelain)" }}>
                      {auction.bidCount}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 4 }}>
                      {auction.status === "open" ? "Ends in" : "Status"}
                    </div>
                    <div style={{ fontSize: 14, color: auction.status === "open" ? "var(--color-porcelain)" : "var(--color-fog-grey)", display: "flex", alignItems: "center", gap: 6 }}>
                      {auction.status === "open" && <Clock size={12} />}
                      <span className="mono">{auction.endsIn}</span>
                    </div>
                  </div>
                  {auction.status === "resolved" && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 4 }}>Clearing price</div>
                      <div className="mono" style={{ fontSize: 14, color: "var(--color-emerald)" }}>
                        {auction.clearingPrice} SOL
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} color="var(--color-storm-cloud)" />
              </div>
            </Link>
          ))}
        </div>

        {/* Program info */}
        <div style={{ marginTop: 40, padding: "16px 20px", background: "var(--color-deep-slate)", borderRadius: 6, border: "1px solid var(--color-charcoal-grey)" }}>
          <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 6 }}>Deployed program</div>
          <div className="mono" style={{ fontSize: 13, color: "var(--color-light-steel)" }}>
            GU3Vwc2tX7EbSgPejkZBC6MwG5ccqSyLQc1pgcYASTcp
          </div>
          <div style={{ fontSize: 11, color: "var(--color-fog-grey)", marginTop: 4 }}>
            Arcium Devnet · Cluster offset 456
          </div>
        </div>
      </div>
    </div>
  );
}