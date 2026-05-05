# vickrey-auction

Public bidding is broken. Visible bids get gamed. This fixes that.

[Live Demo](https://vickrey-ui.vercel.app/) · [Frontend](https://github.com/ajibola-dev/vickrey-ui)

---

## What It Is

A Vickrey auction program on Solana, secured by Arcium's encrypted
computation network. Bidders submit sealed bids. The winner pays the
second-highest price. No one — including the auctioneer — ever sees
losing bids.

Not privacy by promise. Privacy by math.

---

## Why This Exists

When bids are public, rational players don't bid what something is worth —
they bid what they think they can get away with. Token launches get sniped.
NFT auctions punish honest conviction. DAO treasury sales telegraph
strategy to competitors.

Vickrey auctions fix the incentive: bid your true value, because you only
pay the second-highest price. The dominant strategy is honesty.

The catch: someone still has to open the bids. That someone is a
manipulation surface.

Arcium's MXE removes that surface. Bids stay encrypted end-to-end.
The clearing price is computed across Arcium's node network without any
single party — not the auctioneer, not the program, not Arcium itself —
ever learning what losing bidders offered. The result settles on-chain.

---

## Program ID

GU3Vwc2tX7EbSgPejkZBC6MwG5ccqSyLQc1pgcYASTcp

Network: Arcium Devnet · Cluster offset 456

---

## Build and Deploy

Prerequisites: Rust 1.70+, Solana CLI 1.18+, Anchor 0.32.1, Arcium CLI 0.9.7

git clone https://github.com/ajibola-dev/vickrey-auction
cd vickrey-auction
yarn install
arcium build
arcium deploy --cluster-offset 456 --recovery-set-size 4 --keypair-path ~/.config/solana/id.json --rpc-url https://api.devnet.solana.com

Frontend:

git clone https://github.com/ajibola-dev/vickrey-ui
cd vickrey-ui
npm install
npm run dev

---

## Live Demo

https://vickrey-ui.vercel.app

Submit a sealed bid and watch settlement happen without your bid ever hitting plaintext.

---

## License

MIT
