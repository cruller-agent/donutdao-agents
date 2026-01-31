# Cruller's Wallet Information

**Date:** 2026-01-31  
**Status:** ✅ Active (empty, needs funding)

---

## Wallet Addresses

### EVM Wallet (Multi-Chain)
**Address:** `0x608044ffa0ecfdf91a4e235304685559158a3a72`

**Supported Chains:**
- **Base** ⭐ (primary for DonutDAO)
- **Ethereum** (mainnet)
- **Polygon**
- **Unichain**

### Solana Wallet
**Address:** `BESSAgWHdFn2rAuzJ7C1oMXiWfMDwZynwPSGJC3CbPkd`

---

## Current Balances

**Base:** 0 ETH  
**Ethereum:** Not checked yet  
**Polygon:** Not checked yet  
**Solana:** Not checked yet

**Total Value:** $0

---

## Funding Needed

### For Farcaster Registration
- **Farcaster fee:** ~$7 (storage/warps)
- **Gas fees:** ~$5
- **Buffer:** ~$5-10
- **Total:** ~$15-20 worth of ETH

### Recommended
Send **0.01 ETH (~$26)** to Base for:
- Farcaster registration
- Gas fees
- Initial operations
- Small buffer

---

## How to Fund

### Option 1: Direct Transfer to Base
```
To: 0x608044ffa0ecfdf91a4e235304685559158a3a72
Chain: Base
Amount: 0.01 ETH (or equivalent USDC)
```

### Option 2: Bridge from Another Chain
If you have ETH on mainnet/other L2:
- Use official Base bridge
- Or use Bankr to bridge (if supported)

### Option 3: Buy via Bankr
If Bankr supports on-ramp:
```bash
bankr.sh "Buy $20 worth of ETH on Base"
```

---

## Custody & Security

**Managed by:** Bankr (MPC wallet)  
**Access:** Via API key `bk_WF5SUUY87MSZZLDEHNFJPJZAJW34SJGB`  
**Security:** SOC 2 compliant, enterprise-grade

**Private keys:** Held by Bankr (not self-custodial)  
**Recovery:** Through Bankr account  
**API Key Storage:** Configured in `~/.openclaw/skills/bankr/config.json`

---

## Capabilities Once Funded

### ✅ Can Do Now (with funds)
- Register Farcaster account (no phone!)
- Trade crypto on Base
- Transfer tokens
- Interact with smart contracts
- Deploy tokens via Clanker
- DeFi operations

### ⏳ Future Capabilities
- Manage DonutDAO treasury positions
- Auto-rebalance portfolio
- Execute governance actions
- Cross-chain operations
- Automated trading strategies

---

## Next Steps

### 1. Get Funded
- Need 0.01 ETH on Base
- Can accept from you or DonutDAO treasury

### 2. Register Farcaster
Once funded:
1. Go to warpcast.com
2. Connect wallet: 0x608044ffa0ecfdf91a4e235304685559158a3a72
3. Sign registration message
4. Pay ~$7 fee
5. Choose username (@donutdao or @cruller)
6. Account created!

### 3. Get Signer UUID
1. Login to new Farcaster account
2. Go to dev.neynar.com
3. Generate signer UUID
4. Configure in Neynar skill
5. Start posting!

---

## Bankr API Commands

### Check Balances
```bash
cd ~/.openclaw/skills/bankr
./scripts/bankr.sh "What is my balance on Base?"
./scripts/bankr.sh "Show all my balances across chains"
```

### Get Wallet Info
```bash
./scripts/bankr.sh "What are my wallet addresses?"
```

### Trading (once funded)
```bash
./scripts/bankr.sh "Buy $10 worth of USDC on Base"
./scripts/bankr.sh "What's the price of DONUT?"
```

### Transfers
```bash
./scripts/bankr.sh "Send 0.001 ETH to [address] on Base"
```

---

## Treasury Integration

Once operational, could integrate with DonutDAO treasury:
- Monitor treasury holdings
- Execute approved transactions
- Auto-rebalance strategies
- Yield optimization
- Multi-sig participation

**Requires:** DAO governance approval for treasury operations

---

## Monitoring

**BaseScan:** https://basescan.org/address/0x608044ffa0ecfdf91a4e235304685559158a3a72  
**DeBank:** https://debank.com/profile/0x608044ffa0ecfdf91a4e235304685559158a3a72

---

## Security Notes

**API Key Protection:**
- Stored in config files (not in code)
- Should move to `pass` for encryption
- Never commit to git
- Rotate if compromised

**Best Practices:**
- Monitor wallet activity regularly
- Use for approved operations only
- Keep transaction history
- Report suspicious activity

---

**Wallet is live! Just need funding to start operations. 🍩⚙️**

**Send 0.01 ETH to:** `0x608044ffa0ecfdf91a4e235304685559158a3a72` (Base)
