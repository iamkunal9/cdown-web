# cdown

Download verified smart-contract **source code** (and optional ABI / metadata) from Etherscan-compatible explorers as a ZIP.

**Live:** [https://cdown.iamkunal9.in](https://cdown.iamkunal9.in)

## What it does

- Paste one or more contract addresses
- Pick a chain (Ethereum, L2s, testnets, etc.)
- Optionally include ABI and/or explorer metadata
- Downloads a ZIP of the verified source (follows proxy → implementation when present)

The browser talks to a Next.js API route; that route calls the [Etherscan API](https://docs.etherscan.io/) with your API key. The key never ships to the client.

## Stack

- Next.js (App Router) + React 19 + TypeScript + Tailwind
- Server route: `app/api/download`
- Deployed on Netlify/Vercel-style Node hosting (live at `cdown.iamkunal9.in`)

## Prerequisites

- Node 20+ (or [Bun](https://bun.sh))
- A free [Etherscan API key](https://etherscan.io/apis) (V2 multi-chain key works across supported explorers)

## Local development

```bash
cp .env.example .env.local
# set ETHERSCAN_API_KEY=your_key

npm install   # or: bun install / pnpm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Environment

| Variable | Required | Description |
|---|---|---|
| `ETHERSCAN_API_KEY` | Yes (server) | Etherscan API key for `getsourcecode` |

Never commit `.env` / `.env.local`. Use your host’s secret store in production (Vercel/Netlify env vars).

## Deploy

1. Push this repo to GitHub
2. Import the project on Vercel or Netlify
3. Set `ETHERSCAN_API_KEY` in the project environment
4. Point a custom domain (e.g. `cdown.yourdomain.com`) if you want

## Security / privacy notes

- No wallets, no private keys, no user accounts
- Only public verified source from explorers is fetched
- Rate limiting is applied server-side to stay within Etherscan limits

## License

MIT — see [LICENSE.md](./LICENSE.md).
