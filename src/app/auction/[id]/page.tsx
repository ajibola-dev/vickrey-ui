"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock, Clock, Users, Shield, CheckCircle, Circle, Loader } from "lucide-react";
import Link from "next/link";

const MOCK_AUCTIONS: Record<string, {
  id: string; item: string; type: string; status: string;
  minBid: number; bidCount: number; endsIn: string;
  authority: string; description: string;
  winner?: string; clearingPrice?: number;
  endTime: number;
}> = {
  "1": {
    id: "1", item: "Arc Genesis NFT #001", type: "vickrey", status: "open",
    minBid: 0.5, bidCount: 7, endsIn: "2h 14m",
    authority: "AWxayPyFadJiRpJ8mtgp9aMkL7jUZHtjJFLjtz98iRFc",
    description: "Exclusive genesis NFT from the Arc ecosystem. Auction resolves via Vickrey mechanism — winner pays second-highest bid.",
    endTime: Date.now() + 1000 * 60 * 134,
  },
  "2": {
    id: "2", item: "Solana Breakpoint 2025 Pass", type: "vickrey", status: "open",
    minBid: 1.0, bidCount: 12, endsIn: "5h 03m",
    authority: "GU3Vwc2tX7EbSgPejkZBC6MwG5ccqSyLQc1pgcYASTcp",
    description: "Full access pass to Solana Breakpoint 2025. All bids encrypted inside Arcium MXE — no one can see your bid until settlement.",
    endTime: Date.now() + 1000 * 60 * 303,
  },
  "3": {
    id: "3", item: "Private Token Allocation — Round A", type: "vickrey", status: "closed",
    minBid: 5.0, bidCount: 23, endsIn: "Ended",
    authority: "9K79ExZ8fkfcpiXtBJtaHV2c3mtWPz72U5BavFKqW1CZ",
    description: "Early allocation in a privacy-focused DeFi protocol. Auction closed — awaiting MPC settlement.",
    endTime: Date.now() - 1000 * 60 * 30,
  },
  "4": {
    id: "4", item: "DeFi Protocol Governance Seat", type: "vickrey", status: "resolved",
    minBid: 2.0, bidCount: 9, endsIn: "Settled",
    authority: "AWxayPyFadJiRpJ8mtgp9aMkL7jUZHtjJFLjtz98iRFc",
    description: "Governance seat in a DeFi protocol. Vickrey auction completed — winner paid second-highest bid.",
    endTime: Date.now() - 1000 * 60 * 120,
    winner: "5sbYEDZzg844e6AbD5rZM3QPZCLQJihFGow8HfF4EXpCYpppa9xMGHDYtoqUYBfHCcAY7Mw79LoHbzoEzdioE7Ey",
    clearingPrice: 3.2,
  },
};

const COMP_STEPS = [
  { id: "encrypt", label: "Bid encrypted client-side", desc: "Your bid amount is encrypted using x25519 before leaving your device" },
  { id: "submit", label: "Encrypted bid submitted on-chain", desc: "Ciphertext posted to Solana — no one can read the amount" },
  { id: "mpc", label: "MXE computes winner & clearing price", desc: "Arcium nodes run Vickrey comparison over all encrypted bids" },
  { id: "reveal", label: "Winner & second price revealed", desc: "Only the result surfaces on-chain — all other bids stay private" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    open: { cls: "badge-open", label: "OPEN" },
    closed: { cls: "badge-closed", label: "CLOSED" },
    resolved: { cls: "badge-resolved", label: "RESOLVED" },
  };
  const { cls, label } = map[status] ?? map.open;
  return (
    <span className={cls} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 4 }}>
      {label}
    </span>
  );
}

function Countdown({ endTime }: { endTime: number }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) { setRemaining("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return <span className="mono">{remaining}</span>;
}

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const auction = MOCK_AUCTIONS[id];

  const [bidAmount, setBidAmount] = useState("");
  const [bidState, setBidState] = useState<"idle" | "encrypting" | "submitting" | "done" | "error">("idle");
  const [activeStep, setActiveStep] = useState(-1);

  if (!auction) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-storm-cloud)" }}>
      Auction not found
    </div>
  );

  async function submitBid() {
    if (!bidAmount || parseFloat(bidAmount) < auction.minBid) return;
    setBidState("encrypting");
    setActiveStep(0);
    await new Promise(r => setTimeout(r, 1200));
    setActiveStep(1);
    setBidState("submitting");
    await new Promise(r => setTimeout(r, 1500));
    setActiveStep(2);
    await new Promise(r => setTimeout(r, 2000));
    setActiveStep(3);
    await new Promise(r => setTimeout(r, 800));
    setBidState("done");
  }

  const isOpen = auction.status === "open";
  const isResolved = auction.status === "resolved";

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
          <span style={{ fontSize: 13, color: "var(--color-porcelain)" }}>{auction.item}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={14} color="var(--color-aether-blue)" />
          <span style={{ fontSize: 12, color: "var(--color-storm-cloud)" }}>Vickrey on Arcium</span>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

        {/* Left column */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <StatusBadge status={auction.status} />
              <span className="badge-vickrey" style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4 }}>VICKREY</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--color-porcelain)", letterSpacing: "-0.22px", marginBottom: 12 }}>
              {auction.item}
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-storm-cloud)", lineHeight: 1.6, marginBottom: 16 }}>
              {auction.description}
            </p>
            <div style={{ fontSize: 12, color: "var(--color-fog-grey)" }}>
              Created by <span className="mono" style={{ color: "var(--color-storm-cloud)" }}>{auction.authority.slice(0, 8)}...{auction.authority.slice(-4)}</span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Min bid", value: `${auction.minBid} SOL`, mono: true },
              { label: "Bids placed", value: auction.bidCount.toString(), mono: true },
              { label: isOpen ? "Ends in" : "Status", value: isOpen ? <Countdown endTime={auction.endTime} /> : auction.endsIn, mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 8 }}>{label}</div>
                <div className={mono ? "mono" : ""} style={{ fontSize: 16, color: "var(--color-porcelain)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  {isOpen && label === (isOpen ? "Ends in" : "Status") && <Clock size={14} color="var(--color-storm-cloud)" />}
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Result card — resolved only */}
          {isResolved && auction.winner && (
            <div style={{ marginBottom: 32, background: "rgba(94, 106, 210, 0.06)", border: "1px solid rgba(94, 106, 210, 0.2)", borderRadius: 6, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <CheckCircle size={16} color="var(--color-aether-blue)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-aether-blue)" }}>Auction Resolved</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 6 }}>Winner</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--color-porcelain)", wordBreak: "break-all" }}>
                    {auction.winner.slice(0, 12)}...{auction.winner.slice(-8)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 6 }}>Clearing price (2nd highest bid)</div>
                  <div className="mono" style={{ fontSize: 20, color: "var(--color-emerald)", fontWeight: 600 }}>
                    {auction.clearingPrice} SOL
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(94, 106, 210, 0.15)" }}>
                <div style={{ fontSize: 12, color: "var(--color-storm-cloud)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--color-light-steel)" }}>Why this price?</strong> In a Vickrey auction, the winner pays the second-highest bid — not their own. This makes truthful bidding the dominant strategy: you never benefit from shading your bid. The clearing price was computed inside Arcium's MXE with no party able to manipulate it.
                </div>
              </div>
            </div>
          )}

          {/* MPC computation steps */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-porcelain)", marginBottom: 4 }}>What happens inside Arcium</div>
            <div style={{ fontSize: 12, color: "var(--color-storm-cloud)", marginBottom: 20 }}>
              Every bid goes through 4 stages. No raw bid amount is ever exposed on-chain.
            </div>
            {COMP_STEPS.map((step, i) => {
              const isDone = isResolved || (bidState === "done" && i <= activeStep);
              const isActive = bidState !== "idle" && bidState !== "done" && i === activeStep;
              const isPending = !isDone && !isActive;
              return (
                <div key={step.id} className="comp-step">
                  <div className={`comp-step-dot ${isDone ? "done" : isActive ? "active pulse" : "pending"}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: isDone ? "var(--color-porcelain)" : isActive ? "var(--color-light-steel)" : "var(--color-storm-cloud)", fontWeight: isDone || isActive ? 500 : 400 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-fog-grey)", marginTop: 2 }}>{step.desc}</div>
                  </div>
                  {isDone && <CheckCircle size={14} color="var(--color-emerald)" />}
                  {isActive && <Loader size={14} color="var(--color-aether-blue)" className="pulse" />}
                  {isPending && <Circle size={14} color="var(--color-charcoal-grey)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column — bid form */}
        <div style={{ position: "sticky", top: 72 }}>
          {isOpen && (
            <div className="card-elevated" style={{ padding: "24px" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-porcelain)", marginBottom: 4 }}>Place a sealed bid</div>
              <div style={{ fontSize: 12, color: "var(--color-storm-cloud)", marginBottom: 24, lineHeight: 1.5 }}>
                Your bid is encrypted before leaving your browser. Not even the auctioneer can see it.
              </div>

              {bidState === "done" ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <CheckCircle size={32} color="var(--color-emerald)" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-porcelain)", marginBottom: 8 }}>Bid submitted</div>
                  <div style={{ fontSize: 12, color: "var(--color-storm-cloud)" }}>Your encrypted bid is on-chain. Result revealed at settlement.</div>
                  <div style={{ marginTop: 16 }}>
                    <span className="encrypted-value">0x3adf1af...cc39</span>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "var(--color-storm-cloud)", display: "block", marginBottom: 8 }}>
                      Bid amount (SOL)
                    </label>
                    <input
                      className="input"
                      type="number"
                      step="0.1"
                      min={auction.minBid}
                      placeholder={`Min ${auction.minBid} SOL`}
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      disabled={bidState !== "idle"}
                    />
                    {bidAmount && parseFloat(bidAmount) < auction.minBid && (
                      <div style={{ fontSize: 11, color: "var(--color-warning-red)", marginTop: 6 }}>
                        Below minimum bid of {auction.minBid} SOL
                      </div>
                    )}
                  </div>

                  {bidAmount && parseFloat(bidAmount) >= auction.minBid && (
                    <div style={{ marginBottom: 16, background: "var(--color-charcoal-grey)", borderRadius: 6, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: "var(--color-storm-cloud)", marginBottom: 4 }}>Your bid will be encrypted as</div>
                      <div className="encrypted-value" style={{ display: "inline-block" }}>0x••••••••••••••••</div>
                    </div>
                  )}

                  <button
                    className="btn-primary"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={submitBid}
                    disabled={!bidAmount || parseFloat(bidAmount) < auction.minBid || bidState !== "idle"}
                  >
                    {bidState === "encrypting" && <><Loader size={14} className="pulse" /> Encrypting bid...</>}
                    {bidState === "submitting" && <><Loader size={14} className="pulse" /> Submitting...</>}
                    {bidState === "idle" && <><Lock size={14} /> Submit encrypted bid</>}
                  </button>
                </>
              )}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--color-charcoal-grey)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <Shield size={13} color="var(--color-aether-blue)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12, color: "var(--color-storm-cloud)", lineHeight: 1.5 }}>
                    Winner pays second-highest bid. Bid truthfully — shading your bid never helps in a Vickrey auction.
                  </div>
                </div>
              </div>
            </div>
          )}

          {auction.status === "closed" && (
            <div className="card-elevated" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--color-storm-cloud)", marginBottom: 8 }}>Auction closed</div>
              <div style={{ fontSize: 12, color: "var(--color-fog-grey)", lineHeight: 1.5 }}>
                Waiting for MPC nodes to compute winner and clearing price. Results will appear here.
              </div>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div className="comp-step-dot active pulse" />
                <span style={{ fontSize: 12, color: "var(--color-aether-blue)" }}>MXE computing...</span>
              </div>
            </div>
          )}

          {/* Program info */}
          <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--color-graphite)", border: "1px solid var(--color-charcoal-grey)", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "var(--color-fog-grey)", marginBottom: 6 }}>Program</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--color-storm-cloud)", wordBreak: "break-all" }}>
              GU3Vwc2tX7EbSgPejkZBC6MwG5ccqSyLQc1pgcYASTcp
            </div>
            <div style={{ fontSize: 11, color: "var(--color-fog-grey)", marginTop: 4 }}>Arcium Devnet · Cluster 456</div>
          </div>
        </div>
      </div>
    </div>
  );
}