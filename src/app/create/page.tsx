"use client";
import { useState } from "react";
import { ArrowLeft, Lock, Info, CheckCircle, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuctionType = "vickrey" | "firstprice";

export default function CreateAuction() {
  const router = useRouter();
  const [auctionType, setAuctionType] = useState<AuctionType>("vickrey");
  const [item, setItem] = useState("");
  const [minBid, setMinBid] = useState("");
  const [duration, setDuration] = useState("3600");
  const [state, setState] = useState<"idle" | "creating" | "done">("idle");

  const DURATION_OPTIONS = [
    { label: "1 hour", value: "3600" },
    { label: "6 hours", value: "21600" },
    { label: "24 hours", value: "86400" },
    { label: "3 days", value: "259200" },
    { label: "7 days", value: "604800" },
  ];

  const isValid = item.trim().length > 0 && parseFloat(minBid) > 0;

  async function handleCreate() {
    if (!isValid) return;
    setState("creating");
    await new Promise(r => setTimeout(r, 2200));
    setState("done");
    await new Promise(r => setTimeout(r, 1200));
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-pitch-black)" }}>
      {/* Nav */}
      <nav style={{
        background: "var(--color-graphite)",
        borderBottom: "1px solid var(--color-charcoal-grey)",
        padding: "0 32px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-storm-cloud)", textDecoration: "none", fontSize: 13 }}>
            <ArrowLeft size={14} /> Auctions
          </Link>
          <span style={{ color: "var(--color-charcoal-grey)" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--color-porcelain)" }}>New Auction</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={14} color="var(--color-aether-blue)" />
          <span style={{ fontSize: 12, color: "var(--color-storm-cloud)" }}>Vickrey on Arcium</span>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--color-porcelain)", letterSpacing: "-0.22px", marginBottom: 8 }}>
            Create a sealed-bid auction
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-storm-cloud)", lineHeight: 1.6 }}>
            All bids will be encrypted inside Arcium&apos;s MXE. Neither you nor anyone else can see bids before settlement.
          </p>
        </div>

        {/* Auction type */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-light-steel)", display: "block", marginBottom: 12 }}>
            Auction mechanism
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {([
              {
                type: "vickrey" as AuctionType,
                title: "Vickrey (Second-Price)",
                desc: "Winner pays second-highest bid. Truthful bidding is the dominant strategy.",
                recommended: true,
              },
              {
                type: "firstprice" as AuctionType,
                title: "First-Price",
                desc: "Winner pays their own bid. Standard sealed-bid format.",
                recommended: false,
              },
            ]).map(({ type, title, desc, recommended }) => (
              <button
                key={type}
                onClick={() => setAuctionType(type)}
                style={{
                  background: auctionType === type ? "rgba(94, 106, 210, 0.08)" : "var(--color-graphite)",
                  border: `1px solid ${auctionType === type ? "rgba(94, 106, 210, 0.4)" : "var(--color-charcoal-grey)"}`,
                  borderRadius: 6,
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: `2px solid ${auctionType === type ? "var(--color-aether-blue)" : "var(--color-charcoal-grey)"}`,
                    background: auctionType === type ? "var(--color-aether-blue)" : "transparent",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-porcelain)" }}>{title}</span>
                  {recommended && (
                    <span style={{ fontSize: 10, color: "var(--color-aether-blue)", background: "rgba(94,106,210,0.12)", border: "1px solid rgba(94,106,210,0.2)", padding: "1px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.04em" }}>
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "var(--color-storm-cloud)", lineHeight: 1.5 }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Vickrey info box */}
        {auctionType === "vickrey" && (
          <div style={{ marginBottom: 32, background: "rgba(94, 106, 210, 0.05)", border: "1px solid rgba(94, 106, 210, 0.15)", borderRadius: 6, padding: "14px 16px", display: "flex", gap: 10 }}>
            <Info size={14} color="var(--color-aether-blue)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: "var(--color-storm-cloud)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--color-light-steel)" }}>Why Vickrey?</strong> Bidders have no incentive to shade their bids — the optimal strategy is always to bid your true valuation. Combined with Arcium&apos;s encrypted computation, this creates a trustless auction where no party can manipulate the outcome.
            </div>
          </div>
        )}

        {/* Item name */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-light-steel)", display: "block", marginBottom: 8 }}>
            Item or asset name
          </label>
          <input
            className="input"
            type="text"
            placeholder="e.g. Genesis NFT #001, Token allocation round A"
            value={item}
            onChange={e => setItem(e.target.value)}
          />
        </div>

        {/* Min bid + duration */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-light-steel)", display: "block", marginBottom: 8 }}>
              Minimum bid (SOL)
            </label>
            <input
              className="input"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.5"
              value={minBid}
              onChange={e => setMinBid(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-light-steel)", display: "block", marginBottom: 8 }}>
              Duration
            </label>
            <select
              className="input"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{ appearance: "none", cursor: "pointer" }}
            >
              {DURATION_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: "var(--color-deep-slate)" }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        {isValid && (
          <div className="card" style={{ padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-storm-cloud)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Summary
            </div>
            {[
              { label: "Item", value: item },
              { label: "Type", value: auctionType === "vickrey" ? "Vickrey (second-price)" : "First-price" },
              { label: "Min bid", value: `${minBid} SOL` },
              { label: "Duration", value: DURATION_OPTIONS.find(o => o.value === duration)?.label },
              { label: "Settlement", value: "Arcium MXE — encrypted computation" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--color-charcoal-grey)" }}>
                <span style={{ fontSize: 12, color: "var(--color-storm-cloud)" }}>{label}</span>
                <span style={{ fontSize: 12, color: "var(--color-porcelain)" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn-primary"
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", fontSize: 14 }}
          onClick={handleCreate}
          disabled={!isValid || state !== "idle"}
        >
          {state === "creating" && <><Loader size={15} className="pulse" /> Creating auction on Arcium...</>}
          {state === "done" && <><CheckCircle size={15} /> Auction created — redirecting</>}
          {state === "idle" && <><Lock size={15} /> Create sealed-bid auction</>}
        </button>

        <div style={{ marginTop: 12, fontSize: 12, color: "var(--color-fog-grey)", textAlign: "center" }}>
          Creating an auction costs ~0.002 SOL for account rent on Solana devnet
        </div>
      </div>
    </div>
  );
}